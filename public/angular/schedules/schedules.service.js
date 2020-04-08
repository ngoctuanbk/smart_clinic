(function () {
    angular.module('SmartClinic')
        .service('SchedulesService', SchedulesService);

    SchedulesService.$inject = ['HttpService'];

    function SchedulesService(HttpService) {
        this.list = data => HttpService.sendData('GET', '/admin/schedules/list', data, 'Lỗi xảy ra khi hiển thị danh sách lịch làm việc');
        this.listPatient = data => HttpService.sendData('GET', '/admin/patients/listActive', data, 'Lỗi xảy ra khi hiển thị danh sách bệnh nhân');
        this.listDoctorActive = data => HttpService.sendData('GET', '/admin/users/listDoctorActive', data, 'Lỗi xảy ra khi hiển thị danh sách bác sĩ');
        this.create = data => HttpService.sendData('POST', '/admin/schedules/create', data, 'Lỗi xảy ra khi thêm mới lịch khám bệnh');
        this.infoSchedule = data => HttpService.sendData('GET', '/admin/schedules/info', data, 'Lỗi xảy ra khi hiển thị thông tin lịch khám bệnh');
        this.updateStatus = data => HttpService.sendData('PUT', '/admin/schedules/updateStatus', data, 'Lỗi xảy ra khi cập nhật trạng thái danh sách khám bệnh');
    }
}());
