'use strict';

(function () {
    angular.module('SmartClinic')
        .controller('PatientsController', PatientsController);
        PatientsController.$inject = ['$scope', 'PatientsService', 'PaginationFactory', 'logger', '$timeout', 'limitData', 'SharedService', 'ValidatorPatient'];

    function PatientsController($scope, PatientsService, PaginationFactory, logger, $timeout, limitData, SharedService, ValidatorPatient) {
        const {
            deleteItem,
        } = SharedService;
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
        $scope.paginate.Search = '';
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
                        $scope.CountInProcess = response.Data.CountInProcess;
                        $scope.CountWaitingAccepted = response.Data.CountWaitingAccepted;
                        $scope.CountDone = response.Data.CountDone;
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
                Name: '',
                Phone: '',
                Relationship: '',
                Home: '',
                showEdit: true,
            };
            $scope.ContactDetails.push(newField);
        };
        $scope.openEditContactDetail = (idx) => {
            $scope.ContactDetails[idx].showEdit = true;
        };
        $scope.saveContactDetail = (item, idxItem) => {  
            $scope.ContactDetails[idxItem].Name = $scope.formCreate.Name;
            $scope.ContactDetails[idxItem].Phone = $scope.formCreate.Phone;
            $scope.ContactDetails[idxItem].Relationship = $scope.formCreate.Relationship || '';
            $scope.ContactDetails[idxItem].Home = $scope.formCreate.Home || '';
            console.log($scope.ContactDetails)
            if (isEmpty(item.Name)) {
                return logger.error('Hãy chọn họ tên người thân');
            }
            if (isEmpty(item.Phone)) {
                return logger.error('Hãy chọn số điện thoại');
            }
            $scope.ContactDetails[idxItem].showEdit = false;
            resetContact();
                return;
        };
        $scope.deleteContactDetail = (idx) => {
                $scope.ContactDetails.splice(idx, 1);
        };
        function resetContact() {
            $scope.formCreate.Name = '';
            $scope.formCreate.Phone = '';
            $scope.formCreate.Relationship = '';
            $scope.formCreate.Home = '';
        }
        $scope.create = (form) => {
            if ($scope.formCreate.DateOfBirth){
                $scope.formCreate.Age = getAge($scope.formCreate.DateOfBirth);
            }
            if (!isEmpty($scope.ContactDetails)) {
                $scope.formCreate.Contact = $scope.ContactDetails;
            }
            if (form.validate()) {
                console.log($scope.formCreate)
                PatientsService.create($scope.formCreate)
                    .then((response) => {
                        console.log(response);
                        if (response.Success) {
                            $scope.list();
                            $scope.formCreate = {};
                            $scope.ContactDetails = [];
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
        $scope.updateStatus = (Status, PatientObjectId) => {
            const formUpdate = {
                Status,
                PatientObjectId,
            };
            PatientsService.updateStatus(formUpdate)
                .then((response) => {
                    if (response.Success) {
                        $scope.list();
                        logger.success('Cập nhật trạng thái thành công');
                    } else {
                        logger.error('Có lỗi xảy ra, Vui lòng thử lại.');
                    }
                });
        };
        $scope.info = (item, idx) => {
            $scope.selectedPatient = idx;
            $scope.formUpdate.PatientObjectId = item._id;
            $scope.formUpdate.FullName = item.FullName;
            $scope.formUpdate.Mobile = item.Mobile;
            $scope.formUpdate.Sex = item.Sex;
            $scope.formUpdate.DateOfBirth = item.DateOfBirth;
            $scope.formUpdate.Career = item.Career;
            $scope.formUpdate.Reason = item.Reason;
            $scope.formUpdate.Address.ProvinceObjectId = item.Address.ProvinceObjectId._id;
            $scope.formUpdate.Address.DistrictObjectId = item.Address.DistrictObjectId._id;
            $scope.formUpdate.Address.WardObjectId = item.Address.WardObjectId._id;
            $scope.formUpdate.Address.Street = item.Address.Street;
            $scope.ContactDetailsUpdate = item.Contact;
            // refreshSelectPicker();
            $scope.listDistrictByProvince($scope.formUpdate.Address.ProvinceObjectId);
            $scope.listWardByDistrict($scope.formUpdate.Address.DistrictObjectId);
        };

        $scope.update = (form) => {
            if ($scope.formUpdate.DateOfBirth){
                $scope.formUpdate.Age = getAge($scope.formUpdate.DateOfBirth);
            }
            if (form.validate()) {
                PatientsService.update($scope.formUpdate)
                    .then((response) => {
                        if (response.Success) {
                            alertMessage('success', 'Cập nhật thông tin bệnh nhân thành công', true);
                            $timeout(() => {
                                angular.element('#update_patient').modal('hide');
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
        $scope.exportFile = () => {
            let url = '/admin/patients/exportFile?SortOrder=-1';
            window.open(url);
        };
    }
}());
