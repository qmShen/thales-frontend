<template>
  <div class="navigationlist">
    <NavContainer v-for="mapObj in mapObjs" v-bind:mapObj="mapObj" :key="mapObj['layer']"></NavContainer>
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
        mapObjs: []
      }
    },
    components: {
      NavContainer
    },
    mounted(){
      let _this = this;
      pipeService.onMapReady(function(data){
        _this.mapData = data;
        _this.parseMap();

      });
    },
    methods:{
      initMaps(){
        this.navMaps = new NavigationMaps(this.$el, this.maps, this.mapData['stationId']);

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

      },
      renderLegend(){
        let _this = this;
        let legendData = this.legendData;
      }
    }

  }
</script>

<style>

</style>
