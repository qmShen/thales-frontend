<template>
  <div id="app" style="height: 100%">
    <NavBar></NavBar>
    <el-row :gutter="1" style="height: 95%" >
      <el-col :span="16" style="height: 100%">
        <DetailView></DetailView>
      </el-col>
      <el-col :span="8" style="height: 100%">
        <TrendView style="height: 20%"></TrendView>
        <Navigation v-bind:dataRecord="dataRecord" style="height: 40%"></Navigation>
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
        stationId: null,
        dataRecord: [],
        currentLargestTimeStamp: -1,
        renderSign: false,
        currentTime:-1,
        previousTime:0,
        previousTimeRender:0,
        currentIndex: 0
      }
    },
    mounted(){
      let _this = this;
      pipeService.onStationSelected(function(d){
        _this.stationId = d;

        let startTime = 0;
        _this.timeGap = 5000;
//        _this.getRecordsFromTime(startTime, _this.timeGap);
        _this.timeId = setInterval(
          function() {
            _this.getRecordsFromTime(startTime, _this.timeGap);
            startTime += _this.timeGap;
          },
          5000);
      });
    },
    methods:{
      initModules(){
        //After select one station, all the four views will be updated
      },
      getRecordsFromTime(startTime, timeRange) {
        let _this = this;
        dataService.readRecordWithTimeRange(_this.stationId, startTime, timeRange, function(record){
          if(!record && record.length == 0) return;

          for(var i = 0, ilen = record.length; i < ilen; i++){
            if(_this.currentLargestTimeStamp < record[i]['time_stamp']){
              _this.dataRecord.push(record[i])
            }
          }
          if(_this.currentLargestTimeStamp < record[record.length - 1]['time_stamp']){
            _this.currentLargestTimeStamp = record[record.length - 1]['time_stamp'];
          }
          pipeService.emitRecordReady(record);
          _this.previousTime = new Date();
          if(_this.renderSign == false){
            _this.startRender();
          }
        });
//        console.log('Add new', _this.dataRecord.length);
      },
      startRender(){
        let _this = this;
        this.renderSign = true;
        this.timer = setInterval(() => {
          _this.previousTimeRender = new Date();
          _this.updateTime();
        }, 1000);
      },
      updateTime(){
        if(!this.dataRecord || this.dataRecord.length == 0){
          return
        }
        if(this.currentTime == -1){ //Initialize
          this.currentTime = this.dataRecord[0]['time_stamp'];
        }else{
          this.currentTime += 1; // Unit second

        }

//        console.log('current', this.currentTime, this.dataRecord);
        let newRenderData = [];
        for(let i = this.currentIndex, ilen = this.dataRecord.length; i < ilen; i++){
          let currentRecord = this.dataRecord[i];

          if(currentRecord['time_stamp'] == this.currentTime){
            newRenderData.push(currentRecord);
          }
        }
        pipeService.emitRenderFrame(newRenderData);
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
      },
      currentLargestTimeStamp(newTime){
//        console.log('newTime',this.currentIndex, newTime, this.dataRecord.length)
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
