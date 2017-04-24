/**
 * Created by Haipeng on 2017/4/24.
 */


import * as d3 from 'd3'

let DetailBubblemap = function(el, scaleObject){
  this.$el = el;
  this.width = el.clientWidth;
  this.height = el.clientHeight;

  this.xScale = undefined;
  this.yScale = undefined;
  this.offsetX = undefined;
  this.offsetY = undefined;

  this.margin = {
    top:10,
    bottom: 10,
    left: 10,
    right: 10
  };

  this.svgHeight = this.height - this.margin['top'] - this.margin['bottom'];
  this.svgWidth = this.width - this.margin['left'] - this.margin['right'];

  this.initDetailBubblemap();
};


DetailBubblemap.prototype.getScale = function(){
  return {
    'xScale': this.xScale,
    'yScale': this.yScale,
    'offsetX': this.offsetX,
    'offsetY': this.offsetY
  }
}


DetailBubblemap.prototype.initDetailBubblemap = function(){
  let _this = this;
  d3.select(this.$el).selectAll('svg').remove();
  this.svg = d3.select(this.$el).append('svg')
    .attr('height', this.svgHeight)
    .attr('width', this.svgWidth)
    .style('margin-top', this.margin['top'])
    .style('border-style', 'dashed')
    .style('border-color','#777')
    .style('border-width', 0.1)
    .style('border-opacity', 0.3)
    .style('margin-left', _this.margin['left']);
  this.mapContainer = this.svg.append('g').attr('class', 'mapcontainer');
};

DetailBubblemap.prototype.updateBubblemap = function(renderData){
};

export default DetailBubblemap
