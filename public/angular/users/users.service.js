(function () {
    angular.module('SmartClinic')
        .service('UsersService', UsersService);

    UsersService.$inject = ['HttpService'];

    function UsersService(HttpService) {
        this.listRoles = data => HttpService.sendData('GET', '/admin/roles/listActive', data, 'Lỗi xảy khi hiển thị danh sách các quyền');
        this.list = data => HttpService.sendData('GET', '/admin/users/list', data, 'Lỗi xảy khi hiển thị danh sách nhân viên');
    }
}());
