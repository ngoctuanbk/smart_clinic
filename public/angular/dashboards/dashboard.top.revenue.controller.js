'use strict';
(function () {
    angular.module('SaleFieApp')
        .controller('DashboardTopRevenueController', DashboardTopRevenueController)
        DashboardTopRevenueController.$inject = ['$scope', 'DashboardsService', 'SharedService', 'logger', '$timeout'];

    function DashboardTopRevenueController($scope, DashboardsService, SharedService, logger, $timeout) {
        $scope.month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        var numberDate = SharedService.numberDaysInMonth(year, $scope.month); 
        let from = year + "-" + $scope.month + "-01";
        let to = year + "-" + $scope.month + "-" + numberDate;
        $scope.monthFind = {};
        $scope.monthFind.fromDate = moment(from).format('DD-MM-YYYY');
        $scope.monthFind.toDate = moment(to).format('DD-MM-YYYY');

        let find_from = year + "-01-01";
        let find_to = year + "-12-31";
        let orderYearFind = {
            fromDate: moment(find_from).format('DD-MM-YYYY'),
            toDate: moment(find_to).format('DD-MM-YYYY'),
        };

        let targetYearFind = {
            FromTime: moment(find_from).format('DD-MM-YYYY'),
            ToTime: moment(find_to).format('DD-MM-YYYY'),
        };
        $scope.list = () => {
            return Promise.all([
                DashboardsService.getTopProductsByDate($scope.monthFind),
                DashboardsService.getTopUserByDate($scope.monthFind),
                DashboardsService.getOrderByDate(orderYearFind),
                DashboardsService.getTargetListByDate(targetYearFind),
            ]).then(([topProductsData, topUserData, orderData, targetData]) => {
                $scope.top_products_chart = DashboardsService.getTopProductsChartData(topProductsData.Data);
                $scope.top_members_chart = DashboardsService.getTopUserChartData(topUserData.Data);
                $scope.target_revenue_chart = DashboardsService.getTargetRevenueChartData(orderData.Data, targetData.Data);
            });
        }
        $scope.list();
        
    }
})();