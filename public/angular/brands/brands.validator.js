(function () {
    'use strict';

    angular.module('SmartClinic')
        .factory('ValidatorBrand', () => {
            const factoryObj = {};
            factoryObj.validationOptions = function () {
                return {
                    rules: {
                        brand_name: {
                            required: true,
                        },
                        brand_code: {
                            required: true,
                            notSpaceAllow: true,
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
