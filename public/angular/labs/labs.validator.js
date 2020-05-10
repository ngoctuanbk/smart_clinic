(function () {
    'use strict';

    angular.module('SmartClinic')
        .factory('ValidatorLab', () => {
            const factoryObj = {};
            factoryObj.validationOptions = function () {
                return {
                    rules: {
                        lab_name: {
                            required: true,
                        },
                        lab_type: {
                            required: true,
                        },
                        patient: {
                            required: true,
                        },
                        result: {
                            required: true,
                        }
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
                        $(element).closest('.form-group').removeClass('has-error').addClass('has-success'); // set success class to the control group
                    },
                    submitHandler(form) {
                        return false;
                    },
                };
            };
            return factoryObj;
        });
}());
