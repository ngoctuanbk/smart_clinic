(function () {
    angular.module('SmartClinic')
        .service('LabsService', LabsService);

    LabsService.$inject = ['HttpService'];
    function LabsService(HttpService) {
        this.list = data => HttpService.sendData('GET', '/admin/labs/list', data, 'Lỗi xảy ra khi hiển thị danh sách xét nghiệm');
        this.create = data => HttpService.sendData('POST', '/admin/labs/create', data, 'Lỗi xảy ra khi thêm mới xét nghiệm');
        this.listPatient = data => HttpService.sendData('GET', '/admin/patients/listActive', data, 'Lỗi xảy ra khi hiển thị danh sách bệnh nhân');
        this.update = data => HttpService.sendData('PUT', '/admin/labs/update', data, 'Lỗi xảy ra khi cập nhật xét nghiệm');
    }
}());
