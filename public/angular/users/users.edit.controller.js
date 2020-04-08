/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
(function () {
    angular
        .module('SmartClinic')
        .controller('UsersEditController', UsersEditController);
    UsersEditController.$inject = ['$scope', 'ValidatorUsers', 'UsersService', 'UploadService', 'logger', 'SharedService', 'getUrlApi'];

    function UsersEditController($scope, ValidatorUsers, UsersService, UploadService, logger, SharedService, getUrlApi) {
        $scope.disabledElement = true;
        $scope.formUpdate = {};
        const {
            refreshSelectPicker,
            changeCss,
            isEmpty,
            filterObject,
            formatDateToDMY,
            hideActionChangeImage,
        } = SharedService;
        $scope.validator = ValidatorUsers.validationOptions();
        $scope.getInfo = async () => {
            const info = $scope.info || {};
            console.log(info)
            $scope.formUpdate.UserObjectId = info._id;
            $scope.formUpdate.ParentObjectId = info.ParentObjectId && info.ParentObjectId._id;
            $scope.formUpdate.ManagerType = info.ManagerType;
            $scope.formUpdate.UserName = info.UserName;
            $scope.UserCode = info.UserCode;
            $scope.formUpdate.Avatar = info.Avatar || '';
            $scope.Ancestors = info.Ancestors || [];
            const BranchObjectId = !isEmpty(info.Branches) ? info.Branches[0]._id : undefined;
            $scope.formUpdate.BranchObjectId = BranchObjectId;
            $scope.formUpdate.Categories = info.Categories || [];
            $scope.formUpdate.Channels = info.Channels || [];
            $scope.formUpdate.Areas = info.Areas || [];
            $scope.formUpdate.Info = info.Info;
            $scope.formUpdate.Email = info.Email || '';
            $scope.formUpdate.Mobile = info.Mobile || '';
            $scope.formUpdate.Note = info.Note || '';
            $scope.formUpdate.DeviceID = info.DeviceID;
            $scope.formUpdate.SaleType = info.SaleType;
            $scope.formUpdate.JoinDate = formatDateToDMY(info.JoinDate) || '';
            $('.date-picker').datepicker('setDate', $scope.formUpdate.JoinDate);
            $scope.formUpdate.Status = info.Status === 'Active' ? 200 : 400;
            $scope.formUpdate.RoleObjectId = info.RoleObjectId || '';
            $scope.Role = $scope.roles.find(item => item._id === info.RoleObjectId) || {};
            const paramRole = {
                _id: $scope.Role._id,
                ParentObjectId: $scope.Role.ParentObjectId,
            };
            $scope.formUpdate.ParentRoleObjectId = paramRole.ParentObjectId;
            const avatar = info.Avatar ? `${getUrlApi()}${info.Avatar}` : '';
            replaceImage(avatar);
            await $scope.loadSelectByRole(paramRole);
            refreshSelectPicker();
            const elementsRemovedClass = ['#list-category', '#list-users', '#list-channels', '#list-branches', '#list-areas'];
            removeClassForElements(elementsRemovedClass);
            $scope.modifyManagerType(info.ManagerType);
        };

        function replaceImage(url) {
            const urlImgDefault = '/assets/pages/media/profile/avatar-default.png';
            angular.element('.wrapper-img-profile').find('img').attr('src', (url || urlImgDefault));
        }

        $scope.init = async () => {
            await Promise.all([$scope.listRoles()]).then(() => {
                $scope.getInfo();
                refreshSelectPicker();
                setTimeout(() => {
                    loadContent();
                }, 100);
            });
        };

        function loadContent() {
            angular.element('.page-content-wrapper').removeAttr('data-ng-init');
            angular.element('.sf-page-content').css('display', 'block');
        }

        $scope.listRoles = async () => {
            await UsersService.listRoles()
                .then((response) => {
                    $scope.roles = response.Success ? response.Data : [];
                });
        };
        /* role backoffice */


        $scope.openToUpdate = () => {
            $scope.disabledElement = false;
            refreshSelectPicker();
        };
//         let roleSelectedCurrent = {};
//         $scope.loadSelectByRole = async (role = {}) => {
//             const {
//                 RoleCode,
//                 _id,
//             } = role;
//             roleSelectedCurrent = role;
//             $scope.formUpdate.RoleObjectId = _id;
//             $scope.listUserByRole(role.ParentObjectId);
//             refreshSelectPicker();
//         };
//         refreshSelectPicker();

//   refreshSelectPicker();
//         };

        function addClassForElements(elements) {
            elements.map((element) => {
                angular.element(element).addClass('hide-select-option');
            });
        }

        function removeClassForElements(elements) {
            elements.map((element) => {
                angular.element(element).removeClass('hide-select-option');
            });
        }

        $scope.update = (form) => {
            if (form.validate()) {
                $scope.formUpdate = filterObject($scope.formUpdate);
                if ($scope.formUpdate.BranchObjectId) {
                    $scope.formUpdate.Branches = [$scope.formUpdate.BranchObjectId];
                }
                UploadService.uploadDataAndImageBase64(
                    'PUT',
                    '/admin/users/update',
                    $scope.formUpdate,
                    $scope.image,
                )
                    .then((response) => {
                        if (response.Success) {
                            logger.success(getMsgResponse(response));
                            changeCss();
                            resetDataUpdate();
                        } else {
                            logger.error(getMsgResponse(response));
                        }
                    })
                    .catch(() => {
                        logger.error(getMsgResponse(response));
                    });
            } else {
                logger.error(messages[10000]);
            }
        };
        $scope.deleteImage = () => {
            $scope.image = null;
            hideActionChangeImage();
        };
        $scope.updateAvatar = () => {
            if (!$scope.image) {
                return logger.error('Chọn hình ảnh hợp lệ');
            }
            const urlImage = $scope.image;
            UploadService.uploadDataAndImageBase64(
                'PUT',
                '/admin/users/updateAvatar',
                {UserObjectId: $scope.formUpdate.UserObjectId},
                $scope.image,
            ).then((response) => {
                if (response.Success) {
                    logger.success(getMsgResponse(response));
                    changeCss();
                    // eslint-disable-next-line no-unused-expressions
                    ($scope.image && replaceImage(urlImage), $scope.deleteImage());
                } else {
                    logger.error(getMsgResponse(response));
                }
            });
        };

        function resetDataUpdate() {
            $scope.disabledElement = true;
            refreshSelectPicker();
            angular.element('span.fileinput-exists, a.fileinput-exists').css('display', 'none');
            angular.element('span.fileinput-new').css('display', 'block');
        }

        $scope.selectStatus = (status) => {
            $scope.formUpdate.Status = status;
        };

        $scope.filterStatus = (status) => {
            if (status === 200) {
                return {
                    class: 'Active',
                    text: 'Hoạt động',
                };
            }
            if (status === 400) {
                return {
                    class: 'Inactive',
                    text: 'Ngừng',
                };
            }
        };

        $scope.nameTab = '';
        $scope.loadTab = (nameTab) => {
            $scope.nameTab = nameTab;
            $scope.$broadcast(nameTab);
        };

        $scope.reloadTab = () => {
            $scope.$broadcast(`reload-${$scope.nameTab}`);
        };
    }
}());
