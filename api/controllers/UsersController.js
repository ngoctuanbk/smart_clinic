const util = require('util');
// const LogsService = require('../services/LogsService');
const UserService = require('../services/UsersService');
const RolesService = require('../services/RolesService');
const {
    isEmpty,
    responseSuccess,
    responseError,
    getParamsWriteLog,
    sliceString,
    beforeUpload,
    uploadFile,
    fileFilterImage,
    storage,
    isManagerTypeBoth,
    isManagerTypeDirect,
    isManagerTypeInDirect,
    convertJSONStrToJSONParse,
    resJsonError,
} = require('../libs/shared');
const {
    createValidator,
    listValidator,
} = require('../validators/UsersValidator');

const uploadImage = uploadFile(storage('users', 'images'), fileFilterImage, 'Image');
const Model = 'users';

const {
    ACTION,
} = require('../constants/constants');

const {
    Update,
    Create,
    Delete,
    UpdateStatus,
    ImportFile,
} = ACTION;

// async function getInfoDecoded(decoded, query) {
//     const {
//         Database,
//         UserObjectId: UserObjectIdDecoded,
//         RoleObjectId: RoleObjectIdDecoded,
//     } = decoded;
//     query.Database = Database;
//     query.RoleObjectIdDecoded = RoleObjectIdDecoded;
//     return query;
// }


module.exports = {
    create: async (req, res) => {
        try {
            beforeUpload(req, res, async () => {
                if (!req.file) {
                    req.body.Avatar = '/images/avatar-default.jpg';
                } else {
                    const stringPath = req.file.path.split('\\').join('/');
                    req.body.Avatar = sliceString(stringPath, '/uploads');
                }
                req.body = convertJSONStrToJSONParse(req.body);
                const {UserObjectId } = req.decoded;
                req.body.CreatedBy = UserObjectId;
                req.checkBody(createValidator);
                const errors = req.validationErrors();
                if (errors) {
                    return res.json(responseError(40003, errors));
                }
                const existUserName = await UserService.checkUserName(req.body);
                if (existUserName) {
                    return res.json(responseError(40101));
                }
                const result = await UserService.create(req.body);
                if (!isEmpty(result)) {
                    return res.json(responseSuccess(10110));
                }
                return res.json(responseError(40100));
            }, uploadImage);
        } catch (errors) {
            console.log(response);
            return resJsonError(res, errors, 'user');
        }
    },
    list: async (req, res) => {
        try {
            req.checkQuery(listValidator);
            const errors = req.validationErrors();
            if (errors) {
                return res.json(responseError(40003, errors));
            }
            const result = await UserService.list(req.query);
            const statuses = await UserService.getStatuses(req.query);
            result.CountInactive = statuses.Inactive;
            result.CountActive = statuses.Active;
            result.CountWaitingAccepted = statuses.WaitingAccepted;
            return res.json(responseSuccess(10111, result));
        } catch (errors) {
            console.log(errors)
            return resJsonError(res, errors, 'user');
        }
    },
}