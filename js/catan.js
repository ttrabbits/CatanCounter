var count = [];
var xaxis = [];
var total = 0;
var mode = 4;
var maxValue = 10;
for (var i=0; i<11; i++){ 
    count[i] = 0;
    xaxis[i] = i+2;
}

$(function(){
    $('#graph').highcharts({
        chart: {
            type: "column"
        },
        title: {
            text: null
        },
        xAxis: {
            categories: xaxis
        },
        yAxis: {
            min: 0,
            max: maxValue,
            allowDecimals: false,
            title: ''
        },
        tooltip: {
            formatter: function(){
                return "Spot " + this.x + ": <b>" + this.y + "</b>";
            }
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        series: [{
            data: count
        }]
    });

    $(".buttonlist.plus .dice_button").click(function(event){
        var diceno = parseInt($(this).attr("value"));
        count[diceno-2]++;
        total++;
        writeValue();
    });
    
    $(".buttonlist.minus .dice_button").click(function(event){
        var diceno = parseInt($(this).attr("value"));
        if(count[diceno-2] > 0){
            count[diceno-2]--;
            total--;
            writeValue();
        }
    });
    
    $(".mode_3").click(function(event){
        mode = 3;
        writeValue();
    });
    
    $(".mode_4").click(function(event){
        mode = 4;
        writeValue();
    });
    
    $(".clear_button").click(function(){
        if(window.confirm("Clear all records?")){
            for(var i=0; i<11; i++) count[i] = 0;
            total = 0;
            writeValue();
        }
    });
});

function writeValue(){
    var modulo = (total+1) % mode;
    $(".turn1").text(Math.floor(total/mode + 1));
    $(".turn2").text(modulo == 0 ? mode : modulo);
    $("th.total").text(total);
    
    for(var i=0; i<11; i++){
        var num = 100*count[i]/(total != 0 ? total : 1)
        $("td.dice_" + (i+2)).text(count[i]);
        $("td.rate_" + (i+2)).text(num.toFixed(1) + "%");
    }
    
    var max = Math.max.apply(null, count);
    maxValue = (max > 10 ? max : 10);
    
    var chart = $('#graph').highcharts();
    chart.series[0].setData(count);
    chart.yAxis[0].setExtremes(0, maxValue);
}