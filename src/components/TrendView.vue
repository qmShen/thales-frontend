<template>
  <div class="trend">
  </div>
</template>

<script>
  import pipeService from '../service/pipeService.js'
  import RealtimeLinechart from '../libs/RealtimeLinechart.js'
  export default {
    name: 'Trend',
    data(){
      return {
        title: "Trend"
      }

    },
    mounted(){
      let _this = this;
      this.linechart = new RealtimeLinechart(this.$el);

      pipeService.onRenderFrame(function(renderData){
          console.log('TrendView, newRenderData', renderData);
          _this.linechart.updateLinechart(renderData);
      });
    }
  }
</script>

<style>
  .trend{
    width: 100%;
    background-color: #abdeff
  }

  .graph .axis {
    stroke-width: 1;
    }

  .graph .axis .tick line {
    stroke: black;
  }

  .graph .axis .tick text {
    fill: black;
    font-size: 0.7em;
  }

  .graph .axis .domain {
    fill: none;
    stroke: black;
  }

  .graph .group {
    fill: none;
    stroke: black;
    stroke-width: 1.5;
  }
</style>
