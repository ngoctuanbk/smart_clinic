(function () {
    angular.module('SmartClinic')
        .controller('PatientsDetailController', PatientsDetailController);
    PatientsDetailController.$inject = ['$scope', 'PatientsService', 'UploadService', 'PaginationFactory', 'logger', '$timeout', 'limitData', 'SharedService', 'ValidatorPatient'];

    function PatientsDetailController($scope, PatientsService, UploadService, PaginationFactory, logger, $timeout, limitData, SharedService, ValidatorPatient) {
        const {
            refreshSelectPicker,
            isEmpty,
            changeCss,
            isNumberInteger,
        } = SharedService;
        $scope.formUpdate = {};
        $scope.getInfo = async () => {
            const {
                data,
            } = $scope;
            $scope.formUpdate.PatientObjectId = data._id;
            $scope.PatientID = data.PatientID;
            $scope.FullName = data.FullName;
            $scope.Mobile = data.Mobile;
            $scope.DateOfBirth = data.DateOfBirth;
            $scope.Age = data.Age;
            $scope.Sex = data.Sex;
            $scope.ProvinceName = data.Address.ProvinceObjectId.ProvinceName;
            $scope.DistrictName = data.Address.DistrictObjectId.DistrictName;
            $scope.WardName = data.Address.WardObjectId.WardName;
            $scope.Street = data.Address.Street;
            $scope.Reason = data.Reason;
            $scope.formUpdate.HealthStatus = {};
            if (data.HealthStatus){
                $scope.formUpdate.HealthStatus.Height = data.HealthStatus.Height;
                $scope.formUpdate.HealthStatus.Weight = data.HealthStatus.Weight;
                $scope.formUpdate.HealthStatus.BMI = data.HealthStatus.BMI;
                $scope.formUpdate.HealthStatus.BloodGroup = data.HealthStatus.BloodGroup;
                $scope.formUpdate.HealthStatus.BloodPressure = data.HealthStatus.BloodPressure;
                $scope.formUpdate.HealthStatus.Allergy = data.HealthStatus.Allergy;
                $scope.formUpdate.HealthStatus.MedicalHis = data.HealthStatus.MedicalHis;
                $scope.formUpdate.HealthStatus.DiseaseHis = data.HealthStatus.DiseaseHis;
            }
            if (data.Diagnose){
                $scope.formUpdate.Diagnose = data.Diagnose;
            }
            $scope.paginate.PatientObjectId = $scope.formUpdate.PatientObjectId;
            $scope.listLab();
            $scope.paginateAc.PatientObjectId = $scope.formUpdate.PatientObjectId;
            $scope.listActivity();
            $scope.paginatePre.PatientObjectId = $scope.formUpdate.PatientObjectId;
            $scope.listPrescription();
            $scope.paginateImage.PatientObjectId = $scope.formUpdate.PatientObjectId;
            $scope.listImage();
            $scope.paginateDia.PatientObjectId = $scope.formUpdate.PatientObjectId;
            $scope.listDiagnose();
        };
        $scope.updateHealthStatus = () => {
            PatientsService.updateHealthStatus($scope.formUpdate)
                .then((response) => {
                    console.log($scope.formUpdate)
                    console.log(response);
                    if (response.Success) {
                        logger.success('Cập nhật trạng thái sức khỏe của bệnh nhân');
                    } else {
                        logger.error('Có lỗi xảy ra. Vui lòng thử lại!');
                    }
                });
        };
        $scope.tabName = '';
        $scope.modifyTab = (tabName) => {
            $scope.tabName = tabName;
            emitEvent(tabName);
        };
        function emitEvent(emitName) {
            $scope.$broadcast(emitName);
        }
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
                "LabTypeName": "Xét nghiệm máu",
                "LabTypeCode": "MT003"
            },
            {
                "LabTypeName": "Xét nghiệm điện giải đồ (Na+, K+, Cl+, Canxi...)",
                "LabTypeCode": "MT004"
            },
            {
                "LabTypeName": "Xét nghiệm nước tiểu",
                "LabTypeCode": "MT005"
            },
            {
                "LabTypeName": "Xét nghiệm sinh hóa",
                "LabTypeCode": "MT006"
            }
        ];
        $scope.limitData = limitData();
        $scope.paginate = {};
        $scope.paginate.Page = 1;
        $scope.paginate.Limit = $scope.limitData[0];
        $scope.paginate.SortKey = 'CreatedDate';
        $scope.paginate.SortOrder = -1;
        $scope.paginate.Search = '';
        $scope.count = 1;
        $scope.listLab = () => {
            PatientsService.listLab($scope.paginate)
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
                $scope.listLab();
            }
        };

        $scope.nextPage = () => {
            if ($scope.pagination.numberPage > $scope.paginate.Page) {
                $scope.paginate.Page += 1;
                $scope.listLab();
            }
        };

        $scope.prevPage = () => {
            if ($scope.paginate.Page > 1) {
                $scope.paginate.Page -= 1;
                $scope.listLab();
            }
        };

        $scope.firstPage = () => {
            if ($scope.paginate.Page > 1) {
                $scope.paginate.Page = 1;
                $scope.listLab();
            }
        };

        $scope.endPage = () => {
            if ($scope.paginate.Page !== $scope.pagination.numberPage) {
                $scope.paginate.Page = $scope.pagination.numberPage;
                $scope.listLab();
            }
        };
        /*activities */
        $scope.paginateAc = {};
        $scope.paginateAc.Page = 1;
        $scope.paginateAc.Limit = $scope.limitData[0];
        $scope.paginateAc.SortKey = 'CreatedDate';
        $scope.paginateAc.SortOrder = -1;
        $scope.paginateAc.Search = '';
        $scope.number = 1;
        $scope.listActivity = () => {
            PatientsService.listActivity($scope.paginateAc)
                .then((response) => {
                    console.log(response)
                    if (response.Success) {
                        $scope.activities = response.Data.docs;
                        $scope.number = response.Data.page === 1 ? 1 : response.Data.limit * (response.Data.page - 1) + 1;
                        // $scope.paginationAc = PaginationFactory.paginations($scope.paginate.Page, response.Data);
                    }
                });
        };
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
        $scope.formCreate = {};
        $scope.createLab = (form) => {
            if (!isEmpty($scope.LabDetail)) {
                $scope.formCreate.LabDetail = $scope.LabDetail;
            }
                $scope.formCreate.PatientObjectId = $scope.formUpdate.PatientObjectId;
            if (form.validate()) {
                PatientsService.createLab($scope.formCreate)
                    .then((response) => {
                        console.log(response);
                        console.log($scope.formCreate)
                        if (response.Success) {
                            $scope.listLab();
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
            $scope.formUpdateLab.LabObjectId = item.LabObjectId;
            $scope.LabName = item.LabName;
            $scope.LabCode = item.LabCode;
            $scope.LabDetailUpdate = item.LabDetail;
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
        $scope.formUpdateLab={};
        // $scope.updateLab = (form) => {
        //     if (!isEmpty($scope.LabDetailUpdate)) {
        //         $scope.formUpdateLab.LabDetail = $scope.LabDetailUpdate;
        //     }
        //     $scope.formUpdateLab.PatientObjectId = $scope.formUpdate.PatientObjectId;
        //     if (form.validate()) {
        //         PatientsService.updateLab($scope.formUpdateLab)
        //             .then((response) => {
        //                 console.log(response);
        //                 console.log($scope.formUpdateLab)
        //                 if (response.Success) {
        //                     alertMessage('success', 'Cập nhật kết quả xét nghiệm thành công', true);
        //                     $timeout(() => {
        //                         angular.element('#update_lab').modal('hide');
        //                     }, 2000);
        //                     $scope.listLab();
        //                 } else {
        //                     alertMessage('danger', 'Có lỗi xảy ra. Vui lòng thử lại!', true);
        //                 }
        //             });
        //     } else {
        //         alertMessage('danger', SharedService.checkFormInvalid(form), true);
        //     }
        // };
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
                            $scope.listLab();
                                $timeout(() => {
                                    // angular.element('#update_lab').modal('hide');
                                    changeCss();
                                }, 1000);
                            // download file import error
                            if (response.pathLogError) {
                                const pathLogError = response.pathLogError.replace('../public/', '/');
                                $scope.filePathError = pathLogError;
                                displayModalImportFile('#import_file', 'hide');
                                $scope.listLab();
                                $timeout(() => {
                                    downloadRemoveFile();
                                    angular.element('#update_lab').modal('hide');
                                }, 50);
                            } else {
                                $scope.listLab();
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
            await PatientsService.info({LabDetailObjectId})
                .then((response) => {
                    console.log(response);
                    $scope.details = response.Success ? response.Data : [];
                    $scope.type = response.Data[0].LabType;
                    
                });
        };
        $scope.updateStatusLab = (Status, LabObjectId) => {
            const formUpdate = {
                Status,
                LabObjectId,
            };
            PatientsService.updateStatusLab(formUpdate)
                .then((response) => {
                    console.log(response)
                    if (response.Success) {
                        $scope.listLab();
                        logger.success('Cập nhật trạng thái thành công');
                    } else {
                        logger.error('Có lỗi xảy ra, Vui lòng thử lại.');
                    }
                });
        };

        function alertMessage(alertClass = '', alertMsg = '', alertShow = false) {
            $scope.alertShow = alertShow;
            $scope.alertClass = alertClass;
            $scope.alertMsg = alertMsg;
        }
        $scope.listProduct = async () => {
            await PatientsService.listProduct()
                .then((response) => {
                    console.log(response);
                    $scope.products = response.Success ? response.Data : [];
                });
        };
        $scope.listProduct();
        
        /* order */
        $scope.OrderDetails = [];
        $scope.SumTotalPrice = 0;
        $scope.addFieldDetailOrder = () => {
            const newField = {
                Product: null,
                MedicineObjectId: null,
                Price: null,
                Quantity: 0,
                Unit: null,
                TotalValue: null,
                showEdit: true,
            };
            $scope.OrderDetails.push(newField);
            refreshSelectPicker();
        };
        function operateValue(Price, Quantity) {
            return +Price * +Quantity;
        }
        // $scope.changeProduct = async (item, idx) => {
        //     if (item.Product) {
        //         const { Product } = item;
        //         const PriceObjectId = $scope.place.PriceObjectId ? $scope.place.PriceObjectId._id : null;
        //         $scope.OrderDetails[idx].PriceDefault = Product.Price;
        //         $scope.OrderDetails[idx].Unit = (Product.UnitObjectId && Product.UnitObjectId.UnitName) || '';
        //         $scope.OrderDetails[idx].ValueOfTax = Product.TaxObjectId ? Product.TaxObjectId.Value : 0;
        //         $scope.OrderDetails[idx].CategoryObjectId = Product.Category ? Product.Category._id : null;
        //         if (PriceObjectId) {
        //             const params = { PriceObjectId, ProductObjectId: Product._id };
        //             OrdersService.getPriceProductByPriceObjectId(params).then((response) => {
        //                 const PriceByPriceObjectId = response.Success ? response.Data.PriceByPriceObjectId : null;
        //                 const Price = PriceByPriceObjectId || Product.Price;
        //                 $scope.OrderDetails[idx].PriceBeforeTax = Price;
        //                 setPriceForDetailOrder(Price, Product.TaxObjectId.Value, idx);
        //             });
        //         } else {
        //             $scope.OrderDetails[idx].PriceBeforeTax = Product.Price;
        //             setPriceForDetailOrder(Product.Price, Product.TaxObjectId.Value, idx);
        //         }
        //     }
        // };

        $scope.openEditDetailOrder = (idx) => {
            $scope.OrderDetails[idx].showEdit = true;
            refreshSelectPicker();
        };

        function sumTotalValueInTable() {
            $scope.SumTotalPrice = $scope.OrderDetails.reduce((initVal, currVal) => initVal + currVal.TotalValue, 0);
        }

        $scope.saveDetailOrder = (item, idxItem) => {
            if (isEmpty(item.Product)) {
                return logger.error('Hãy chọn sản phẩm');
            }
            let idxFound = null;
            const hasProduct = $scope.OrderDetails.find((detail, index) => { idxFound = index; return detail.MedicineObjectId === item.Product._id; });
            if (hasProduct && idxFound !== idxItem) {
                return logger.error('Sản phẩm này đã tồn tại');
            }
            if (item.Quantity <= 0) {
                return logger.error('Số lượng phải lớn hơn 0');
            }
            if (!isNumberInteger(item.Quantity)) {
                return logger.error('Số lượng phải là số nguyên');
            }
            $scope.OrderDetails[idxItem].MedicineObjectId = item.Product._id;
            $scope.OrderDetails[idxItem].Unit = item.Product.Unit || '';
            $scope.OrderDetails[idxItem].Price = item.Product.Price || '';
            $scope.OrderDetails[idxItem].Quantity = item.Quantity || '';
            $scope.OrderDetails[idxItem].TotalValue = operateValue(item.Product.Price, item.Quantity);
            $scope.OrderDetails[idxItem].showEdit = false;
            sumTotalValueInTable();
        };
        $scope.deleteOrderDetail = (idx) => {
            $scope.OrderDetails.splice(idx, 1);
            sumTotalValueInTable();
        };
        $scope.createPrescription = (form) => {
            if (!isEmpty($scope.OrderDetails)) {
                $scope.formCreate.OrderDetail = $scope.OrderDetails;
            }
            $scope.formCreate.PatientObjectId = $scope.formUpdate.PatientObjectId;
            $scope.formCreate.SumTotalPrice = $scope.SumTotalPrice;
            if (form.validate()) {
                PatientsService.createPrescription($scope.formCreate)
                    .then((response) => {
                        console.log(response);
                        console.log($scope.formCreate)
                        if (response.Success) {
                            $scope.listPrescription();
                            $scope.formCreate = {};
                            $scope.OrderDetails = [];
                            $scope.formCreate.SumTotalPrice = 0;
                            changeCss();
                            refreshSelectPicker();
                            alertMessage('success', 'Thêm mới đơn thuốc thành công', true);
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
         /*prescription */
         $scope.paginatePre = {};
         $scope.paginatePre.Page = 1;
         $scope.paginatePre.Limit = $scope.limitData[0];
         $scope.paginatePre.SortKey = 'CreatedDate';
         $scope.paginatePre.SortOrder = -1;
         $scope.paginatePre.Search = '';
         $scope.numberPre = 1;
         $scope.listPrescription = () => {
             PatientsService.listPrescription($scope.paginatePre)
                 .then((response) => {
                     console.log(response)
                     if (response.Success) {
                         $scope.prescriptions = response.Data.docs;
                         $scope.numberPre = response.Data.page === 1 ? 1 : response.Data.limit * (response.Data.page - 1) + 1;
                         // $scope.paginationAc = PaginationFactory.paginations($scope.paginate.Page, response.Data);
                     }
                 });
         };
         /* update diagnose*/
        /*activities */
        $scope.paginateDia = {};
        $scope.paginateDia.Page = 1;
        $scope.paginateDia.Limit = $scope.limitData[0];
        $scope.paginateDia.SortKey = 'CreatedDate';
        $scope.paginateDia.SortOrder = -1;
        $scope.numberDia = 1;
        $scope.listDiagnose = () => {
            PatientsService.listDiagnose($scope.paginateDia)
                .then((response) => {
                    console.log(response)
                    if (response.Success) {
                        $scope.diagnoses = response.Data.docs;
                        $scope.numberDia = response.Data.page === 1 ? 1 : response.Data.limit * (response.Data.page - 1) + 1;
                        // $scope.paginationAc = PaginationFactory.paginations($scope.paginate.Page, response.Data);
                    }
                });
        };
        $scope.formCreateDia = {};
        $scope.createDiagnose = (form) => {
            $scope.formCreateDia.PatientObjectId = $scope.formUpdate.PatientObjectId;
            if (form.validate()) {
                PatientsService.createDiagnose($scope.formCreateDia)
                    .then((response) => {
                        console.log(response)
                        if (response.Success) {
                            $scope.listDiagnose();
                            $scope.formCreateDia = {};
                            changeCss();
                            alertMessage('success', 'Thêm chuẩn đoán thành công', true);
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

        // images
        $scope.limitData = limitData();
        $scope.paginateImage = {};
        $scope.paginateImage.Page = 1;
        $scope.paginateImage.Limit = $scope.limitData[0];
        $scope.paginateImage.SortKey = 'CreatedDate';
        $scope.paginateImage.SortOrder = -1;
        $scope.paginateImage.Search = '';
        $scope.countImage = 1;
        $scope.listImage = () => {
            PatientsService.listImageByPatient($scope.paginateImage)
                .then((response) => {
                    if (response.Success) {
                        console.log(response)
                        $scope.items = response.Data.docs;
                        $scope.countImage = response.Data.page === 1 ? 1 : response.Data.limit * (response.Data.page - 1) + 1;
                        $scope.paginationImage = PaginationFactory.paginations($scope.paginateImage.Page, response.Data);
                    }
                });
        };
        $scope.setPageImage = (page) => {
            if (page && page !== $scope.paginateImage.Page) {
                $scope.paginateImage.Page = +page;
                $scope.listImage();
            }
        };

        $scope.nextPageImage = () => {
            if ($scope.paginationImage.numberPage > $scope.paginateImage.Page) {
                $scope.paginateImage.Page += 1;
                $scope.listImage();
            }
        };

        $scope.prevPageImage = () => {
            if ($scope.paginateImage.Page > 1) {
                $scope.paginateImage.Page -= 1;
                $scope.listImage();
            }
        };

        $scope.firstPageImage = () => {
            if ($scope.paginateImage.Page > 1) {
                $scope.paginateImage.Page = 1;
                $scope.listImage();
            }
        };

        $scope.endPageImage = () => {
            if ($scope.paginateImage.Page !== $scope.paginationImage.numberPage) {
                $scope.paginateImage.Page = $scope.paginationImage.numberPage;
                $scope.listImage();
            }
        };
        $scope.typeImages = [
            {
                "TypeName": "Chụp X-quang",
                "TypeCode": "MT001"
            },
            {
                "TypeName": "Chụp Cộng hưởng từ MRI",
                "TypeCode": "MT002"
            },
            {
                "TypeName": "Chụp cắt lớp vi tính CT-Scan",
                "TypeCode": "MT003"
            },
            {
                "TypeName": "Siêu âm khớp",
                "TypeCode": "MT004"
            },
            {
                "TypeName": "Nội soi",
                "TypeCode": "MT005"
            },
            {
                "TypeName": "Siêu âm 3D",
                "TypeCode": "MT004"
            },
            {
                "TypeName": "Siêu âm tim",
                "TypeCode": "MT004"
            },
            {
                "TypeName": "Siêu âm Dropper",
                "TypeCode": "MT004"
            },
        ];
        $scope.formCreateImage = {};
        $scope.createImage = (form) => {
            $scope.formCreateImage.PatientObjectId = $scope.formUpdate.PatientObjectId;
            if (form.validate()) {
                PatientsService.createImage($scope.formCreateImage)
                    .then((response) => {
                        console.log($scope.formCreateImage)
                        console.log(response)
                        if (response.Success) {
                            $scope.listImage();
                            $scope.formCreateImage = {};
                            refreshSelectPicker();
                            changeCss();
                            alertMessage('success', 'Thêm mới yêu cầu chụp chiếu thành công', true);
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
        $scope.formUpdateImage = {};
        $scope.infoImage = (item, idx) => {
            $scope.selectedImage = idx;
            $scope.formUpdateImage.ImageObjectId = item.ImageObjectId;
            $scope.formUpdateImage.ImageCode = item.ImageCode;
            $scope.formUpdateImage.Type = item.Type;
            $scope.formUpdateImage.Note = item.Note;
            $('.preview-images-zone').html('');
            item.Image.map((item, idx) => {
                renderViewImg(`${item}`, idx, item._id);
            });
            refreshSelectPicker();
        };
        $scope.uImage = (form) => {
            $scope.formUpdateImage.PatientObjectId = $scope.formUpdate.PatientObjectId;
            console.log($scope.formUpdateImage)
            if (form.validate()) {
                console.log($scope.images)
                const files = [];
                if (!isEmpty($scope.images)) {
                    for (const file of $scope.images) {
                        files.push(file);
                    }
                }
                $scope.formUpdateImage.ImageObjectIdDeleted = $scope.ImageObjectIdDeleted;
                UploadService.uploadImage('PUT', '/admin/images/update', $scope.formUpdateImage, files)
                    .then((response) => {
                        console.log("fffffffff")
                        console.log(response);
                        if (response.Success) {
                            alertMessage('success', 'Cập nhật kết quả chụp chiếu thành công', true);
                            $timeout(() => {
                                angular.element('#update_image').modal('hide');
                            }, 2000);
                            $scope.listImage();
                        } else {
                            alertMessage('danger', 'Có lỗi xảy ra. Vui lòng thử lại!', true);
                        }
                    });
            } else {
                alertMessage('danger', SharedService.checkFormInvalid(form), true);
            }
        };
        $scope.updateStatusImage = (Status, ImageObjectId) => {
            const formUpdate = {
                Status,
                ImageObjectId,
            };
            PatientsService.updateStatusImage(formUpdate)
                .then((response) => {
                    console.log(response)
                    if (response.Success) {
                        $scope.listImage();
                        logger.success('Cập nhật trạng thái thành công');
                    } else {
                        logger.error('Có lỗi xảy ra, Vui lòng thử lại.');
                    }
                });
        };
        $(document).ready(() => {
            document.getElementById('pro-image').addEventListener('change', readImage, false);

            $('.preview-images-zone').sortable();

            $(document).on('click', '.image-cancel', function () {
                const no = $(this).data('no');
                $(`.preview-image.preview-show-${no}`).remove();
                const id = $(this).data('id');
                $scope.ImageObjectIdDeleted.push(id);
            });
        });
        $scope.ImageObjectIdDeleted = [];

        let num = 0;
        function readImage(event) {
            if (window.File && window.FileList && window.FileReader) {
                const files = event.target.files; // FileList object
                $scope.images = files;
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    // eslint-disable-next-line no-continue
                    if (!file.type.match('image')) continue;

                    const picReader = new FileReader();

                    // eslint-disable-next-line no-loop-func
                    picReader.addEventListener('load', (event) => {
                        const picFile = event.target;
                        num += 1;
                        if (num <= 5) {
                            renderViewImg(picFile.result, num);
                        }
                    });
                    picReader.readAsDataURL(file);
                }
            }
        }

        function renderViewScreen(url) {
            const output = $('.wrapperSlideScreen');
            const html = `
                <div class="mySlides">
                    <img src="${$scope.checkImage(url)}" style="width:100%;height:600px">
                </div>
            `;
            output.append(html);
        }

        function renderImageColumn(url) {
            const output = $('.wrapperImageColumn');
            const html = `
                <div class="column">
                    <img class="demo cursor" src="${$scope.checkImage(url)}" style="width:100%; height:200px" >
                </div>
            `;
            output.append(html);
        }

        $scope.showImage = (Images) => {
            const wrapperSlideScreen = $('.wrapperSlideScreen');
            const wrapperImageColumn = $('.wrapperImageColumn');
            wrapperSlideScreen.html('');
            wrapperImageColumn.html('');
            $scope.SlideImages = Images;
            Images.map((slide) => {
                renderViewScreen(slide.ImagesDir);
                renderImageColumn(slide.ImagesDir);
            });
            $('#slide-image-asset').removeClass('hide');
        }; 
        $('.modal').on('hide.bs.modal', () => {
            $timeout(() => {
                changeCss();
                alertMessage();
            });
        }); 

        $scope.init = async () => { 
            await Promise.all([]).then(() => {
                $scope.getInfo();
                refreshSelectPicker();
            });
        };
    }
    function renderViewImg(url, idx, id) {
        const output = $('.preview-images-zone');
        const html = `<div class="preview-image preview-show-${idx}">`
        + `<div class="image-cancel" data-no="${idx}" data-id="${id}">x</div>`
        + `<div class="image-zone"><img id="pro-img-${idx}" src="${url}"></div>`
        + '</div>';
        output.append(html);
    }
}());
