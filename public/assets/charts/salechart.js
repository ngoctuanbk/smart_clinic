//define this variables for each client
var _UNIT_VOLUME = 'chai'; //general = 'sp' (san pham)
var _UNIT_REVENUE = 'triệu'; //chia nho đơn vị tiền

var chartData = [{
        "date": "2018-10-01",
        "revenue": 2.3,
        "volume": 100
    }, {
        "date": "2018-10-02",
        "revenue": 6.2,
        "volume": 150
    }, {
        "date": "2018-10-03",
        "revenue": 3.1,
        "volume": 300
    }, {
        "date": "2018-10-04",
        "revenue": 9.5,
        "volume": 500
    }, {
        "date": "2018-10-05",
        "revenue": 6.2,
        "volume": 450
    }, {
        "date": "2018-10-06",
        "revenue": 20,
        "volume": 1000
    }, {
        "date": "2018-10-07",
        "revenue": 21,
        "volume": 1200
    }, {
        "date": "2018-10-08",
        "revenue": 5.6,
        "volume": 600
    }, {
        "date": "2018-10-09",
        "revenue": 3.6,
        "volume": 600
    }, {
        "date": "2018-10-10",
        "revenue": 3.8,
        "volume": 1000
    }, {
        "date": "2018-10-11",
        "revenue": 5.6,
        "volume": 700
    }, {
        "date": "2018-10-12",
        "revenue": 5.1,
        "volume": 750
    }, {
        "date": "2018-10-13",
        "revenue": 16,
        "volume": 800
    }, {
        "date": "2018-10-14",
        "revenue": 14.5,
        "volume": 1300
    }, {
        "date": "2018-10-15",
        "revenue": 19.2,
        "volume": 1850
    }, {
        "date": "2018-10-16",
        "revenue": 9.5,
        "volume": 1800
    }, {
        "date": "2018-10-17",
        "revenue": 6,
        "volume": 2000
    }, {
        "date": "2018-10-18",
        "revenue": 17,
        "volume": 2500
    }, {
        "date": "2018-10-19",
        "revenue": 18,
        "volume": 2600
    }, {
        "date": "2018-10-20",
        "revenue": 15.8,
        "volume": 2800
    }, {
        "date": "2018-10-21",
        "revenue": 16.0,
        "volume": 2700
    }, {
        "date": "2018-10-22",
        "revenue": 14.5,
        "volume": 2000,
        "dashLengthLine": 5
    }, {
        "date": "2018-10-23",
        "revenue": 16,
        "volume": 2020,
        "dashLengthColumn": 5,
        "alpha": 0.2,
    },
    {
        "date": "2018-10-24",
    }, {
        "date": "2018-10-25",
    }
];


