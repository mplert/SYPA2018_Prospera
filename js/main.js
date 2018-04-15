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

    // Number of years it take to break even
    // var yearBreakEven = document.getElementById("#cb-years").value;

    // creating instances for js file
    costBen = new costBenVis("#costben-vis");