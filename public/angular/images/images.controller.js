/* eslint-disable prefer-destructuring */
(function () {
    angular.module('SmartClinic')
        .controller('ImagesController', ImagesController);
    ImagesController.$inject = ['$scope', 'ImagesService', 'UploadService', 'PaginationFactory',
        'logger', '$timeout', 'ValidatorImage', 'limitData', 'getUrlApi', 'SharedService'];

    function ImagesController($scope, ImagesService, UploadService, PaginationFactory,
        logger, $timeout, ValidatorImage, limitData, getUrlApi, SharedService) {
        const {
            filterObject,
            deleteItem,
            changeCss,
            refreshSelectPicker,
            isEmpty,
        } = SharedService;

        $scope.validator = ValidatorImage.validationOptions();
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
            ImagesService.list($scope.paginate)
                .then((response) => {
                    if (response.Success) {
                        $scope.images = response.Data.docs;
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
        $scope.listPatient = async () => {
            await ImagesService.listPatient()
                .then((response) => {
                    console.log(response);
                    $scope.patients = response.Success ? response.Data.docs : [];
                });
        };
        $scope.listPatient();
        $scope.types = [
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
        $scope.create = (form) => {
            if (form.validate()) {
                ImagesService.create($scope.formCreate)
                    .then((response) => {
                        console.log($scope.formCreate)
                        console.log(response)
                        if (response.Success) {
                            $scope.list();
                            $scope.formCreate = {};
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

        $scope.info = (item, idx) => {
            $scope.selectedImage = idx;
            $scope.formUpdate.ImageObjectId = item._id;
            $scope.formUpdate.PatientObjectId = item.PatientObjectId._id;
            $scope.formUpdate.ImageCode = item.ImageCode;
            $scope.formUpdate.Type = item.Type;
            $scope.Patient = item.PatientObjectId.FullName;
            $('.preview-images-zone').html('');
            item.Images.map((item, idx) => {
                renderViewImg(`${item.ImagesDir}`, idx, item._id);
            });
            refreshSelectPicker();
        };

        $scope.update = (form) => {
            if (form.validate()) {
                const files = [];
                if (!isEmpty($scope.images)) {
                    for (const file of $scope.images) {
                        files.push(file);
                    }
                }
                $scope.formUpdate.ImageObjectIdDeleted = $scope.ImageObjectIdDeleted;
                UploadService.uploadImage('PUT', '/admin/images/update', $scope.formUpdate, files)
                    .then((response) => {
                        console.log(response);
                        if (response.Success) {
                            alertMessage('success', 'Cập nhật kết quả chụp chiếu thành công', true);
                            $timeout(() => {
                                angular.element('#update_image').modal('hide');
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

        // $scope.updateStatus = (Status, BrandObjectId) => {
        //     const formUpdate = {
        //         Status,
        //         BrandObjectId,
        //     };
        //     BrandsService.updateStatus(formUpdate)
        //         .then((response) => {
        //             if (response.Success) {
        //                 $scope.list();
        //                 logger.success('Cập nhật trạng thái thành công');
        //             } else {
        //                 logger.error('Có lỗi xảy ra, Vui lòng thử lại.');
        //             }
        //         });
        // };

        // $scope.deleteBrands = (BrandObjectId, BrandName) => {
        //     function deleteBrands() {
        //         BrandsService.delete({
        //             BrandObjectId,
        //         })
        //             .then((response) => {
        //                 console.log(response);
        //                 if (response.Success) {
        //                     swal('Đã xóa!', 'success');
        //                     $scope.list();
        //                 } else {
        //                     swal('Có lỗi xảy ra', 'Vui lòng thử lại.', 'error');
        //                 }
        //             });
        //     }
        //     const msg = `Bạn có chắc chắn muốn xóa thương hiệu ${BrandName}?`;
        //     deleteItem(deleteBrands, msg);
        // };
        $scope.reload = () => {
            $scope.paginate.Page = 1;
            // $scope.list();
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
