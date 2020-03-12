'use strict';
(function () {
    angular.module('SaleFieApp')
        .controller('DashboardSaleRevenueController', DashboardSaleRevenueController)
        DashboardSaleRevenueController.$inject = ['$scope', 'DashboardsService', 'SharedService', 'logger', '$timeout'];

    function DashboardSaleRevenueController($scope, DashboardsService, SharedService, logger, $timeout) {
        $scope.typeOfDate = 'Month';
        $scope.month = new Date().getMonth() + 1;
        $scope.year = new Date().getFullYear();
        $scope.numberDate = SharedService.numberDaysInMonth($scope.year, $scope.month); 
        let from = $scope.year + "-" + $scope.month + "-01";
        let to = $scope.year + "-" + $scope.month + "-" + $scope.numberDate;
        $scope.find = {};
        $scope.find.fromDate = moment(from).format('DD-MM-YYYY');
        $scope.find.toDate = moment(to).format('DD-MM-YYYY');
        $scope.list = () => {
            DashboardsService.getOrderByDate($scope.find)
                .then((response) => {
                    if (response.Success) {
                        if ($scope.typeOfDate === 'Month') {
                            $scope.saleChartData  = DashboardsService.getSaleChartMonthData(response.Data, $scope.numberDate, $scope.year, $scope.month );
                        } else if ($scope.typeOfDate === 'Year') {
                            $scope.saleChartData  = DashboardsService.getSaleChartYearData(response.Data, $scope.year);
                        } else {
                            $scope.saleChartData  = DashboardsService.getSaleChartQuarterData(response.Data, $scope.year, $scope.quarter);
                        }
                    }
                });
        }
        $scope.list();
        var initMonthPicker = function() {
            $('#sale-monthpicker').monthpicker({
                "choices": {
                    'Tháng này': [moment().startOf('month'),1],  //month select 
                    'Tháng trước': [moment().subtract(1,'months').startOf('month'),1], //month select
                    'Quý này': [moment().quarter(moment().quarter()).startOf('quarter'),2], //this is quarter
                    'Năm nay': [moment().startOf('year'),3]     //this is year
                },
                "locale": {
                    "lang": "vi",
                    "format": "DD/MM/YYYY",
                    "quarterFull" : "Quý",
                    "quarterShort" : "Q",
                    "yearFull" : "Năm",
                    "yearShort" : "Y",
                    "applyLabel": "Chọn",
                    "cancelLabel": "Huỷ",
                    "customChoiceLabel": "Tuỳ chọn"
                },
                opens: 'left'
            }).on('apply.monthpicker', function(ev,picker) {
                //process selected ranges here
                var rangeStr = picker.pickRange[0].locale(picker.locale.lang).format('DD MMMM, YYYY') + " - " +  
                    picker.pickRange[1].locale(picker.locale.lang).format('DD MMMM, YYYY');
                
                //or just for display string
                //$('#target-choice-date').html(picker.pickFullString);

                // From
                let array_date = rangeStr.split("-");
                let array_from = array_date[0].split(",");
                let year_from = array_from[1].trim();
                let month_from = array_from[0].trim().split(" ")[2];

                // To
                let array_to = array_date[1].split(",");
                let year_to = array_to[1].trim();
                let month_to = array_to[0].trim().split(" ")[2];
                let day_to = array_to[0].trim().split(" ")[0];


                $scope.find.fromDate = "01-" + month_from + "-" + year_from;
                $scope.find.toDate = day_to + "-" + month_to + "-" + year_to;

                if (month_from === month_to && year_from === year_to) {
                    $scope.typeOfDate = 'Month';
                    $scope.month = month_from;
                    $scope.year = year_from;
                    $scope.numberDate = SharedService.numberDaysInMonth($scope.year, $scope.month); 
                } else if (month_from === '1' && month_to === '12' && year_from === year_to) {
                    $scope.typeOfDate = 'Year';
                    $scope.year = year_from;
                } else {
                    $scope.typeOfDate = 'Quarter';
                    $scope.year = year_from;
                    rangeStr = "01 Tháng " + month_from + ", " + year_from + " - " + day_to + " Tháng " + (month_to - 1) +  ", " + year_to;
                    $scope.find.toDate = day_to + "-" + (month_to - 1) + "-" + year_to;
                    if (month_from === '1') {
                        $scope.quarter = '1';
                    } else if (month_from === '4') {
                        $scope.quarter = '2';
                    } else if (month_from === '7') {
                        $scope.quarter = '3';
                    } else {
                        $scope.quarter = '4';
                        rangeStr = "01 Tháng " + month_from + ", " + year_from + " - " + day_to + " Tháng 12, " + year_from;
                        $scope.find.toDate = day_to + "-12-" + year_from;
                    }
                }
                $timeout(() => {
                    angular.element('.bs-select', '.caption').selectpicker('refresh');
                }, 1);
                $scope.list();
                $('#sale-choice-date').html(rangeStr);
            });
            moment.locale("vi");
            $('#sale-choice-date').html(moment().format('D MMMM, YYYY'));
        }
        initMonthPicker()
    }
})();