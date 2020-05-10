'use strict';
(function () {
    angular.module('SmartClinic')
        .controller('DashboardCountUserController', DashboardCountUserController)
        DashboardCountUserController.$inject = ['$scope', 'DashboardsService'];

    function DashboardCountUserController($scope, DashboardsService) {
        $scope.list = () => {
            DashboardsService.getUser()
                .then(response => {
                    console.log(response);
                    $scope.counts = response.Data;
                });
        }
        $scope.list(); 
        $scope.countPatient = () => {
            DashboardsService.countPatient()
                .then(response => {
                    console.log(response);
                    $scope.patients = response.Data;
                });
        }
        $scope.countPatient();
    }
})();