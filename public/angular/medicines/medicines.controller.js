
/* eslint-disable prefer-destructuring */
(function () {
    angular.module('SmartClinic')
        .controller('MedicinesController', MedicinesController);
    MedicinesController.$inject = ['$scope', 'MedicinesService', 'PaginationFactory',
        'logger', '$timeout', 'ValidatorMedicine', 'limitData', 'SharedService'];

    function MedicinesController($scope, MedicinesService, PaginationFactory,
        logger, $timeout, ValidatorMedicine, limitData, SharedService) {
        const {
            filterObject,
            deleteItem,
            changeCss,
            refreshSelectPicker,
            isEmpty,
        } = SharedService;

        $scope.validator = ValidatorMedicine.validationOptions();
        $scope.formCreate = {};
        $scope.formUpdate = {};
        $scope.limitData = limitData();
        $scope.paginate = {};
        $scope.paginate.Page = 1;
        $scope.paginate.Limit = $scope.limitData[0];
        $scope.paginate.SortKey = 'CreatedDate';
        $scope.paginate.SortOrder = -1;
        $scope.paginate.Search = '';
        $scope.count = 1;

        $scope.list = () => {
            MedicinesService.list($scope.paginate)
                .then((response) => {
                    console.log(response);
                    if (response.Success) {
                        $scope.medicines = response.Data.docs;
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
        $scope.listBrand = async () => {
            await MedicinesService.listBrand()
                .then((response) => {
                    console.log(response);
                    $scope.brands = response.Success ? response.Data : [];
                });
        };

        Promise.all([$scope.list(), $scope.listBrand()]).then(() => {
            refreshSelectPicker();
        });

        $scope.create = (form) => {
            if (form.validate()) {
                MedicinesService.create($scope.formCreate)
                    .then((response) => {
                        console.log(response);
                        console.log($scope.formCreate)
                        if (response.Success) {
                            $scope.list();
                            $scope.formCreate = {};
                            changeCss();
                            refreshSelectPicker();
                            alertMessage('success', 'Thêm mới thuốc thành công', true);
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
        $scope.info = (item) => {
            $scope.formUpdate.MedicineObjectId = item._id;
            $scope.formUpdate.BrandObjectId = item.BrandObjectId._id;
            $scope.formUpdate.MedicineName = item.MedicineName;
            $scope.formUpdate.MedicineCode = item.MedicineCode;
            $scope.formUpdate.Price = item.Price;
            $scope.formUpdate.Unit = item.Unit;
            $scope.formUpdate.MFG = item.MFG;
            $scope.formUpdate.EXP = item.EXP;
            refreshSelectPicker();
        };
        $scope.update = (form) => {
            if (form.validate()) {
                MedicinesService.update($scope.formUpdate)
                    .then((response) => {
                        console.log(response);
                        if (response.Success) {
                            alertMessage('success', 'Cập nhật thuốc thành công', true);
                            $timeout(() => {
                                angular.element('#update_medicine').modal('hide');
                            }, 2000);
                            $scope.list();
                        } else {
                            alertMessage('danger', 'Có lỗi xảy ra. Vui lòng thử lại!', true);
                        }
                    });
            } else {
                alertMessage('danger', SharedService.checkFormInvalid(form), true);
            }
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
