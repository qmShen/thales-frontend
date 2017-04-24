/**
 * Created by Qiaomu on 2017/4/17.
 */


import * as d3 from 'd3'

let DetailMap = function(el){
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

  this.initDetailMap();
};


DetailMap.prototype.getScale = function(){
  return {
    'xScale': this.xScale,
    'yScale': this.yScale,
    'offsetX': this.offsetX,
    'offsetY': this.offsetY
  }
}

// DetailMap.prototype.selectionFlag = function(){
//   return 
// }


DetailMap.prototype.initDetailMap = function(){
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

  // // container for bubbles
  // this.bubbleG = this.mapContainer.append('g').attr('class', 'bubblescontainer');
};

DetailMap.prototype.mapFitScale = function(updateConfig){
  console.log('updateConfig', updateConfig);
  let _this = this;
  this.layerId = updateConfig['layerId'];
  let yxSelectionRatio = updateConfig['selectionHeight'] / updateConfig['selectionWidth'];
  let xDataRange = updateConfig['xRange'][0]>updateConfig['xRange'][1]
    ? [updateConfig['xRange'][1],updateConfig['xRange'][0]]
    : [updateConfig['xRange'][0],updateConfig['xRange'][1]];
  let yDataRange = updateConfig['yRange'][0]>updateConfig['yRange'][1]
    ? [updateConfig['yRange'][1],updateConfig['yRange'][0]]
    : [updateConfig['yRange'][0],updateConfig['yRange'][1]];
  let yxSvgRatio = this.svgHeight / this.svgWidth;

  let renderHeight = this.svgHeight;
  let renderWidth = this.svgWidth;
  let offsetX = 0;
  let offsetY = 0;

  if(yxSelectionRatio > yxSvgRatio){
    renderWidth = renderHeight / yxSelectionRatio;
    offsetX = (this.svgWidth - renderWidth) / 2;
  }else{
    renderHeight = renderWidth * yxSelectionRatio;
    offsetY = Math.abs(this.svgHeight - renderHeight) / 2;
  }

  this.offsetX = offsetX;
  this.offsetY = offsetY;

  this.xScale = d3.scaleLinear().domain(updateConfig['xRange']).range([0, renderWidth]);
  this.yScale = d3.scaleLinear().domain(updateConfig['yRange']).range([0, renderHeight]);


  let meshes = updateConfig['mapObj']['data'];

  let elePath = d3.line()
    .x(function(d) { return _this.xScale(d[0]); })
    .y(function(d) { return _this.yScale(d[1]); });


  this.mapContainer.append('g').attr('class', 'mapmeshcontainer').selectAll('.mapele')
    .data(meshes).enter().append('path').attr('class','mapele')
    .attr('d', elePath)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 0.3)
    .attr('stroke-opacity', 0.4)
    .attr('transform', 'translate(' + offsetX + ', '+ offsetY+')');


  let legendSize = 50;

  let legendsData = updateConfig['legendConfig'];
  if(legendsData == undefined) return;
  
  let lcs = this.mapContainer.append('g').attr('class', 'legendscontainer').selectAll('.legend')
    .data(legendsData).enter().append('g').attr('class','legend')
    .attr('transform', function(d, i){
      let x = _this.xScale(d['pos'][0]);
      let y = _this.yScale(d['pos'][1]);
      return 'translate(' + (x + offsetX)+ ',' + (y + offsetY) + ')'
    });

  lcs.append('svg:image')
      .attr('x',-legendSize / 2)
      .attr('y',-legendSize / 2)
      .attr('width',legendSize)
      .attr('height', legendSize)
      .attr("xlink:href",function(d){
        return 'static/legend/' + d['model']
      });
  
  // this.mapContainer.select('.bubblescontainer').remove();
  // container for bubbles
  this.bubbleG = this.mapContainer.append('g').attr('class', 'bubblescontainer');
};


DetailMap.prototype.updateBubblemap = function(renderData){
  let _this = this;

  // need to parser renderData
  console.log('layerId: ', this.layerId);
  console.log('updateBubblemap: ', renderData);
  let bubblesData = renderData['data'][0]['small_clusters'];
  console.log('bubblesData: ', bubblesData);
  let bubbles = this.bubbleG.selectAll('circle').data(bubblesData, function(d) {return d[0]+'_'+d[1];})

  bubbles
      .transition()
      .attr('r', function(d){ 
          return 10;})
      .text(function(d) {
          return 'density: '+d[4];
      })
      .attr('opacity', 0.3)
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .attr('fill', function(d) {
        return 'blue';
      })
  
  bubbles
      .enter()
      .append('circle')
      .attr('class', 'bubble')
      .attr('cx', function(d) {
          return _this.xScale(d[0])+_this.offsetX;
      })
      .attr('cy', function(d) {
          return _this.yScale(d[1])+_this.offsetY;
      })
      .attr('r', function(d) { 
          return 10;})
      .attr('fill', function(d) {
        return 'blue';
      })
      .attr('opacity', 0.3)
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .append('title')
      .attr('class', 'circleTitle')
      .text(function(d) {
          return 'density: '+d[4];
      })

  bubbles
      .exit()
      .transition()
      .attr('fill', 'blue')
      .attr('r', 0)
      .remove();
};

export default DetailMap
