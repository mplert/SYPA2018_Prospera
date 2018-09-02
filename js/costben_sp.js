// Cost Benefit Estimation Vis

/*
 *  costBenVis - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with the data set need for the projection
 */

costBenVis = function(_parentElement) {
    this.parentElement = _parentElement;
    this.initVis();
    this.initNumbers();
}

/* ACTUAL LINE GRAPH FOR COST-BEN ESTIMATION */

costBenVis.prototype.initVis = function() {
    var vis = this;

    vis.margin = { bottom: 80, top: 25, left:80, right:10 };

    vis.width = 700 - vis.margin.left - vis.margin.right;
    vis.height = 450- vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select('#costben-vis')
        .append('svg')
        .attr('width', vis.width + vis.margin.left + vis.margin.right)
        .attr('height', vis.height + vis.margin.top + vis.margin.bottom)
        .attr('align', 'center')
        .attr('id', 'svg-cb')
        .append('g')
        .attr('transform', 'translate('+ vis.margin.left +',' + vis.margin.top +')');

    // adding axes and scales for the line graph
    vis.x = d3.scaleLinear()
        .range([0, vis.width]);

    vis.y = d3.scaleLinear()
        .range([vis.height, 0]);

    vis.xAxis = d3.axisBottom().scale(vis.x)
        .ticks(12);

    vis.yAxis = d3.axisLeft().scale(vis.y);

    vis.addX = vis.svg.append('g')
        .attr('class', 'x-axis axis')
        .attr('transform', 'translate(0,' + (vis.height) + ')');

    vis.addY = vis.svg.append('g')
        .attr('class', 'y-axis axis');


    // adding labels
    vis.xLabel = d3.select("#svg-cb").append('text')
        .text("Años")
        .attr('x', vis.width+vis.margin.left)
        .attr('y', vis.height+vis.margin.top +35)
        .attr('class', 'x-label');

    vis.yLabel = d3.select('#svg-cb').append('text')
        .text("Millones Mex$")
        .attr('x', -50)
        .attr('y', vis.margin.left-60)
        .attr('class', 'y-label');


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
        .text('Costos')
        .attr('x', vis.margin.left +170)
        .attr('y', vis.height + vis.margin.top +vis.margin.bottom*4/5+5)
        .attr('class', 'legend-text');

    vis.legendTextBen = d3.select("#svg-cb").append('text')
        .text('Beneficios')
        .attr('x', vis.margin.left +365)
        .attr('y', vis.height + vis.margin.top +vis.margin.bottom*4/5+5)
        .attr('class', 'legend-text');

    vis.addNote = d3.select('#svg-cb').append('text')
        .text('SE PUEDE PONER SOBRE LOS DATOS PARA MÁS DETALLES.')
        .attr('x', (vis.width-vis.margin.left-vis.margin.right)/2+120)
        .attr('y', vis.margin.top-10)
        .attr('class', 'channel-note')
        .attr('text-anchor', 'middle');

    // adding lines
    vis.addLineBen = vis.svg.append('path')
        .attr("class", "line line-ben");

    vis.addLineCost = vis.svg.append('path')
        .attr('class', 'line line-cost');


    vis.wrangleData();
}


