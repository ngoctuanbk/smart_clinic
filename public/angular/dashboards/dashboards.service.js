(function () {
    angular.module('SmartClinic')
        .service('DashboardsService', DashboardsService);

    DashboardsService.$inject = ['HttpService'];
    function DashboardsService(HttpService) {
        this.getUser = data => HttpService.sendData('GET', '/admin/users/getUser', data, 'Lỗi xảy ra khi hiển thị danh sách đếm số lượng nhân viên');
        this.countPatient = data => HttpService.sendData('GET', '/admin/patients/countPatient', data, 'Lỗi xảy ra khi hiển thị danh sách đếm số lượng nhân viên');
        this.patientByDate =  data => HttpService.sendData('GET', '/admin/patients/patientByDate', data, 'Lỗi xảy ra khi hiển thị doanh thu trong ngày');
        this.patientByMonth =  data => HttpService.sendData('GET', '/admin/patients/patientByMonth', data, 'Lỗi xảy ra khi hiển thị doanh thu trong ngày');
    }
}());
