/* eslint-disable no-param-reassign */
(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('listLab', listLab)
    function listLab() {
        return {
            restrict: 'AE',
            template: `
            <select style="max-width: 200px;" class="bs-select form-control" required data-live-search="true"
                name="lab"
                data-title=" "
                ng-model="item.LabType"
                ng-options="ite.LabTypeName as ite.LabTypeName for ite in types"
                data-size="5">
                <option value="" ng-if="hideOptions">
                    Select... </option>
            </select>
            `,
        };
    }
}());