costBenVis.prototype.wrangleData = function() {
    var vis = this;

    vis.unemploy = document.getElementById("sliderUnemVal").textContent;
    vis.transferChange = document.getElementById("sliderTransferVal").textContent;
    vis.numYouth = document.getElementById("sliderNumYouthVal").textContent;

    console.log(vis.unemploy);
    console.log(vis.transferChange);
    console.log(vis.numYouth);


    // generic variables for the estimation
    var annualYear = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        cumulativeYear = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        totalBen = 6000000,
        youthEnterLaborRate = 1 / 18,
        firstJobImpact = 0.86,
        currentJobImpact = 0.95;

    // cost
    var currentTransfer = 335,
        newTransfer = currentTransfer * vis.transferChange / 100,
        newAnnualTransfer = newTransfer * 12,
        newAnnualTransferTotal = newAnnualTransfer * totalBen;

    console.log(newTransfer);
    console.log(newAnnualTransfer);
    console.log(newAnnualTransferTotal);

    var cumCostHH = cumulativeYear.map(function (d) {
        return d * newAnnualTransfer;
    });

    vis.annualCostTotal = annualYear.map(function (d) {
        return Math.round(d * newAnnualTransferTotal / 1000000);
    });

    vis.cumCostTotal = cumulativeYear.map(function (d) {
        return Math.round(d * newAnnualTransferTotal / 1000000);
    });

    console.log(cumCostHH);
    console.log(vis.annualCostTotal);
    console.log(vis.cumCostTotal);


    // benefits of the first job
    // ln(monthly wage of first job)  = 0.86*ln(total lifetime transfer amount)
    // making the calculation an array;
    var annualBenFirstTotal = cumCostHH.map(function (d) {
        return Math.round((Math.round(Math.exp(firstJobImpact * Math.log(d)) * 12) * vis.numYouth * totalBen) * (100 - vis.unemploy) / 100 * youthEnterLaborRate);
    });

    var cumBenFirstTotal = [];
    annualBenFirstTotal.reduce(function (a, b, i) {
        return cumBenFirstTotal[i] = a + b;
    }, 0);

    console.log(annualBenFirstTotal);
    console.log(cumBenFirstTotal);


    // benefits of the current job
    // ln(monthly wage of current job)  = 0.95*ln(total lifetime transfer amount)
    var newCostHH = cumCostHH;
    newCostHH.unshift(0);
    newCostHH.filter(function (d, i) {
        return i = 11;
    });
    console.log(newCostHH);

    var annualBenCurrentTotal = newCostHH.map(function (d) {
        return Math.round((Math.round(Math.exp(currentJobImpact * Math.log(d)) * 12) * vis.numYouth * totalBen) * (100 - vis.unemploy) / 100 * youthEnterLaborRate);
    });

    var cumBenCurrentTotal = [];
    annualBenCurrentTotal.reduce(function (a, b, i) {
        return cumBenCurrentTotal[i] = a + b;
    }, 0);

    console.log(annualBenCurrentTotal);
    console.log(cumBenCurrentTotal);


    // combining first and current job Ben
    vis.annualBen = annualBenFirstTotal.map(function (d, i) {
        return Math.round((d + annualBenCurrentTotal[i]) / 1000000);
    });

    vis.cumBen = cumBenFirstTotal.map(function (d, i) {
        return Math.round((d + cumBenCurrentTotal[i]) / 1000000);
    });

    console.log(vis.annualBen);
    console.log(vis.cumBen);


    // identifying number of year to break even
    vis.breakEven = vis.cumBen.map(function(d, i){
        if (vis.cumBen[i] >vis.cumCostTotal[i]) return 1;
        else return 0;
    });
    console.log(vis.breakEven);

    vis.breakEvenYear = vis.breakEven.indexOf(1);
    console.log(vis.breakEvenYear);

    vis.updateVis();
}

costBenVis.prototype.updateVis = function() {
    var vis= this;

    console.log(vis.cumBen);
    console.log(vis.cumCostTotal);


    //updating the domain for x scale
    vis.x.domain([0, 12]);


    //updating the domain for y scale
    vis.yMax = d3.max(vis.cumBen, function(d) { return d; });
    vis.y.domain([0, vis.yMax*1.1]);

    vis.addX.call(vis.xAxis);
    vis.addY.transition().duration(1200).call(vis.yAxis);


    //drawing the cumulative benefits lines
    vis.lineBen = d3.line()
        .x(function(d, i){ return vis.x(i); })
        .y(function(d){ return vis.y(d); })
        .curve(d3.curveLinear);

    vis.addLineBen
        .transition().duration(1500)
        .attr('d', vis.lineBen(vis.cumBen));

    vis.addLineBen.exit().remove();


    //drawing the cumulative cost lines
    vis.lineCost = d3.line()
        .x(function(d, i){ return vis.x(i); })
        .y(function(d){ return vis.y(d); })
        .curve(d3.curveLinear);

    vis.addLineCost
        .transition().duration(1500)
        .attr('d', vis.lineCost(vis.cumCostTotal));

    vis.addLineCost.exit().remove();


    // adding data points
    vis.pointCost = vis.svg.selectAll('.point-cost')
        .data(vis.cumCostTotal);

    vis.pointCost.enter()
        .append('circle')
        .merge(vis.pointCost)
        // .transition().duration(1000)
        .attr('class', 'point point-cost')
        .attr('r', 4)
        .attr('cx', function(d, i){
            return vis.x(i);
        })
        .attr('cy', function(d){
            return vis.y(d);
        })
        .attr('title', function(d, i){
            return "<b>Costo acumulativo</b>:<br> " + d.toLocaleString() +" millones Mex$)" +
                "<br><b>Años</b>: " + i;
        });

    vis.pointCost
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut);

    vis.pointBen = vis.svg.selectAll('.point-ben')
        .data(vis.cumBen);

    vis.pointBen.enter()
        .append('circle')
        .merge(vis.pointBen)
        // .transition().duration(1000)
        .attr('class', 'point point-ben')
        .attr('r', 4)
        .attr('cx', function(d, i){
            return vis.x(i);
        })
        .attr('cy', function(d){
            return vis.y(d);
        })
        .attr('title', function(d, i){
            return "<b>Beneficios acumulativos</b>: <br> " + d.toLocaleString() +" millones Mex$" +
                "<br><b>Años</b>: " + i;
        });

    vis.pointBen
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut);

    // initializing tool tips
    $('.point-ben').tooltipsy({
        offset: [10, -3],
        css: {
            'padding': '10px',
            'max-width': '200px',
            'color': '#ffffff',
            'background-color': 'rgba(21, 40, 100, 0.6)',
            'border': '0.1px solid #656565',
            'border-radius': '10px',
            '-moz-box-shadow': '0 0 10px rgba(100, 100, 100, .6)',
            '-webkit-box-shadow': '0 0 10px rgba(100, 100, 100, .5)',
            'box-shadow': '0 0 10px rgba(100, 100, 100, .5)',
            'text-shadow': 'none'
        }
    });

    $('.point-cost').tooltipsy({
        offset: [10, -3],
        css: {
            'padding': '10px',
            'max-width': '200px',
            'color': '#ffffff',
            'background-color': 'rgba(139, 41, 31, 0.7)',
            'border': '0.1px solid #656565',
            'border-radius': '10px',
            '-moz-box-shadow': '0 0 10px rgba(100, 100, 100, .5)',
            '-webkit-box-shadow': '0 0 10px rgba(100, 100, 100, .5)',
            'box-shadow': '0 0 10px rgba(100, 100, 100, .5)',
            'text-shadow': 'none'
        }
    });

    function mouseOver() {
        d3.select(this).transition().duration(100)
            .attr("r", 6);
    }

    function mouseOut(){
        d3.select(this).transition().duration(100)
            .attr('r', 4);
    }

}


