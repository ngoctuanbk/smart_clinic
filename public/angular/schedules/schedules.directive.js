/* eslint-disable no-param-reassign */
(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('customBindHtml', customBindHtml)
        .directive('renderview', renderview);
    function customBindHtml($compile) {
        return {
            restrict: 'A',
            link: (scope, element, attr) => {
                attr.$observe('ngBindHtml', () => {
                    if (attr.ngBindHtml) {
                        $compile(element[0].children)(scope);
                    }
                });
            },
        };
    }
    function renderview(SchedulesService) {
        const directive = {
            restrict: 'AE',
            scope: {
                str: '=',
                class: '=',
                scheduleobjectid: '=',
            },
            template: '<a style="display:block; margin-bottom: 10px;" href="javascript:;" ng-click="scheduleDetail(scheduleobjectid)" ng-class="class" ng-bind="str"></a>',
            link: (scope) => {
                scope.scheduleDetail = (ScheduleObjectId) => {
                    SchedulesService.infoSchedule({ ScheduleObjectId }).then((response) => {
                        const data = response.Success ? response.Data : {};
                        scope.$emit('fetch-info-schedule', data);
                    });
                };
            },
        };
        return directive;
    }
}());
