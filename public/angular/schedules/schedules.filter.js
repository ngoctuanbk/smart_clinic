/* eslint-disable no-const-assign */
(function () {
    angular
        .module('SmartClinic')
        .filter('filterScheduleAll', filterScheduleAll)
    function renderElem(value, status, scheduleObjectId) {
        // eslint-disable-next-line no-nested-ternary
        const classElm = status === 'Active' ? 'text-success' : status === 'WaitingAccepted' ? 'text-warning' : 'text-secondary';
        return `
            <renderview str="'${value}'" scheduleobjectid="'${scheduleObjectId}'" class="'${classElm}'"></renderview>
        `;
    }
    function filterScheduleAll($sce, SharedService) {
        const { isEmpty } = SharedService;
        function input(schedules = [], date) {
            const hasDate = schedules.filter(sch => sch.Date === date);
            if (!isEmpty(hasDate)) {
                let template = '';
                hasDate.map((item) => {
                    template += renderElem(`${item.Patient} (${item.PatientID})`,
                        item.Status, item.ScheduleObjectId);
                });
                return $sce.trustAsHtml(template);
            }
            return '';
        }
        return input;
    }
}());
 