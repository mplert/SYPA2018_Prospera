// Cost Benefit Estimation Vis

/*
 *  costBenVis - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with the data set need for the projection
 */

costBenVis = function(_parentElement) {
    this.parentElement = _parentElement;
    // this.data = _data;

    this.initVis();
    this.initNumbers();
}


// costBenVis.prototype.sliderVis = function() {
//     var vis = this;
//
//     vis.svgSlider = d3.select('#slider').append('svg')
//         .attr('width', 200)
//         .attr('height', 200)
//         .attr('id', 'svg-slider')
//         .attr('align', 'center');
//
//
// }


costBenVis.prototype.initNumbers = function() {
    var vis = this;

    vis.start = 0,
        vis.duration = 7000,
        vis.endCost = [1000000], vis.endBen = [1000000];

    vis.nbHeight = 70, vis.nbWidth = 290;

    // total-cost
    vis.svgTotalCost = d3.select('#total-cost').append('svg')
        .attr('id', 'svg-cost').attr('class', 'svg-nb')
        .attr('height', vis.nbHeight).attr('width', vis.nbWidth)
        .attr('align', 'center');

    vis.svgTotalCost.selectAll("#cb-cost")
        .data(vis.endCost).enter()
        .append('text').text(vis.start)
        .attr('id', '#cb-cost')
        .attr('class', 'cb-numbers')
        .attr('x', vis.nbWidth/2)
        .attr('y', vis.nbHeight*2/3)
        .transition().duration(5000);
            // .tween("text", function(d){
            //     var i = d3.interpolate(this.textContent, d),
            //         prec = (d + "").split("."),
            //         round = (prec.length > 1 )? Math.pow(10, prec[1].length) : 1;
            //
            //     return function(t) {
            //         this.textContent = Math.round(i(t) * round) / round;
            //     };
            // });

    // total-ben
    vis.svgTotalBen = d3.select('#total-ben').append('svg')
        .attr('id', 'svg-ben').attr('class', 'svg-nb')
        .attr('height', vis.nbHeight).attr('width', vis.nbWidth)
        .attr('align', 'center');

    vis.svgTotalBen.selectAll(".cb-numbers").data(vis.endBen).enter()
        .append('text').text(vis.start)
        .attr('class', 'cb-numbers')
        .attr('x', vis.nbWidth/2)
        .attr('y', vis.nbHeight*2/3)
        .transition().duration(5000)
        .tween("text", function(d){
            var i = d3.interpolate(this.textContent, d),
                prec = (d + "").split("."),
                round = (prec.length > 1 )? Math.pow(10, prec[1].length) : 1;

            return function(t) {
                this.textContent = Math.round(i(t) * round) / round;
            };
        });

    // number of year to break even
    vis.svgYears = d3.select('#cb-years').append('svg')
        .attr('id', 'svg-years').attr('class', 'svg-nb')
        .attr('height', vis.nbHeight).attr('width', vis.nbWidth)
        .attr('align', 'center');

}

