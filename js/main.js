// website for SYPA
var costBen, channel;

// data for vis 1 - impact channel
    // creating instances for channel js file
    channel = new channelVis("#channel-vis");

    // duplicate the visualization on another page --> TBD
    // channelA = new channelVis("#channel-a-vis");


// data for vis 2 - cost benefits estimation

/*
    - creating the input space/scale / slider
    - creating a variable based on the input and use it to create a new data set within the js file
    - create a default number based on the recommendation
 */


    // slider for youth unemployment
    $("#sliderUnem").slider();
    $("#sliderUnem").on("slide", function(slideEvt) {
        $("#sliderUnemVal").text(slideEvt.value);
    });

    // sliders for change in wage level
    $("#sliderWage").slider();
    $("#sliderWage").on("slide", function(slideEvt) {
        $("#sliderWageVal").text(slideEvt.value);
    });

    // slider for number of youths per HH
    $("#sliderNumYouth").slider();
    $("#sliderNumYouth").on("slide", function(slideEvt){
        $("#sliderNumYouthVal").text(slideEvt.value);
    });

    // creating variables for selected value
    var unemploy = 	document.getElementById("sliderUnemVal").textContent;
    var wageChange = document.getElementById("sliderWageVal").textContent;
    var numYouth = document.getElementById("sliderNumYouthVal").textContent;

function showInput() {
    console.log(unemploy); // make sure we update this onChange of the slider!
    console.log(wageChange);
    console.log(numYouth);

}

// Number of years it take to break even
    // var yearBreakEven = document.getElementById("#cb-years").value;

    // creating instances for js file
    costBen = new costBenVis("#costben-vis");