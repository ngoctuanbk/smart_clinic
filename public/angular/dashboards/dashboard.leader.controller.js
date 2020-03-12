'use strict';
(function () {
    angular.module('SaleFieApp')
        .controller('DashboardLeaderController', DashboardLeaderController)
        DashboardLeaderController.$inject = ['$scope', 'DashboardsService', 'logger', '$timeout'];

    function DashboardLeaderController($scope, DashboardsService, logger, $timeout) {
        $scope.find = {};
        $scope.listAllBranch = () => {
            DashboardsService.listAllBranch()
                .then(response => {
                    if (response.Success) {
                        $scope.branches = response.Data;
                        $scope.find.branch = $scope.branches && $scope.branches.length ? $scope.branches[0] : "";
                        $scope.Branch = $scope.branches && $scope.branches.length ? $scope.branches[0].Info.Name : "";
                        $scope.listAllGroups($scope.find.branch);
                        $timeout(() => {
                            angular.element('.bs-select').selectpicker('refresh');
                        }, 1);
                    } else {
                        $scope.branches = "";
                        $scope.find.branch = "";
                    }
                    $timeout(() => {
                        angular.element('.bs-select').selectpicker('refresh');
                    }, 1);
                    
                })
        }
        $scope.listAllBranch();

        $scope.listAllGroups = (branch) => {
            if (branch) {
                $scope.Branch = branch.Info.Name;
            }
            DashboardsService.getAllGroups()
                .then(response => {
                    if (response.Success) {
                        $scope.groups = response.Data;
                        $scope.find.group = $scope.groups && $scope.groups.length ? $scope.groups[0]._id : "";
                        $scope.find.fromDate = moment($scope.find.fromDate, 'DD/MM/YYYY').format('DD-MM-YYYY');
                        $scope.find.toDate = moment($scope.find.toDate, 'DD/MM/YYYY').format('DD-MM-YYYY');
                        $timeout(() => {
                            angular.element('.bs-select').selectpicker('refresh');
                        }, 1);
                    } else {
                        $scope.groups = "";
                        $scope.find.group = "";
                    }
                    $timeout(() => {
                        angular.element('.bs-select').selectpicker('refresh');
                    }, 1);
                })
        }

        
            
        // $scope.listAllBranch = () => {        
        //     DashboardsService.getAllGroups()
        //         .then(response => {
        //             let branches = [];
        //             response.Data.forEach(data => {
        //                 let obj = {
        //                     branch_id: data._id.branch_id[0],
        //                     branch_name: data._id.branch_name[0],
        //                     groups: data.Groups
        //                 };
        //                 branches.push(obj);
        //             });
        //             $scope.branches = branches;
        //             $timeout(() => {
        //                 angular.element('.bs-select').selectpicker('refresh');
        //             }, 1);
        //         }); 
        // }

        $scope.change = (group) => {
            if (group) {
                $scope.Group = group.Name;
            }
            // let groups = null;
            // $scope.branches.forEach(branch => {
            //     if (branch.branch_id === $scope.find.branch) {
            //         groups = branch.groups;
            //     };
            //     if (branch.branch_id === $scope.find.branch) {
            //         $scope.Branch = branch.branch_name;
            //     };
            // });
            // $scope.groups = groups;
            // $scope.groups.forEach(group => {
            //     if (group.group_id === $scope.find.group) {
            //         $scope.Group = group.group_name;
            //     };
            // });
            $scope.find.fromDate = moment($scope.find.fromDate, 'DD/MM/YYYY').format('DD-MM-YYYY');
            $scope.find.toDate = moment($scope.find.toDate, 'DD/MM/YYYY').format('DD-MM-YYYY');
            $timeout(() => {
                angular.element('.bs-select').selectpicker('refresh');
            }, 1);

        };

        $scope.listTopUser = () => {
            if ($scope.find) {
                DashboardsService.getTopUserByDate($scope.find)
                    .then(response => {
                        $scope.leaderBoardChartData = DashboardsService.getLeaderBoardChartData(response.Data);
                    });
            }
        }

        // $scope.listAllBranch();
    }
})();
