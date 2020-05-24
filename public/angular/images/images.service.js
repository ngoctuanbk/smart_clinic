(function () {
    angular.module('SmartClinic')
        .service('ImagesService', ImagesService);

    ImagesService.$inject = ['HttpService'];
    function ImagesService(HttpService) {
        this.create = data => HttpService.sendData('POST', '/admin/images/create', data, 'Lỗi xảy ra khi thêm mới chụp chiếu');
        this.list = data => HttpService.sendData('GET', '/admin/images/list', data, 'Lỗi xảy ra khi hiển thị danh sách chụp chiếu');
        this.listPatient = data => HttpService.sendData('GET', '/admin/patients/listActive', data, 'Lỗi xảy ra khi hiển thị danh sách bệnh nhân');
        this.updateStatus = data => HttpService.sendData('PUT', '/admin/images/updateStatus', data, 'Lỗi xảy ra khi cập nhật xét nghiệm');
    }
}());
