
define(function (require, exports, module) {
    require("echarts");

    function setTheme() {
        var theme = {
            line: {
                smooth: true,
                symbol: 'emptyCircle',
                symbolSize: 3
            }
        };

        echarts.registerTheme('macarons', theme);
    }
    exports.init = function (id, seriesType, title, x, lines, isFormat, max, chartColums, chartCodes, selectedMode, colors) {
        console.log("lines" + lines);
        var series = [];
        if (lines != undefined) {
            series.push({
                name: chartColums[0],
                type: 'bar',
                data: lines[0],
                yAxisIndex:1,
                barWidth: '20%',
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter: '{c}'
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#00ae08'
                    }
                }
            });
        }
        console.log(series);
        var legend = [];
        for (var i in chartColums) {
            legend.push({
                name: chartColums[i],
                icon: 'rect',
            });
        }
        series.push({
            name: chartColums[1],
            type: 'line',
            data: lines[1],
        
            itemStyle: {
                normal: {
                    color: '#3191fd'
                }
            }

        });
        setTheme();
        console.log(legend);
        var myChart = echarts.init($("#" + id).get(0), "macarons");
        option = {
            backgroundColor: '#fff',
            title: {
                text: title + '数据',
                x: 'center',
                textStyle: {
                    color: '#334455',
                    fontSize: 16,
                }
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params, ticket, callback) {
                    var res = params[0].name;
                    if (params.length > 0) {
                        for (var i = 0, l = params.length; i < l; i++) {
                            if (params[i].value != undefined) {
                                res += '<br/>' + params[i].seriesName + ' : ' + (isFormat ? params[i].value : params[i].value.toString() + '%');
                            } else {
                                res += '<br/>' + params[i].seriesName + ' : 0';
                            }

                        }
                    } else {
                        res = '<br/>' + params[i].seriesName + ' : 0';
                    }
                    setTimeout(function () {
                        // 仅为了模拟异步回调
                        callback(ticket, res);
                    }, 1000)
                    return 'loading';
                }
            },
            legend: {
                selectedMode: selectedMode,
                top: '30',
                data: legend,
            },
            grid: {
                show: true,
                zlevel: -999,
                left: '50',
                right: '40',
                top:'75',
                backgroundColor: '#f0f2f2',
                borderWidth: 0,
            },
            calculable: false,
            xAxis: [{
                type: 'category',
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: "#33FF33"
                    }
                },
                nameLocation: 'middle',
                boundaryGap: true,
                axisTick: {
                    alignWithLabel:true,
                },

                axisLabel: {
                    // interval: interval,
                    textStyle: {
                        color: '#334455',
                        fontSize: 16,
                    },
                    formatter: function (value) {
                        if (value == null || value == undefined)
                            return;
                        // 格式化成月-日,不显示年份
                        if (value.toString().length == 7) {
                            return value.toString().substr(5, value.toString().lenghth);
                        } else {
                            return value;
                        }
                        // return value;
                    }
                },
                data: x
            }
            ],
            yAxis: [ {
                min: '0',            
                type: 'value',
                splitNumber: 5,
                splitLine: {
                    show: false
                },
                position:'right',
                // 当数据为百分比的时候，加上%
                axisLabel: {
                    formatter: function (value) {
                        var label = isFormat ? value : value.toString() + '%';
                        return label;
                      
                    }
                }
            },{
                min: '0',
                max: max,
                type: 'value',
                splitNumber:5,
                splitLine: {
                    show: true
                },
                // 当数据为百分比的时候，加上%
                axisLabel: {
                    formatter: function (value) {
                      
                        var label = "";
                        if (value / 10000 >= 1) {
                            label = (value / 10000).toFixed(1) + 'w';
                        }
                        else {
                            label = value;
                        }
                        return label;
                    }
                }
            }
            ],
            series: series,
            color: colors,
        };
        console.log(option);
        myChart.setOption(option);
        window.onresize = myChart.resize;
    }
});
