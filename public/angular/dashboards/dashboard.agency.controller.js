'use strict';
(function () {
    angular.module('SaleFieApp')
        .controller('DashboardAgencyController', DashboardAgencyController)
        DashboardAgencyController.$inject = ['$scope', 'DashboardsService', 'SharedService', 'logger', '$timeout'];

    function DashboardAgencyController($scope, DashboardsService, SharedService, logger, $timeout) {
        $scope.month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        var numberDate = SharedService.numberDaysInMonth(year, $scope.month); 
        let from = year + "-" + $scope.month + "-01";
        let to = year + "-" + $scope.month + "-" + numberDate;
        $scope.find = {};
        $scope.find.fromDate = moment(from).format('DD-MM-YYYY');
        $scope.find.toDate = moment(to).format('DD-MM-YYYY');
        $scope.list = () => {
            DashboardsService.getTopAgencyByDate($scope.find)
                .then(response => {
                    $scope.topAgencyChartData = DashboardsService.getTopAgencyChartData(response.Data);
                    $scope.lowAgencyChartData = DashboardsService.getLowAgencyChartData(response.Data);
                });
        }
        $scope.list();
        
    }
})();