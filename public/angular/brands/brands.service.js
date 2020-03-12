(function () {
    angular.module('SmartClinic')
        .service('BrandsService', BrandsService);

    BrandsService.$inject = ['HttpService'];
    function BrandsService(HttpService) {
        this.list = data => HttpService.sendData('GET', '/admin/brands/list', data, 'Lỗi xảy ra khi hiển thị danh sách thương hiệu');

        this.create = data => HttpService.sendData('POST', '/admin/brands/create', data, 'Lỗi xảy ra khi thêm mới thương hiệu');

        this.update = data => HttpService.sendData('PUT', '/admin/brands/update', data, 'Lỗi xảy ra khi cập nhật');

        this.updateStatus = data => HttpService.sendData('PUT', '/admin/brands/updateStatus', data, 'Lỗi xảy ra khi cập nhật trạng thái');

        this.delete = data => HttpService.sendData('PUT', '/admin/brands/delete', data, 'Lỗi xảy ra khi xóa thương hiệu');
    }
}());
