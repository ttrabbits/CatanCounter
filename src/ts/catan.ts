declare var $: any;

module CatanCounterChart {
    var xs;
    var ys;

    var playerCount;
    var totalTurn;
    var maxValue;

    var storage;

    export function init() {
        if (window.sessionStorage) {
            storage = window.sessionStorage;
        }
        loadStorage() ? updateHtml() : initValues();
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
                formatter: function(){
                    return this.x + ': <b>' + this.y + ' times</b>';
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

    function loadStorage() {
        if (!storage || !storage.getItem('values')) {
            return false;
        }
        try {
            var values = JSON.parse(storage.getItem('values'));
            xs = values.xs;
            ys = values.ys;
            totalTurn = values.totalTurn;
            maxValue = values.maxValue;
            playerCount = values.playerCount;
        } catch (e) {
            return false;
        }
        return true;
    }

    function saveStorage() {
        if (!storage) {
            return false;
        }
        var values = JSON.stringify({
            xs: xs,
            ys: ys,
            totalTurn: totalTurn,
            maxValue: maxValue,
            playerCount: playerCount,
        });
        storage.setItem('values', values);
        return true;
    }

    function bindEvents() {
        $('.btnlist.plus .dice-btn').click(function() {
            var key = parseInt($(this).text()) - 2;
            ys[key]++;
            totalTurn++;
            update();
        });

        $('.btnlist.minus .dice-btn').click(function() {
            var key = parseInt($(this).text()) - 2;
            if (ys[key] <= 0) return;
            ys[key]--;
            totalTurn--;
            update();
        });

        $('.player-btn').click(function() {
            playerCount = parseInt($(this).attr('players'));
            updateHtml();
            saveStorage();
        });

        $('.clear-btn').click(function() {
            if (confirm('Clear all records?')) {
                initValues();
                update();
            }
        });
    }

    function update() {
        var max = Math.max.apply(null, ys);
        maxValue = (max > 10 ? max : 10);

        updateHtml();

        var chart = $('#graph').highcharts();
        chart.series[0].setData(ys, false);
        chart.yAxis[0].setExtremes(0, maxValue, false);
        chart.redraw();

        saveStorage();
    }

    function updateHtml() {
        // TODO: use template engine.
        var modulo = (totalTurn + 1) % playerCount;
        var mainTurn = Math.floor(totalTurn / playerCount + 1);
        var subTurn = modulo == 0 ? playerCount : modulo;
        $('.turn.main').text(mainTurn);
        $('.turn.sub').text(subTurn);
        $('th.total').text(totalTurn);

        for (var i = 0; i < 11; i++) {
            var rate = 100 * ys[i] / (totalTurn == 0 ? 1 : totalTurn);
            $('td.dice_' + (i+2)).text(ys[i]);
            $('td.rate_' + (i+2)).text(rate.toFixed(1) + '%');
        }

        $('.player-count').text(playerCount);
        var nextCount = playerCount == 4 ? 3 : 4;
        var playerBtn = $('.player-btn');
        playerBtn.attr('players', nextCount);
        playerBtn.text(nextCount + ' players');
    }

}

$(function() {
    CatanCounterChart.init();
});
