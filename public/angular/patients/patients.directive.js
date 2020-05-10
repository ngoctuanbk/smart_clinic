/* eslint-disable no-param-reassign */
(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('listLab', listLab)
        .directive('listProduct', listProduct)
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
    function listProduct() {
        return {
            restrict: 'AE',
            template(tElem, tAttrs) {
                const isSelectMul = ('multiple' in tAttrs);
                const useNgChange = ('ngchange' in tAttrs);
                return `
                <select style="max-width: 180px;" class="bs-select form-control" data-live-search="true"
                    data-title=" " ${isSelectMul ? 'multiple' : ''} data-selected-text-format="count > 2"
                    ng-model="item.Product" ${useNgChange ? `ng-change="${tAttrs.ngchange}"` : ''}
                    ng-options="ite as ite.MedicineName + '(' + ite.MedicineCode+ ')' for ite in products"
                    data-size="5">
                    <option value="" ng-if="hideOptions">
                        Select... </option>
                </select>
                `;
            },
        };
    }
}());
