/* eslint-disable prefer-destructuring */
(function () {
    angular.module('SmartClinic')
        .controller('BrandsController', BrandsController);
    BrandsController.$inject = ['$scope', 'BrandsService', 'PaginationFactory',
        'logger', '$timeout', 'ValidatorBrand', 'limitData', 'SharedService'];

    function BrandsController($scope, BrandsService, PaginationFactory,
        logger, $timeout, ValidatorBrand, limitData, SharedService) {
        const {
            filterObject,
            deleteItem,
            changeCss,
            refreshSelectPicker,
        } = SharedService;

        $scope.validator = ValidatorBrand.validationOptions();
        $scope.formCreate = {};
        $scope.formUpdate = {};
        $scope.limitData = limitData();
        $scope.paginate = {};
        $scope.paginate.Page = 1;
        $scope.paginate.Limit = $scope.limitData[0];
        $scope.paginate.SortKey = 'CreatedDate';
        $scope.paginate.SortOrder = -1;
        $scope.count = 1;

        $scope.list = () => {
            BrandsService.list($scope.paginate)
                .then((response) => {
                    if (response.Success) {
                        $scope.brands = response.Data.docs;
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

        $scope.search = () => {
            $scope.paginate.Page = 1;
            $scope.list();
        };
        // end paginate customers

        Promise.all([$scope.list()]).then(() => {
            refreshSelectPicker();
        });

        $scope.create = (form) => {
            if (form.validate()) {
                $scope.formCreate = filterObject($scope.formCreate);
                BrandsService.create($scope.formCreate)
                    .then((response) => {
                        console.log(response)
                        if (response.Success) {
                            $scope.list();
                            $scope.formCreate = {};
                            changeCss();
                            alertMessage('success', 'Thêm thương hiệu thành công', true);
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

        $scope.info = (item, idx) => {
            $scope.selectedBrand = idx;
            $scope.formUpdate.BrandObjectId = item._id;
            $scope.formUpdate.BrandName = item.BrandName;
            $scope.formUpdate.BrandCode = item.BrandCode;
            $scope.formUpdate.Description = item.Description;
        };

        $scope.update = (form) => {
            if (form.validate()) {
                $scope.formUpdate = filterObject($scope.formUpdate);
                BrandsService.update($scope.formUpdate)
                    .then((response) => {
                        if (response.Success) {
                            alertMessage('success', 'Cập nhật thương hiệu thành công', true);
                            $timeout(() => {
                                angular.element('#update_brand').modal('hide');
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

        $scope.updateStatus = (Status, BrandObjectId) => {
            const formUpdate = {
                Status,
                BrandObjectId,
            };
            BrandsService.updateStatus(formUpdate)
                .then((response) => {
                    if (response.Success) {
                        $scope.list();
                        logger.success('Cập nhật trạng thái thành công');
                    } else {
                        logger.error('Có lỗi xảy ra, Vui lòng thử lại.');
                    }
                });
        };

        $scope.deleteBrands = (BrandObjectId, BrandName) => {
            function deleteBrands() {
                BrandsService.delete({
                    BrandObjectId,
                })
                    .then((response) => {
                        console.log(response);
                        if (response.Success) {
                            swal('Đã xóa!', 'success');
                            $scope.list();
                        } else {
                            swal('Có lỗi xảy ra', 'Vui lòng thử lại.', 'error');
                        }
                    });
            }
            const msg = `Bạn có chắc chắn muốn xóa thương hiệu ${BrandName}?`;
            deleteItem(deleteBrands, msg);
        };
        $scope.reload = () => {
            $scope.paginate.Page = 1;
            $scope.list();
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
                resetDataCreate();
            });
        });
    }
}());
