<template>
  <div class="navigation">

  </div>
</template>

<script>

  import pipeService from '../../service/pipeService.js'
  import NavigationMap from '../../libs/NavigationMap.js'
  import NavigationHeatmap from '../../libs/NavigationHeatmap.js'
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
    props:['mapObj', 'recordObj', 'dataRecord'],

    mounted(){
      let _this = this;
//      console.log("mapObj ", this.mapObj);
//      console.log("recordObj ", this.recordObj);
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

      this.navHeatmap = new NavigationHeatmap(this.$el, this.navMap.getScale());
      this.navHeatmap.updateHeatmap(this.recordObj);

      pipeService.onSelectionBrushStart(function(layerId){
        if(_this.layerId != layerId){
          _this.navMap.clearBrush();
        }
      })

      pipeService.onLegendConfigReady(function(data){
        _this.legendData = data;

        if(_this.legendData && _this.navMap && (_this.navMap.getStationId() == _this.legendData['stationId'])){
          _this.navMap.setLegend(_this.legendData['legendConfig']);
        }
      });

    },
    methods: {},
    watch:{
      recordObj(newRecord){
        this.navHeatmap.updateHeatmap(newRecord);
      }
    }

  }
</script>

<style>
  .navigation{
    float: left;
    width: 25%;
    height: 100%;
    /*background-color: #68ffc4*/
  }
  .heatmap-canvas{
    pointer-events: none;
  }
</style>
