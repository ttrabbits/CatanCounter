var CatanCounterChart;
(function (CatanCounterChart) {
    var xs;
    var ys;
    var playerCount;
    var totalTurn;
    var maxValue;
    function init() {
        initValues();
        bindEvents();
        $('#graph').highcharts({
            chart: {
                type: 'column',
            },
            title: {
                text: null,
            },
            xAxis: {
                categories: xs,
            },
            yAxis: {
                min: 0,
                max: maxValue,
                allowDecimals: false,
                title: '',
            },
            tooltip: {
                formatter: function () {
                    return "Spot " + this.x + ": <b>" + this.y + "</b>";
                },
            },
            credits: {
                enabled: false,
            },
            legend: {
                enabled: false,
            },
            series: [{
                    data: ys,
                }],
        });
    }
    CatanCounterChart.init = init;
    function initValues() {
        xs = [];
        ys = [];
        for (var i = 0; i < 11; i++) {
            xs[i] = i + 2;
            ys[i] = 0;
        }
        totalTurn = 0;
        maxValue = 10;
        if (!playerCount) {
            playerCount = 4;
        }
    }
    function bindEvents() {
        $('.btnlist.plus .dice-btn').click(function () {
            var key = parseInt($(this).text()) - 2;
            ys[key]++;
            totalTurn++;
            update();
        });
        $('.btnlist.minus .dice-btn').click(function () {
            var key = parseInt($(this).text()) - 2;
            if (ys[key] <= 0)
                return;
            ys[key]--;
            totalTurn--;
            update();
        });
        $('.player-btn').click(function () {
            var oldCount = playerCount;
            playerCount = parseInt($(this).attr('players'));
            $(this).attr('players', oldCount);
            $(this).text(oldCount + ' players');
            $('.player-count').text(playerCount);
            update();
        });
        $('.clear-btn').click(function () {
            if (confirm('Clear all records?')) {
                initValues();
                update();
            }
        });
    }
    function update() {
        var max = Math.max.apply(null, ys);
        maxValue = (max > 10 ? max : 10);
        var modulo = (totalTurn + 1) % playerCount;
        var mainTurn = Math.floor(totalTurn / playerCount + 1);
        var subTurn = modulo == 0 ? playerCount : modulo;
        $('.turn.main').text(mainTurn);
        $(".turn.sub").text(subTurn);
        $('th.total').text(totalTurn);
        for (var i = 0; i < 11; i++) {
            var rate = 100 * ys[i] / (totalTurn == 0 ? 1 : totalTurn);
            $('td.dice_' + (i + 2)).text(ys[i]);
            $('td.rate_' + (i + 2)).text(rate.toFixed(1) + '%');
        }
        var chart = $('#graph').highcharts();
        chart.series[0].setData(ys, false);
        chart.yAxis[0].setExtremes(0, maxValue, false);
        chart.redraw();
    }
})(CatanCounterChart || (CatanCounterChart = {}));
$(function () {
    CatanCounterChart.init();
});
