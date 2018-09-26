
define(function (require, exports, module) {
    require("echarts");

    //function setTheme() {
    //    var theme = {
    //        line: {
    //            smooth: true,
    //            symbol: 'emptyCircle',
    //            symbolSize: 3
    //        }
    //    };

    //    echarts.registerTheme('macarons', theme);
    //}


    exports.init = function (id, seriesType,title, lines , chartColums, chartCodes, colors) {
        console.log("lines");
        console.log(lines);
        var series = [];
        series.push(
                {
                    name: title,
                    type: seriesType,
                    radius: '50%',
                    data: lines,
                    label: {
                        normal: {
                            show: true,
                            position: 'outside',
                            formatter: "{b} \n 占比{d}%",
                            //formatter: function (params) {
                            //     params.color="#334455";
                            //     var res =params.percent;
                              
                            
                            //     return res;
                            //},
                            textStyle: {
                                color: '#334455',
                                
                            }
                        }, emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '20',
                                fontWeight: 'bold'
                            },
                            formatter: '{d}%',
                        }
                    },
                    labelLine: {
                        normal: {
                            show: true,
                            length: 5,
                            lineStyle: {
                                color: '#aaaaaa'
                            }
                        }
                    }
                }
            );

            

        console.log(series);
        //setTheme();

        var myChart = echarts.init($("#" + id).get(0), "macarons");
        option = {
            backgroundColor: '#fff',
            tooltip: {
                trigger: 'item',
                formatter: "{b}: {c}<br/> ({d}%)"
            },
            calculable: false,

             series: series,
            //series:[{
            //    name:'覆盖率',
            //    type:'pie',
            //    radius: ['50%', '70%'],
            //   // avoidLabelOverlap: false,
            //    data: [{ name: '注册户数', value: 30 },
            //           {name: '入住户数',value: 20, }], 
            //    label: {
            //        normal: {
            //            show: true,
            //            position: 'outside',
            //            formatter: "{b}:{c} \n 占比{d}%",
            //        }, emphasis: {
            //            show: true,
            //            textStyle: {
            //                fontSize: '20',
            //                fontWeight: 'bold'
            //            },
            //            formatter: '{d}%',
            //        }
            //    },
            //    itemStyle: {
            //        emphasis: {
            //            shadowBlur: 10,
            //            shadowOffsetX: 0,
            //            shadowColor: 'rgba(0, 0, 0, 0.5)'
            //        }
            //    }
            //}],
          
         color: colors,
        };

        console.log(option);

        myChart.setOption(option);
        window.onresize = myChart.resize;
    }
});