var SaleChart = function () {
    var initSaleChart = function () {
        var chart = AmCharts.makeChart("sale_chart", {
            "type": "serial",
            "theme": "light",
            "autoMargins": false,
            "marginLeft": 50,
            "marginRight": 70,
            "marginTop": 10,
            "marginBottom": 20,

            "fontFamily": 'Open Sans',
            "color": '#888',

            "legend": {
                "equalWidths": false,
                "useGraphSettings": true,
                "valueAlign": "left",
                "valueWidth": 100,
            },

            "dataProvider": chartData,
            "valueAxes": [{
                "id": "revenueAxis",
                "stackType": "regular",
                "axisAlpha": 0,
                "position": "left",
                "title": "Doanh thu",
            }, {
                "id": "volumeAxis",
                "axisAlpha": 0,
                "gridAlpha": 0,
                "inside": false,
                "position": "right",
                "title": "Doanh số"
            }],
            "startDuration": 0,
            "graphs": [{
                "alphaField": "alpha",
                "balloonText": "<span style='font-size:10px;'>[[title]] :<b>[[value]]</b> [[additional]]</span>",
                "dashLengthField": "dashLengthColumn",
                "fillAlphas": 1,
                "title": "Doanh thu",
                "type": "column",
                "valueField": "revenue",
                "id": "revenue",
                "valueAxis": "revenueAxis",
                "legendValueText": "[[value]] triệu",
                "legendPeriodValueText": " | Tổng: [[value.sum]]" + _UNIT_REVENUE,
            }, {
                "lineColor": "#cc4748",
                "balloonText": "<span style='font-size:10px;'>[[title]] :<b>[[value]]</b> [[additional]]</span>",
                "bullet": "round",
                "dashLengthField": "dashLengthLine",
                "lineThickness": 3,
                "bulletSize": 7,
                "bulletBorderAlpha": 1,
                "bulletColor": "#FFFFFF",
                "useLineColorForBulletBorder": true,
                "bulletBorderThickness": 3,
                "fillAlphas": 0,
                "lineAlpha": 1,
                "title": "Doanh số",
                "valueField": "volume",
                "id": "volume",
                "valueAxis": "volumeAxis",
                "legendValueText": "[[value]] chai",
                "legendPeriodValueText": " | Tổng: [[value.sum]] " + _UNIT_VOLUME,
            }],
            "chartScrollbar": {
                "scrollbarHeight": 3,
                "dragIcon": 'dragIconRoundSmall',
                "dragIconHeight": 25,
                "dragIconWidth": 25,
                "offset": -1,
                "backgroundColor": "#888888",
                "selectedBackgroundColor": "#67b7dc",
                "selectedBackgroundAlpha": 1
            },
            "chartCursor": {
                "categoryBalloonDateFormat": "DD",
                "cursorAlpha": 0.1,
                "cursorColor": "#000000",
                "fullWidth": true,
                "valueBalloonsEnabled": false,
                "zoomable": false
            },
            "dataDateFormat": "YYYY-MM-DD",
            "categoryField": "date",
            "categoryAxis": {
                "dateFormats": [{
                    "period": "DD",
                    "format": "DD"
                }, {
                    "period": "WW",
                    "format": "MMM DD"
                }, {
                    "period": "MM",
                    "format": "MMM"
                }, {
                    "period": "YYYY",
                    "format": "YYYY"
                }],
                "parseDates": true,
                "gridPosition": "start",
                "axisAlpha": 0,
                "tickLength": 0
            }
        });
    }
    var initTopProducts = function () {
        let topProducts = [{
                name: 'Sản phẩm 1',
                revenue: '5000',
                volume: '100',
                color: "#85C5E3",
            },
            {
                name: 'Sản phẩm 2',
                revenue: '3000',
                volume: '300',
                color: "#E284D7",
            },
            {
                name: 'Sản phẩm 3',
                revenue: '1000',
                volume: '500',
                color: "#E2BE84",
            }
        ]
        var chart = AmCharts.makeChart("top_products_chart", {
            "type": "serial",
            "theme": "light",
            "autoMargins": false,
            "rotate": true,
            "marginLeft": 80,
            "marginRight": 30,
            "marginTop": 10,
            "marginBottom": 50,

            "fontFamily": 'Open Sans',
            "color": '#888',

            "legend": {
                "equalWidths": false,
                "useGraphSettings": true,
                "valueAlign": "left",
                "valueWidth": 20,
            },
            "dataProvider": topProducts,
            "startDuration": 0,
            "graphs": [{
                "alphaField": "alpha",
                "balloonText": "<span style='font-size:10px; text-align:center'>[[title]] :<b>[[value]]</b> [[additional]]</span>",
                "dashLengthField": "dashLengthColumn",
                "fillAlphas": 1,
                "title": "Doanh số",
                "type": "column",
                "valueField": "revenue",
                "id": "revenue",
                "valueAxis": "revenueAxis",
                "labelPosition": "middle",
                "legendValueText": "[[value]] Sản phẩm",
                "legendPeriodValueText": " | Tổng: [[value.sum]]" + ' Sản phẩm',
                "colorField":"color"
            }],
            "chartScrollbar": {
                "scrollbarHeight": 3,
                "dragIcon": 'dragIconRoundSmall',
                "dragIconHeight": 25,
                "dragIconWidth": 25,
                "offset": -1,
                "backgroundColor": "#888888",
                "selectedBackgroundColor": "#67b7dc",
                "selectedBackgroundAlpha": 1
            },
            "chartCursor": {
                "categoryBalloonDateFormat": "DD",
                "cursorAlpha": 0.1,
                "cursorColor": "#000000",
                "fullWidth": true,
                "valueBalloonsEnabled": false,
                "zoomable": false
            },
            "categoryField": "name",
            "categoryAxis": {
                "gridPosition": "start",
                "axisAlpha": 0,
                "tickLength": 0
            }
        });
    }
    var initTopMembers = function () {
        let topMembers = [{
                "name": "Lan",
                "revenue": 15,
                "volume": 100,
                "color": "#85C5E3",
            },
            {
                "name": "Huệ",
                "revenue": 13,
                "volume": 200,
                "color": "#84A8E2",
            },
            {
                "name": "Hồng",
                "revenue": 12,
                "volume": 120,
                "color": "#9783E1",
            },
            {
                "name": "Mai",
                "revenue": 10,
                "volume": 200,
                "color": "#D184E2",
            },
            {
                "name": "Đào",
                "revenue": 9,
                "volume": 180,
                "color": "#E284BB",
            },
            {
                "name": "Cúc",
                "revenue": 4,
                "volume": 250,
                "color": "#E28684",
            },
        ]
        var chart = AmCharts.makeChart("top_members_chart", {
            "type": "serial",
            "theme": "light",
            "autoMargins": false,
            "rotate": true,
            "marginLeft": 50,
            "marginRight": 30,
            "marginTop": 10,
            "marginBottom": 50,

            "fontFamily": 'Open Sans',
            "color": '#888',

            "legend": {
                "equalWidths": false,
                "useGraphSettings": true,
                "valueAlign": "left",
                "valueWidth": 20,
            },
            "dataProvider": topMembers,
            // "valueAxes": [{
            // 	"id": "revenueAxis",
            // 	"stackType": "regular",
            //     "axisAlpha": 0,
            //     "position": "left",
            //     "title": "Doanh thu",
            // }],
            "startDuration": 0,
            "graphs": [{
                "alphaField": "alpha",
                "balloonText": "<span style='font-size:10px;'>[[title]] :<b>[[value]]</b> [[additional]]</span>",
                "dashLengthField": "dashLengthColumn",
                "fillAlphas": 1,
                "title": "Doanh số",
                "type": "column",
                "valueField": "revenue",
                "id": "revenue",
                "valueAxis": "revenueAxis",
                "legendValueText": "[[value]]",
                "legendPeriodValueText": " | Tổng: [[value.sum]]",
                "colorField":"color"
            }],
            "chartScrollbar": {
                "scrollbarHeight": 3,
                "dragIcon": 'dragIconRoundSmall',
                "dragIconHeight": 25,
                "dragIconWidth": 25,
                "offset": -1,
                "backgroundColor": "#888888",
                "selectedBackgroundColor": "#67b7dc",
                "selectedBackgroundAlpha": 1
            },
            "chartCursor": {
                "categoryBalloonDateFormat": "DD",
                "cursorAlpha": 0.1,
                "cursorColor": "#000000",
                "fullWidth": true,
                "valueBalloonsEnabled": false,
                "zoomable": false
            },
            "categoryField": "name",
            "categoryAxis": {
                "gridPosition": "start",
                "axisAlpha": 0,
                "tickLength": 0
            }
        });
    }
    var initRevenueYearChart = function () {
        let revenueMonth = [{
                "month": "1",
                "lastYear": 10,
                "currentYear": 50,
                "volume": 10,
                "color": "#F8AF46",
                "color1": "#6EBCFC"
            },
            {
                "month": "2",
                "lastYear": 60,
                "currentYear": 80,
                "volume": 30,
                "color": "#F8AF46",
                "color1": "#6EBCFC"
            },
            {
                "month": "3",
                "lastYear": 20,
                "currentYear": 50,
                "volume": 50,
                "color": "#F8AF46",
                "color1": "#6EBCFC"
            },
            {
                "month": "4",
                "lastYear": 63,
                "currentYear": 25,
                "volume": 10,
                "color": "#F8AF46",
                "color1": "#6EBCFC"
            },
            {
                "month": "5",
                "lastYear": 55,
                "currentYear": 55,
                "volume": 70,
                "color": "#F8AF46",
                "color1": "#6EBCFC"
            },
            {
                "month": "6",
                "lastYear": 36,
                "currentYear": 88,
                "volume": 60,
                "color": "#F8AF46",
                "color1": "#6EBCFC"
            },
            {
                "month": "7",
                "lastYear": 42,
                "currentYear": 85,
                "volume": 30,
                "color": "#F8AF46",
                "color1": "#6EBCFC"
            },
            {
                "month": "8",
                "lastYear": 52,
                "currentYear": 99,
                "volume": 90,
                "color": "#F8AF46",
                "color1": "#6EBCFC"
            },
            {
                "month": "9",
                "lastYear": 60,
                "currentYear": 70,
                "volume": 80,
                "color": "#F8AF46",
                "color1": "#6EBCFC"
            },
            {
                "month": "10",
                "lastYear": 80,
                "currentYear": 30,
                "volume": 65,
                "color": "#F8AF46",
                "color1": "#6EBCFC"
            },
            {
                "month": "11",
                "lastYear": 20,
                "currentYear": 60,
                "volume": 26,
                "color": "#F8AF46",
                "color1": "#6EBCFC"
            },
            {
                "month": "12",
                "lastYear": 56,
                "currentYear": 100,
                "volume": 56,
                "color": "#F8AF46",
                "color1": "#6EBCFC"
            }
        ]
        var chart = AmCharts.makeChart("revenue_year_chart", {
            "type": "serial",
            "theme": "light",
            "autoMargins": false,
            "marginLeft": 60,
            "marginRight": 60,
            "marginTop": 10,
            "marginBottom": 20,
            "fontFamily": 'Open Sans',
            "color": '#888',
            "legend": {
                "equalWidths": false,
                "useGraphSettings": true,
                "valueAlign": "left",
                "valueWidth": 100,
            },
            "categoryField": "month",
            "categoryAxis": {
                "gridPosition": "start",
                "axisAlpha": 0,
                "tickLength": 0,
                "position": "left"
            },
            "dataProvider": revenueMonth,
            "valueAxes": [{
                "id": "lastYearAxis",
                "stackType": "regular",
                "axisAlpha": 0,
                "position": "left",
                "title": "Doanh số",
            },
            {
                "id": "currentYearAxis",
                "stackType": "regular",
                "axisAlpha": 0,
                "position": "right",
                "title": "Doanh số",
            }],
            "startDuration": 0,
            "graphs": [{
                "balloonText": "Năm ngoái:[[value]]",
                "color": "#fff",
                "fillAlphas": 0.8,
                "lineAlpha": 0.2,
                "title": "Năm ngoái",
                "type": "column",
                "valueField": "lastYear",
                "color": "#ffffff",
                "colorField": "color",
                "valueAxis":"lastYearAxis",
                "fillColors":"#F8AF46",
                "legendValueText": "[[value]] ",
                "legendPeriodValueText": " | Tổng: [[value.sum]]",
            }, {
                "newStack": true,
                "balloonText": "Năm nay:[[value]]",
                "color": "#fff",
                "fillAlphas": 0.8,
                "lineAlpha": 0.2,
                "title": "Năm nay",
                "type": "column",
                "valueField": "currentYear",
                "color": "#ffffff",
                "colorField": "color1",
                "valueAxis":"currentYearAxis",
                "fillColors":"#6EBCFC",
                "legendValueText": "[[value]] ",
                "legendPeriodValueText": " | Tổng: [[value.sum]]",
            }],
            "chartScrollbar": {
                "scrollbarHeight": 3,
                "dragIcon": 'dragIconRoundSmall',
                "dragIconHeight": 25,
                "dragIconWidth": 25,
                "offset": -1,
                "backgroundColor": "#888888",
                "selectedBackgroundColor": "#67b7dc",
                "selectedBackgroundAlpha": 1
            },
            "chartCursor": {
                "cursorAlpha": 0.1,
                "cursorColor": "#000000",
                "fullWidth": true,
                "valueBalloonsEnabled": false,
                "zoomable": false
            },
        });
    }
    var initQuantityYearChart = function () {
        let revenueMonth = [{
                "month": "1",
                "lastYear": 10,
                "currentYear": 50,
                "volume": 10,
                "color": "#F8AF46",
                "color1": "#6EBCFC"
            },
            {
                "month": "2",
                "lastYear": 60,
                "currentYear": 80,
                "volume": 30,
                "color": "#F8AF46",
                "color1": "#6EBCFC"
            },
            {
                "month": "3",
                "lastYear": 20,
                "currentYear": 50,
                "volume": 50,
                "color": "#F8AF46",
                "color1": "#6EBCFC"
            },
            {
                "month": "4",
                "lastYear": 63,
                "currentYear": 25,
                "volume": 10,
                "color": "#F8AF46",
                "color1": "#6EBCFC"
            },
            {
                "month": "5",
                "lastYear": 55,
                "currentYear": 55,
                "volume": 70,
                "color": "#F8AF46",
                "color1": "#6EBCFC"
            },
            {
                "month": "6",
                "lastYear": 36,
                "currentYear": 88,
                "volume": 60,
                "color": "#F8AF46",
                "color1": "#6EBCFC"
            },
            {
                "month": "7",
                "lastYear": 42,
                "currentYear": 85,
                "volume": 30,
                "color": "#F8AF46",
                "color1": "#6EBCFC"
            },
            {
                "month": "8",
                "lastYear": 52,
                "currentYear": 99,
                "volume": 90,
                "color": "#F8AF46",
                "color1": "#6EBCFC"
            },
            {
                "month": "9",
                "lastYear": 60,
                "currentYear": 70,
                "volume": 80,
                "color": "#F8AF46",
                "color1": "#6EBCFC"
            },
            {
                "month": "10",
                "lastYear": 80,
                "currentYear": 30,
                "volume": 65,
                "color": "#F8AF46",
                "color1": "#6EBCFC"
            },
            {
                "month": "11",
                "lastYear": 20,
                "currentYear": 60,
                "volume": 26,
                "color": "#F8AF46",
                "color1": "#6EBCFC"
            },
            {
                "month": "12",
                "lastYear": 56,
                "currentYear": 100,
                "volume": 56,
                "color": "#F8AF46",
                "color1": "#6EBCFC"
            }
        ]
        var chart = AmCharts.makeChart("quantity_year_chart", {
            "type": "serial",
            "theme": "light",
            "autoMargins": false,
            "marginLeft": 60,
            "marginRight": 60,
            "marginTop": 10,
            "marginBottom": 20,
            "fontFamily": 'Open Sans',
            "color": '#888',
            "legend": {
                "equalWidths": false,
                "useGraphSettings": true,
                "valueAlign": "left",
                "valueWidth": 100,
            },
            "categoryField": "month",
            "categoryAxis": {
                "gridPosition": "start",
                "axisAlpha": 0,
                "tickLength": 0,
                "position": "left",
            },
            "dataProvider": revenueMonth,
            "valueAxes": [{
                "id": "lastYearAxis",
                "stackType": "regular",
                "axisAlpha": 0,
                "position": "left",
                "title": "Số lượng",
            },
            {
                "id": "currentYearAxis",
                "stackType": "regular",
                "axisAlpha": 0,
                "position": "right",
                "title": "Số lượng",
            }],
            "startDuration": 0,
            "graphs": [{
                "balloonText": "Năm ngoái:[[value]]",
                "color": "#fff",
                "fillAlphas": 0.8,
                "lineAlpha": 0.2,
                "title": "Năm ngoái",
                "type": "column",
                "valueField": "lastYear",
                "color": "#ffffff",
                "colorField": "color",
                "valueAxis": "lastYearAxis",
                "fillColors":"#F8AF46",
                "legendValueText": "[[value]] ",
                "legendPeriodValueText": " | Tổng: [[value.sum]]",
            }, {
                "newStack": true,
                "balloonText": "Năm nay:[[value]]",
                "color": "#fff",
                "fillAlphas": 0.8,
                "lineAlpha": 0.2,
                "title": "Năm nay",
                "type": "column",
                "valueField": "currentYear",
                "color": "#ffffff",
                "colorField": "color1",
                "valueAxis": "currentYearAxis",
                "fillColors":"#6EBCFC",
                "legendValueText": "[[value]] ",
                "legendPeriodValueText": " | Tổng: [[value.sum]]",
            }],
            "chartScrollbar": {
                "scrollbarHeight": 3,
                "dragIcon": 'dragIconRoundSmall',
                "dragIconHeight": 25,
                "dragIconWidth": 25,
                "offset": -1,
                "backgroundColor": "#888888",
                "selectedBackgroundColor": "#67b7dc",
                "selectedBackgroundAlpha": 1
            },
            "chartCursor": {
                "cursorAlpha": 0.1,
                "cursorColor": "#000000",
                "fullWidth": true,
                "valueBalloonsEnabled": false,
                "zoomable": false
            },
        });
    }
    return {
        //main function to initiate the module
        init: function () {
            initSaleChart();
            initTopProducts();
            initTopMembers();
            initRevenueYearChart();
            initQuantityYearChart();
        }
    };

}();

jQuery(document).ready(function () {
    SaleChart.init();
});