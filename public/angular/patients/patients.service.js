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
        this.updateStatus = data => HttpService.sendData('PUT', '/admin/patients/updateStatus', data, 'Lỗi xảy khi cập nhật trạng thái bệnh nhân');
        this.update = data => HttpService.sendData('PUT', '/admin/patients/update', data, 'Lỗi xảy khi cập nhật thông tin bệnh nhân');
        this.updateHealthStatus = data => HttpService.sendData('PUT', '/admin/patients/updateHealthStatus', data, 'Lỗi xảy khi cập nhật chỉ số sức khỏe bệnh nhân');
        this.listLab = data => HttpService.sendData('GET', '/admin/labs/listByPatient', data, 'Lỗi xảy ra khi hiển thị danh sách xét nghiệm');
        this.createLab = data => HttpService.sendData('POST', '/admin/labs/create', data, 'Lỗi xảy ra khi thêm mới xét nghiệm');
        this.updateLab = data => HttpService.sendData('PUT', '/admin/labs/update', data, 'Lỗi xảy ra khi cập nhật xét nghiệm');
        this.listActivity = data => HttpService.sendData('GET', '/admin/activities/list', data, 'Lỗi xảy ra khi hiển thị danh sách xét nghiệm');
        this.listProduct = data => HttpService.sendData('GET', '/admin/medicines/listActive', data, 'Lỗi xảy ra khi hiển thị danh sách xét nghiệm');
        this.createPrescription = data => HttpService.sendData('POST', '/admin/prescriptions/create', data, 'Lỗi xảy ra khi thêm mới xét nghiệm');
        this.listPrescription = data => HttpService.sendData('GET', '/admin/prescriptions/list', data, 'Lỗi xảy ra khi hiển thị danh sách xét nghiệm');
        this.listDiagnose = data => HttpService.sendData('GET', '/admin/diagnose/list', data, 'Lỗi xảy ra khi hiển thị danh sách xét nghiệm');
        this.createImage = data => HttpService.sendData('POST', '/admin/images/create', data, 'Lỗi xảy ra khi thêm mới xét nghiệm');
        this.listImageByPatient = data => HttpService.sendData('GET', '/admin/images/listByPatient', data, 'Lỗi xảy ra khi hiển thị danh sách xét nghiệm');
        this.info = data => HttpService.sendData('GET', '/admin/lab_details/info', data, 'Lỗi xảy ra khi hiển thị danh sách xét nghiệm');
        this.updateStatusLab = data => HttpService.sendData('PUT', '/admin/labs/updateStatus', data, 'Lỗi xảy ra khi cập nhật xét nghiệm');
        this.createDiagnose = data => HttpService.sendData('POST', '/admin/diagnose/create', data, 'Lỗi xảy khi thêm mới bệnh nhân');
        this.updateStatusImage = data => HttpService.sendData('PUT', '/admin/images/updateStatus', data, 'Lỗi xảy ra khi cập nhật xét nghiệm');
    }
}());
