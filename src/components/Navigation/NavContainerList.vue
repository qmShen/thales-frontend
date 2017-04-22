<template>
  <div class="navigationlist">
    <NavContainer v-for="(mapObj, index) in mapObjs" v-bind:mapObj="mapObj" v-bind:recordObj="recordObjs[index]" :key="mapObj['layer']"></NavContainer>
  </div>
</template>

<script>

  import pipeService from '../../service/pipeService.js'
  import NavContainer from './NavContainer.vue'


  export default {
    name: 'Navigation',
    data(){
      return {
        title: 'Navigation',
        // Should write into config file
        stationId: null,
        idRange: [-3, -2, -1, 0, 1, 2, 3],
        mapObjs: [],
        recordObjs: []
      }
    },
    components: {
      NavContainer
    },
    mounted(){
      let _this = this;
      pipeService.onMapReady(function(data){
        _this.mapData = data;
        // console.log('_this.mapData: ', _this.mapData);
        _this.parseMap();
      });
      pipeService.onRecordReady(function(data){
        console.log("receive record data in NavContainerList");
        _this.recordData = data;
        // console.log('_this.recordData: ', _this.recordData);
        _this.parseRecord();
      });
    },
    methods:{
      // initMaps(){
      //   this.navMaps = new NavigationMaps(this.$el, this.maps, this.mapData['stationId']);

      //   this.navMaps.on('brushend', function(xRange, yRange, selectionWidth, selectionHeight, map, layerId, legendConfig){

      //     pipeService.emitSelectionBrushend({
      //       'xRange': xRange,
      //       'yRange': yRange,
      //       'selectionWidth': selectionWidth,
      //       'selectionHeight': selectionHeight,
      //       'mapObj': map,
      //       'layerId': layerId,
      //       'legendConfig': legendConfig
      //     });
      //   });
      // },
      parseMap(){
        let _this = this;
        let mapData = this.mapData;
        let maps = [];
        this.idRange.forEach(function(layerId){
          if(mapData[layerId] != undefined){
            maps.push({'layer': layerId,
              'data': mapData[layerId],
            })
          }
        });
        maps.sort(function(a, b){
          return b.layer - a.layer;
        });
        maps.forEach(function(d){
            d['allMaps'] = maps;
            d['stationId'] = mapData['stationId'];
        })
        _this.mapObjs = maps;
        _this.stationId = mapData['stationId'];

        // console.log('_this.mapObjs: ', _this.mapObjs)

      },
      renderLegend(){
        let _this = this;
        let legendData = this.legendData;
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
        _this.recordObjs = records;
      }
    }

  }
</script>

<style>

</style>
