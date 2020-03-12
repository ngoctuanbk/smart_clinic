exports.CODES_SUCCESS = {
    10000: 'Login success',
    10001: 'Create user success',
    10002: 'Create role success',
    10003: 'Create country success',
    10004: 'Create company success',
    10005: 'Get company success',
    10006: 'Create category success',
    10007: 'Import success',
    10008: 'List export success',
    10009: 'Update role success',
    10010: 'Export success',
    10011: 'List success',
/* role start from 10100 */
    10100: 'Create role success',
    10101: 'List active role success',
/* user start from 10110 */
    10110: 'Create user success',
    10111: 'List user success',
/* brand start from 10120 */
    10120: 'Create brand success',
    10121: 'List brand success',
    10122: 'Update brand success',
    10123: 'Update status brand success',
    10124: 'Delete brand success',
    /* province start from 10130 */
    10130: 'Create province success',
    10131: 'Create district success',
    10132: 'Create ward success',
    10133: 'List active province success',
    10134: 'List district by province success',
    10135: 'List ward by district success',
    /* patient start from 10140 */
    10140: 'Create patient success',
    10141: 'List patient success',
};

exports.CODES_ERROR = {
    /* error upload */
    40003: 'Params error!',
    40005: 'Create role error',
    40009: 'Failed to authenticate token',
    40010: 'Username or Password not correct',
    40012: 'Authentication failed. User not found',
    40013: 'Token expires date',
    40015: 'Field file upload is required',
    40016: 'File image is required',
    /* Error catch! */
    100001: 'Error catch!',
    /* user error */ 
    40100: 'Create user error',
    40101: 'UserName has exsit already',
    40102: 'UserCode has exsit already',
    /* brand error */ 
    40110: 'Create brand error',
    40111: 'BrandCode has exsit already',
    40112: 'Update brand error',
    40113: 'Update status brand error',
    40114: 'Delete brand error',
    /* province error */ 
    40120: 'Create province error',
    40121: 'ProvinceCode has exsit already',
    40122: 'ProvinceName has exsit already',
    40123: 'Create district error',
    40124: 'DistrictCode has exsit already',
    40125: 'DistrictName has exsit already',
    40126: 'Create ward error',
    40127: 'WardCode has exsit already',
    /* patient error */ 
    40130: 'Create patient error',
    40131: 'Patient has exsit already',
};
