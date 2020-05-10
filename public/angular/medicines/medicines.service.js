(function () {
    angular.module('SmartClinic')
        .service('MedicinesService', MedicinesService);

    MedicinesService.$inject = ['HttpService'];
    function MedicinesService(HttpService) {
        this.list = data => HttpService.sendData('GET', '/admin/medicines/list', data, 'Lỗi xảy ra khi hiển thị danh sách thuốc');
        this.listBrand = data => HttpService.sendData('GET', '/admin/brands/listActive', data, 'Lỗi xảy ra khi hiển thị danh sách thương hiệu');
        this.create = data => HttpService.sendData('POST', '/admin/medicines/create', data, 'Lỗi xảy ra khi thêm mới thuốc');
        this.update = data => HttpService.sendData('PUT', '/admin/medicines/update', data, 'Lỗi xảy ra khi cập nhật thuốc');
    }
}());
