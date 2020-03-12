'use strict';
(function () {
    angular.module('SaleFieApp')
        .controller('DashboardsRateController', DashboardsRateController)
        DashboardsRateController.$inject = ['$scope', 'DashboardsService', 'SharedService', 'logger', '$timeout'];

    function DashboardsRateController($scope, DashboardsService, SharedService, logger, $timeout) {
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        var numberDate = SharedService.numberDaysInMonth(year, month); 
        let from = year + "-" + month + "-01";
        let to = year + "-" + month + "-" + numberDate;
        $scope.find = {};
        $scope.find.fromDate = moment(from).format('DD-MM-YYYY');
        $scope.find.toDate = moment(to).format('DD-MM-YYYY');

        $scope.count = () =>{
            return Promise.all([
                // DashboardsService.countChannels($scope.find),
                DashboardsService.getTopChannelsByDate($scope.find),
                DashboardsService.countCategories($scope.find)
            ]).then(([channelData, categoryData]) => {
                $scope.channelChartData = DashboardsService.getChannelChartData(channelData.Data);
                $scope.categoryChartData = DashboardsService.getCategoryChartData(categoryData.Data);
            });
        };
        $scope.count();
    }
})();

// var initChannelChart = function (channels) {
//     let channelChartData = [{
//         "category": "Truyền thống",
//         "revenue": 30
//     }, {
//         "category": "Siêu thị",
//         "revenue": 70
//     }];

//     var chart = AmCharts.makeChart("channel_chart", {
//         "dataProvider": channels ? channels : channelChartData,
//         "type": "pie",
//         "theme": "light",
//         "fontFamily": 'Open Sans',
//         "color": '#000',
//         "valueField": "percent",
//         "titleField": "channelName",
//         "pullOutRadius": 0,
//         "labelRadius": -22,
//         "labelText": "[[percents]]%",
//         "percentPrecision": 1,
//         "colorField":"color"
//     })
// };
// var initRevenueChart = function () {
//     let revenueMonth = [{
//             "month": "1",
//             "revenue": 10,
//             "total": 100,
//             "volume": 10,
//             "color": "#67B7DC",
//             "color1": "#B2DAEC"
//         },
//         {
//             "month": "2",
//             "revenue": 30,
//             "total": 100,
//             "volume": 30,
//             "color": "#67B7DC",
//             "color1": "#B2DAEC"
//         },
//         {
//             "month": "3",
//             "revenue": 50,
//             "total": 100,
//             "volume": 50,
//             "color": "#67B7DC",
//             "color1": "#B2DAEC"
//         },
//         {
//             "month": "4",
//             "revenue": 10,
//             "total": 100,
//             "volume": 10,
//             "color": "#67B7DC",
//             "color1": "#B2DAEC"
//         },
//         {
//             "month": "5",
//             "revenue": 70,
//             "total": 100,
//             "volume": 70,
//             "color": "#67B7DC",
//             "color1": "#B2DAEC"
//         },
//         {
//             "month": "6",
//             "revenue": 60,
//             "total": 100,
//             "volume": 60,
//             "color": "#67B7DC",
//             "color1": "#B2DAEC"
//         },
//         {
//             "month": "7",
//             "revenue": 30,
//             "total": 100,
//             "volume": 30,
//             "color": "#67B7DC",
//             "color1": "#B2DAEC"
//         },
//         {
//             "month": "8",
//             "revenue": 90,
//             "total": 100,
//             "volume": 90,
//             "color": "#67B7DC",
//             "color1": "#B2DAEC"
//         },
//         {
//             "month": "9",
//             "revenue": 80,
//             "total": 100,
//             "volume": 80,
//             "color": "#67B7DC",
//             "color1": "#B2DAEC"
//         },
//         {
//             "month": "10",
//             "revenue": 65,
//             "total": 100,
//             "volume": 65,
//             "color": "#67B7DC",
//             "color1": "#B2DAEC"
//         },
//         {
//             "month": "11",
//             "revenue": 26,
//             "total": 100,
//             "volume": 26,
//             "color": "#67B7DC",
//             "color1": "#B2DAEC"
//         },
//         {
//             "month": "12",
//             "revenue": 56,
//             "total": 100,
//             "volume": 56,
//             "color": "#67B7DC",
//             "color1": "#B2DAEC"
//         }
//     ]
//     var chart = AmCharts.makeChart("revenue_chart", {
//         "type": "serial",
//         "theme": "light",
//         "autoMargins": false,
//         "marginLeft": 50,
//         "marginRight": 30,
//         "marginTop": 10,
//         "marginBottom": 20,
//         "fontFamily": 'Open Sans',
//         "color": '#888',
//         "legend": {
//             "equalWidths": false,
//             "useGraphSettings": true,
//             "valueAlign": "left",
//             "valueWidth": 100,
//         },
//         "categoryField": "month",
//         "categoryAxis": {
//             "gridPosition": "start",
//             "axisAlpha": 0,
//             "tickLength": 0,
//             "position": "left"
//         },
//         "dataProvider": revenueMonth,
//         "valueAxes": [{
//             "id": "Revenue",
//             "stackType": "regular",
//             "axisAlpha": 0,
//             "position": "left",
//         }],
//         "startDuration": 0,
//         "graphs": [{
//             "newStack": true,
//             "balloonText": "Thực tế:[[value]]",
//             "color": "#fff",
//             "fillAlphas": 0.8,
//             "lineAlpha": 0.2,
//             "title": "Thực tế",
//             "type": "column",
//             "valueField": "revenue",
//             "color": "#ffffff",
//             "colorField": "color",
//             "valueAxis":"Revenue",
//             "fillColors":"#67B7DC"
//         }, {
//             "balloonText": "Kế hoạch:[[value]]",
//             "color": "#fff",
//             "fillAlphas": 0.8,
//             "lineAlpha": 0.2,
//             "title": "Kế hoạch",
//             "type": "column",
//             "valueField": "total",
//             "colorField": "color1",
//             "fillColors":"#B2DAEC"
//         }],
//         "chartScrollbar": {
//             "scrollbarHeight": 3,
//             "dragIcon": 'dragIconRoundSmall',
//             "dragIconHeight": 25,
//             "dragIconWidth": 25,
//             "offset": -1,
//             "selectedBackgroundAlpha": 1
//         },
//         "chartCursor": {
//             "cursorAlpha": 0.1,
//             "cursorColor": "#000000",
//             "fullWidth": true,
//             "valueBalloonsEnabled": false,
//             "zoomable": false
//         },
//     });
    
// }
// initRevenueChart();