// website for SYPA
var costBen, channel;


/* DATA for channel vis*/

// creating instances for channel js file
    channel = new channelVis("#channel-vis");



/* DATA for COST-BEN vis*/

// creating variables for selected value
    var unemploy = 	document.getElementById("sliderUnemVal").textContent;
    var transferChange = document.getElementById("sliderTransferVal").textContent;
    var numYouth = document.getElementById("sliderNumYouthVal").textContent;

    console.log(unemploy);
    console.log(transferChange);
    console.log(numYouth);

    // slider for youth unemployment
    $("#sliderUnem").slider();
    $("#sliderUnem").on("slide", function(slideEvt) {
        $("#sliderUnemVal").text(slideEvt.value);
        console.log(unemploy); // make sure we update this onChange of the slider!
        console.log(slideEvt.value);

    });

    // sliders for change in wage level
    $("#sliderTransfer").slider();
    $("#sliderTransfer").on("slide", function(slideEvt) {
        $("#sliderTransferVal").text(slideEvt.value);
        console.log(transferChange);
        console.log(slideEvt.value);

    });

    // slider for number of youths per HH
    $("#sliderNumYouth").slider();
    $("#sliderNumYouth").on("slide", function(slideEvt){
        $("#sliderNumYouthVal").text(slideEvt.value);
        console.log(numYouth);
        console.log(slideEvt.value);
    });


// generic variables for the estimation
    var annualYear = [1,1,1,1,1,1,1,1,1,1,1,1],
        cumulativeYear = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        totalBen = 6000000,
        youthEnterLaborRate = 1/18,
        firstJobImpact = 0.86,
        currentJobImpact = 0.95;

// cost
    var currentTransfer = 335,
        newTransfer = currentTransfer*transferChange/100,
        newAnnualTransfer = newTransfer*12,
        newAnnualTransferTotal = newAnnualTransfer*totalBen;

    console.log(newTransfer);
    console.log(newAnnualTransfer);
    console.log(newAnnualTransferTotal);

    var cumCostHH = cumulativeYear.map(function(d){
        return d*newAnnualTransfer;
    });

    var annualCostTotal = annualYear.map(function(d){
        return d*newAnnualTransferTotal;
    });

    var cumCostTotal = cumulativeYear.map(function(d){
        return d*newAnnualTransferTotal;
    });

    // var annualCostTotal = [newAnnualTransferTotal, newAnnualTransferTotal,
    //     newAnnualTransferTotal, newAnnualTransferTotal,
    //     newAnnualTransferTotal, newAnnualTransferTotal,
    //     newAnnualTransferTotal, newAnnualTransferTotal,
    //     newAnnualTransferTotal, newAnnualTransferTotal,
    //     newAnnualTransferTotal, newAnnualTransferTotal];

    // var cumCostTotal = [newAnnualTransferTotal, 2*newAnnualTransferTotal,
    //     3*newAnnualTransferTotal, 4*newAnnualTransferTotal,
    //     5*newAnnualTransferTotal, 6*newAnnualTransferTotal,
    //     7*newAnnualTransferTotal, 8*newAnnualTransferTotal,
    //     9*newAnnualTransferTotal, 10*newAnnualTransferTotal,
    //     11*newAnnualTransferTotal, 12*newAnnualTransferTotal];

    console.log(cumCostHH);
    console.log(annualCostTotal);
    console.log(cumCostTotal);


// benefits of the first job
// ln(monthly wage of first job)  = 0.86*ln(total lifetime transfer amount)
    // making the calculation an array;
    var annualBenFirstTotal = cumCostHH.map(function(d){
        return Math.round((Math.round(Math.exp(firstJobImpact * Math.log(d))*12)*numYouth*totalBen)*(100-unemploy)/100*youthEnterLaborRate);
    });

    var cumBenFirstTotal = [];
    annualBenFirstTotal.reduce(function(a, b, i){ return cumBenFirstTotal[i] = a+b; }, 0);

    // original calculation (static time)
    // var lnChangeMonthlyWage = firstJobImpact* Math.log(newAnnualTransfer),
    //     changeMonthlyWage = Math.exp(lnChangeMonthlyWage),
    //     changeAnnualWage = Math.round(changeMonthlyWage*12),
    //     changeAnnualWageHH = changeAnnualWage*numYouth,
    //     changeAnnualWageTotal = changeAnnualWageHH*totalBen;
    //
    // // incorporating proportion of youth entering the market and unemployment rate
    // var realChangeAnnualWageTotal = Math.round(changeAnnualWageTotal*(100-unemploy)/100*youthEnterLaborRate);
    //
    // console.log(changeAnnualWage);
    // console.log(changeAnnualWageHH);
    // console.log(changeAnnualWageTotal);
    // console.log(realChangeAnnualWageTotal);

    // var annualBenTotal = annualYear*realChangeAnnualWageTotal,
    //     cumBenTotal = cumulativeYear*realChangeAnnualWageTotal;

    console.log(annualBenFirstTotal);
    console.log(cumBenFirstTotal);


// benefits of the current job
    var newCostHH = cumCostHH;
    newCostHH.unshift(0);
    newCostHH.filter(function(d, i){
        return i = 11;
    });
    console.log(newCostHH);

    var annualBenCurrentTotal = newCostHH.map(function(d){
        return Math.round((Math.round(Math.exp(currentJobImpact * Math.log(d))*12)*numYouth*totalBen)*(100-unemploy)/100*youthEnterLaborRate);
    });

    var cumBenCurrentTotal = [];
    annualBenCurrentTotal.reduce(function(a, b, i){ return cumBenCurrentTotal[i] = a+b; },0);

    console.log(annualBenCurrentTotal);
    console.log(cumBenCurrentTotal);

    // var lnChangeCurrentMonthWage = currentJobImpact*Math.log(newAnnualTransfer),
    //     changeCurrentMonthWage = Math.exp(lnChangeCurrentMonthWage),
    //     changeCurrentAnnualWage = Math.round(changeCurrentMonthWage*12),
    //     changeCurrentAnnualWageHH = changeCurrentAnnualWage*numYouth,
    //     changeCurrentAnnualWageTotal = changeCurrentAnnualWageHH*totalBen,
    //
    //     // incorporating proportion of youth entering the market and unemployment rate
    //     realChangeCurrentAnnualTotal = Math.round(changeCurrentAnnualWageTotal*(100-unemploy)/100*youthEnterLaborRate);
    //
    // console.log(changeCurrentAnnualWage);
    // console.log(changeCurrentAnnualWageTotal);
    // console.log(realChangeCurrentAnnualTotal);

// combining first and current job Ben
    var annualBenSum = annualBenFirstTotal.map(function(d, i){
        return Math.round((d+ annualBenCurrentTotal[i])/1000000);
    });

    var cumBenSum = cumBenFirstTotal.map(function(d, i){
        return Math.round((d + cumBenCurrentTotal[i])/1000000);
    });

    console.log(annualBenSum);
    console.log(cumBenSum);


// Number of years it take to break even
    // var yearBreakEven = document.getElementById("#cb-years").value;


// creating instances for js file
    costBen = new costBenVis("#costben-vis", annualCostTotal, cumCostTotal, annualBenSum, cumBenSum);