(function () {
    'use strict';
    
    function getTimeDMYUnix(time) {
        return moment(time, 'DD-MM-YYYY').unix();
    }

    function timeAfterNow(Time) {
        const currentTime = moment(new Date()).format('DD-MM-YYYY');
        const CurrentTimeUnix = getTimeDMYUnix(currentTime);
        const TimeUnix = getTimeDMYUnix(Time);
        if (CurrentTimeUnix > TimeUnix) {
            return false;
        } return true;
    }
    $.validator.addMethod('isValidEndTimeAfterNow', value => timeAfterNow(value));
    angular.module('SmartClinic')
        .factory('ValidatorSchedules', () => {
            const factoryObj = {};
            factoryObj.validationOptions = function () {
                return {
                    rules: {
                        patient: {
                            required: true,
                        },
                        doctor: {
                            required: true,
                        },
                        date: {
                            required: true,
                            isValidEndTimeAfterNow: true,
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
