/**
 * Created by haipeng on 2017/4/23.
 */

import * as d3 from 'd3'

let RealtimeLinechart = function(el){
    this.$el = el;
    this.margin = {top: 5, left: 5, right:5 ,bottom: 5};
    this.width = el.clientWidth - this.margin.left - this.margin.right;
    this.height = el.clientHeight - this.margin.top - this.margin.bottom;
    
    this.widthPerSvg = el.clientWidth;
    this.heightPerSvg = el.clientHeight;

    this.initContainer();
};

RealtimeLinechart.prototype.initContainer = function(){

    var limit = 60 * 1,
            duration = 750,
            now = new Date(Date.now() - duration);


    var groups = {
        current: {
            value: 0,
            color: 'orange',
            data: d3.range(limit).map(function() {
                return 0
            })
        },
        target: {
            value: 0,
            color: 'green',
            data: d3.range(limit).map(function() {
                return 0
            })
        },
        output: {
            value: 0,
            color: 'grey',
            data: d3.range(limit).map(function() {
                return 0
            })
        }
    };

    var x = d3.scaleTime()
            .domain([now - (limit - 2), now - duration])
            .range([0, this.width]);

    var y = d3.scaleLinear()
            .domain([0, 100])
            .range([this.height, 20]);

    var line = d3.line()
            .x(function(d, i) {
                return x(now - (limit - 1 - i) * duration)
            })
            .y(function(d) {
                return y(d)
            })
            .curve(d3.curveCardinal);


    this.svg = d3.select(this.$el).append('svg')
            .attr('class', 'chart')
            .attr('width', this.widthPerSvg)
            .attr('height', this.heightPerSvg)

    // var axis = this.svg.append('g')
    //         .attr('class', 'x axis')
    //         .attr('transform', 'translate(0,' + this.height + ')')
    //         .call(d3.axisBottom(x))

    var paths = this.svg.append('g')

    for (var name in groups) {
        var group = groups[name]
        group.path = paths.append('path')
                .data([group.data])
                .attr('class', name + ' group')
                .attr('fill', 'none')
                .style('stroke', group.color)
    }

    function tick() {
        now = new Date();

        // Add new values
        for (var name in groups) {
            var group = groups[name]
            //group.data.push(group.value) // Real values arrive at irregular intervals
            group.data.push(20 + Math.random() * 100);
            group.path.attr('d', line)
        }

        // Shift domain
        x.domain([now - (limit - 2) * duration, now - duration]);

        // Slide x-axis left
        // axis.transition()
        //         .duration(duration)
        //         .ease(d3.easeLinear)
        //         .call(d3.axisBottom(x));

        // Slide paths left
        paths.attr('transform', null)
                .transition()
                .duration(duration)
                .ease(d3.easeLinear)
                .attr('transform', 'translate(' + x(now - (limit - 1) * duration) + ')')
                .on('end', tick);

        // Remove oldest data point from each group
        for (var name in groups) {
            var group = groups[name];
            group.data.shift()
        }
    }

    tick();
};


export default RealtimeLinechart
