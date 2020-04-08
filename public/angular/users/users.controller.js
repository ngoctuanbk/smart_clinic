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

        // $scope.updateStatus = (Status, UserObjectId) => {
        //     const formUpdate = {
        //         Status,
        //         UserObjectId,
        //     };
        //     UsersService.updateStatus(formUpdate)
        //         .then((response) => {
        //             if (response.Success) {
        //                 // $scope.users[idx].Status = Status === 200 ? 'Active' : 'Inactive';
        //                 $scope.list();
        //                 logger.success(getMsgResponse(response));
        //             } else {
        //                 logger.error(getMsgResponse(response));
        //             }
        //         });
        // };

        // $scope.delete = (UserObjectId) => {
        //     const formUpdate = {
        //         UserObjectId,
        //     };
        //     function deleteUser() {
        //         UsersService.delete(formUpdate).then((response) => {
        //             if (response.Success) {
        //                 swal(
        //                     messages[10018], // Xóa thành công,
        //                     'success',
        //                 );
        //                 $scope.list();
        //             } else {
        //                 swal(
        //                     getMsgResponse(response),
        //                     'error',
        //                 );
        //             }
        //         });
        //     }
        //     const msg = messages[10001];
        //     show_swal(deleteUser, msg);
        // };

        // $scope.viewInfo = (UserObjectId) => {
        //     window.location.href = `/admin/user/edit?id=${UserObjectId}`;
        // };

        // $scope.files = [];
        // $scope.filePathError = '';
        // $scope.importFile = () => {
        //     if ($scope.files) {
        //         displayLoading('block');
        //         UploadService.uploadFile('POST', '/admin/users/importFile', $scope.files)
        //             .then((response) => {
        //                 if (response && response.Success) {
        //                     let MessageSuccess = '';
        //                     let MessageFaild = '';
        //                     const { Data = {} } = response;
        //                     if (Data.totalAdded && Data.totalAdded.message) {
        //                         MessageSuccess = `${MessageSuccess + Data.totalAdded.message}<br/>`;
        //                     }
        //                     if (Data.totalUpdated && Data.totalUpdated.message) {
        //                         MessageSuccess = `${MessageSuccess + Data.totalUpdated.message}<br/>`;
        //                     }
        //                     if (Data.Error && Data.Error.message) {
        //                         MessageFaild = `${MessageFaild + Data.Error.message}<br/>`;
        //                     }
        //                     if (Data.totalAddError && Data.totalAddError.message) {
        //                         MessageFaild = `${MessageFaild + Data.totalAddError.message}<br/>`;
        //                     }
        //                     if (Data.totalUpdateError && Data.totalUpdateError.message) {
        //                         MessageFaild = `${MessageFaild + Data.totalUpdateError.message}<br/>`;
        //                     }
        //                     if (MessageSuccess !== '') {
        //                         logger.success(MessageSuccess);
        //                     }
        //                     if (MessageFaild !== '') {
        //                         logger.error(MessageFaild);
        //                     }
        //                     displayLoading('none');
        //                     $scope.files = {};
        //                     $scope.$broadcast('reloadImport');
        //                     // download file import error
        //                     if (response.pathLogError) {
        //                         const pathLogError = response.pathLogError.replace('../public/', '/');
        //                         $scope.filePathError = pathLogError;
        //                         angular.element('#import_file').modal('hide');
        //                         $timeout(() => {
        //                             viewError();
        //                         }, 50);
        //                     } else {
        //                         $scope.list();
        //                         $timeout(() => {
        //                             angular.element('#import_file').modal('hide');
        //                         }, 1000);
        //                     }
        //                 } else {
        //                     displayLoading('none');
        //                     logger.error(getMsgResponse(response));
        //                 }
        //             }).catch((err) => {
        //                 displayLoading('none');
        //                 logger.error(err);
        //             });
        //     } else {
        //         displayLoading('none');
        //         logger.error(messages[10004]);
        //     }
        // };

        // function displayLoading(action) {
        //     angular.element('#loading_add').css('display', action);
        // }

        // function viewError() {
        //     function _viewError() {
        //         downloadFile($scope.filePathError);
        //         $timeout(() => {
        //             deleteFile($scope.filePathError);
        //         }, 1000);
        //     }
        //     const msg = messages[10003];
        //     show_swal(_viewError, msg);
        // }

        // function downloadFile(filePath) {
        //     $timeout(() => {
        //         window.open(filePath);
        //     }, 10);
        // }

        // function deleteFile(filePath) {
        //     UploadService.deleteFile({
        //         filePath,
        //     }).then(() => {});
        // }

        // $scope.export = {};
        // $scope.exportFile = () => {
        //     let url = '/admin/users/exportFile?SortOrder=-1';
        //     if (!isEmpty($scope.export.Branches)) {
        //         url += `&Branches=${$scope.export.Branches}`;
        //     }
        //     if (!isEmpty($scope.export.Roles)) {
        //         url += `&Roles=${$scope.export.Roles}`;
        //     }
        //     if (!isEmpty($scope.export.Areas)) {
        //         url += `&Areas=${$scope.export.Areas}`;
        //     }
        //     if (!isEmpty($scope.export.Channels)) {
        //         url += `&Channels=${$scope.export.Channels}`;
        //     }
        //     if (!isEmpty($scope.export.Categories)) {
        //         url += `&Categories=${$scope.export.Categories}`;
        //     }
        //     window.open(url);
        //     resetDataExport();
        // };

        // $scope.getUsersLdap = async () => {
        //     displayLoadingSync('block');
        //     UsersService.getUsersLdap()
        //         .then((response) => {
        //             if (response.Success) {
        //                 $scope.list();
        //                 logger.success(messages[10030]);
        //                 displayLoadingSync('none');
        //             } else {
        //                 const msgError = getMsgResponse(response);
        //                 logger.error(msgError);
        //                 displayLoadingSync('none');
        //             }
        //         })
        //         .catch(() => {
        //             logger.error(messages[10031]);
        //             displayLoadingSync('none');
        //         });
        // };

        // function displayLoadingSync(action) {
        //     angular.element('#loading_add_sync').css('display', action);
        // }

        // $scope.reset = () => {
        //     $scope.paginate.Page = 1;
        //     $scope.paginate.Search = '';
        //     $scope.paginate.SortKey = 'CreatedDate';
        //     $scope.paginate.SortOrder = -1;
        //     $scope.paginate.Limit = $scope.limitData[0];
        //     delete $scope.paginate.Branches;
        //     delete $scope.paginate.Roles;
        //     delete $scope.paginate.Status;
        //     refreshSelectPicker();
        //     $scope.list();
        // };

        // function resetDataExport() {
        //     $scope.export = {};
        //     refreshSelectPicker();
        // }

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
