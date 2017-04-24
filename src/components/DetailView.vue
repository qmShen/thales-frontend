<template>
  <div class="detailview">
  </div>
</template>

<script>
  import pipeService from '../service/pipeService.js'
  import DetailMap from '../libs/DetailMap.js'
  import DetailBubblemap from '../libs/DetailBubblemap.js'

  export default {
    name: 'detail',
    data(){
      return {
        title: "Detail",
        idRange: [-4, -3, -2, -1, 0, 1, 2, 3, 4],
        layerId: undefined
      }

    },
    mounted(){
      let _this = this;
      // this.initDetailMap();
      _this.initDetailMap();
      pipeService.onSelectionBrushend(function(d){
        _this.layerId = d['layerId'];
        console.log('onSelectionBrushend', d);
        _this.initDetailMap();
        _this.detailMap.mapFitScale(d);
      }),
      pipeService.onRenderFrame(function(renderData){
        if(_this.layerId == undefined) return;
        _this.recordData = renderData;
        _this.parseRecord();
        _this.detailMap.updateBubblemap(_this.renderData);
      });
    },
    methods:{
      initDetailMap: function(){
        this.detailMap = new DetailMap(this.$el);
      },
      parseRecord(){
        let _this = this;
        let recordData = this.recordData;
        let records = [];
        let tmpRecordObj = {};
        for(let i=0; i<recordData.length; i++){
          let recordItem = recordData[i];
          if(!tmpRecordObj.hasOwnProperty(recordItem['floor'])){
            tmpRecordObj[recordItem['floor']] = [];
          }
          tmpRecordObj[recordItem['floor']].push(recordItem);
        }
        // console.log('tmpRecordObj: ', tmpRecordObj)
        this.idRange.forEach(function(layerId){
          if(tmpRecordObj[layerId] != undefined){
            records.push({'layer':layerId==0?layerId: -layerId,
              'data': tmpRecordObj[layerId],
            })
          }
        });

        records.sort(function(a, b){
          return b.layer - a.layer;
        });
        for(let idx in records){
          if(records[idx]['layer'] == _this.layerId) {
            _this.renderData = records[idx];
            return;
          }
        }
      }
    }

  }
</script>

<style>
  .detailview{
    width: 100%;
    height: 100%;

  }
</style>