costBenVis.prototype.initVis = function() {
    var vis = this;

    vis.margin = { bottom: 60, top: 50, left:80, right:10 };

    vis.width = 700 - vis.margin.left - vis.margin.right;
    vis.height = 550- vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select('#costben-vis')
        .append('svg')
            .attr('width', vis.width + vis.margin.left + vis.margin.right)
            .attr('height', vis.height + vis.margin.top + vis.margin.bottom)
            .attr('align', 'center')
            .attr('id', 'svg-cb')
        .append('g')
            .attr('transform', 'translate('+ vis.margin.left +',' + vis.margin.top +')');

    // adding axes and scales for the line graph
    vis.yMax = 0;
    vis.yMin = 500;
    vis.yearMin = 0;
    vis.yearMax = 12;

    vis.x = d3.scaleLinear()
        .domain([0, 12])
        .range([0, vis.width]);

    vis.y = d3.scaleLinear()
        .domain([0, 500])
        .range([vis.height, 0]);

    vis.xAxis = d3.axisBottom().scale(vis.x)
        .ticks(6);

    vis.yAxis = d3.axisLeft().scale(vis.y)
        .ticks(5);

    vis.addX = vis.svg.append('g')
        .attr('class', 'x-axis axis')
        .attr('transform', 'translate(0,' + (vis.height) + ')');

    vis.addY = vis.svg.append('g')
        .attr('class', 'y-axis axis');

    vis.addX
        // .transition().duration(1000)
        .call(vis.xAxis); // need to add the transition

    vis.addY
        // .transition().duration(1000)
        .call(vis.yAxis); // need to add the transition
        // .call(customYAxis);

    // MAY TRY DIFFERENT TYPE OF LINE GRAPH (ONES WITH HORIZONTAL LINES)

    // function customYAxis(d) {
    //     d.call(vis.yAxis);
    //     d.select(".domain")
    //         .remove();
    //     d.selectAll(".tick:not(:first-of-type) line")
    //         // .attr("stroke", "#777")
    //         .attr("stroke-dasharray", "2,2");
    //     // vis.g.selectAll(".tick text")
    //     //     .attr("x", 4)
    //     //     .attr("dy", -4);
    // }


    // adding labels
    vis.xLabel = d3.select("#svg-cb").append('text')
        .text("Years")
        .attr('x', vis.width+vis.margin.left)
        .attr('y', vis.height+vis.margin.top +35)
        .attr('class', 'x-label');

    vis.yLabel = d3.select('#svg-cb').append('text')
        .text("Mexican Peso ('000)")
        .attr('x', -200)
        .attr('y', vis.margin.left-40)
        .attr('class', 'y-label');

    // adding title
    // vis.title = d3.select("#svg-cb").append('text')
    //     .text('COST/BENEFIT PROJECTION')
    //     .attr('x', vis.width/2 - 60)
    //     .attr('y', 30)
    //     .attr('class', 'title');

    // vis.subtitle = d3.select("#svg-cb").append('text')
    //     .text('You may adjust the assumptions used in our estimates below.')
    //     .attr('x', vis.width/2-80)
    //     .attr('y', 30+18)
    //     .attr('class', 'subtitle');

    // legends
    vis.legendCost = d3.select('#svg-cb').append('circle')
        .attr('class', 'legend-cost')
        .attr('r', 8)
        .attr('cy', vis.height+vis.margin.top+ vis.margin.bottom*4/5)
        .attr('cx', vis.margin.left + 150);

    vis.legendBen = d3.select('#svg-cb').append('circle')
        .attr('class', 'legend-ben')
        .attr('r', 8)
        .attr('cy', vis.height+vis.margin.top+ vis.margin.bottom*4/5)
        .attr('cx', vis.margin.left + 345);

    vis.legendTextCost = d3.select("#svg-cb").append('text')
        .text('Cost')
        .attr('x', vis.margin.left +170)
        .attr('y', vis.height + vis.margin.top +vis.margin.bottom*4/5+5)
        .attr('class', 'legend-text');

    vis.legendTextBen = d3.select("#svg-cb").append('text')
        .text('Benefits')
        .attr('x', vis.margin.left +365)
        .attr('y', vis.height + vis.margin.top +vis.margin.bottom*4/5+5)
        .attr('class', 'legend-text');

    // adding sliders

    // Transfer amount
        // add scale for transfer amount slider
        // vis.transferScale = d3.scaleLinear().domain([0,100]).range([0, vis.width/2]);

        // vis.transferSlider = d3.slide().axis(d3.svg.axis().orient("top").ticks(5)); //apparently this is not a d3 function, check v4 new command
            // vis.svg.append("g")
            // .attr("class", "slider");
            // .attr("transform", "translate(" + margin.left + "," + height / 2 + ")");

        // adding slider titles
        // vis.transferSliderTitle = d3.select("#svg-cb").append("text")
        //     .text("CHANGE IN TRANSFER LEVEL (%)")
        //     .attr('x', vis.margin.left).attr('y', 20 + 55)
        //     .attr('class', 'slider-text');

    // unemployment
        // title
        // vis.umeployment = d3.select("#svg-cb").append("text")
        //     .text("YOUTH UNEMPLOYMENT RATE (%)")
        //     .attr('x', vis.margin.left).attr('y', 20 + 80)
        //     .attr('class', 'slider-text');

    // entering labor market
        // title
        // vis.enterLabor = d3.select("#svg-cb").append("text")
        //     .text("PROPORTION OF YOUTH ENTERING LABOR MARKET (%)")
        //     .attr('x', vis.margin.left).attr('y', 20 + 105)
        //     .attr('class', 'slider-text');

}


costBenVis.prototype.wrangleData = function() {

}

costBenVis.prototype.updateVis = function() {

}