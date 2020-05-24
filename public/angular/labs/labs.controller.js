
/* eslint-disable prefer-destructuring */
(function () {
    angular.module('SmartClinic')
        .controller('LabsController', LabsController);
    LabsController.$inject = ['$scope', 'LabsService', 'UploadService', 'PaginationFactory',
        'logger', '$timeout', 'ValidatorLab', 'limitData', 'SharedService'];

    function LabsController($scope, LabsService, UploadService, PaginationFactory,
        logger, $timeout, ValidatorLab, limitData, SharedService) {
        const {
            filterObject,
            deleteItem,
            changeCss,
            refreshSelectPicker,
            isEmpty,
        } = SharedService;

        $scope.validator = ValidatorLab.validationOptions();
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
        $scope.types = [
            {
                "LabTypeName": "Xét nghiệm chức năng thận(Creatinine, Ure)",
                "LabTypeCode": "MT001"
            },
            {
                "LabTypeName": "Xét nghiệm chức năng gan(GOT, GPT, GGT...)",
                "LabTypeCode": "MT002"
            },
            {
                "LabTypeName": "Xét nghiệm mỡ máu",
                "LabTypeCode": "MT003"
            },
            {
                "LabTypeName": "Xét nghiệm điện giải đồ (Na+, K+, Cl+, Canxi...)",
                "LabTypeCode": "MT004"
            },
            {
                "LabTypeName": "Xét nghiệm cơ bản nước tiểu",
                "LabTypeCode": "MT005"
            }
        ];
        $scope.list = () => {
            LabsService.list($scope.paginate)
                .then((response) => {
                    if (response.Success) {
                        console.log(response)
                        $scope.labs = response.Data.docs;
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
        $scope.listPatient = async () => {
            await LabsService.listPatient()
                .then((response) => {
                    console.log(response);
                    $scope.patients = response.Success ? response.Data.docs : [];
                });
        };

        Promise.all([$scope.list(),  $scope.listPatient()]).then(() => {
            refreshSelectPicker();
        });
        $scope.LabDetail = [];
        $scope.addFieldDetailLab = () => {
            const newField = {
                LabType: '',
                showEdit: true,
            };
            $scope.LabDetail.push(newField);
            refreshSelectPicker();
        };
        $scope.openEditDetailLab = (idx) => {
            $scope.LabDetail[idx].showEdit = true;
            refreshSelectPicker();
        };
        $scope.saveDetailLab = (item, idxItem) => {
            if (isEmpty(item.LabType)) {
                return logger.error('Hãy chọn loại xét nghiệm');
            }
            let idxFound = null;
            const hasLab = $scope.LabDetail.find((detail, index) => { idxFound = index; return detail.LabType === item.LabType; });
            if (hasLab && idxFound !== idxItem) {
                return logger.error('Đã tồn tại loại xét nghiệm này');
            }
            $scope.LabDetail[idxItem].LabType = item.LabType;
            $scope.LabDetail[idxItem].showEdit = false;
        };
        $scope.deleteDetailLab = (idx) => {
                $scope.LabDetail.splice(idx, 1);
        };
        $scope.create = (form) => {
            if (!isEmpty($scope.LabDetail)) {
                $scope.formCreate.LabDetail = $scope.LabDetail;
            }
            if (form.validate()) {
                LabsService.create($scope.formCreate)
                    .then((response) => {
                        console.log(response);
                        console.log($scope.formCreate)
                        if (response.Success) {
                            $scope.list();
                            $scope.formCreate = {};
                            $scope.LabDetail = [];
                            changeCss();
                            refreshSelectPicker();
                            alertMessage('success', 'Thêm mới xét nghiệm thành công', true);
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
            $scope.selectedLab = idx;
            $scope.formUpdate.LabObjectId = item._id;
            $scope.formUpdate.PatientObjectId = item.PatientObjectId._id;
            $scope.LabName = item.LabName;
            $scope.LabCode = item.LabCode;
            $scope.LabDetailUpdate = item.LabDetails;
            $scope.Patient = item.PatientObjectId.FullName;
        };
        // $scope.addFieldDetailLabUpdate = () => {
        //     const newField = {
        //         LabType: '',
        //         Result: '',
        //         showEdit: true,
        //     };
        //     $scope.LabDetailUpdate.push(newField);
        //     refreshSelectPicker();
        // };
        // $scope.openEditDetailLabUpdate = (idx) => {
        //     $scope.LabDetailUpdate[idx].showEdit = true;
        //     refreshSelectPicker();
        // };
        // $scope.saveDetailLabUpdate = (item, idxItem) => {
        //     if (isEmpty(item.LabType)) {
        //         return logger.error('Hãy chọn loại xét nghiệm');
        //     }
        //     let idxFound = null;
        //     const hasLab = $scope.LabDetailUpdate.find((detail, index) => { idxFound = index; return detail.LabType === item.LabType; });
        //     if (hasLab && idxFound !== idxItem) {
        //         return logger.error('Đã tồn tại loại xét nghiệm này');
        //     }
        //     $scope.LabDetailUpdate[idxItem].LabType = item.LabType;
        //     $scope.LabDetailUpdate[idxItem].Result = item.Result;
        //     $scope.LabDetailUpdate[idxItem].showEdit = false;
        // };
        // $scope.deleteDetailLabUpdate = (idx) => {
        //         $scope.LabDetailUpdate.splice(idx, 1);
        // };
        // console.log($scope.LabDetailUpdate)

        // $scope.update = (form) => {
        //     if (!isEmpty($scope.LabDetailUpdate)) {
        //         $scope.formUpdate.LabDetail = $scope.LabDetailUpdate;
        //     }
        //     if (form.validate()) {
        //         LabsService.update($scope.formUpdate)
        //             .then((response) => {
        //                 console.log(response);
        //                 console.log($scope.formUpdate)
        //                 if (response.Success) {
        //                     alertMessage('success', 'Cập nhật kết quả xét nghiệm thành công', true);
        //                     $timeout(() => {
        //                         angular.element('#update_lab').modal('hide');
        //                     }, 2000);
        //                     $scope.list();
        //                 } else {
        //                     alertMessage('danger', 'Có lỗi xảy ra. Vui lòng thử lại!', true);
        //                 }
        //             });
        //     } else {
        //         alertMessage('danger', SharedService.checkFormInvalid(form), true);
        //     }
        // };
        $scope.updateStatus = (Status, LabObjectId) => {
            const formUpdate = {
                Status,
                LabObjectId,
            };
            LabsService.updateStatus(formUpdate)
                .then((response) => {
                    if (response.Success) {
                        $scope.list();
                        logger.success('Cập nhật trạng thái thành công');
                    } else {
                        logger.error('Có lỗi xảy ra, Vui lòng thử lại.');
                    }
                });
        };
        $scope.files = {};
        $scope.filePathError = '';
        $scope.importFile = (item, files) => {
            console.log(files)
            if ($scope.files) {
                displayLoading('block');
                console.log(item._id)
                UploadService.uploadFile('POST', '/admin/lab_details/importFile', files, {
                    LabDetailObjectId : item._id,
                })
                    .then((response) => {
                        console.log(response)
                        if (response && response.Success) {
                            alertMessage('success', 'Cập nhật kết quả xét nghiệm thành công', true);
                            displayLoading('none');
                            $scope.files = {};
                            $scope.$broadcast('reloadImport');
                            $scope.list();
                                $timeout(() => {
                                    // angular.element('#update_lab').modal('hide');
                                    changeCss();
                                }, 1000);
                            // download file import error
                            if (response.pathLogError) {
                                const pathLogError = response.pathLogError.replace('../public/', '/');
                                $scope.filePathError = pathLogError;
                                displayModalImportFile('#import_file', 'hide');
                                $scope.list();
                                $timeout(() => {
                                    downloadRemoveFile();
                                    angular.element('#update_lab').modal('hide');
                                }, 50);
                            } else {
                                $scope.list();
                                $timeout(() => {
                                    displayModalImportFile('#import_file', 'hide');
                                }, 1000);
                            }
                        } else {
                            displayLoading('none');
                        }
                    }).catch((err) => {
                        displayLoading('none');
                        logger.error(err);
                    });
            } else {
                displayLoading('none');
            }
        };
        function displayModalImportFile(element, action) {
            angular.element(element).modal(action);
        }
        function displayLoading(action) {
            angular.element('#loading_add').css('display', action);
        }

        function downloadRemoveFile() {
            function _viewError() {
                downloadFile($scope.filePathError);
                $timeout(() => {
                    deleteFile($scope.filePathError);
                }, 1000);
            }
            show_swal(_viewError, msg);
        }
        $scope.infoDetail = async (LabDetailObjectId) => {
            await LabsService.info({LabDetailObjectId})
                .then((response) => {
                    console.log(response);
                    $scope.details = response.Success ? response.Data : [];
                    $scope.type = response.Data[0].LabType;
                    
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
