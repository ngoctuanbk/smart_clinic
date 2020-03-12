/* eslint-disable object-shorthand */
/* eslint-disable prefer-arrow-callback */
(function () {
    'use strict';

    angular.module('SmartClinic')
        .factory('validatorLogin', function () {
            // factory returns an object
            const factoryObj = {};
            factoryObj.validationOptions = function () {
                return {
                    errorElement: 'span', // default input error message container
                    errorClass: 'error-block', // default input error message class
                    rules: {
                        Email: {
                            required: true,
                            email: true,
                        },
                        Password: {
                            required: true,
                        },
                        Username: {
                            required: true,
                        },
                        VerifyCode: {
                            required: true,
                            number: true,
                        },
                        NewPassword: {
                            required: true,
                            minlength: 6,
                        },
                        ReNewPassword: {
                            required: true,
                            equalTo: '#NewPassword',
                        },

                    },
                    messages: {
                        Email: {
                            required: 'Nhập email để tạo lại mật khẩu',
                            email: 'Nhập email hợp lệ',
                        },
                        Password: {
                            required: 'Nhập mật khẩu',
                        },
                        Username: {
                            required: 'Nhập tên đăng nhập',
                        },
                        VerifyCode: {
                            required: 'Nhập mã xác nhận',
                            number: 'Nhập mã xác nhận hợp lệ',
                        },
                        NewPassword: {
                            required: 'Nhập mật khẩu mới',
                            minlength: 'Mật khẩu phải từ 6 ký tự trở lên',
                        },
                        ReNewPassword: {
                            required: 'Nhập lại mật khẩu mới',
                            equalTo: 'Nhập lại mật khẩu mới không đúng',
                        },

                    },
                    errorPlacement: function (error, element) { // render error placement for each input type
                        element.after(error);
                        // var icon = $(element).parent().find('span.addon-icon').children('i');
                        // icon.removeClass('fa-check').addClass("fa-warning");
                        // icon.attr("data-original-title", error.text()).tooltip();
                    },
                    highlight: function (element) { // hightlight error inputs
                        // var icon = $(element).parent().find('span.addon-icon').children('i');
                        $(element).closest('.form-group').removeClass('has-success').addClass('has-error'); // set error class to the control group
                        // icon.removeClass("fa-check").addClass("fa-exclamation-circle");
                    },
                    unhighlight: function (element) { // revert the change done by hightlight
                        // var icon = $(element).parent().find('span.addon-icon').children('i');
                        $(element).closest('.form-group').removeClass('has-error'); // set error class to the control group
                        // icon.removeClass("fa-exclamation-circle").addClass("fa-check");
                    },
                    success: function (label, element) {
                        // var icon = $(element).parent().find('span.addon-icon').children('i');
                        $(element).closest('.form-group').removeClass('has-error').addClass('has-success'); // set success class to the control group
                        // icon.removeClass("fa-exclamation-circle").addClass("fa-check");
                    },
                    submitHandler: function (form) {
                        error.hide();
                        // success.show();
                        // no need submit form
                        return false;
                    },
                };
            };
            return factoryObj;
        });
}());
