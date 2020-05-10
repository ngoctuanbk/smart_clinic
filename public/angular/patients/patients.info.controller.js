'use strict';

(function () {
    angular.module('SmartClinic')
        .controller('PatientsDetailController', PatientsDetailController);
    PatientsDetailController.$inject = ['$scope', 'PatientsService', 'PaginationFactory', 'logger', '$timeout', 'limitData', 'SharedService', 'ValidatorPatient'];

    function PatientsDetailController($scope, PatientsService, PaginationFactory, logger, $timeout, limitData, SharedService, ValidatorPatient) {
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
                Result: '',
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
            $scope.LabDetail[idxItem].Result = item.Result;
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
            $scope.formUpdateLab.LabObjectId = item._id;
            $scope.LabName = item.LabName;
            $scope.LabCode = item.LabCode;
            $scope.LabDetailUpdate = item.LabDetail;
        };
        $scope.addFieldDetailLabUpdate = () => {
            const newField = {
                LabType: '',
                Result: '',
                showEdit: true,
            };
            $scope.LabDetailUpdate.push(newField);
            refreshSelectPicker();
        };
        $scope.openEditDetailLabUpdate = (idx) => {
            $scope.LabDetailUpdate[idx].showEdit = true;
            refreshSelectPicker();
        };
        $scope.saveDetailLabUpdate = (item, idxItem) => {
            if (isEmpty(item.LabType)) {
                return logger.error('Hãy chọn loại xét nghiệm');
            }
            let idxFound = null;
            const hasLab = $scope.LabDetailUpdate.find((detail, index) => { idxFound = index; return detail.LabType === item.LabType; });
            if (hasLab && idxFound !== idxItem) {
                return logger.error('Đã tồn tại loại xét nghiệm này');
            }
            $scope.LabDetailUpdate[idxItem].LabType = item.LabType;
            $scope.LabDetailUpdate[idxItem].Result = item.Result;
            $scope.LabDetailUpdate[idxItem].showEdit = false;
        };
        $scope.deleteDetailLabUpdate = (idx) => {
                $scope.LabDetailUpdate.splice(idx, 1);
        };
        $scope.formUpdateLab={};
        $scope.updateLab = (form) => {
            if (!isEmpty($scope.LabDetailUpdate)) {
                $scope.formUpdateLab.LabDetail = $scope.LabDetailUpdate;
            }
            $scope.formUpdateLab.PatientObjectId = $scope.formUpdate.PatientObjectId;
            if (form.validate()) {
                PatientsService.updateLab($scope.formUpdateLab)
                    .then((response) => {
                        console.log(response);
                        console.log($scope.formUpdateLab)
                        if (response.Success) {
                            alertMessage('success', 'Cập nhật kết quả xét nghiệm thành công', true);
                            $timeout(() => {
                                angular.element('#update_lab').modal('hide');
                            }, 2000);
                            $scope.listLab();
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
                            // $scope.listP();
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
         $scope.updateDiagnose = () => {
            PatientsService.updateDiagnose($scope.formUpdate)
                .then((response) => {
                    console.log($scope.formUpdate)
                    console.log(response);
                    if (response.Success) {
                        logger.success('Cập nhật chuẩn đoán thành công');
                    } else {
                        logger.error('Có lỗi xảy ra. Vui lòng thử lại!');
                    }
                });
        };

        $scope.init = async () => { 
            await Promise.all([]).then(() => {
                $scope.getInfo();
                refreshSelectPicker();
            });
        };
    }
}());
