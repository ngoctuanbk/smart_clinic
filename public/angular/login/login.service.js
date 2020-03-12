(function () {
    angular.module('SmartClinic')
        .service('loginService', loginService);

    loginService.$inject = ['HttpService'];

    function loginService(HttpService) {
        this.login = function (data) { return HttpService.sendData('POST', '/login', data, 'Lỗi xảy ra khi đăng nhập'); };
    }
}());
