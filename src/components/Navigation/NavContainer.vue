<template>
  <div class="navigation">

  </div>
</template>

<script>

  import pipeService from '../../service/pipeService.js'
  import NavigationMap from '../../libs/NavigationMap.js'

  export default {
    name: 'Navigation',
    data(){
      return {
        title: 'Navigation',
        // Should write into config file
        stationId: null,
        layerId: null,
        legendData: null,
        idRange: [-4, -3, -2, -1, 0, 1, 2, 3, 4],
      }
    },
    props:['mapObj'],

    mounted(){
      let _this = this;
      this.layerId = this.mapObj['layer'];
      this.navMap = new NavigationMap(this.$el, this.mapObj);
      this.navMap.on('brushstart', function(layerId){
        pipeService.emitSelectionBrushStart(layerId);
      });

      this.navMap.on('brushend', function(xRange, yRange, selectionWidth, selectionHeight, map, layerId, legendConfig){
        pipeService.emitSelectionBrushend({
          'xRange': xRange,
          'yRange': yRange,
          'selectionWidth': selectionWidth,
          'selectionHeight': selectionHeight,
          'mapObj': map,
          'layerId': layerId,
          'legendConfig': legendConfig
        });
      });

      pipeService.onSelectionBrushStart(function(layerId){
        if(_this.layerId != layerId){
          _this.navMap.clearBrush();
        }
      })

      pipeService.onLegendConfigReady(function(data){
        _this.legendData = data;

        if(_this.legendData && _this.navMap && (_this.navMap.getStationId() == _this.legendData['stationId'])){
          console.log('legend', _this.legendData[_this.layerId])
          _this.navMap.setLegend(_this.legendData['legendConfig']);
        }
      })
    },
    methods: {}
  }
</script>

<style>
  .navigation{
    float: left;
    width: 33%;
    height: 100%;
    /*background-color: #68ffc4*/
  }
</style>
