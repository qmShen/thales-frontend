<template>
  <div class="detailview">
  </div>
</template>

<script>
  import pipeService from '../service/pipeService.js'
  import DetailMaps from '../libs/DetailMap.js'

  export default {
    name: 'detail',
    data(){
      return {
        title: "Detail"
      }

    },
    mounted(){
      let _this = this;
      this.initDetailMap();
      pipeService.onSelectionBrushend(function(d){
        console.log('d', d);
        _this.initDetailMap()
        _this.detailMap.mapFitScale(d);

      })
    },
    methods:{
      initDetailMap: function(){
        this.detailMap = new DetailMaps(this.$el);
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
