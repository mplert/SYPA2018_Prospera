// Channel visualization

/*
 *  channelVis - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with the data set need for the projection
 */

channelVis = function(_parentElement) {
    this.parentElement = _parentElement;

    this.initVis();
    // this.initNumbers();
}

channelVis.prototype.initVis = function(){
    var vis = this;

    vis.margin = { bottom: 10, top: 10, left:10, right:10 };

    vis.width = 1150 - vis.margin.left - vis.margin.right;
    vis.height = 730- vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select('#channel-vis')
        .append('svg')
            .attr('width', vis.width + vis.margin.left + vis.margin.right)
            .attr('height', vis.height + vis.margin.top + vis.margin.bottom)
            .attr('align', 'center')
            .attr('id', 'svg-channel')
        .append('g')
            .attr('transform', 'translate('+ vis.margin.left +',' + vis.margin.top +')');

    vis.drawShapes();
}

channelVis.prototype.drawShapes = function(){
    var vis = this;

    // institution box
    vis.institution = vis.svg.append('rect')
        .attr('class', 'background institution')
        .attr('x', vis.margin.left).attr('y', vis.margin.top)
        .attr('height', vis.height-vis.margin.bottom-vis.margin.top)
        .attr('width', vis.width-vis.margin.left-vis.margin.right)
        .attr('rx', 25).attr('ry', 25);


    // channel box
    var channelData = [0, 1, 2];
    var gap = 40;

    vis.channel = vis.svg.selectAll('.channel').data(channelData);

    vis.channel.enter()
        .append('a')
        .attr('xlink:href', function(d, i){
            if(i==0) { return "channela.html";}
            if(i==1) { return "channelb.html";}
            else { return "channelc.html";}
        })
        .attr('target', "_blank")
        .append('rect')
        .attr('class', 'background channel')
        .attr('x', function(d,i){ return vis.width/3 })
        .attr('y', function(d, i){ return vis.margin.top +60 + (vis.height/4 + gap)*i; })
        .attr('height', vis.height*0.23).attr('width', 370)
        .attr('rx', 20).attr('ry', 20)
        .style('fill', function (d, i){
            if(i==0) { return "#5B9BD5";}
            if(i==1) { return "#2CA25F";}
            else { return "#FFC000";}
        })
        .style('stroke', function (d, i){
            if(i==0) { return "#5B9BD5";}
            if(i==1) { return "#2CA25F";}
            else { return "#FFC000";}
        })
        .on('mouseover', function(d, i){
            console.log(d);
            d3.select(this).attr("height", function(d){
                return vis.height*0.23 + 6;
            })
                .attr('width', function(d){
                    return 370+6;
                })
                .attr('x', vis.width/3-3)
                .attr('y', vis.margin.top +60 + (vis.height/4 + gap)*i -3)
        })
        .on('mouseout', function(d,i){
            d3.select(this).attr("height", function(d){
                return vis.height*0.23;
            })
                .attr('width', function(d){
                    return 370;
                })
                .attr('x', vis.width/3)
                .attr('y', vis.margin.top +60 + (vis.height/4 + gap)*i)
        })
        .attr('title', function(d,i){
            if (i==0) {
                return "<b>INCENTIVE EFFECTS</b><br> Program conditions incentivize increased investment in children.";
            } if (i==1) {
                return "<b>INCOME EFFECTS</b> <br>Additional household income provides more resources to invest in children.";
            } else {
                return "<b>SUPPLEMENTAL EFFECTS</b> <br> Supplemental programs increase young adults' productivity.";
            }
        });

    // channel A
    var channelAData = [0, 1],
        smallBoxWidth = 130,
        smallBoxHeight = 50,
        smallBoxGap = 20,
        verticalGap = 15;

    vis.channelA = vis.svg.selectAll ('.channel-a').data(channelAData);

    vis.channelA.enter().append('rect')
        .attr('class', 'channel-a')
        .attr('x', function(d,i){
            return vis.width/3 + 30 + smallBoxGap + (smallBoxWidth+smallBoxGap)*i;
        })
        .attr('y', (vis.margin.top +60 +smallBoxGap) )
        .attr('width', smallBoxWidth).attr('height', smallBoxHeight)
        .attr('rx', 10).attr('ry', 10);

    vis.channelA.enter().append('rect')
        .attr('class', 'channel-a')
        .attr('x', function(d,i){
            return vis.width/3 + 30 + smallBoxGap + (smallBoxWidth+smallBoxGap)*i;
        })
        .attr('y', (vis.margin.top +60 +smallBoxGap + verticalGap + smallBoxHeight))
        .attr('width', smallBoxWidth).attr('height', smallBoxHeight)
        .attr('rx', 10).attr('ry', 10);

    // channel B
    var channelBData = [1,2],
        channelBWidth = 120;

    vis.channelB = vis.svg.selectAll('.channel-b')
        .data(channelBData);

    vis.channelB.enter().append('rect')
        .attr('class', 'channel-b')
        .attr('x', function(d,i){
            return vis.width/3 + 30;
        })
        .attr('y', function(d,i) {
            return vis.margin.top +65 +smallBoxGap + vis.height/4 + gap + (smallBoxHeight + verticalGap)*i;
        })
        .attr('width', channelBWidth).attr('height', smallBoxHeight)
        .attr('rx', 10).attr('ry', 10);

    vis.channelB.enter().append('rect')
        .attr('class', 'channel-b channel-decolored')
        .attr('x', function(d,i){
            return vis.width/3 + 30 + channelBWidth +35;
        })
        .attr('y', function(d,i) {
            return vis.margin.top +65 +smallBoxGap + vis.height/4 + gap + (smallBoxHeight + verticalGap)*i;
        })
        .attr('width', channelBWidth+50).attr('height', smallBoxHeight)
        .attr('rx', 10).attr('ry', 10);

    // channel C
    vis.channelC = vis.svg.append('rect')
        .attr('class', 'channel-c')
        .attr('x', (vis.width/3 + 20))
        .attr('y', (vis.margin.top +60 + (vis.height/4 + gap)*2 + 20))
        .attr('height', vis.height*0.23 - 40).attr('width', 370-40)
        .attr('rx', 15).attr('ry', 15)
        .style('fill', "#DDA711");


    // Arrows
    vis.blueArrow1 = vis.svg.append('image')
        .attr('xlink:href', 'img/blue-arrow1.png')
        .attr('x', vis.width/5-20).attr('y', vis.height/5 )
        .attr('height', 110);

    vis.blueArrow2 = vis.svg.append('image')
        .attr('xlink:href', 'img/blue-arrow2.png')
        .attr('x', vis.width*2/3+10).attr('y', vis.height/5 )
        .attr('height', 120);

    vis.greenArrow1 = vis.svg.append('image')
        .attr('xlink:href', 'img/green-arrow1.png')
        .attr('x', vis.width/5+50).attr('y', vis.height/2-30 )
        .attr('height', 70);

    vis.greenArrow2 = vis.svg.append('image')
        .attr('xlink:href', 'img/green-arrow2.png')
        .attr('x', vis.width*2/3+10).attr('y', vis.height/2-30 )
        .attr('height', 65);

    vis.yellowArrow1 = vis.svg.append('image')
        .attr('xlink:href', 'img/yellow-arrow1.png')
        .attr('x', vis.width/5+10).attr('y', vis.height*2/3)
        .attr('height', 80);

    vis.yellowArrow2 = vis.svg.append('image')
        .attr('xlink:href', 'img/yellow-arrow2.png')
        .attr('x', vis.width*2/3+15).attr('y', vis.height*2/3)
        .attr('height', 85);

    vis.greenArrow3 = vis.svg.append('image')
        .attr('xlink:href', 'img/green-arrow4.png')
        .attr('x', vis.width/2-38).attr('y', vis.height/2-25)
        .attr('width', 33);

    vis.greenArrow4 = vis.svg.append('image')
        .attr('xlink:href', 'img/green-arrow4.png')
        .attr('x', vis.width/2-38).attr('y', vis.height/2+40)
        .attr('width', 33);


    // titles for channels
    vis.channelATitle = vis.svg.append('text')
        .text("Channel A: Incentive Effects")
        .attr('x', vis.width/2).attr('y', vis.margin.top +60-10 )
        .attr("class", "channel-a-title title");

    vis.channelBTitle = vis.svg.append('text')
        .text("Channel B: Income Effects")
        .attr('x', vis.width/2).attr('y', vis.margin.top +60-10+ (vis.height/4 + gap))
        .attr("class", "channel-b-title");

    vis.channelCTitle = vis.svg.append('text')
        .text("Channel C: Supplementary Programs")
        .attr('x', vis.width/2).attr('y', vis.margin.top +60-10 +(vis.height/4 + gap)*2)
        .attr("class", "channel-c-title");


    // texts for channels
    vis.channelAText = vis.svg
        .append('text').text('Health')
            .attr('class', 'channel-subtext')
            .attr('x', (vis.width/3 + 30 +smallBoxGap +smallBoxWidth/2))
            .attr('y', (vis.margin.top +60 +smallBoxGap + 32))
        .append('tspan').text('Nutrition')
            .attr('x', (vis.width/3 + 20 +smallBoxGap*2 + smallBoxWidth*1.5+10))
            .attr('y', (vis.margin.top +60 +smallBoxGap + 32))
        .append('tspan').text('Education')
            .attr('x', (vis.width/3 + 30 +smallBoxGap +smallBoxWidth/2))
            .attr('y', (vis.margin.top +60 +smallBoxGap + 32 + verticalGap +smallBoxHeight))
        .append('tspan').text('Other Trainings')
            .attr('class', 'channel-subtext2')
            .attr('x', (vis.width/3 + 20 +smallBoxGap*2 + smallBoxWidth*1.5+10))
            .attr('y', (vis.margin.top +60 +smallBoxGap + 32 + verticalGap +smallBoxHeight));

    vis.channelBText = vis.svg
        .append('text').text("Income")
            .attr('class','channel-subtext')
            .attr('x', vis.width/3 + 30 + channelBWidth/2)
            .attr('y', (vis.margin.top +65 +smallBoxGap + vis.height/4 + gap +30))
        .append('tspan').text("Income")
            .attr('x', vis.width/3 + 30 + channelBWidth/2)
            .attr('y', (vis.margin.top +65 +smallBoxGap + vis.height/4 + gap + (smallBoxHeight + verticalGap) +30));

    vis.channelBSubtext = vis.svg
        .append('text').text("Health, Nutrition")
            .attr('class', 'channel-subtext3')
            .attr('x', (vis.width/3 + 30 + channelBWidth +120))
            .attr('y', (vis.margin.top +65 +smallBoxGap + vis.height/4 + gap +22))
        .append('tspan').text("or Education")
            .attr('class', 'channel-subtext3')
            .attr('x', vis.width/3 + 30 + channelBWidth + 120)
            .attr('y', (vis.margin.top +65 +smallBoxGap + vis.height/4 + gap +22+15))
        .append('tspan').text("Others including migration,")
            .attr('class', 'channel-subtext3')
            .attr('x', vis.width/3 + 30 + channelBWidth + 120)
            .attr('y', (vis.margin.top +65 +smallBoxGap + vis.height/4 + gap + (smallBoxHeight + verticalGap) +22))
        .append('tspan').text("reduced stress, etc.")
            .attr('class', 'channel-subtext3')
            .attr('x', vis.width/3 + 30 + channelBWidth + 120)
            .attr('y', (vis.margin.top +65 +smallBoxGap + vis.height/4 + gap + (smallBoxHeight + verticalGap) +22+15));

    // !!!!!!! need to add action here: hovering and onclick!

    vis.channelCText = vis.svg
        .append('text').text("Supplementary programs offered via")
            .attr('class', 'channel-subtext')
            .attr('x', vis.width/2)
            .attr('y', vis.height*4/5)
        .append('tspan').text("other organizations (entrepreneurship,")
            .attr('x', vis.width/2)
            .attr('y', vis.height*4/5 +25)
        .append('tspan').text("job matching programs)")
            .attr('x', vis.width/2)
            .attr('y', vis.height*4/5 +25*2);


    // source circles
    var radius = 120,
        channelArea = 825,
        circleData = [0, 1];

    vis.sourceCircles = vis.svg.selectAll('circle').data(circleData);

    vis.sourceCircles.enter()
        .append('circle')
        .attr('r', radius)
        .attr('cx', function(d,i){
            return vis.margin.left + radius + channelArea*i + 20;
        })
        .attr('cy', vis.margin.top + vis.height/2)
        .attr('class', 'source');

    vis.prosperaText = vis.svg
        .append('text').text("Prospera")
            .attr('class', 'channel-text')
            .attr('x', vis.margin.left + radius +20)
            .attr('y', vis.margin.top + vis.height/2-10)
        .append('tspan').text("Program")
            .attr('class', 'channel-text')
            .attr('x', vis.margin.left + radius +20)
            .attr('y', vis.margin.top + vis.height/2 + 30);

    vis.productText = vis.svg
        .append('text').text("Labor")
            .attr('class', 'channel-text')
            .attr('x', vis.margin.left + channelArea +radius +20)
            .attr('y', vis.margin.top + vis.height/2-10)
        .append('tspan').text("Productivity")
            .attr('class', 'channel-text')
            .attr('x', vis.margin.left + channelArea+radius +20)
            .attr('y', vis.margin.top + vis.height/2 + 30);


    // notes
    vis.addNotes = vis.svg.append('text')
        .text('HOVER OVER EACH BOX FOR MORE DETAILS. CLICK EACH BOX FOR OUR FINDINGS FOR EACH CHANNEL.')
        .attr('class', 'channel-note')
        .attr('x', vis.width/2)
        .attr('y', 0);


    // initializing tool tips
    $('.channel').tooltipsy({
        offset: [5, 0],
        css: {
            'padding': '10px',
            'max-width': '200px',
            'color': '#3D3D3D',
            'background-color': 'rgba(240, 240, 240, 0.9)',
            'border': '0.1px solid #656565',
            'border-radius': '10px',
            '-moz-box-shadow': '0 0 10px rgba(100, 100, 100, .5)',
            '-webkit-box-shadow': '0 0 10px rgba(100, 100, 100, .5)',
            'box-shadow': '0 0 10px rgba(100, 100, 100, .5)',
            'text-shadow': 'none'
        }
    });

}




