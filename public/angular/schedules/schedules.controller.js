
(function () {
    angular.module('SmartClinic')
        .controller('ScheduleController', ScheduleController);
    ScheduleController.$inject = ['$scope', 'SchedulesService', 'PaginationFactory', 'SharedService', '$timeout', 'listMonths', 'limitData', 'ValidatorSchedules'];
    function ScheduleController($scope, SchedulesService, PaginationFactory, SharedService, $timeout, listMonths, limitData, ValidatorSchedules) {
        const {
            daysOfWeek,
            refreshSelectPicker,
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
        $scope.paginate.Limit = $scope.limitData[0];
        $scope.paginate.SortKey = '_id';
        $scope.paginate.SortOrder = -1;
        $scope.paginate.Search = '';
        $scope.paginate.Month = convertMonth((new Date().getMonth() + 1).toString());
        $scope.numerical = 1;

        $scope.list = () => SchedulesService.list($scope.paginate)
            .then((response) => {
                console.log(response);
                if (response.Success) {
                    $scope.schedules = response.Data.docs;
                    $scope.numerical = response.Data.page === 1 ? 1 : response.Data.limit * (response.Data.page - 1) + 1;
                    $scope.pagination = PaginationFactory.paginations($scope.paginate.Page, response.Data);
                }
            });
        $scope.listDoctorActive = async () => {
            await SchedulesService.listDoctorActive()
                .then((response) => {
                    $scope.doctors = response.Success ? response.Data.docs : [];
                });
        };
        $scope.listPatient = async () => {
            await SchedulesService.listPatient()
                .then((response) => {
                    console.log(response);
                    $scope.patients = response.Success ? response.Data.docs : [];
                });
        };
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
        const promises = [$scope.list(), $scope.listDoctorActive(), $scope.listPatient()];
        Promise.all(promises).then(() => {
            refreshSelectPicker();
        });
        $scope.changeMonth = () => {
            $scope.daysInMonth = getDaysInMonth('', $scope.paginate.Month);
            refreshSelectPicker();
            $scope.paginate.Page = 1;
            $scope.list();
        };
        $scope.create = (form) => {
            if (form.validate()) {
                SchedulesService.create($scope.formCreate)
                    .then((response) => {
                        if (response.Success) {
                            $scope.list();
                            $scope.formCreate = {};
                            changeCss();
                            refreshSelectPicker();
                            alertMessage('success', 'Thêm danh sách khám bệnh thành công', true);
                            $timeout(() => {
                                alertMessage();
                            }, 2000);
                        } else {
                            alertMessage('danger', 'Có lỗi xảy ra. Vui lòng thử lại!', true);
                        }
                    });
            } else {
                alertMessage('danger', SharedService.checkFormInvalid(form), true);
            }
        };
        $scope.$on('fetch-info-schedule', (evt, data) => {
            $scope.infoSchedule = data;
            angular.element('#detail_schedule').modal('show');
        });
        $scope.updateStatus = (Status, ScheduleObjectId) => {
            const formUpdate = {
                Status,
                ScheduleObjectId,
            };
            SchedulesService.updateStatus(formUpdate)
                .then((response) => {
                    console.log(response);
                    if (response.Success) {
                        $scope.list();
                        $('#detail_schedule').animate({ scrollTop: 0 }, 'fast');
                        $scope.infoSchedule.Status = Status;
                        alertMessage('success', 'Cập nhật trạng thái danh sách khám thành công', true);
                        $timeout(() => {
                            alertMessage();
                        }, 2000);
                    } else {
                        alertMessage('danger', 'Có lỗi xảy ra. Vui lòng thử lại!', true);
                    }
                });
        };

        function alertMessage(alertClass = '', alertMsg = '', alertShow = false) {
            $scope.alertShow = alertShow;
            $scope.alertClass = alertClass;
            $scope.alertMsg = alertMsg;
        }

        $('.modal').on('hide.bs.modal', () => {
            $timeout(() => {
                changeCss();
                alertMessage();
            });
        });
    }
}());
