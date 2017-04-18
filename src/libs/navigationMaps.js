/**
 * Created by xiao on 2017/4/17.
 */


import * as d3 from 'd3'

let NavigationMaps = function(el, maps, stationId){
  this.$el = el;
  this.stationId = stationId;
  this.height = el.clientHeight;
  this.width = el.clientWidth;
  this.layerGap = 3;
  this.margin = {top: 5, left: 5, right:5 ,bottom: 5}
  this.layerNumber = maps.length;
  this.maps = maps;
  this.widthPerSvg = (this.width - this.margin.left - this.margin.right - (this.layerNumber)*this.layerGap)/ (this.layerNumber + 0.1);
  this.heightPerSvg = this.height - this.margin.top - this.margin.bottom;


  this.mapAttr = {};
  this.xScale = undefined;
  this.yScale = undefined;
  this.reXScale = undefined;
  this.reYScale = undefined;


  this.initContainer();
  this.renderMap();
};

NavigationMaps.prototype.getStationId = function(){
  return this.stationId;
};

NavigationMaps.prototype.initContainer = function(){
  let _this = this;
  this.svgs = d3.select(this.$el).selectAll('.svg').data(this.maps)
    .enter()
    .append('svg')
    .attr('height', this.heightPerSvg)
    .attr('width', this.widthPerSvg)
    .style('margin-left', function(d, i){
      if(i != 0) return _this.margin['left'] * 1.5;
      else return _this.margin['left'] * 0.5;
    })
    .style('margin-top', this.margin['top'])
    .style('border-style', 'dashed')
    .style('border-color','#777')
    .style('border-width', 0.1)
    .style('border-opacity', 0.3)

};

NavigationMaps.prototype.renderMap = function(){
  let _this = this;
  let largestX = 0;
  let largestY = 0;

  let smallestX = 10000;
  let smallestY = 10000;

  this.maps.forEach(function(meshes){
    let meshElements = meshes['data'];
    let layerId = meshes['layer'];
    meshElements.forEach(function(eles){
      eles.forEach(function(ele){
        largestX = largestX>ele[0]?largestX:ele[0];
        smallestX = smallestX<ele[0]?smallestX:ele[0];
        largestY = largestY>ele[1]?largestY:ele[1];
        smallestY = smallestY<ele[1]?smallestY:ele[1];
      })
    })
  });

  this.mapAttr['largestX'] = largestX;
  this.mapAttr['smallestX'] = smallestX;
  this.mapAttr['largestY'] = largestY;
  this.mapAttr['smallestY'] = smallestY;
  // console.log('ss', this.mapAttr);
  let yxRatioInData = (largestY - smallestY) / (largestX - smallestX);
  let yxRatioForSvg = this.heightPerSvg / this.widthPerSvg;
  let _tempWidth = this.widthPerSvg;
  let _tempHeight = this.heightPerSvg;

  if(yxRatioInData > yxRatioForSvg){
    _tempWidth = _tempHeight / yxRatioInData;
  }else{
    _tempHeight = _tempWidth * yxRatioInData;
  }


  this.xScale = d3.scaleLinear().domain([smallestX, largestX]).range([0, _tempWidth]);
  this.yScale = d3.scaleLinear().domain([smallestY, largestY]).range([_tempHeight, 0]);

  this.reXScale = this.xScale.invert;
  let offsetX = (this.widthPerSvg - _tempWidth) / 2;

  let elePath = d3.line()
    .x(function(d) { return _this.xScale(d[0]); })
    .y(function(d) { return _this.yScale(d[1]); });


  let brushended = function(layerObj, map){
    let layer = layerObj['layer'];
    var s = d3.event.selection;
    if(!s) return;

    let xRange = [_this.xScale.invert(s[0][0]), _this.xScale.invert(s[1][0])];
    let yRange = [_this.yScale.invert(s[0][1]), _this.yScale.invert(s[1][1])];
    let selectionWidth = Math.abs(s[1][0] - s[0][0]);
    let selectionHeight = Math.abs(s[0][1] - s[1][1]);


    if(_this.brushCallback){
      _this.brushCallback(xRange, yRange, selectionWidth, selectionHeight, layerObj, map, _this.legendConfig['legendConfig'][layer]);
    }

  }
  let brush = d3.brush()
    .extent([[0,0], [_tempWidth, _tempHeight]])
    .on('start', function(currentMapObj){
      let currentLayerId = currentMapObj['layer'];

      _this.svgs.each(function(d){
        if(currentLayerId == d['layer']) return;
        d3.select(this).selectAll('.mapcontainer').call(brush.move, null);
      })
    })
    .on("end", brushended);

  this.layerContainers = this.svgs.append('g').attr('class','mapcontainer').attr('transform', 'translate(' + offsetX + ',0)');
  this.layerContainers.each(function(d){
    let meshes = d['data'];
    let container = d3.select(this);
    meshes.forEach(function(ele){
      container.append('path').attr('class','mapele')
        .datum(ele)
        .attr('d', elePath)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 0.3)
        .attr('stroke-opacity', 0.4)
    });
  })
  this.layerContainers.call(brush);

};

NavigationMaps.prototype.on = function(event, callback){
  if(event == 'brushend'){
    this.brushCallback = callback
  }
};

NavigationMaps.prototype.setLegend = function(legendConfig){
  let _this = this;
  this.legendConfig = legendConfig;
  console.log('legend', legendConfig);

  this.layerContainers.each(function(mapData){
    let layerId = mapData['layer'];
    let legendArray = legendConfig['legendConfig'][layerId];
    let legendContainer = d3.select(this).append('g').attr('class', 'legendContainer');
    let lcs = legendContainer.selectAll('.legend').data(legendArray).enter().append('g')
      .attr('transform', function(d, i){
        let x = _this.xScale(d['pos'][0]);
        let y = _this.yScale(d['pos'][1]);
        return 'translate(' + x + ',' + y + ')'
      });
    lcs.append('svg:image')
      .attr('x',-3)
      .attr('y',-3)
      .attr('width',6)
      .attr('height', 6)
      .attr("xlink:href",function(d){
        return 'static/legend/' + d['model']
      })
  })

};

export default NavigationMaps
