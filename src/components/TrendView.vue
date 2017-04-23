<template>
  <div class="trend">
    {{title}}
  </div>
</template>

<script>
  import RealtimeLinechart from '../libs/RealtimeLinechart.js'
  export default {
    name: 'Trend',
    data(){
      return {
        title: "Trend"
      }

    },
    mounted(){
      this.linechart = new RealtimeLinechart(this.$el);
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
