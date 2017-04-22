/**
 * Created by haipeng on 2017/4/19.
 */

import * as d3 from 'd3'
import h337 from 'heatmap.js'

let NavigationHeatmap = function(el, scaleList){
  this.$el = el;
  this.heatmapInstance = undefined;
  this.canvasHeatmap = undefined;
  this.xScale = scaleList[0];
  this.yScale = scaleList[1];
  this.initContainer();
};

NavigationHeatmap.prototype.initContainer = function(){
  if (this.canvasHeatmap != null) {
      this.canvasHeatmap.remove();
    }
    let config = {
        // container: document.getElementById('#' + this.heatmapId),
        container: this.$el, // document.querySelector('#' + this.heatmapId),
        radius: 10,
        maxOpacity: 0.5,
        minOpacity: 0,
        blur: 0.75
    }
    this.heatmapInstance = h337.create(config)
    this.canvasHeatmap = this.$el.querySelector('.heatmap-canvas')
};

NavigationHeatmap.prototype.updateHeatmap = function(record){
    this.record = record['data'];
    let startIndex = 0;
    let endIndex = this.record.length;
    this.timer = setInterval(() => {
        if (startIndex < endIndex) {
            this.updateHeatmapCanvas(this.heatmapInstance, startIndex);
            ++startIndex;
        } else {
            clearInterval(this.timer);
        }
    }, 1000);
};

NavigationHeatmap.prototype.updateHeatmapCanvas = function(heatmapInstance, recordIdx) {
    let points = []
    // let max = 0
    for (let pointIdx in this.record[recordIdx]['small_clusters']) {
        let temp = {
            x: Math.round(this.xScale(this.record[recordIdx]['small_clusters'][pointIdx][0])),
            y: Math.round(this.yScale(this.record[recordIdx]['small_clusters'][pointIdx][1])),
            value: this.record[recordIdx]['small_clusters'][pointIdx][4]
        }
        // if (temp.x < this.margin.left || temp.x > this.width + this.margin.left) continue
        // if (temp.y < this.margin.top || temp.y > this.height + this.margin.top) continue
        points.push(temp)
    }
    // heatmap data format
    let data = {
        max: 1,
        data: points
    }
    // if you have a set of data points always use setData instead of addData
    // for data initialization
    heatmapInstance.setData(data)
};

NavigationHeatmap.prototype.clearHeatmapCanvas = function() {
    this.heatmapInstance.setData({ max: 0, data: [] })
};

export default NavigationHeatmap
