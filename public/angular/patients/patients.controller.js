'use strict';

(function () {
    angular.module('SmartClinic')
        .controller('PatientsController', PatientsController);
        PatientsController.$inject = ['$scope', 'PatientsService', 'PaginationFactory', 'logger', '$timeout', 'limitData', 'SharedService', 'ValidatorPatient'];

    function PatientsController($scope, PatientsService, PaginationFactory, logger, $timeout, limitData, SharedService, ValidatorPatient) {
        $scope.ValidationPatient = ValidatorPatient.validationOptions();
        $scope.formCreate = {};
        $scope.formCreate.Address = {};
        $scope.formUpdate = {};
        $scope.formUpdate.Address = {};
        $scope.limitData = limitData();
        $scope.paginate = {};
        $scope.paginate.Page = 1;
        // eslint-disable-next-line prefer-destructuring
        $scope.paginate.Limit = $scope.limitData[0];
        $scope.paginate.SortKey = 'CreatedDate';
        $scope.paginate.SortOrder = -1;
        $scope.count = 1;
        $scope.Sex = ['Male', 'Female', 'Other'];

        $scope.filterStatus = (status) => {
            $scope.paginate.Status = status;
            $scope.list();
        };

        $scope.list = () => {
            PatientsService.list($scope.paginate)
                .then((response) => {
                    console.log(response);
                    if (response.Success) {
                        $scope.patients = response.Data.docs;
                        $scope.CountActive = response.Data.CountActive;
                        $scope.CountWaitingAccepted = response.Data.CountWaitingAccepted;
                        $scope.CountInactive = response.Data.CountInactive;
                        $scope.count = response.Data.page === 1 ? 1 : response.Data.limit * (response.Data.page - 1) + 1;
                        $scope.pagination = PaginationFactory.paginations($scope.paginate.Page, response.Data);
                    }
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

        // end paginate customers

        $scope.listProvince = () => PatientsService.listProvince()
            .then((response) => {
                console.log(response);
                $scope.provinces = response.Success ? response.Data : [];
            });

        $scope.listDistrictByProvince = (ProvinceObjectId) => {
            PatientsService.listDistrictByProvince({ProvinceObjectId}).then((response) => {
                $scope.districts = response.Success ? response.Data : [];
                refreshSelectPicker();
            });
        };
        $scope.listWardByDistrict = (DistrictObjectId) => {
            PatientsService.listWardByDistrict({DistrictObjectId}).then((response) => {
                $scope.wards = response.Success ? response.Data : [];
                refreshSelectPicker();
            });
        };
        Promise.all([$scope.list(), $scope.listProvince(), $scope.listDistrictByProvince(), $scope.listWardByDistrict()]).then(() => {
            refreshSelectPicker();
        });
        $scope.ContactDetails = [];
        $scope.addContactDetail = () => {
            const newField = {
                FullName: null,
                Mobile: null,
                Relationship: null,
                Address: null,
                showEdit: true,
            };
            $scope.ContactDetails.push(newField);
            refreshSelectPicker();
        };
        $scope.create = (form) => {
            $scope.formCreate.Age = getAge($scope.formCreate.DateOfBirth);
            console.log($scope.formCreate.DateOfBirth);
            console.log($scope.formCreate.Age);
            if (form.validate()) {
                PatientsService.create($scope.formCreate)
                    .then((response) => {
                        console.log(response);
                        if (response.Success) {
                            $scope.list();
                            $scope.formCreate = {};
                            changeCss();
                            alertMessage('success', 'Thêm bệnh nhân thành công', true);
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

        function changeCss() {
            SharedService.changeCss();
        }
        function getAge(dateofbirth) {
            var today = new Date();
            var birthDate = new Date(dateofbirth.replace(/(\d{2})[-/](\d{2})[-/](\d+)/, "$2/$1/$3"));
            var age = today.getFullYear() - birthDate.getFullYear();
            var m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age = age - 1;
            }
            return age;
        }

        function isEmpty(value) {
            return SharedService.isEmpty(value);
        }

        function alertMessage(alertClass = '', alertMsg = '', alertShow = false) {
            $scope.alertShow = alertShow;
            $scope.alertClass = alertClass;
            $scope.alertMsg = alertMsg;
        }
        $('.modal').on('hide.bs.modal', () => {
            $timeout(() => {
                changeCss();
                alertMessage();
            }, 10);
        });

        function refreshSelectPicker() {
            SharedService.refreshSelectPicker();
        }

        function getMsgResponse(response = {}) {
            const { StatusCode } = response;
            const msgError = messages[StatusCode] || response.Message;
            return msgError;
        }

        // function alertMessage(alertClass = '', alertMsg = '', alertShow = false) {
        //     $scope.alertShow = alertShow;
        //     $scope.alertClass = alertClass;
        //     $scope.alertMsg = alertMsg;
        // }
        $scope.reset = () => {
            $scope.paginate.Page = 1;
            $scope.paginate.Search = '';
            $scope.paginate.SortKey = 'CreatedDate';
            $scope.paginate.SortOrder = -1;
            // eslint-disable-next-line prefer-destructuring
            $scope.paginate.Limit = $scope.limitData[0];
            delete $scope.paginate.FromDate;
            delete $scope.paginate.ToDate;
            refreshSelectPicker();
            $scope.list();
        };
    }
}());
