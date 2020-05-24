exports.PRIVILEGE_STATUS = 1;
exports.CECRET = 'wrong-secret';
exports.EXPIRES_IN = '24h';
exports.EXPIRES_OUT = '-1h';
exports.POINT_RATIO = 10000;

exports.STATUS = {
    100: 'WaitingAccepted',
    200: 'Active',
    400: 'Inactive',
    500: 'InProcess',
    600: 'Done',
};
exports.DELETE_FLAG = {
    200: 'NO',
    300: 'YES',
};
exports.ACTION = {
    Update: 'Update',
    Delete: 'Delete',
    Create: 'Create',
    UpdateStatus: 'Update Status',
    ImportFile: 'Import File',
    ExportFile: 'Export File',
};
exports.SEX = ['Male', 'Female', 'Other'];
exports.FIELDS_IMPORT = {
    Param: 'Chỉ số',
    Value: 'Kết quả',
};