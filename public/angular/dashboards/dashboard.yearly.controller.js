'use strict';
(function () {
    angular.module('SaleFieApp')
        .controller('DashboardYearlyController', DashboardYearlyController)
        DashboardYearlyController.$inject = ['$scope', 'DashboardsService', 'logger', '$timeout'];

    function DashboardYearlyController($scope, DashboardsService, logger, $timeout) {
        var current_year = new Date().getFullYear();
        let current_from = current_year + "-01-01";
        let current_to = current_year + "-12-31";
        let last_from = (current_year - 1)+ "-01-01";
        let last_to = (current_year - 1) + "-12-31";
        $scope.current = {};
        $scope.last ={};
        $scope.current.fromDate = moment(current_from).format('DD-MM-YYYY');
        $scope.current.toDate = moment(current_to).format('DD-MM-YYYY');
        $scope.last.fromDate = moment(last_from).format('DD-MM-YYYY');
        $scope.last.toDate = moment(last_to).format('DD-MM-YYYY');
        $scope.list = () => {
            return Promise.all([
                DashboardsService.getOrderByDate($scope.current),
                DashboardsService.getOrderByDate($scope.last),
            ]).then(([currentData, lastData]) => {
                $scope.revenueYearlyChartData  = DashboardsService.getRevenueYearlyChartData(currentData.Data, lastData.Data);
                $scope.quantityYearlyChartData  = DashboardsService.getQuantityYearlyChartData(currentData.Data, lastData.Data);
            });
            
        }
        $scope.list();
    }
})();