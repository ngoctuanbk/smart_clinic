(function () {
    'use strict';

    angular.module('SmartClinic')
        .factory('ValidatorMedicine', () => {
            const factoryObj = {};
            factoryObj.validationOptions = function () {
                return {
                    rules: {
                        medicine_name: {
                            required: true,
                        },
                        medicine_code: {
                            required: true,
                            notSpaceAllow: true,
                        },
                        price: {
                            required: true,
                        },
                        brand: {
                            required: true,
                        },
                        unit: {
                            required: true,
                        },
                        quantity: {
                            required: true,
                        },
                        lot: {
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