costBenVis.prototype.initNumbers = function() {
    var vis = this;

    vis.start = 0,
        vis.duration = 5000,
        vis.endCost = [vis.cumCostTotal],
        vis.endBen = [vis.cumBen];

    vis.nbHeight = 60, vis.nbWidth = 290;

    // total-cost
    vis.svgTotalCost = d3.select('#total-cost').append('svg')
        .attr('id', 'svg-cost').attr('class', 'svg-nb')
        .attr('height', vis.nbHeight).attr('width', vis.nbWidth)
        .attr('align', 'center');


    // total-ben
    vis.svgTotalBen = d3.select('#total-ben').append('svg')
        .attr('id', 'svg-ben').attr('class', 'svg-nb')
        .attr('height', vis.nbHeight).attr('width', vis.nbWidth)
        .attr('align', 'center');


    // number of year to break even
    vis.svgYears = d3.select('#cb-years').append('svg')
        .attr('id', 'svg-years').attr('class', 'svg-nb')
        .attr('height', vis.nbHeight).attr('width', vis.nbWidth)
        .attr('align', 'center');

    vis.updateNum();
}

costBenVis.prototype.hideVis = function() {
    $('.cb-numbers').hide();
    $('.svg-nb').remove();
}

costBenVis.prototype.updateNum = function() {
    var vis = this,
        format = d3.format(",d");

    vis.svgTotalCost.selectAll("#cb-cost")
        .data(vis.endCost).enter()
        .append('text').text(vis.start)
        .attr('id', 'cb-cost').attr('class', 'cb-numbers')
        .attr('x', 70).attr('y', vis.nbHeight*2/3)
        .transition().duration(2000)
        .on('start', function repeat(){
            d3.active(this)
                .tween("text", function(d){
                    var that = d3.select(this),
                        i = d3.interpolateNumber(that.text(), d[12]);
                    return function(t) {that.text(format(i(t))); };
                })
                .transition()
                .delay(1500);
        });

    vis.svgTotalBen.selectAll("#cb-ben")
        .data(vis.endBen).enter()
        .append('text').text(vis.start)
        .attr("id", "cb-ben").attr('class', 'cb-numbers')
        .attr('x', 70).attr('y', vis.nbHeight*2/3)
        .transition().duration(2000)
        .on('start', function repeat(){
            d3.active(this)
                .tween("text", function(d){
                    var that = d3.select(this),
                        i = d3.interpolateNumber(that.text(), d[12]);
                    return function(t) {that.text(format(i(t))); };
                })
                .transition()
                .delay(1500);
        });

    vis.svgYears.selectAll("#cb-years")
        .data(vis.breakEven).enter()
        .append('text').text(vis.start)
        .attr("id", "cb-years").attr('class', 'cb-numbers')
        .attr('x', 130).attr('y', vis.nbHeight*2/3)
        .transition().duration(2000)
        .on('start', function repeat(){
            d3.active(this)
                .tween("text", function(d, i){
                    console.log(d);
                    var that = d3.select(this),
                        i = d3.interpolateNumber(that.text(), vis.breakEvenYear);
                    return function(t) {that.text(format(i(t))); };
                })
                .transition()
                .delay(1500);
        });

}

