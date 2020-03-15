(function () {
    angular.module('SmartClinic')
        .controller('ScheduleController', ScheduleController);
    ScheduleController.$inject = ['$scope', 'SchedulesService', 'PaginationFactory', 'SharedService', '$timeout', 'listMonths', 'limitData'];
    function ScheduleController($scope, SchedulesService, PaginationFactory, SharedService, $timeout, listMonths, limitData) {
        const {
            daysOfWeek,
            refreshSelectPicker,
            timeUnix,
            formatToYMD,
            nextDate,
            getDayOfWeek,
            isEmpty,
            changeCss,
            convertMonth,
            getDaysInMonth,
        } = SharedService;
        // $scope.validator = ValidatorSchedules.validationOptions();
        $scope.DaysOfWeek = daysOfWeek;
        // paginate
        $scope.listMonths = listMonths();
        $scope.limitData = limitData();
        $scope.daysInMonth = getDaysInMonth();
        $scope.paginate = {};
        $scope.paginate.Page = 1;
        [$scope.paginate.Limit] = $scope.limitData;
        $scope.paginate.SortKey = '_id';
        $scope.paginate.SortOrder = -1;
        $scope.paginate.Search = '';
        $scope.paginate.Month = convertMonth((new Date().getMonth() + 1).toString());
        $scope.numerical = 1;

        console.log($scope.paginate);
        $scope.list = () => SchedulesService.list($scope.paginate)
            .then((response) => {
                console.log(response)
                if (response.Success) {
                    $scope.schedules = response.Data.docs;
                    $scope.numerical = response.Data.page === 1 ? 1 : response.Data.limit * (response.Data.page - 1) + 1;
                    $scope.pagination = PaginationFactory.paginations($scope.paginate.Page, response.Data);
                }
            });
        $scope.setPage = (page) => {
            if (page && page !== $scope.paginate.Page) {
                $scope.paginate.Page = +page;
                $scope.list();
            }
        };

        $scope.nextPage = () => {
            if ($scope.pagination.numberPage > $scope.paginate.Page) {
                $scope.paginate.Page += 1;
                $scope.list();
            }
        };

        $scope.prevPage = () => {
            if ($scope.paginate.Page > 1) {
                $scope.paginate.Page -= 1;
                $scope.list();
            }
        };

        $scope.firstPage = () => {
            if ($scope.paginate.Page > 1) {
                $scope.paginate.Page = 1;
                $scope.list();
            }
        };

        $scope.endPage = () => {
            if ($scope.paginate.Page !== $scope.pagination.numberPage) {
                $scope.paginate.Page = $scope.pagination.numberPage;
                $scope.list();
            }
        };
        const promises = [$scope.list()];
        Promise.all(promises).then(() => {
            refreshSelectPicker();
        });
    }
}());
