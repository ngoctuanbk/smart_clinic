(function () {
    angular.module('SmartClinic')
        .service('SchedulesService', SchedulesService);

    SchedulesService.$inject = ['HttpService'];

    function SchedulesService(HttpService) {
        this.list = data => HttpService.sendData('GET', '/admin/schedules/list', data, 'Lỗi xảy ra khi hiển thị danh sách lịch làm việc');
    }
}());
