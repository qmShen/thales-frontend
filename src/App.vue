<template>
  <div id="app" style="height: 100%">
    <NavBar></NavBar>
    <el-row :gutter="1" style="height: 95%" >
      <el-col :span="16" style="height: 100%">
        <DetailView></DetailView>
      </el-col>
      <el-col :span="8" style="height: 100%">
        <TrendView style="height: 20%"></TrendView>
        <Navigation style="height: 40%"></Navigation>
        <TicketView style="height: 40%"></TicketView>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import NavBar from './components/NavBar.vue'
  import DetailView from './components/DetailView.vue'
  import TrendView from './components/TrendView.vue'
  import Navigation from './components/Navigation/NavContainerList.vue'


  import TicketView from './components/TicketView.vue'
  import dataService from './service/dataService.js'


  import pipeService from './service/pipeService.js'

  export default {
    name: 'app',
    components: {
      NavBar,
      DetailView,
      TrendView,
      Navigation,
      TicketView
    },
    data(){
      return {
        stationMap: null,
        stationId: null
      }
    },
    mounted(){
      let _this = this;
      pipeService.onStationSelected(function(d){
        _this.stationId = d;
      });
    },
    methods:{
      initModules(){
        //After select one station, all the four views will be updated

      }
    },
    watch:{
      stationId(newId){
        let _this = this;
        dataService.readMap(newId, function(map){
          _this.stationMap = map;
          pipeService.emitMapReady(map);
          dataService.rendLegendConfiguration(newId, function(legendConfig){
            pipeService.emitLegendConfigReady(legendConfig);
          });
        });
      }
    }
  }
</script>

<style>
  #app{
    height: 100%;
    width: 100%
  }

</style>
