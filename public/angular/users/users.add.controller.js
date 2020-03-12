/* eslint-disable no-param-reassign */
(function () {
    angular
        .module('SmartClinic')
        .controller('UsersAddController', UsersAddController);
    UsersAddController.$inject = ['$scope', 'UsersService', 'logger', 'SharedService', 'UploadService', 'ValidatorUsers'];

    function UsersAddController($scope, UsersService, logger, SharedService, UploadService, ValidatorUsers) {
        const {
            refreshSelectPicker,
            changeCss,
            isEmpty,
            filterObject,
            hideActionChangeImage,
        } = SharedService;
        $scope.validator = ValidatorUsers.validationOptions();
        $scope.formCreate = {};
        $scope.formCreate.Status = 200;
        $scope.Sex = [{
            key: 'Male',
            name: 'Nam',
        }, {
            key: 'Female',
            name: 'Nữ',
        }, {
            key: 'Other',
            name: 'Khác',
        }];

        $scope.listRoles = async () => {
            await UsersService.listRoles()
                .then((response) => {
                    console.log(response);
                    $scope.roles = response.Success ? response.Data : [];
                });
        };

        Promise.all([$scope.listRoles()]).then(() => {
            refreshSelectPicker();
        });
        $scope.create = (form) => {
            if (form.validate()) {
                // chi check image co gia tri la false thi hinh anh khong hop le
                if ($scope.image === false) {
                    return logger.error('Chọn hình ảnh hợp lệ');
                }
                $scope.formCreate = filterObject($scope.formCreate);
                UploadService.uploadDataAndImageBase64(
                    'POST',
                    '/admin/users/create',
                    $scope.formCreate,
                    $scope.image,
                )
                    .then((response) => {
                        console.log(response);
                        if (response.Success) {
                            logger.success('Thêm mới nhân viên thành công');
                            resetData();
                            changeCss();
                            ($scope.image && $scope.deleteImage());
                        } else {
                            logger.error('Đã xảy ra lỗi. Vui lòng thử lại');
                        }
                    });
            } else {
                logger.error('Hãy điền đẩy đủ thông tin');
            }
        };
        $scope.selectStatus = (status) => {
            $scope.formCreate.Status = status;
        };

        $scope.filterStatus = (status) => {
            if (status === 200) {
                return {
                    class: 'Active',
                    text: 'Hoạt động',
                };
            }
            if (status === 100) {
                return {
                    class: 'New',
                    text: 'Mới',
                };
            }
        };


    
    }
}());
