(function () {
    angular.module('SmartClinic')
        .service('PatientsService', PatientsService);

        PatientsService.$inject = ['HttpService'];

    function PatientsService(HttpService) {
        this.list = data => HttpService.sendData('GET', '/admin/patients/list', data, 'Lỗi xảy khi hiển thị danh sách bệnh nhân');
        this.listProvince = data => HttpService.sendData('GET', '/admin/provinces/listActive', data, 'Lỗi xảy khi hiển thị danh sách tỉnh/thành phố');
        this.listDistrictByProvince = data => HttpService.sendData('GET', '/admin/districts/listByProvince', data, 'Lỗi xảy khi hiển thị danh sách tỉnh/thành phố');
        this.listWardByDistrict = data => HttpService.sendData('GET', '/admin/wards/listByDistrict', data, 'Lỗi xảy khi hiển thị danh sách tỉnh/thành phố');
        this.create = data => HttpService.sendData('POST', '/admin/patients/create', data, 'Lỗi xảy khi thêm mới bệnh nhân');
        this.updateStatus = data => HttpService.sendData('PUT', '/admin/patients/updateStatus', data, 'Lỗi xảy khi cập nhật trạng bệnh nhân');
    }
}());
