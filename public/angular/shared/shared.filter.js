/* eslint-disable no-useless-concat */
/* eslint-disable eqeqeq */
/* eslint-disable prefer-destructuring */
/* eslint-disable default-case */
/* eslint-disable no-param-reassign */
/* eslint-disable radix */
(function () {
    'use strict';

    angular
        .module('app.core')
        .filter('diffTimeFilter', diffTimeFilter)
        .filter('formatDateToDMY', formatDateToDMY)
        .filter('filterStatusToText', filterStatusToText)
        .filter('filterStatusOrderToText', filterStatusOrderToText)
        .filter('filterStatusScheduleToText', filterStatusScheduleToText)
        .filter('filterStatusToClass', filterStatusToClass)
        .filter('filterStatusToLabelClass', filterStatusToLabelClass)
        .filter('filterDaysOfWeek', filterDaysOfWeek)
        .filter('getMonthInDate', getMonthInDate)
        .filter('getDayOfWeek', getDayOfWeek)
        .filter('filterGender', filterGender)
        .filter('filterStatusAcl', filterStatusAcl)
        .filter('filterStatusAclToClass', filterStatusAclToClass)
        .filter('filterChannelName', filterChannelName)
        .filter('filterAgencyName', filterAgencyName)
        .filter('currencyFormat', currencyFormat)
        .filter('convertArrayObjectToString', convertArrayObjectToString)
        .filter('filterImageFromApi', filterImageFromApi);

    diffTimeFilter.$inject = ['moment'];

    function diffTimeFilter(moment) {
        function diffTime(date) {
            const strFomat = [
                'YYYY-MM-DD HH:mm:ss',
            ];
            const validFromDate = moment(date.FromTime, strFomat, true).isValid();
            const validToDate = moment(date.ToTime, strFomat, true).isValid();
            if (validFromDate && validToDate) {
                const fromDate = moment(date.FromTime, strFomat, true).format('YYYY-MM-DD HH:mm').toString();
                const toDate = moment(date.ToTime, strFomat, true).format('YYYY-MM-DD HH:mm').toString();
                const parseFromDate = Date.parse(fromDate);
                const parseToDate = Date.parse(toDate);
                const momentFromDate = moment(parseFromDate);
                const momentToDate = moment(parseToDate);
                const getDuration = moment.duration(momentToDate.diff(momentFromDate));
                const duration = `${parseInt(getDuration.asDays())}d${parseInt(getDuration.asHours())}h${parseInt(getDuration.minutes())}m`;
                return duration;
            }
            return '';
        }
        return diffTime;
    }

    function currencyFormat() {
        function commaSeparateNumber(val) {
            while (/(\d+)(\d{3})/.test(val.toString())) {
                val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
            }
            return val;
        }
        return commaSeparateNumber;
    }

    function filterChannelName() {
        function filterChannelName(channels) {
            let stringData = '';
            channels.map((data, key) => {
                if (key <= 5) {
                    if (key == 5) stringData += '..., ';
                    else stringData += (`${data.ChannelName}, `);
                }
            });
            stringData = stringData.slice(0, -2);
            return stringData;
        }
        return filterChannelName;
    }
    function filterAgencyName() {
        function filterAgencyName(agencies) {
            let stringData = '';
            agencies.map((data, key) => {
                if (key <= 2) {
                    if (key == 2) stringData += '..., ';
                    else stringData += (`${data.AgencyName}, `);
                }
            });
            stringData = stringData.slice(0, -2);
            return stringData;
        }
        return filterAgencyName;
    }

    function formatDateToDMY() {
        function inputDate(date) {
            const _isValidDayDMY = moment(date, 'DD-MM-YYYY', true).isValid();
            if (_isValidDayDMY) {
                return date;
            }
            let newDate = '';
            const _isValidDayYMDHMS = moment(date, ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD H:m:s'], true).isValid();
            const _isValidDayYMD = moment(date, 'YYYY-MM-DD', true).isValid();
            if (_isValidDayYMDHMS) {
                newDate = moment(date.toString(), ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD H:m:s']).format('DD-MM-YYYY HH:mm:ss');
            } else if (_isValidDayYMD) {
                newDate = moment(date.toString(), 'YYYY-MM-DD').format('DD-MM-YYYY');
            }
            return newDate;
        }
        return inputDate;
    }

    function filterStatusToText() {
        function filterStatus(status) {
            if (status === 'Active') {
                return 'Hoạt động';
            } if (status === 'WaitingAccepted') {
                return 'Mới';
            } if (status === 'Inactive') {
                return 'Ngừng';
            } if (status === 'Deleted') {
                return 'Bị xóa';
            } if (status === 'InProcess') {
                return 'Đang khám';
            } if (status === 'Done') {
                return 'Đã khám';
            }
        }
        return filterStatus;
    }

    function filterStatusOrderToText() {
        function filterStatus(status) {
            if (status === 'Active') {
                return 'Xác nhận';
            } if (status === 'WaitingAccepted') {
                return 'Mới';
            } if (status === 'Inactive') {
                return 'Hủy';
            } if (status === 'Deleted') {
                return 'Bị xóa';
            } if (status === 'InProcess') {
                return 'Đang khám';
            } if (status === 'Done') {
                return 'Đã khám';
            }
        }
        return filterStatus;
    }
    function filterStatusScheduleToText() {
        function filterStatus(status) {
            if (status === 'Active' || +status === 200) {
                return 'Đã duyệt'; // 'Đã duyệt',
            } if (status === 'WaitingAccepted' || +status === 100) {
                return 'Chờ duyệt'; // 'Chờ duyệt'
            } if (status === 'Inactive' || +status === 400) {
                return 'Hủy'; // 'Hủy'
            } if (status === 'Deleted') {
                return 'Đã xóa'; // 'Bị xóa'
            }
        }
        return filterStatus;
    }

    function filterStatusToClass() {
        function filterStatus(status) {
            if (status === 'Active'  || status === 200 || status === 'InProcess' || status === 500) {
                return 'status-Active';
            } if (status === 'WaitingAccepted') {
                return 'status-New';
            } if (status === 'Inactive' || status === 300 || status === 'InProcess' || status === 500) {
                return 'status-Inactive';
            } if (status === 'Deleted') {
                return 'status-Remove';
            }
        }
        return filterStatus;
    }

    function filterStatusToLabelClass() {
        function filterStatus(status) {
            if (status === 'Active') {
                return 'label-success';
            } if (status === 'WaitingAccepted') {
                return 'label-warning';
            } if (status === 'Inactive') {
                return 'label-default';
            } if (status === 'Deleted') {
                return 'label-danger';
            }
        }
        return filterStatus;
    }

    function filterDaysOfWeek() {
        function inputDaysOfWeek(DayOfWeek) {
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
        return inputDaysOfWeek;
    }

    function getMonthInDate() {
        function inputDate(date) {
            const month = moment(date).format('MM');
            return month;
        }
        return inputDate;
    }

    function getDayOfWeek() {
        function inputDate(date) {
            const DaysOfWeek = [{
                number: 0,
                key: 'Sun',
                value: 'Chủ nhật',
            }, {
                number: 1,
                key: 'Mon',
                value: 'Thứ 2',
            }, {
                number: 2,
                key: 'Tue',
                value: 'Thứ 3',
            }, {
                number: 3,
                key: 'Wed',
                value: 'Thứ 4',
            }, {
                number: 4,
                key: 'Thu',
                value: 'Thứ 5',
            }, {
                number: 5,
                key: 'Fri',
                value: 'Thứ 6',
            }, {
                number: 6,
                key: 'Sat',
                value: 'Thứ 7',
            }];
            const momentdate = moment(date);
            const day = new Date(momentdate);
            const dayNumber = day.getDay();
            const _day = DaysOfWeek.filter(d => d.number === dayNumber);
            return _day[0].value;
        }
        return inputDate;
    }


    function filterGender() {
        function inputGender(gender) {
            if (gender == 'Male') {
                return 'Nam';
            } if (gender == 'Female') {
                return 'Nữ';
            }
            return '';
        }
        return inputGender;
    }

    function filterStatusAcl() {
        function inputStatus(role) {
            if (role === 'Allow') {
                return 'Truy cập';
            }
            if (role === 'Deny') {
                return 'Chặn';
            }
            return '';
        }
        return inputStatus;
    }

    function filterStatusAclToClass() {
        function filterStatus(status) {
            if (status === 'Allow') {
                return 'status-Active';
            }
            if (status === 'Deny') {
                return 'status-Inactive';
            }
            return '';
        }
        return filterStatus;
    }

    function isEmpty(val) {
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
    }

    function trimValue(value) {
        return String(value || '').trim();
    }

    function removeCommaLast(string = '') {
        string = trimValue(string);
        if (string.slice(-1) !== ',') { return string; }
        const lastIdx = string.lastIndexOf(',');
        return string.substr(0, lastIdx);
    }

    function convertArrayObjectToString() {
        function input(array = [], fieldTaken1 = '') {
            let str = '';
            array.map((item) => {
                str += `${(item[fieldTaken1] || '')}, `;
            });
            str = removeCommaLast(str);
            return str;
        }
        return input;
    }
    function filterImageFromApi(getUrlApi) {
        function input(urlImage) {
            return urlImage ? `${getUrlApi()}${urlImage}` : '';
        }
        return input;
    }
}());
