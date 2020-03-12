/* eslint-disable eqeqeq */

'use strict';

(function () {
    $.validator.addMethod('isPassport', (value) => {
        if (!value) { return true; }
        if (Number(+value) && Number.isInteger(+value)) {
            return !!(value.toString().length >= 9 && value.toString().length <= 12);
        }
        return false;
    });

    function removeClassByProp(prop, value) {
        const element = $(`input[${prop}$="${value}"]`);
        if (element.val() != undefined && !element.val().length) {
            element.closest('.form-group').removeClass('has-error').removeClass('has-success');
        }
    }
    angular.module('SmartClinic')
        .factory('ValidatorUsers', () => {
            // factory returns an object
            const factoryObj = {};
            factoryObj.validationOptions = function () {
                return {
                    errorElement: 'span', // default input error message container
                    errorClass: 'error-block', // default input error message class
                    rules: {
                        username: {
                            required: true,
                            minlength: 6,
                            notSpaceAllow: true,
                        },
                        user_code: {
                            required: true,
                        },
                        password: {
                            required: true,
                            minlength: 6,
                        },
                        name: {
                            required: true,
                            minlength: 6,
                        },
                        email: {
                            // required: true,
                            isEmail: true,
                        },
                        mobile: {
                            required: true,
                            isMobile: true,
                        },
                        passport: {
                            number: true,
                            isPassport: true,
                        },
                        manager: {
                            required: true,
                        },
                        leader: {
                            required: true,
                        },
                        branch: {
                            required: true,
                        },
                        role: {
                            required: true,
                        },
                        category: {
                            required: true,
                        },
                        channel: {
                            required: true,
                        },
                        area: {
                            required: true,
                        },
                        new_pasword: {
                            required: true,
                            minlength: 5,
                        },
                        re_new_pasword: {
                            required: true,
                            equalTo: '#new_password',
                        },
                        person_manager: {
                            required: true,
                        },

                        // import
                        form_import_position: {
                            required: true,
                        },
                        form_import_manager: {
                            required: true,
                        },
                        loginId: {
                            required: true,
                            minlength: 6,
                        },
                    },
                    errorPlacement(error) { // render error placement for each input type
                        // element.after(error);
                        return false;
                    },
                    highlight(element) { // hightlight error inputs
                        $(element).closest('.form-group').removeClass('has-success').addClass('has-error'); // set error class to the control group
                        $(element).siblings('.bootstrap-select button.btn').addClass('has-error');
                    },
                    unhighlight(element) { // revert the change done by hightlight
                        $(element).closest('.form-group').removeClass('has-error'); // set error class to the control group
                        $(element).siblings('.bootstrap-select button.btn').removeClass('has-error');
                    },
                    success(label, element) {
                        $(element).closest('.form-group').removeClass('has-error').addClass('has-success'); // set success class to the control group
                        $(element).siblings('.bootstrap-select button.btn').removeClass('has-error').addClass('has-success');
                        // removeClassByProp('name', 'mobile');
                        removeClassByProp('name', 'email');
                        removeClassByProp('name', 'passport');
                    },
                    submitHandler() {
                        error.hide();
                        return false;
                    },
                };
            };
            return factoryObj;
        });
}());
