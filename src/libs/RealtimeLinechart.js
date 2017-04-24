/**
 * Created by haipeng on 2017/4/23.
 */

import * as d3 from 'd3'
let RealtimeLinechart = function(el){
    let _this = this;
    this.$el = el;
    this.margin = {top: 5, left: 5, right:5 ,bottom: 30};
    this.width = el.clientWidth - this.margin.left - this.margin.right;
    this.height = el.clientHeight - this.margin.top - this.margin.bottom;
    
    this.widthPerSvg = el.clientWidth;
    this.heightPerSvg = el.clientHeight;

    this.limit = 60*1;
    this.duration = 1000;
    this.now = new Date(Date.now() - this.duration);

    // need to adjust later, perhaps based on data
    this.groups = {
        current: {
            value: 0,
            color: 'orange',
            data: d3.range(this.limit).map(function(){
                return 0;
            })
        },
        target: {
            value: 0,
            color: 'green',
            data: d3.range(this.limit).map(function(){
                return 0;
            })
        },
        output: {
            value: 0,
            color: 'grey',
            data: d3.range(this.limit).map(function(){
                return 0;
            })
        },
    };

    this.xScale = d3.scaleTime()
            .domain([this.now - (this.limit - 2) * this.duration, this.now - this.duration])
            .range([0, this.width]);

    this.yScale = d3.scaleLinear()
            .domain([0, 1])
            .range([this.height, 20]);

    this.line = d3.line()
            .x(function(d, i) {
                return _this.xScale(_this.now - (_this.limit - 1 - i) * _this.duration)
            })
            .y(function(d) {
                return _this.yScale(d)
            })
            .curve(d3.curveCardinal);

    this.initContainer();
};

RealtimeLinechart.prototype.initContainer = function(){

    this.svg = d3.select(this.$el).append('svg')
            .attr('class', 'chart')
            .attr('width', this.widthPerSvg)
            .attr('height', this.heightPerSvg)

    this.axis = this.svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(d3.axisBottom(this.xScale))

    this.paths = this.svg.append('g')

    for (var name in this.groups) {
        var group = this.groups[name]
        group.path = this.paths.append('path')
                .data([group.data])
                .attr('class', name + ' group')
                .attr('fill', 'none')
                .style('stroke', group.color)
    }
    // this.updateLinechart();
};

// RealtimeLinechart.prototype.initContainer = function(){
//     this.
// }

RealtimeLinechart.prototype.updateLinechart = function (renderData){
    console.log('renderData: ', renderData);
    


    this.now = new Date();
    let idx = 0;
    // Add new values
    for (var name in this.groups) {
        var group = this.groups[name]
        let desity = d3.max(renderData[idx]['small_clusters'].map(function(record){ return record[4]}));
        //group.data.push(group.value) // Real values arrive at irregular intervals
        group.data.push(desity==undefined?0:desity);
        group.path.attr('d', this.line)

        ++idx;
    }

    // Shift domain
    this.xScale.domain([this.now - (this.limit - 2) * this.duration, this.now - this.duration]);

    // Slide x-axis left
    this.axis.transition()
            .duration(this.duration)
            .ease(d3.easeLinear)
            .call(d3.axisBottom(this.xScale));

    // Slide paths left
    this.paths.attr('transform', null)
            .transition()
            .duration(this.duration)
            .ease(d3.easeLinear)
            .attr('transform', 'translate(' + this.xScale(this.now - (this.limit - 1) * this.duration) + ')')

    // Remove oldest data point from each group
    for (var name in this.groups) {
        var group = this.groups[name];
        group.data.shift()
    }
}


export default RealtimeLinechart
