(function () {
    'use strict';

    function removeClassByProp(prop, value, formParent) {
        const element = $(formParent).find(`input[${prop}$="${value}"]`);
        if (element.val() != undefined && !element.val().length) {
            element.closest('.form-group').removeClass('has-error').removeClass('has-success');
        }
    }

    angular.module('SmartClinic')
        .factory('ValidatorPatient', () => {
            const factoryObj = {};
            factoryObj.validationOptions = function () {
                return {
                    rules: {
                        fullname: {
                            required: true,
                        },
                        mobile: {
                            required: true,
                            isMobile: true,
                        },
                        sex: {
                            required: true,
                        },
                        reason: {
                            required: true,
                        },
                        date_of_birth: {
                            required: true,
                        },
                    },
                    errorPlacement(error, element) { // render error placement for each input type
                        return true;
                    },
                    highlight(element) { // hightlight error inputs
                        $(element).closest('.form-group').removeClass('has-success').addClass('has-error'); // set error class to the control group
                    },
                    unhighlight(element) { // revert the change done by hightlight
                        $(element).closest('.form-group').removeClass('has-error');
                    },
                    success(label, element) {
                        const formParent = element.closest('form');
                        $(element).closest('.form-group').removeClass('has-error').addClass('has-success'); // set success class to the control group
                        // removeClassByProp('name', 'mobile', formParent);
                        removeClassByProp('name', 'email', formParent);
                    },
                    submitHandler(form) {
                        return false;
                    },
                };
            };
            return factoryObj;
        });
}());
