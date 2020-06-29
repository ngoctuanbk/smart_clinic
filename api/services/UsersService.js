const UserModel = require('../models/Users');
const {
    convertToObjectId,
    generatorTime,
    promiseReject,
    promiseResolve,
    formatDateToYMD,
    trimValue,
    escapeRegExp,
    convertToArrayObjectId,
    compareValue,
} = require('../libs/shared');

const {
    STATUS,
    DELETE_FLAG,
} = require('../constants/constants');

module.exports = {
    create: async (data) => {
        try {
            const set = {
                UserName: data.UserName,
                // Password: UsersSchema.methods.generateHashPassword(data.Password),
                Password: data.Password,
                Info: data.Info,
                RoleObjectId: convertToObjectId(data.RoleObjectId),
                RoleCode: data.RoleCode,
                Avatar: data.Avatar || '',
                Email: data.Email || '',
                Mobile: data.Mobile || '',
                Sex: data.Sex,
                DateOfBirth: formatDateToYMD(data.DateOfBirth) || '',
                JoinDate: formatDateToYMD(data.JoinDate) || '',
                Status: data.Status ? STATUS[+data.Status] : STATUS[100],
                CreatedBy: data.CreatedBy,
                CreatedDate: generatorTime(),
            };
            const result = await UserModel.create(set);
            return promiseResolve(result);
        } catch (err) {
            console.log(err);
            return promiseReject(err);
        }
    },
    findOneUserName: async (data) => {
        try {
            const regex = new RegExp(['^', data.UserName, '$'].join(''), 'i');
            const conditions = {
                UserName: regex,
                DeleteFlag: DELETE_FLAG[200],
                Status: STATUS[200],
            };
            const fields = {
                UserName: 1,
                Password: 1,
                UserCode: 1,
                Email: 1,
                Mobile: 1,
                JoinDate: 1,
                Avatar: 1,
                Info: 1,
            };
            const populate = [
                { path: 'RoleObjectId', select: '_id RoleCode RoleName', match: { DeleteFlag: DELETE_FLAG[200] } },
            ];
            const result = await UserModel.findOne(conditions, fields).populate(populate);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    updateExpiresDate: async (data) => {
        try {
            const condition = {
                _id: convertToObjectId(data.UserObjectId),
            };
            const set = {
                ExpiresDate: data.ExpiresDate,
            };
            const result = await UserModel.findOneAndUpdate(condition, set, {
                new: true,
            });
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    getExpiresDate: async (data) => {
        try {
            const conditions = {
                _id: convertToObjectId(data.UserObjectId),
                DeleteFlag: DELETE_FLAG[200],
            };
            const fields = {
                UserName: 1,
                ExpiresDate: 1,
            };
            const result = await UserModel.findOne(conditions, fields).lean().exec();
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    list: async (data) => {
        try {
            const page = +data.Page || 1;
            const limit = +data.Limit || 10;
            const sortKey = data.SortKey || 'CreatedDate';
            const sortOrder = data.SortOrder || -1;
            const search = trimValue(data.Search) || '';
            const status = data.Status ? data.Status : 0;
            const conditions = {
                DeleteFlag: DELETE_FLAG[200],
            };
            if (status) {
                conditions.Status = STATUS[+status];
            }
            if (search) {
                const regex = new RegExp(escapeRegExp(search), 'i');
                conditions.$or = [
                    { UserName: regex }];
            }
            if (data.RoleObjectId) {
                conditions.RoleObjectId = {
                    $in: convertToArrayObjectId(data.RoleObjectId),
                };
            }
            const fieldsSelect = 'UserName Info.FullName Mobile Email Status Avatar';
            const populate = [{
                path: 'RoleObjectId',
                select: '-_id RoleName',
                match: {
                    DeleteFlag: DELETE_FLAG[200],
                },
            }];
            const options = {
                sort: {
                    [sortKey]: sortOrder,
                },
                lean: true,
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                select: fieldsSelect,
                populate: populate,
            };
            const result = UserModel.paginate(conditions, options);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    checkUserName: async (data) => {
        try {
            const conditions = {
                UserName: data.UserName,
            };
            const user = await UserModel.findOne(conditions).exec();
            if (user) {
                if (compareValue(user._id, data.UserObjectId)) {
                    return promiseResolve(false);
                }
                return promiseResolve(true);
            }
            return promiseResolve(false);
        } catch (err) {
            return promiseReject(err);
        }
    },
    listDoctorActive: async (data) => {
        try {
            const conditions = {
                DeleteFlag: DELETE_FLAG[200],
                Status: STATUS[200],
                RoleObjectId: convertToObjectId("5e4032d43973ad2384e10038"),
            };
            const fieldsSelected = '_id Info.FullName UserName';
            const options = {
                sort: {
                    _id: -1,
                },
                lean: true,
                select: fieldsSelected,
            };
            const result = await UserModel.paginate(conditions, options);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    getStatuses: async (data) => {
        try {
            const match = {
                DeleteFlag: DELETE_FLAG[200],
            };
            if (data.RoleObjectId) {
                match.RoleObjectId = {
                    $in: convertToArrayObjectId(data.RoleObjectId),
                };
            }
            const group = {
                _id: '$Status',
                total: { $sum: 1 },
            };
            const project = {
                _id: 0,
                Status: '$_id',
                total: 1,
            };
            const pipeline = [
                { $match: match },
                { $group: group },
                { $project: project },
            ];
            const result = await UserModel.aggregate(pipeline) || [];
            const response = result.reduce((obj, item) => {
                obj[item.Status] += item.total;
                return obj;
            }, {Active: 0, WaitingAccepted: 0, Inactive: 0});
            return promiseResolve(response);
        } catch (err) {
            return promiseReject(err);
        }
    },
    info: async (data) => {
        try {
            const conditions = {
                _id: data.UserObjectId,
                DeleteFlag: DELETE_FLAG[200],
            };
            const fieldsSelected = `_id UserName Email Mobile RoleObjectId Avatar Info JoinDate Status DateOfBirth Sex`;
            const populate = [
                { path: 'RoleObjectId', select: '_id RoleCode RoleName', match: { DeleteFlag: DELETE_FLAG[200] } },
            ];
            const result = await UserModel.findOne(conditions).select(fieldsSelected).populate(populate);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    update: async (data) => {
        try {
            const conditions = {
                _id: data.UserObjectId,
                DeleteFlag: DELETE_FLAG[200],
            };
            const set = {
                UserName: data.UserName,
                Info: data.Info,
                RoleObjectId: convertToObjectId(data.RoleObjectId),
                Email: data.Email || '',
                Mobile: data.Mobile || '',
                Sex: data.Sex,
                DateOfBirth: formatDateToYMD(data.DateOfBirth) || '',
                JoinDate: formatDateToYMD(data.JoinDate) || '',
                Status: data.Status ? STATUS[+data.Status] : STATUS[100],
                UpdatedBy: data.UpdatedBy,
                UpdatedDate: generatorTime(),
            };
            if (data.Avatar) {
                set.Avatar = data.Avatar;
            }
            const result = await UserModel.findOneAndUpdate(conditions, set, {
                new: true,
            });
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    getUser: async (data) => {
        try {
            const match = {
                DeleteFlag: DELETE_FLAG[200],
            };
            const group = {
                _id: '$RoleCode',
                total: { $sum: 1 },
            };
            const project = {
                _id: 0,
                RoleCode: '$_id',
                total: 1,
            };
            const pipeline = [
                { $match: match },
                { $group: group },
                { $project: project },
            ];
            const result = await UserModel.aggregate(pipeline) || [];
            const response = result.reduce((obj, item) => {
                obj[item.RoleCode] += item.total;
                return obj;
            }, {AdminSystem: 0, Doctor: 0, Nurse: 0, Pharmasist: 0});
            return promiseResolve(response);
        } catch (err) {
            return promiseReject(err);
        }
    },
    updateStatus: async (data) => {
        try {
            const conditions = {
                _id: data.UserObjectId,
                DeleteFlag: DELETE_FLAG[200],
            };
            const set = {
                Status: STATUS[+data.Status],
                UpdatedDate: generatorTime(),
                UpdatedBy: data.UpdatedBy,
            };
            const result = await UserModel.findOneAndUpdate(conditions, set, { new: true });
            return promiseResolve(result);
        } catch (err) {
            console.log(err)
            return promiseReject(err);
        }
    },
    delete: async (data) => {
        try {
            const conditions = {
                _id: data.UserObjectId,
                DeleteFlag: DELETE_FLAG[200],
            };
            const set = {
                DeleteFlag: DELETE_FLAG[300],
                UpdatedDate: generatorTime(),
                UpdatedBy: data.UpdatedBy,
            };
            const result = await UserModel.findOneAndUpdate(conditions, set, { new: true });
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    updateAvatar: async (data) => {
        try {
            const conditions = {
                _id: convertToObjectId(data.UserObjectId),
                DeleteFlag: DELETE_FLAG[200],
            };
            const set = {
                UpdatedBy: data.UpdatedBy,
                UpdatedDate: generatorTime(),
            };
            if (data.Avatar) {
                set.Avatar = data.Avatar;
            }
            const result = await UserModel.findOneAndUpdate(conditions, set);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    listExport: async (data) => {
        try {
            const sortKey = data.SortKey ? data.SortKey : 'CreatedDate';
            const sortOrder = data.SortOrder ? data.SortOrder : -1;
            const conditions = {
                DeleteFlag: DELETE_FLAG[200],
            };
            const fieldsSelect = 'UserName Info.FullName Mobile Email Status DateOfBirth JoinDate Sex Info.Passport Info.Address';
            const populate = [{
                path: 'RoleObjectId',
                select: '-_id RoleName',
                match: {
                    DeleteFlag: DELETE_FLAG[200],
                },
            }];
            const options = {
                sort: {
                    [sortKey]: sortOrder,
                },
                select: fieldsSelect,
                populate: populate,
            };
            const result = UserModel.paginate(conditions, options);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
};
