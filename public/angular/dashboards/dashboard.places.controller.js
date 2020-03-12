'use strict';
(function () {
    angular.module('SaleFieApp')
        .controller('DashboardPlacesController', DashboardPlacesController)
        DashboardPlacesController.$inject = ['$scope', 'DashboardsService', 'SharedService', 'logger', '$timeout'];

    function DashboardPlacesController($scope, DashboardsService, SharedService, logger, $timeout) {
        $scope.month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        var numberDate = SharedService.numberDaysInMonth(year, $scope.month); 
        let from = year + "-" + $scope.month + "-01";
        let to = year + "-" + $scope.month + "-" + numberDate;
        $scope.find = {};
        $scope.find.fromDate = moment(from).format('DD-MM-YYYY');
        $scope.find.toDate = moment(to).format('DD-MM-YYYY');
        $scope.list = () => {
            DashboardsService.getTopPlacesByDate($scope.find)
                .then(response => {
                    $scope.revenuePlacesChartData = DashboardsService.getRevenuePlacesChartData(response.Data);
                    $scope.quantityPlacesChartData = DashboardsService.getQuantityPlacesChartData(response.Data);
                });
        }
        $scope.list();
        
    }
})();