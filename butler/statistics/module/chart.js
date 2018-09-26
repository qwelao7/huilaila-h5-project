
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


    exports.init = function (title, x, lines, isFormat,max, chartColums, chartCodes, interval, selectedMode, colors) {
        console.log("lines"+lines);
        var series = [];
        
        if (lines != undefined) {

            for (var i in chartColums) {
                series.push(
                            {
                                name: chartColums[i],
                                type: 'line',
                                data: lines[i],
                               
                            }
                    );
            }

            
            console.log(series);
            var legend = [];
            for (var i in chartColums) {
                legend.push(
                    {
                        name: chartColums[i],
                        icon: 'circle',
                    }
                    );
            }
            if (lines[chartColums.length] != undefined) {
                series.push(
                            {
                                name: "指标",
                                type: 'line',
                                data: lines[chartColums.length],
                                itemStyle: {
                                    normal: {
                                        color: '#FF0000'
                                    }
                                }

                            }
                    );
                legend.push(
                 {
                     name: '指标',
                     icon: 'circle',
                 }
                 );

            }
        }

        setTheme();

        console.log(legend);
        var myChart = echarts.init(document.getElementById('chart'), "macarons");
      

        option = {
            backgroundColor: '#fff',
            title: {
                text: title+'数据',
                x: 'center',
                textStyle: {
                    color: '#334455',
                    fontSize:20,
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
                    }
                    else {
                        res = '<br/>' + params[i].seriesName + ' : 0';
                    }
                    setTimeout(function ()  {
                        // 仅为了模拟异步回调
                        callback(ticket, res);
                    }, 1000)
                    return 'loading';
                }
            },
            toolbox: {
            },
            legend: {
                selectedMode: selectedMode,
                top: '30',
                data: legend,
                
            },
            grid: {
                show: true,
                zlevel: -999,
                // containLabel:true,坐标值全部显示
                left: '50',
                backgroundColor: '#f0f2f2',
                borderWidth:0,
            },
            
            calculable: false,
            xAxis: [
                {
                    type: 'category',

                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: "#33FF33"
                        }
                    },
                   
                    boundaryGap: false,
                    axisLabel:{
                       // interval: interval,
                        textStyle: {
                            color: '#334455',
                            fontSize: 16,
                        },
                        formatter: function (value) {
                            if (value == null||value==undefined) return;
                            // 格式化成月-日,不显示年份
                            if (value.toString().length == 7) {
                                return value.toString().substr(5, value.toString().lenghth);
                            }
                            else {
                                return value;
                            }
                           // return value;
                        }
                    },
                    // data: lines.pop()
                    data:x
                }
            ],
            yAxis: [
                {
                    min: '0',
                    max: max,
                    type: 'value',
                    splitLine: {
                        show: true
                    },
                   // 当数据为百分比的时候，加上%
                    axisLabel: {
                        formatter: function (value) {
                            var label = isFormat? value : value.toString()+'%';
                            return label;
                        }
                       
                    }
                }
            ],
            series: series,
            color:colors,
        };

        console.log(option);

        myChart.setOption(option);
        window.onresize = myChart.resize;
    }
});
