<template>
  <div class="navigation">

  </div>
</template>

<script>

  import pipeService from '../service/pipeService.js'
  import NavigationMaps from '../libs/navigationMaps'

  export default {
    name: 'Navigation',
    data(){
      return {
        title: 'Navigation',
        // Should write into config file
        idRange: [-3, -2, -1, 0, 1, 2, 3],
        mapData: null,
        legendConfig: null
      }
    },
    mounted(){
      let _this = this;
      pipeService.onMapReady(function(data){
        _this.mapData = data;
        console.log('_this', _this.mapData);
        _this.parseMap();
        _this.initMaps();
        if(_this.legendData && _this.navMaps && (_this.navMaps.getStationId() == _this.legendData['stationId'])){
            _this.navMaps.setLegend(_this.legendData);
        }
      });
      pipeService.onLegendConfigReady(function(data){
        _this.legendData = data;
        if(_this.legendData && _this.navMaps && (_this.navMaps.getStationId() == _this.legendData['stationId'])){
            _this.navMaps.setLegend(_this.legendData);
        }
      })
    },
    methods:{
      initMaps(){
        this.navMaps = new NavigationMaps(this.$el, this.maps);

        this.navMaps.on('brushend', function(xRange, yRange, selectionWidth, selectionHeight, map, layerId, legendConfig){
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
      },
      parseMap(){
        let _this = this;
        let mapData = this.mapData;
        let maps = [];
        this.idRange.forEach(function(layerId){
          if(mapData[layerId] != undefined){
            maps.push({'layer': layerId,
              'data': mapData[layerId]
            })
          }
        });
        maps.sort(function(a, b){
          return b.layer - a.layer;
        });
        _this.maps = maps;

      },
      renderLegend(){
          let _this = this;
          let legendData = this.legendData;
          console.log('legend', legendData);

      }
    }

  }
</script>

<style>
  .navigation{
    width: 100%;
    /*background-color: #68ffc4*/
  }
</style>
