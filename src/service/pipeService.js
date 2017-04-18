/**
 * Created by Qiaomu on 2017/4/16.
 */

import Vue from 'vue'

var pipeService = new Vue({
  data:{
    STATIONSELECTED: 'station_selected',
    MAPREADT: 'map_ready',
    LEGENDCONFIGREADY: 'legend_config_ready',
    REGIONBRUSHED: 'region_brushed'
  },

  methods:{
    //Once a station is selected
    emitStationSelected: function(msg){
      this.$emit(this.STATIONSELECTED, msg);
    },
    onStationSelected: function(callback){
      this.$on(this.STATIONSELECTED,function(msg){
        callback(msg);
      })
    },

    //Distribute map data
    emitMapReady: function(msg){
      this.$emit(this.MAPREADT, msg);
    },
    onMapReady: function(callback){
      this.$on(this.MAPREADT,function(msg){
        callback(msg);
      })
    },

    //Distribute legend config
    emitLegendConfigReady: function(msg){
      this.$emit(this.LEGENDCONFIGREADY, msg);
    },
    onLegendConfigReady: function(callback){
      this.$on(this.LEGENDCONFIGREADY,function(msg){
        callback(msg);
      })
    },

    // Link Navigation view to detail view
    emitSelectionBrushend: function(msg){
      this.$emit(this.REGIONBRUSHED, msg);
    },
    onSelectionBrushend: function(callback){
      this.$on(this.REGIONBRUSHED,function(msg){
        callback(msg);
      })
    },

  }
});

export default pipeService
