'use strict';

(function () {
    angular.module('SmartClinic')
        .controller('DashboardSaleRevenueController', DashboardSaleRevenueController);
    DashboardSaleRevenueController.$inject = ['$scope', 'DashboardsService', 'SharedService', '$timeout'];

    function DashboardSaleRevenueController($scope, DashboardsService, SharedService, $timeout) {
        $scope.typeOfDate = 'Month';
        $scope.month = new Date().getMonth() + 1;
        $scope.year = new Date().getFullYear();
        $scope.totalDateInMonth = SharedService.numberDaysInMonth($scope.year, $scope.month);
        // $scope.TranslateDashboard = $scope.$parent.TranslateForJs.Dashboard.Dashboard;
        $scope.list = () => {
            $scope.saleChartData = [];
            if ($scope.typeOfDate === 'Month') {
                const date = `${$scope.year}-${$scope.month}`;
                const FromDate = SharedService.firstDayOfMonth(date);
                const ToDate = SharedService.endDayOfMonth(date);
                DashboardsService.patientByDate({FromDate, ToDate}).then((response) => {
                    const data = response.Success ? response.Data : [];
                    console.log(response)
                    for (let i = 1; i <= $scope.totalDateInMonth; i++) {
                        const date = `${$scope.year}-${convertNumber($scope.month)}-${convertNumber(i)}`;
                        const d = data.find(item => item.Date === date);
                        $scope.saleChartData.push({
                            date,
                            revenue: d ? d.TotalPatient : 0,
                        });
                    }
                    initSaleChart($scope.saleChartData);
                });
            } else if ($scope.typeOfDate === 'Quarter') {
                const Month = getMonthsOfQuarter($scope.year, $scope.quarter);
                DashboardsService.patientByMonth({ Month }).then((response) => {
                    const data = response.Success ? response.Data : [];
                    $scope.saleChartData = Month.map(((m) => {
                        const d = data.find(item => item.Month === m);
                        return {
                            date: m,
                            revenue: d ? d.TotalPatient : 0,
                        };
                    }));
                    initSaleChart($scope.saleChartData);
                });
            } else if ($scope.typeOfDate === 'Year') {
                const Month = getMonthsOfYear($scope.year);
                DashboardsService.patientByMonth({Month}).then((response) => {
                    const data = response.Success ? response.Data : [];
                    $scope.saleChartData = Month.map(((m) => {
                        const d = data.find(item => item.Month === m);
                        return {
                            date: m,
                            revenue: d ? d.TotalPatient : 0,
                        };
                    }));
                    initSaleChart($scope.saleChartData);
                });
            }
        };
        const initMonthPicker = function () {
            $('#sale-monthpicker').monthpicker({
                choices: {
                    ['Tháng này']: [moment().startOf('month'), 1], // month select
                    ['Tháng trước']: [moment().subtract(1, 'months').startOf('month'), 1], // month select
                    ['Quý này']: [moment().quarter(moment().quarter()).startOf('quarter'), 2], // this is quarter
                    ['Năm nay']: [moment().startOf('year'), 3],
                },
                locale: {
                    lang: 'vi',
                    format: 'DD/MM/YYYY',
                    quarterFull: 'Quarter',
                    quarterShort: 'Q',
                    yearFull: 'Year',
                    yearShort: 'Y',
                    applyLabel: 'Apply',
                    cancelLabel: 'Cancel',
                    customChoiceLabel: 'Optional',
                },
                opens: 'left',
            }).on('apply.monthpicker', (ev, picker) => {
                // process selected ranges here
                let rangeStr = `${picker.pickRange[0].locale(picker.locale.lang).format('DD MMMM, YYYY')} - ${
                    picker.pickRange[1].locale(picker.locale.lang).format('DD MMMM, YYYY')}`;

                // or just for display string
                // $('#target-choice-date').html(picker.pickFullString);

                // From
                const array_date = rangeStr.split('-');
                const array_from = array_date[0].split(',');
                const year_from = array_from[1].trim();
                const month_from = array_from[0].trim().split(' ')[2];

                // To
                const array_to = array_date[1].split(',');
                const year_to = array_to[1].trim();
                const month_to = array_to[0].trim().split(' ')[2];
                const day_to = array_to[0].trim().split(' ')[0];


                if (month_from === month_to && year_from === year_to) {
                    $scope.typeOfDate = 'Month';
                    $scope.month = month_from;
                    $scope.year = year_from;
                    $scope.totalDateInMonth = SharedService.numberDaysInMonth($scope.year, $scope.month);
                } else if (month_from === '1' && month_to === '12' && year_from === year_to) {
                    $scope.typeOfDate = 'Year';
                    $scope.year = year_from;
                } else {
                    $scope.typeOfDate = 'Quarter';
                    $scope.year = year_from;
                    rangeStr = `01 Tháng ${month_from}, ${year_from} - ${day_to} Tháng ${month_to - 1}, ${year_to}`;
                    if (month_from === '1') {
                        $scope.quarter = '1';
                    } else if (month_from === '4') {
                        $scope.quarter = '2';
                    } else if (month_from === '7') {
                        $scope.quarter = '3';
                    } else {
                        $scope.quarter = '4';
                        rangeStr = `01 Tháng ${month_from}, ${year_from} - ${day_to} Tháng 12, ${year_from}`;
                    }
                }
                $timeout(() => {
                    angular.element('.selectpicker', '.caption').selectpicker('refresh');
                }, 1);
                $scope.list();
                $('#sale-choice-date').html(rangeStr);
            });
            moment.locale('vi');
            $('#sale-choice-date').html(moment().format('D MMMM, YYYY'));
        };

        function getMonthsOfQuarter(year, quater) {
            const quaters = {
                1: [`${year}-01`, `${year}-02`, `${year}-03`],
                2: [`${year}-04`, `${year}-05`, `${year}-06`],
                3: [`${year}-07`, `${year}-08`, `${year}-09`],
                4: [`${year}-10`, `${year}-11`, `${year}-12`],
            };
            return quaters[+quater];
        }

        function getMonthsOfYear(year) {
            return [
                `${year}-01`, `${year}-02`, `${year}-03`, `${year}-04`, `${year}-05`, `${year}-06`,
                `${year}-07`, `${year}-08`, `${year}-09`, `${year}-10`, `${year}-11`, `${year}-12`,
            ];
        }

        function convertNumber(number) {
            return number.toString().length === 1 ? `0${number}` : number;
        }

        const initSaleChart = function (saleChartData) {
            const _UNIT_REVENUE = 'bệnh nhân'; // chia nho đơn vị tiền
            const chart = AmCharts.makeChart('sales_chart', {
                type: 'serial',
                theme: 'light',
                autoMargins: false,
                marginLeft: 110,
                marginRight: 70,
                marginTop: 10,
                marginBottom: 20,

                fontFamily: 'Open Sans',
                color: '#888',

                legend: {
                    equalWidths: false,
                    useGraphSettings: true,
                    valueAlign: 'left',
                    valueWidth: 100,
                },

                dataProvider: saleChartData,
                valueAxes: [{
                    id: 'revenueAxis',
                    stackType: 'regular',
                    axisAlpha: 0,
                    position: 'left',
                    title: 'Số bệnh nhân',
                }],
                startDuration: 1,
                graphs: [{
                    alphaField: 'alpha',
                    balloonText: "<span style='font-size:10px;'>[[title]] :<b>[[value]]</b> [[additional]]</span>",
                    dashLengthField: 'dashLengthColumn',
                    fillAlphas: 1,
                    title: 'Số bệnh nhân',
                    type: 'column',
                    valueField: 'revenue',
                    id: 'revenue',
                    valueAxis: 'revenueAxis',
                    legendValueText: `[[value]] 'bệnh nhân'`,
                    legendPeriodValueText: `: [[value.sum]] ${_UNIT_REVENUE}`,
                }],
                chartScrollbar: {
                    scrollbarHeight: 3,
                    dragIcon: 'dragIconRoundSmall',
                    dragIconHeight: 25,
                    dragIconWidth: 25,
                    offset: -1,
                    backgroundColor: '#888888',
                    selectedBackgroundColor: '#67b7dc',
                    selectedBackgroundAlpha: 1,
                },
                chartCursor: {
                    categoryBalloonDateFormat: 'DD',
                    cursorAlpha: 0.1,
                    cursorColor: '#000000',
                    fullWidth: true,
                    valueBalloonsEnabled: false,
                    zoomable: false,
                },
                dataDateFormat: 'YYYY-MM-DD',
                categoryField: 'date',
                categoryAxis: {
                    dateFormats: [{
                        period: 'DD',
                        format: 'DD',
                    }, {
                        period: 'WW',
                        format: 'MMM DD',
                    }, {
                        period: 'MM',
                        format: 'MMM',
                    }, {
                        period: 'YYYY',
                        format: 'YYYY',
                    }],
                    parseDates: true,
                    gridPosition: 'start',
                    axisAlpha: 0,
                    tickLength: 0,
                },
            });
            $('#sales_chart').closest('.portlet').find('.fullscreen').click(() => {
                chart.invalidateSize();
            });
        };

        const promises = [$scope.list(), initMonthPicker()];
        Promise.all(promises).then(() => { });
    }
}());
