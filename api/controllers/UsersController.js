const util = require('util');
// const LogsService = require('../services/LogsService');
const UserService = require('../services/UsersService');
const RolesService = require('../services/RolesService');
const {
    isEmpty,
    responseSuccess,
    responseError,
    sliceString,
    beforeUpload,
    uploadFile,
    fileFilterImage,
    storage,
    deleteFile,
    convertJSONStrToJSONParse,
    resJsonError,
} = require('../libs/shared');
const {
    createValidator,
    listValidator,
    UserObjectIdValidator,
    updateValidator,
    updateStatusValidator
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
    listDoctorActive: async (req, res) => {
        try {
            const result = await UserService.listDoctorActive(req.query);
            return res.json(responseSuccess(10111, result));
        } catch (errors) {
            console.log(errors)
            return resJsonError(res, errors, 'user');
        }
    },
    getInfo: async (req, res) => {
        try {
            req.checkQuery(UserObjectIdValidator);
            const errors = req.validationErrors();
            if (errors) {
                return res.json(responseError(40003, errors));
            }
            req.query.Database = req.decoded.Database;
            const result = await UserService.info(req.query);
            if (!isEmpty(result)) {
                const response = {};
                response.Sex = result.Sex;
                response.Info = result.Info;
                response.Status = result.Status;
                response.UserName = result.UserName;
                response.Email = result.Email;
                response.Mobile = result.Mobile;
                response._id = result._id;
                response.Avatar = result.Avatar;
                response.JoinDate = result.JoinDate;
                response.DateOfBirth = result.DateOfBirth;
                response.RoleObjectId = result.RoleObjectId._id;
                response.RoleCode = result.RoleObjectId.RoleCode;
                response.RoleName = result.RoleObjectId.RoleName;
                return res.json(responseSuccess(10112, response));
            }
            return res.json(responseError(40103));
        } catch (errors) {
            return resJsonError(res, errors, 'user');
        }
    },
    update: async (req, res) => {
        try {
            beforeUpload(req, res, async () => {
                if (req.file) {
                    const stringPath = req.file.path.split('\\').join('/');
                    req.body.Avatar = sliceString(stringPath, '/uploads');
                }
                req.body = convertJSONStrToJSONParse(req.body);
                const {UserObjectId } = req.decoded;
                req.body.CreatedBy = UserObjectId;
                req.checkBody(updateValidator);
                const errors = req.validationErrors();
                if (errors) {
                    return res.json(responseError(40003, errors));
                }
                const result = await UserService.update(req.body);
                if (!isEmpty(result)) {
                    return res.json(responseSuccess(10113));
                }
                return res.json(responseError(40104));
            }, uploadImage);
        } catch (errors) {
            console.log(response);
            return resJsonError(res, errors, 'user');
        }
    },
    getUser: async (req, res) => {
        try {
            const count = {};
            const result = await UserService.getUser(req.query);
            count.CountDoctor = result.Doctor;
            count.CountAdmin = result.AdminSystem;
            count.CountNurse = result.Nurse;
            count.CountPharmasist = result.Pharmasist;
            return res.json(responseSuccess(10141, count));
        } catch (errors) {
            return resJsonError(res, errors, 'patient');
        }
    },
    updateStatus: async (req, res) => {
        try {
            req.checkBody(updateStatusValidator);
            const errors = req.validationErrors();
            if (errors) {
                return res.json(responseError(40003, errors));
            }
            req.body.UpdatedBy = req.decoded.UserObjectId;
            const result = await UserService.updateStatus(req.body);
            if (!isEmpty(result)) {
                return res.json(responseSuccess(10123));
            }
            return res.json(responseError(40113));
        } catch (errors) {
            console.log(errors)
            return resJsonError(res, errors, 'user');
        }
    },
    delete: async (req, res) => {
        try {
            req.checkBody(UserObjectIdValidator);
            const errors = req.validationErrors();
            if (errors) {
                return res.json(responseError(40003, errors));
            }
            req.body.UpdateBy = req.decoded.UserObjectId;
            const result = await UserService.delete(req.body);
            if (!isEmpty(result)) {
                return res.json(responseSuccess(10124));
            }
            return res.json(responseError(40114));
        } catch (errors) {
            return resJsonError(res, errors, 'user');
        }
    },
    updateAvatar: async (req, res) => {
        beforeUpload(req, res, async () => {
            function deleteImage() {
                req.file && deleteFile(req.file.path);
            }
            try {
                if (req.file) {
                    const stringPath = req.file.path.split('\\').join('/');
                    req.body.Avatar = sliceString(stringPath, '/uploads');
                }
                req.checkBody(UserObjectIdValidator);
                const errors = req.validationErrors();
                if (errors) {
                    deleteImage();
                    return res.json(responseError(40003, errors));
                }
                req.body.Database = req.decoded.Database;
                req.body.UpdatedBy = req.decoded.UserObjectId;
                const result = await UserService.updateAvatar(req.body);
                if (!isEmpty(result)) {
                    const pathAvatarOld = `./public${result.Avatar}`;
                    deleteFile(pathAvatarOld);
                    return res.json(responseSuccess(10113));
                }
                deleteImage();
                return res.json(responseError(40104));
            } catch (errors) {
                deleteImage();
                return resJsonError(res, errors, 'user');
            }
        }, uploadImage);
    },
    exportFile: async (req, res) => {
        try {
            const result = await UserService.listExport(req.query);
            return res.json(responseSuccess(10111, result));
        } catch (errors) {
            console.log(errors)
            return resJsonError(res, errors, 'user');
        }
    },
}