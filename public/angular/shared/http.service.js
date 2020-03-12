/* eslint-disable prefer-arrow-callback */
/* eslint-disable object-shorthand */
(function () {
    angular.module('SmartClinic')
        .service('HttpService', HttpService);

    HttpService.$inject = ['$http', 'exception'];

    function HttpService($http, exception) {
        this.sendData = function (method, url, data, msgError) {
            return $http({
                method: method,
                url: url,
                data: data,
                params: data,
            }).then(function (response) { return response.data; }).catch(function () { return handlingError(msgError); });
        };

        function handlingError(msg, error) {
            return exception.catcher(msg)(error);
        }
    }
}());
