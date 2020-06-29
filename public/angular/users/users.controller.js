/* eslint-disable prefer-destructuring */
(function () {
    angular.module('SmartClinic')
        .controller('UsersController', UsersController);
    UsersController.$inject = ['$scope', 'PaginationFactory', 'UsersService', 'logger',
        '$timeout', 'limitData', 'SharedService'];

    function UsersController($scope, PaginationFactory, UsersService, logger,
        $timeout, limitData, SharedService) {
        // paginate
        $scope.limitData = limitData();
        $scope.paginate = {};
        $scope.paginate.Page = 1;
        $scope.paginate.Limit = $scope.limitData[0];
        $scope.paginate.SortKey = 'CreatedDate';
        $scope.paginate.SortOrder = -1;
        $scope.paginate.Search = '';
        $scope.LoginLdapEnable = false;
        $scope.users = [];

        // $scope.status = statusFilter();

        const {
            deleteItem,
            refreshSelectPicker,
            isEmpty,
        } = SharedService;
        $scope.list = () => {
            UsersService.list($scope.paginate)
                .then((response) => {
                    console.log(response);
                    if (response.Success) {
                        $scope.users = response.Data.docs;
                        $scope.CountActive = response.Data.CountActive;
                        $scope.CountWaitingAccepted = response.Data.CountWaitingAccepted;
                        $scope.CountInactive = response.Data.CountInactive;
                        $scope.count = response.Data.page === 1 ? 1 : response.Data.limit * (response.Data.page - 1) + 1;
                        $scope.pagination = PaginationFactory.paginations($scope.paginate.Page, response.Data);
                    } else {
                        $scope.users = [];
                    }
                });
        };
        $scope.listRoles = async () => {
            await UsersService.listRoles()
                .then((response) => {
                    console.log(response);
                    $scope.roles = response.Success ? response.Data : [];
                });
        };

        $scope.filterStatus = (status) => {
            $scope.paginate.Status = status;
            $scope.list();
        };

        // pagination
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

        $scope.sort = (column) => {
            $scope.paginate.SortKey = column;
            $scope.paginate.SortOrder = -$scope.paginate.SortOrder;
            $scope.list();
        };

        Promise.all([$scope.list(), $scope.listRoles()]).then(() => {
            refreshSelectPicker();
        });

        $scope.filter = () => {
            $scope.paginate.Page = 1;
            $scope.list();
        };
        $scope.viewInfo = (UserObjectId) => {
            window.location.href = `/admin/users/edit?id=${UserObjectId}`;
        };

        $scope.updateStatus = (Status, UserObjectId) => {
            const formUpdate = {
                Status,
                UserObjectId,
            };
            UsersService.updateStatus(formUpdate)
                .then((response) => {
                    console.log(response)
                    if (response.Success) {
                        $scope.list();
                        logger.success('Cập nhật trạng thái nhân viên thành công');
                    } else {
                        logger.error('Có lỗi xảy ra, Vui lòng thử lại.');
                    }
                });
        };

        $scope.delete = (UserObjectId, FullName) => {
            function deleteUsers() {
                UsersService.delete({
                    UserObjectId,
                })
                    .then((response) => {
                        if (response.Success) {
                            swal('Đã xóa!', 'success');
                            $scope.list();
                        } else {
                            swal('Có lỗi xảy ra', 'Vui lòng thử lại.', 'error');
                        }
                    });
            }
            const msg = `Bạn có chắc chắn muốn xóa nhân viên ${FullName}?`;
            deleteItem(deleteUsers, msg);
        };


        $scope.exportFile = () => {
            let url = '/admin/users/exportFile?SortOrder=-1';
            window.open(url);
        };


        // function show_swal(callback, message, cbError) {
        //     deleteItem(callback, message, cbError);
        // }
        // let messages = {};
        // function listMessage() {
        //     MessagesService.getMessageModule({ modulesName: ['Common', 'User'] }).then((data) => {
        //         messages = data;
        //     });
        // }
        // listMessage();
        // function getMsgResponse(response = {}) {
        //     const { StatusCode } = response;
        //     const msgError = messages[StatusCode] || response.Message;
        //     return msgError;
        // }
    }
}());
