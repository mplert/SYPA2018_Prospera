// website for SYPA
var costBen, channel;


/* DATA for channel vis*/

// creating instances for channel js file
channel = new channelVis("#channel-vis");



/* DATA for COST-BEN vis*/

// slider for youth unemployment
$("#sliderUnem").slider();
$("#sliderUnem").on("slide", function (slideEvt) {
    $("#sliderUnemVal").text(slideEvt.value);
    console.log(slideEvt.value);
});

// sliders for change in wage level
$("#sliderTransfer").slider();
$("#sliderTransfer").on("slide", function (slideEvt) {
    $("#sliderTransferVal").text(slideEvt.value);
    console.log(slideEvt.value);

});

// slider for number of youths per HH
$("#sliderNumYouth").slider();
$("#sliderNumYouth").on("slide", function (slideEvt) {
    $("#sliderNumYouthVal").text(slideEvt.value);
    console.log(slideEvt.value);
});

// adding title to the text
$('#slider-transfer').attr('title', "Percentage change in nutrition component of the transfer dictates the cost and the benefits on youth's labor productivity.");
$('#slider-unem').attr('title', 'Youth unemployment rate (%) dictates how many youths could get a job.');
$('#slider-youth').attr('title', 'The average number of youths in the household is 3.4. ' +
    'For conservative estimates, we assume that each household has 1 youth who will recieve benefits from the change in transfer amount.')

// creating instances for js file
costBen = new costBenVis("#costben-vis");


