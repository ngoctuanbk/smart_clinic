var ChannelChart = function () {
    let initCategoryChart = function () {
        let categoryChartData = [{
            "category": "Máy lọc nước",
            "revenue": 501.9
        }, {
            "category": "Hàng gia dụng",
            "revenue": 301.9
        }, {
            "category": "Thiết bị bếp",
            "revenue": 201.1
        }, {
            "category": "Điện lạnh",
            "revenue": 165.8
        }, {
            "category": "Thiết bị vệ sinh",
            "revenue": 139.9
        }];

        var chart = AmCharts.makeChart("category_chart", {
            "dataProvider": categoryChartData,
            "type": "pie",
            "theme": "light",
            "fontFamily": 'Open Sans',
            "color": '#000',
            "pullOutRadius": 0,
            "labelRadius": -22,
            "valueField": "revenue",
            "titleField": "category",
            "labelText": "[[percents]]%",
            "percentPrecision": 1
        })
    }
    var initRevenuePlaceChart = function () {
        let channelChartData = [{
            "channel": "Hà nội",
            "revenue": 501.9
        }, {
            "channel": "Tuyên quang",
            "revenue": 301.9
        }, {
            "channel": " Thái bình",
            "revenue": 201.1
        }, {
            "channel": " Hải phòng",
            "revenue": 165.8
        }, {
            "channel": "Nam định",
            "revenue": 139.9
        }, {
            "channel": "Bắc ninh",
            "revenue": 128.3
        }];
        var chart = AmCharts.makeChart("revenue_place_chart", {
            "dataProvider": channelChartData,
            "type": "pie",
            "theme": "light",
            "fontFamily": 'Open Sans',
            "color": '#000',
            "valueField": "revenue",
            "titleField": "channel",
            "pullOutRadius": 0,
            "labelRadius": -22,
            "labelText": "[[percents]]%",
            "percentPrecision": 1
        })
    }
    var initQuantityPlaceChart = function () {
        let channelChartData = [{
            "channel": "Hà nội",
            "revenue": 501.9
        }, {
            "channel": "Tuyên quang",
            "revenue": 301.9
        }, {
            "channel": " Thái bình",
            "revenue": 201.1
        }, {
            "channel": " Hải phòng",
            "revenue": 165.8
        }, {
            "channel": "Nam định",
            "revenue": 139.9
        }, {
            "channel": "Bắc ninh",
            "revenue": 128.3
        }];
        var chart = AmCharts.makeChart("quantity_place_chart", {
            "dataProvider": channelChartData,
            "type": "pie",
            "theme": "light",
            "fontFamily": 'Open Sans',
            "color": '#000',
            "valueField": "revenue",
            "titleField": "channel",
            "pullOutRadius": 0,
            "labelRadius": -22,
            "labelText": "[[percents]]%",
            "percentPrecision": 1
        })
    }
    var initRevenueTopAgency = function () {
        let topAgencies = [{
                "name": "Đại lý A",
                "revenue": 14,
                "volume": 2,
                "color": "#85C5E3",
            },
            {
                "name": "Đại lý B",
                "revenue": 12,
                "volume": 5,
                "color": "#9783E1",
            },
            {
                "name": "Đại lý C",
                "revenue": 8,
                "volume": 8,
                "color": "#E284BB",
            },
            {
                "name": "Đại lý D",
                "revenue": 5,
                "volume": 2,
                "color": "#E28684",
            }
        ]

        var chart = AmCharts.makeChart("revenue_top_agency_chart", {
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
            "dataProvider": topAgencies,
            "valueAxes": [],
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
    var initRevenueLowAgency = function () {
        let lowAgencies = [{
                "name": "Đại lý E",
                "revenue": 18,
                "volume": 2,
                "color": "#E28684",
            },
            {
                "name": "Đại lý F",
                "revenue": 14,
                "volume": 5,
                "color": "#E284BB",
            },
            {
                "name": "Đại lý G",
                "revenue": 8,
                "volume": 8,
                "color": "#9783E1",
            },
            {
                "name": "Đại lý H",
                "revenue": 6,
                "volume": 2,
                "color": "#85C5E3",
            }
        ]
        var chart = AmCharts.makeChart("revenue_low_agency_chart", {
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
            "dataProvider": lowAgencies,
            "valueAxes": [],
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
    return {
        //main function to initiate the module
        init: function () {
            // initChannelChart();
            initCategoryChart();
            initRevenuePlaceChart();
            initQuantityPlaceChart();
            initRevenueTopAgency();
            initRevenueLowAgency();
        }
    };

}();

jQuery(document).ready(function () {
    ChannelChart.init();
});