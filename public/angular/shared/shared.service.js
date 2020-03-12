/* eslint-disable no-prototype-builtins */
/* eslint-disable eqeqeq */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-new-func */
/* eslint-disable no-param-reassign */
/* eslint-disable default-case */
(function () {
    angular.module('SmartClinic')
        .service('SharedService', SharedService);

    SharedService.$inject = ['$http', 'exception', 'moment', '$timeout', 'listMonths', '$filter'];

    function SharedService($http, exception, moment, $timeout, listMonths, $filter) {
        const _listMonths = listMonths();
        this.numberDaysInMonth = function (year, month) {
            return new Date(year, month, 0).getDate();
        };
        this.getDayOfWeek = function (date) {
            const DaysOfWeek = [{
                number: 0,
                key: 'Sun',
                value: 'Chủ nhật',
            },
            {
                number: 1,
                key: 'Mon',
                value: 'Thứ hai',
            }, {
                number: 2,
                key: 'Tue',
                value: 'Thứ ba',
            }, {
                number: 3,
                key: 'Wed',
                value: 'Thứ tư',
            }, {
                number: 4,
                key: 'Thu',
                value: 'Thứ năm',
            }, {
                number: 5,
                key: 'Fri',
                value: 'Thứ sáu',
            }, {
                number: 6,
                key: 'Sat',
                value: 'Thứ bảy',
            },
            ];
            const momentdate = moment(date);
            const day = new Date(momentdate);
            const dayNumber = day.getDay();
            const _day = DaysOfWeek.filter(d => d.number === dayNumber);
            return _day[0].key;
        };
        this.convertTimeMoment = function (time) {
            const isValidDate = moment(time, 'YYYY-MM-DD HH:mm:ss', true).isValid();
            const formatTime = isValidDate ? moment(time, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY HH:mm:ss') : '';
            return formatTime;
        };
        this.filterDaysOfWeek = function (DayOfWeek) {
            let strDayOfWeek = '';
            switch (DayOfWeek) {
            case 'Mon':
                strDayOfWeek = 'Thứ hai';
                break;
            case 'Tue':
                strDayOfWeek = 'Thứ ba';
                break;
            case 'Wed':
                strDayOfWeek = 'Thứ tư';
                break;
            case 'Thu':
                strDayOfWeek = 'Thứ năm';
                break;
            case 'Fri':
                strDayOfWeek = 'Thứ sáu';
                break;
            case 'Sat':
                strDayOfWeek = 'Thứ bảy';
                break;
            case 'Sun':
                strDayOfWeek = 'Chủ nhật';
                break;
            }
            return strDayOfWeek;
        }
        this.strDateTime = ['YYYY-MM-DD','DD-MM-YYYY','YYYY-M-D', 'YYYY-MM-DD HH:mm:ss', 'YYYY-M-D H:m:s'];
        this.formatDateToDMY = (date) => {
            const _isValidDayYMD = moment(date, this.strDateTime, true).isValid();
            if (_isValidDayYMD) {
                const newDate = moment(date.toString(), this.strDateTime).format('DD-MM-YYYY');
                return newDate;
            }
            return '';
        };
        this.filterStatus = (status) => {
            if (status === 'Active' || +status === 200) {
                return {
                    class: 'status-Active',
                    str: 'Hoạt động',
                    label_class: 'label-success',
                };
            }
            if (status === 'WaitingAccepted' || +status === 100) {
                return {
                    class: 'status-New',
                    str: 'Mới',
                    label_class: 'label-warning',
                };
            }
            return {
                class: 'status-Inactive',
                str: 'Ngừng',
                label_class: 'label-default',
            };
        };
        this.filterStatusOrder = (status) => {
            if (status === 'Active') {
                return {
                    class: 'status-Active',
                    str: 'Xác nhận',
                    label_class: 'label-success',
                };
            } if (status === 'WaitingAccepted') {
                return {
                    class: 'status-New',
                    str: 'Mới',
                    label_class: 'label-warning',
                };
            }
            return {
                class: 'status-Inactive',
                str: 'Ngừng',
                label_class: 'label-default',
            };
        };
        this.formatToYMD = (date) => {
            const dateFormat = ['YYYY-M-D', 'YYYY-MM-DD', 'DD-MM-YYYY', 'D-M-YYYY'];
            const newDate = moment(date, dateFormat).format('YYYY-MM-DD');
            return newDate;
        };
        this.getDaysInMonth = (year, month) => {
            year = year || new Date().getFullYear();
            month = month || new Date().getMonth() + 1;
            const daysInMonth = new Date(year, month, 0).getDate();
            let arrDaysInMonth = [];
            for (let i = 1; i <= daysInMonth; i++) {
                const date = {
                    day: i,
                    month,
                    year,
                    fullDate: `${year}-${month}-${i}`,
                };
                arrDaysInMonth = [...arrDaysInMonth, date];
            }
            return arrDaysInMonth;
        };

        this.convertMonth = month => (month.toString().length === 1 ? `0${month}` : month);

        this.changeCss = () => {
            angular.element('.form-group').removeClass('has-error');
            angular
                .element('.form-group')
                .find('.has-error')
                .removeClass('has-error');
            angular.element('.form-group').removeClass('has-success');
            angular
                .element('.form-group')
                .find('.has-success')
                .removeClass('has-success');
            angular.element('.error-block').css('display', 'none');
            angular.element('.bootstrap-select button.btn').removeClass('has-error').removeClass('has-success');
        };

        this.refreshSelectPicker = () => {
            $timeout(() => {
                angular.element('.bs-select').selectpicker('refresh');
            }, 1);
        };

        function isDateDMY(date) {
            const _isValidDayDMY = moment(date, 'DD-MM-YYYY', true).isValid();
            if (_isValidDayDMY) {
                return date;
            }
        }
        this.convertToStrTimeVN = (date) => {
            if (isDateDMY(date)) {
                const fullDate = date.split('-');
                const _day = fullDate[0];
                const _month = this.convertMonth(fullDate[1]);
                const _year = fullDate[2];
                const hasMonth = _listMonths.find(month => month.key == _month);
                return `${_day} ${hasMonth.value}, ${_year}`;
            }
            return '';
        };

        function escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        this.paginate = (arrays, query = {}) => {
            const limit = query.Limit ? +query.Limit : 100;
            const page = query.Page ? +query.Page : 1;
            let SearchName = query.SearchName ? query.SearchName : '';
            if (SearchName) {
                SearchName = escapeRegExp(SearchName);
                const regex = new RegExp(SearchName, 'i');
                arrays = arrays.filter((item) => {
                    if (item.Info && item.Info.Name) {
                        return regex.test(item.Info.Name);
                    } if (item.Name) {
                        return regex.test(item.Name);
                    }
                    return item;
                });
            }
            const response = {};
            const pagination = {};
            pagination.total = arrays.length;
            pagination.limit = limit;
            pagination.pages = Math.ceil(pagination.total / pagination.limit);
            pagination.page = page;
            pagination.skip = (page - 1) * limit + 1;
            const start = pagination.skip - 1;
            const end = limit * page;
            response.Pagination = pagination;
            response.Data = arrays.slice(start, end);
            return response;
        };

        this.duplicateArrayIds = (array, obj) => {
            if (obj && Object.keys(obj).length && obj.hasOwnProperty('_id')) {
                if (obj.Selected) {
                    array = [...array, obj._id];
                    const set = new Set(array);
                    const value = set.values();
                    return Array.from(value);
                }
                const idx = array.indexOf(obj._id);
                array.splice(idx, 1);
                return array;
            }
            const set = new Set(array);
            const value = set.values();
            return Array.from(value);
        };

        this.deleteItem = (callback, message = '', cbError = new Function()) => {
            swal({
                title: 'Cảnh báo?',
                text: message,
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#27a4b0',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes!',
            })
                .then((willDelete) => {
                    if (willDelete) {
                        callback();
                    }
                })
                .catch(() => {
                    cbError();
                    return swal.noop;
                });
        };

        this.isEmpty = (val) => {
            const has = Object.prototype.hasOwnProperty;
            const toString = Object.prototype.toString;
            // Null and Undefined...
            if (val == null) return true;

            // Booleans...
            if (typeof val === 'boolean') return false;

            // Numbers...
            if (typeof val === 'number') return val === 0;

            // Strings...
            if (typeof val === 'string') return val.length === 0;

            // Functions...
            if (typeof val === 'function') return val.length === 0;

            // Arrays...
            if (Array.isArray(val)) return val.length === 0;

            // Errors...
            if (val instanceof Error) return val.message === '';

            // Objects...
            if (val.toString == toString) {
                switch (val.toString()) {
                // Maps, Sets, Files and Errors...
                case '[object File]':
                case '[object Map]':
                case '[object Set]': {
                    return val.size === 0;
                }

                // Plain objects...
                case '[object Object]': {
                    for (const key in val) {
                        if (has.call(val, key)) return false;
                    }

                    return true;
                }
                }
            }

            // Anything else...
            return false;
        };

        this.isRoleAdTeRsmMe = role => ['AdminSystem', 'TechnicalSupport', 'RSM', 'Member'].includes(role);
        this.isRoleDirector = role => role === 'Director';

        this.isRoleBO = role => role === 'BackOffice';

        this.isRoleASM = role => role === 'ASM';

        this.isRolePGLeader = role => role === 'PGLeader';

        this.isRolePG = role => role === 'PG';

        this.isRoleSaleRep = role => role === 'SaleRep';

        this.filterObject = (obj = {}) => {
            const newObj = {};
            for (const prop in obj) {
                if (!this.isEmpty(obj[prop])) {
                    newObj[prop] = obj[prop];
                }
            }
            return newObj;
        };

        this.checkFormInvalid = (form) => {
            const controls = form.$$controls;
            const fieldsRequired = [];
            controls.map((field) => {
                if (!this.isEmpty(form[field.$name]) && form[field.$name].$$attr.required) {
                    fieldsRequired.push(form[field.$name]);
                }
            });
            let fieldsHasValue = 0;
            const lenFieldsRequired = fieldsRequired.length;
            for (let i = 0; i < lenFieldsRequired; i++) {
                if (!this.isEmpty(fieldsRequired[i].$viewValue)) {
                    fieldsHasValue++;
                }
            }
            if (fieldsHasValue === lenFieldsRequired) {
                return 'Thông tin không hợp lệ';
            }
            return 'Hãy điền đầy đủ thông tin';
        };

        this.trimValue = value => String(value || '').trim();
    }
}());
