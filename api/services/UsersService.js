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
    // update: async (data) => {
    //     try {
    //         const conn = connectDatabase(data.Database);
    //         const UserModel = conn.model('users', UsersSchema);
    //         const conditions = {
    //             _id: data.UserObjectId,
    //             DeleteFlag: DELETE_FLAG[200],
    //         };
    //         const set = {
    //             DeviceID: data.DeviceID || '',
    //             RoleObjectId: convertToObjectId(data.RoleObjectId),
    //             ManagerType: data.ManagerType || 'Both',
    //             Info: data.Info,
    //             Email: data.Email || '',
    //             Mobile: data.Mobile || '',
    //             Location: {
    //                 Lat: data.Location && data.Location.Lat ? data.Location.Lat : '',
    //                 Long: data.Location && data.Location.Long ? data.Location.Long : '',
    //             },
    //             Ancestors: !isEmpty(data.Ancestors) ? uniqArray(convertToArrayObjectId(data.Ancestors)) : [],
    //             ParentObjectId: data.ParentObjectId ? data.ParentObjectId : null,
    //             Branches: !isEmpty(data.Branches) ? uniqArray(convertToArrayObjectId(data.Branches)) : [],
    //             Categories: !isEmpty(data.Categories) ? uniqArray(convertToArrayObjectId(data.Categories)) : [],
    //             Channels: !isEmpty(data.Channels) ? uniqArray(convertToArrayObjectId(data.Channels)) : [],
    //             Areas: !isEmpty(data.Areas) ? uniqArray(convertToArrayObjectId(data.Areas)) : [],
    //             Note: data.Note || '',
    //             JoinDate: formatDateToYMD(data.JoinDate) || '',
    //             Status: data.Status ? STATUS[+data.Status] : STATUS[100],
    //             UpdatedBy: data.UpdatedBy,
    //             CountryObjectId: convertToObjectId(data.CountryObjectId),
    //             UpdatedDate: generatorTime(),
    //         };
    //         if (data.Avatar) {
    //             set.Avatar = data.Avatar;
    //         }
    //         const result = await UserModel.findOneAndUpdate(conditions, set, {
    //             new: true,
    //         });
    //         return promiseResolve(result);
    //     } catch (err) {
    //         return promiseReject(err);
    //     }
    // },
    // updateAvatar: async (data) => {
    //     try {
    //         const conn = connectDatabase(data.Database); // eslint-disable-line
    //         const UserModel = conn.model('users', UsersSchema);
    //         const conditions = {
    //             _id: convertToObjectId(data.UserObjectId),
    //             DeleteFlag: DELETE_FLAG[200],
    //         };
    //         const set = {
    //             UpdatedBy: data.UpdatedBy,
    //             UpdatedDate: generatorTime(),
    //         };
    //         if (data.Avatar) {
    //             set.Avatar = data.Avatar;
    //         }
    //         const result = await UserModel.findOneAndUpdate(conditions, set);
    //         return promiseResolve(result);
    //     } catch (err) {
    //         return promiseReject(err);
    //     }
    // },
    // info: async (data) => {
    //     try {
    //         const conn = connectDatabase(data.Database);
    //         const UserModel = conn.model('users', UsersSchema);
    //         conn.model('areas', AreaSchema);
    //         const conditions = {
    //             _id: data.UserObjectId,
    //             DeleteFlag: DELETE_FLAG[200],
    //         };
    //         const fieldsSelected = `_id UserName ManagerType Email Mobile DeviceID RoleObjectId Avatar Info 
    //         Ancestors Branches Areas Channels Categories ParentObjectId Note JoinDate Status UserCode`;
    //         const populate = [
    //             { path: 'RoleObjectId', select: '_id RoleCode RoleName Children', match: { DeleteFlag: DELETE_FLAG[200] } },
    //             { path: 'Areas', select: '_id AreaName AreaCode', match: { DeleteFlag: DELETE_FLAG[200] } },
    //             { path: 'Branches', select: '_id BranchName BranchCode', match: { DeleteFlag: DELETE_FLAG[200] } },
    //             { path: 'Channels', select: '_id ChannelName ChannelCode', match: { DeleteFlag: DELETE_FLAG[200] } },
    //             { path: 'Categories', select: '_id CategoryName CategoryCode', match: { DeleteFlag: DELETE_FLAG[200] } },
    //             { path: 'ParentObjectId', select: '_id Info UserName Mobile Email', match: { DeleteFlag: DELETE_FLAG[200] } },
    //         ];
    //         const result = await UserModel.findOne(conditions).select(fieldsSelected).populate(populate);
    //         return promiseResolve(result);
    //     } catch (err) {
    //         return promiseReject(err);
    //     }
    // },
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
            const fieldsSelect = 'UserName Info.FullName Mobile Email Status';
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
    // listByRole: async (data) => {
    //     try {
    //         const conditions = {};
    //         if (compareValue(data.RoleObjectId, data.RoleObjectIdDecoded)) {
    //             // neu role dang nhap bang voi role truyen vao thi chi lay user hien tai
    //             conditions._id = data.UserObjectIdDecoded;
    //         } else {
    //             Object.assign(conditions, conditionsFilter);
    //         }
    //         conditions.RoleObjectId = data.RoleObjectId;
    //         conditions.DeleteFlag = DELETE_FLAG[200];
    //         if (data.Status) {
    //             conditions.Status = {};
    //             conditions.Status.$in = [STATUS[+data.Status]];
    //         }
    //         const fieldsSelected = '_id Info.FullName';
    //         const populate = [{
    //             path: 'RoleObjectId',
    //             select: '-_id RoleName',
    //             match: {
    //                 DeleteFlag: DELETE_FLAG[200],
    //             },
    //         }];
    //         const result = await Users.find(conditions).select(fieldsSelected).populate(populate).sort({_id: -1});
    //         return promiseResolve(result);
    //     } catch (err) {
    //         return promiseReject(err);
    //     }
    // },
    // listUsersByAncestors: async (data) => {
    //     try {
    //         const conn = connectDatabase(data.Database);
    //         const Users = conn.model('users', UsersSchema);
    //         const conditions = {
    //             DeleteFlag: DELETE_FLAG[200],
    //             Ancestors: {
    //                 $in: data.Ancestors,
    //             }, // data.Ancestors is array
    //         };
    //         if (data.RoleObjectId) {
    //             conditions.RoleObjectId = {
    //                 $in: data.RoleObjectId,
    //             };
    //         }
    //         const fieldsSelected = '_id';
    //         const result = await Users.find(conditions).select(fieldsSelected);
    //         return promiseResolve(result);
    //     } catch (err) {
    //         return promiseReject(err);
    //     }
    // },
    // updateStatus: async (data) => {
    //     try {
    //         const conn = connectDatabase(data.Database);
    //         const Users = conn.model('users', UsersSchema);
    //         const conditions = {
    //             _id: data.UserObjectId,
    //             DeleteFlag: DELETE_FLAG[200],
    //         };
    //         const set = {
    //             Status: STATUS[+data.Status],
    //             UpdatedDate: generatorTime(),
    //             UpdatedBy: data.UpdatedBy,
    //         };
    //         const result = await Users.findOneAndUpdate(conditions, set, {
    //             new: true,
    //         });
    //         return promiseResolve(result);
    //     } catch (err) {
    //         return promiseReject(err);
    //     }
    // },
    // delete: async (data) => {
    //     try {
    //         const conn = connectDatabase(data.Database);
    //         const Users = conn.model('users', UsersSchema);
    //         const conditions = {
    //             _id: data.UserObjectId,
    //             DeleteFlag: DELETE_FLAG[200],
    //         };
    //         const set = {
    //             DeleteFlag: DELETE_FLAG[300],
    //             UpdatedDate: generatorTime(),
    //             UpdatedBy: data.UpdatedBy,
    //         };
    //         const result = await Users.findOneAndUpdate(conditions, set, {
    //             new: true,
    //         });
    //         return promiseResolve(result);
    //     } catch (err) {
    //         return promiseReject(err);
    //     }
    // },
    // listExport: async (data) => {
    //     try {
    //         const conn = connectDatabase(data.Database);
    //         const Users = conn.model('users', UsersSchema);
    //         conn.model('branches', BranchesSchema);
    //         conn.model('channels', ChannelsSchema);
    //         conn.model('categories', CategoriesSchema);
    //         conn.model('areas', AreaSchema);
    //         const sortKey = data.SortKey ? data.SortKey : 'CreatedDate';
    //         const sortOrder = data.SortOrder ? data.SortOrder : -1;
    //         const query = filterConditionsByRole(data);
    //         query.DeleteFlag = DELETE_FLAG[200];
    //         if (!isEmpty(data.Channels)) {
    //             query.Channels = {
    //                 $in: convertToArrayObjectId(data.Channels),
    //             };
    //         }
    //         if (!isEmpty(data.Areas)) {
    //             query.Areas = {
    //                 $in: convertToArrayObjectId(data.Areas),
    //             };
    //         }
    //         if (!isEmpty(data.Categories)) {
    //             query.Categories = {
    //                 $in: convertToArrayObjectId(data.Categories),
    //             };
    //         }
    //         if (!isEmpty(data.Branches)) {
    //             query.Branches = {
    //                 $in: convertToArrayObjectId(data.Branches),
    //             };
    //         }
    //         if (!isEmpty(data.Roles)) {
    //             query.RoleObjectId = {
    //                 $in: convertToArrayObjectId(data.Roles),
    //             };
    //         }
    //         const populate = [
    //             { path: 'ParentObjectId', select: '-_id Info.FullName UserCode', match: { DeleteFlag: DELETE_FLAG[200] }},
    //             { path: 'RoleObjectId', select: '-_id RoleName', match: { DeleteFlag: DELETE_FLAG[200] }},
    //             {
    //                 path: 'Branches', select: '-_id BranchCode BranchName', match: { DeleteFlag: DELETE_FLAG[200] },
    //             },
    //             {
    //                 path: 'Channels', select: '-_id ChannelCode ChannelName', match: { DeleteFlag: DELETE_FLAG[200] },
    //             },
    //             {
    //                 path: 'Categories', select: '-_id CategoryCode CategoryName', match: { DeleteFlag: DELETE_FLAG[200] },
    //             },
    //             { path: 'Areas', select: '-_id AreaName AreaCode', match: {DeleteFlag: DELETE_FLAG[200]}},
    //         ];
    //         const fields = '-_id UserName Info Email Mobile UserCode JoinDate CreatedDate DeviceID Note Status';
    //         const result = await Users.find(query).select(fields).populate(populate).sort({
    //             [sortKey]: sortOrder,
    //         });
    //         return promiseResolve(result);
    //     } catch (err) {
    //         return promiseReject(err);
    //     }
    // },
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
    // findByObjectId: async (data) => {
    //     try {
    //         const conn = connectDatabase(data.Database);
    //         const Users = conn.model('users', UsersSchema);
    //         const conditions = {
    //             DeleteFlag: DELETE_FLAG[200],
    //             _id: data.UserObjectId,
    //         };
    //         const fieldsSelected = '_id Info.FullName Ancestors Channels Branches Categories';
    //         const populate = [{
    //             path: 'RoleObjectId',
    //             select: '-_id RoleCode',
    //         }];
    //         const result = await Users.findOne(conditions).select(fieldsSelected).populate(populate);
    //         return promiseResolve(result);
    //     } catch (err) {
    //         return promiseReject(err);
    //     }
    // },
    // findByUserName: async (data) => {
    //     try {
    //         const conn = connectDatabase(data.Database);
    //         const Users = conn.model('users', UsersSchema);
    //         const conditions = {
    //             DeleteFlag: DELETE_FLAG[200],
    //             UserName: data.UserName,
    //         };
    //         const Language = data.Language || LANGUAGE[100];
    //         const populate = [{
    //             path: 'RoleObjectId',
    //             select: {
    //                 _id: 0,
    //                 RoleCode: 1,
    //                 Info: {
    //                     $elemMatch: {
    //                         Language,
    //                     },
    //                 },
    //             },
    //             match: {
    //                 Status: {
    //                     $ne: 'Deleted',
    //                 },
    //             },
    //         }];
    //         const fieldsSelected = '_id Ancestors Status Categories Channels Branches';
    //         const result = await Users.findOne(conditions).select(fieldsSelected).populate(populate);
    //         return promiseResolve(result);
    //     } catch (err) {
    //         return promiseReject(err);
    //     }
    // },
    // listActive: async (data) => {
    //     try {
    //         const conn = connectDatabase(data.Database);
    //         const Users = conn.model('users', UsersSchema);
    //         const search = trimValue(data.Search);
    //         const page = data.Page ? +data.Page : 1;
    //         const conditions = {
    //             Status: STATUS[200],
    //             DeleteFlag: DELETE_FLAG[200],
    //         };
    //         if (search) {
    //             const regex = RegExpSearch(search);
    //             conditions.$or = [{
    //                 'Info.FullName': regex,
    //             }];
    //         }
    //         const Language = data.Language || LANGUAGE[100];
    //         const populate = [{
    //             path: 'RoleObjectId',
    //             select: {
    //                 _id: 0,
    //                 RoleCode: 1,
    //                 Info: {
    //                     $elemMatch: {
    //                         Language,
    //                     },
    //                 },
    //             },
    //             match: {
    //                 Status: {
    //                     $ne: 'Deleted',
    //                 },
    //             },
    //         }];
    //         const fieldsSelected = '_id Info.FullName';
    //         const options = {
    //             page,
    //             limit: 20,
    //             select: fieldsSelected,
    //             populate,
    //         };
    //         const result = await Users.paginate(conditions, options);
    //         return promiseResolve(result);
    //     } catch (err) {
    //         return promiseReject(err);
    //     }
    // },
    // updateImportFile: async (data) => {
    //     try {
    //         const conn = connectDatabase(data.Database);
    //         const UserModel = conn.model('users', UsersSchema);
    //         const conditions = {
    //             UserName: data.UserName,
    //         };
    //         const set = {
    //             RoleObjectId: data.RoleObjectId,
    //             Info: data.Info,
    //             Ancestors: data.Ancestors || [],
    //             Branches: data.Branches || [],
    //             Categories: data.Categories || [],
    //             Channels: data.Channels || [],
    //             Areas: data.Areas || [],
    //             Status: data.Status,
    //             UpdatedBy: data.UpdatedBy,
    //             UpdatedDate: generatorTime(),
    //         };
    //         ('DeviceID' in data) && (set.DeviceID = data.DeviceID);
    //         ('ManagerType' in data) && (set.ManagerType = data.ManagerType);
    //         ('Email' in data) && (set.Email = data.Email || '');
    //         ('Email' in data) && (set.Email = data.Email || '');
    //         ('Mobile' in data) && (set.Mobile = data.Mobile || '');
    //         ('JoinDate' in data) && (set.JoinDate = data.JoinDate || '');
    //         const result = await UserModel.update(conditions, set, {
    //             new: true,
    //         });
    //         return promiseResolve(result);
    //     } catch (err) {
    //         return promiseReject(err);
    //     }
    // },
    // listInfo: async (data) => {
    //     try {
    //         const conn = connectDatabase(data.Database);
    //         const Users = conn.model('users', UsersSchema);
    //         const fieldsSelected = '-_id Email Info Mobile UserCode UserName';
    //         const result = await Users.find().select(fieldsSelected);
    //         return promiseResolve(result);
    //     } catch (err) {
    //         return promiseReject(err);
    //     }
    // },
    // listActiveByRoleObjectId: async (data) => {
    //     try {
    //         const conn = connectDatabase(data.Database);
    //         const Users = conn.model('users', UsersSchema);
    //         const page = data.Page ? +data.Page : 1;
    //         let search = data.Search ? data.Search : '';
    //         const conditions = {
    //             DeleteFlag: DELETE_FLAG[200],
    //             Status: STATUS[200],
    //             RoleObjectId: {
    //                 $in: data.ParentObjectId,
    //             },
    //         };
    //         if (search) {
    //             search = escapeRegExp(search);
    //             const regex = new RegExp(search, 'i');
    //             conditions.$or = [{
    //                 Info: regex,
    //             }];
    //         }
    //         const fieldsSelected = '_id Info.FullName Channels Categories';
    //         const populate = [{
    //             path: 'RoleObjectId',
    //             select: {
    //                 _id: 0,
    //                 RoleCode: 1,
    //                 RoleName: 1,
    //             },
    //             match: {
    //                 DeleteFlag: DELETE_FLAG[200],
    //             },
    //         }];
    //         const options = {
    //             sort: {
    //                 _id: -1,
    //             },
    //             lean: true,
    //             page,
    //             limit: 100,
    //             select: fieldsSelected,
    //             populate,
    //         };
    //         const result = await Users.paginate(conditions, options);
    //         return promiseResolve(result);
    //     } catch (err) {
    //         return promiseReject(err);
    //     }
    // },
    // changePassword: async (data) => {
    //     try {
    //         const conn = connectDatabase(data.Database);
    //         const UserModel = conn.model('users', UsersSchema);
    //         const conditions = {
    //             UserName: data.UserName,
    //             DeleteFlag: DELETE_FLAG[200],
    //         };
    //         const set = {
    //             Password: UsersSchema.methods.generateHashPassword(data.Password),
    //             UpdatedBy: data.UpdatedBy,
    //             UpdatedDate: generatorTime(),
    //         };
    //         const result = await UserModel.update(conditions, set, {
    //             new: true,
    //         });
    //         return promiseResolve(result);
    //     } catch (err) {
    //         return promiseReject(err);
    //     }
    // },
    // /* mobile */
    // updateMobile: async (data) => {
    //     try {
    //         const conn = connectDatabase(data.Database);
    //         const UserModel = conn.model('users', UsersSchema);
    //         const conditions = {
    //             _id: data.UserObjectId,
    //             DeleteFlag: DELETE_FLAG[200],
    //         };
    //         const set = {
    //             'Info.FullName': data.Info.FullName,
    //             'Info.Address': data.Info.Address || '',
    //             Email: data.Email || '',
    //             Mobile: data.Mobile || '',
    //             UpdatedBy: data.UpdatedBy,
    //             UpdatedDate: generatorTime(),
    //         };
    //         if (data.Avatar) {
    //             set.Avatar = data.Avatar;
    //         }
    //         const result = await UserModel.findOneAndUpdate(conditions, set, {
    //             new: true,
    //         });
    //         return promiseResolve(result);
    //     } catch (err) {
    //         return promiseReject(err);
    //     }
    // },
    // createMany: async (data) => {
    //     try {
    //         const conn = connectDatabase(data.Database);
    //         const Users = conn.model('users', UsersSchema);
    //         const recordsAdded = data.records;
    //         const result = await Users.create(recordsAdded);
    //         return promiseResolve(result);
    //     } catch (err) {
    //         return promiseReject(err);
    //     }
    // },
    // listUserByManager: async (data) => {
    //     try {
    //         const conn = connectDatabase(data.Database);
    //         const Users = conn.model('users', UsersSchema);
    //         conn.model('areas', AreaSchema);
    //         conn.model('Branches', BranchesSchema);
    //         conn.model('Channels', ChannelsSchema);
    //         conn.model('Categories', CategoriesSchema);
    //         const page = data.Page ? +data.Page : 1;
    //         const limit = data.Limit ? +data.Limit : 1000;
    //         const sortKey = data.SortKey ? data.SortKey : 'CreatedDate';
    //         const sortOrder = data.SortOrder ? data.SortOrder : -1;
    //         let search = data.Search ? data.Search : '';
    //         const conditions = {
    //             DeleteFlag: DELETE_FLAG[200],
    //             _id: convertToArrayObjectId(data.UserObjectIds),
    //         };

    //         if (!isEmpty(search)) {
    //             search = RegExpSearch(search);
    //             conditions.$or = [
    //                 {
    //                     UserName: search,
    //                 }, {
    //                     'Info.FullName': search,
    //                 },
    //             ];
    //         }

    //         const fields = {
    //             UserName: 1,
    //             UserCode: 1,
    //             Email: 1,
    //             Mobile: 1,
    //             JoinDate: 1,
    //             DeviceID: 1,
    //             Info: 1,
    //             Avatar: 1,
    //             Status: 1,
    //         };
    //         const populate = [
    //             { path: 'RoleObjectId', select: '_id RoleCode RoleName Children', match: { DeleteFlag: DELETE_FLAG[200] } },
    //             { path: 'Areas', select: '_id AreaName AreaCode', match: { DeleteFlag: DELETE_FLAG[200] } },
    //             { path: 'Branches', select: '_id BranchName BranchCode', match: { DeleteFlag: DELETE_FLAG[200] } },
    //             { path: 'Channels', select: '_id ChannelName ChannelCode', match: { DeleteFlag: DELETE_FLAG[200] } },
    //             { path: 'Categories', select: '_id CategoryName CategoryCode', match: { DeleteFlag: DELETE_FLAG[200] } },
    //             { path: 'ParentObjectId', select: '_id Info UserName Mobile Email', match: { DeleteFlag: DELETE_FLAG[200] } },
    //         ];

    //         const options = {
    //             select: fields,
    //             sort: {
    //                 [sortKey]: sortOrder,
    //             },
    //             populate: populate,
    //             lean: true,
    //             page,
    //             limit,
    //         };
    //         const result = await Users.paginate(conditions, options);
    //         return promiseResolve(result);
    //     } catch (err) {
    //         return promiseReject(err);
    //     }
    // },
    // changePasswordForMobile: async (data) => {
    //     try {
    //         const conn = connectDatabase(data.Database);
    //         const UserModel = conn.model('users', UsersSchema);
    //         const conditions = {
    //             _id: data.UserObjectId,
    //             DeleteFlag: DELETE_FLAG[200],
    //         };
    //         const set = {
    //             Password: UsersSchema.methods.generateHashPassword(data.Password),
    //             UpdatedBy: data.UpdatedBy,
    //             UpdatedDate: generatorTime(),
    //         };
    //         const result = await UserModel.update(conditions, set, {
    //             new: true,
    //         });
    //         return promiseResolve(result);
    //     } catch (err) {
    //         return promiseReject(err);
    //     }
    // },
    // findByUser: async (data) => {
    //     try {
    //         const conn = connectDatabase(data.Database);
    //         const Users = conn.model('users', UsersSchema);
    //         const conditions = {
    //             _id: convertToObjectId(data.UserObjectId),
    //             RoleObjectId: convertToObjectId(data.RoleObjectId),
    //             DeleteFlag: DELETE_FLAG[200],
    //         };
    //         const fields = '_id Info.FullName Ancestors Channels Branches Categories RoleObjectId';
    //         const result = await Users.findOne(conditions, fields);
    //         return promiseResolve(result);
    //     } catch (err) {
    //         return promiseReject(err);
    //     }
    // },
    // countStatus: async (data) => {
    //     try {
    //         const conn = connectDatabase(data.Database);
    //         const Users = conn.model('users', UsersSchema);
    //         const status = data.Status ? data.Status : 0;
    //         const query = {
    //             DeleteFlag: DELETE_FLAG[200],
    //         };
    //         if (status !== 0) {
    //             query.Status = STATUS[status];
    //         }
    //         if (!isEmpty(data.Children)) {
    //             query.RoleObjectId = {
    //                 $in: convertToArrayObjectId(data.Children),
    //             };
    //         }
    //         if (data.ManagerType === 'Both') {
    //             const orConditions = []; const andConditions = [];
    //             if (isEmpty(data.Ancestors)) {
    //                 orConditions.push({
    //                     Ancestors: {
    //                         $in: convertToArrayObjectId(data.UserObjectId),
    //                     },
    //                 });
    //             }
    //             if (!isEmpty(data.Channels)) {
    //                 andConditions.push({
    //                     Channels: {
    //                         $in: convertToArrayObjectId(data.Channels),
    //                     },
    //                 });
    //             }
    //             if (!isEmpty(data.Categories)) {
    //                 andConditions.push({
    //                     Categories: {
    //                         $in: convertToArrayObjectId(data.Categories),
    //                     },
    //                 });
    //             }
    //             if (!isEmpty(data.Branches)) {
    //                 andConditions.push({
    //                     Branches: {
    //                         $in: convertToArrayObjectId(data.Branches),
    //                     },
    //                 });
    //             }
    //             if (!isEmpty(andConditions)) {
    //                 orConditions.push({
    //                     $and: andConditions,
    //                 });
    //             }
    //             query.$or = orConditions;
    //         } else if (data.ManagerType === 'Direct') {
    //             if (isEmpty(data.Ancestors)) {
    //                 query.Ancestors = {
    //                     $in: convertToArrayObjectId(data.UserObjectId),
    //                 };
    //             }
    //         } else {
    //             if (!isEmpty(data.Channels)) {
    //                 query.Channels = {
    //                     $in: convertToArrayObjectId(data.Channels),
    //                 };
    //             }
    //             if (!isEmpty(data.Categories)) {
    //                 query.Categories = {
    //                     $in: convertToArrayObjectId(data.Categories),
    //                 };
    //             }
    //             if (!isEmpty(data.Branches)) {
    //                 query.Branches = {
    //                     $in: convertToArrayObjectId(data.Branches),
    //                 };
    //             }
    //         }
    //         const result = await Users.countDocuments(query);
    //         return promiseResolve(result);
    //     } catch (err) {
    //         return promiseReject(err);
    //     }
    // },
    // list: async (data) => {
    //     try {
    //         const conn = connectDatabase(data.Database);
    //         const Users = conn.model('users', UsersSchema);
    //         const page = data.Page ? +data.Page : 1;
    //         const limit = data.Limit ? +data.Limit : 10;
    //         const sortKey = data.SortKey ? data.SortKey : 'CreatedDate';
    //         const sortOrder = data.SortOrder ? data.SortOrder : -1;
    //         let search = data.Search ? data.Search : '';
    //         const status = data.Status ? data.Status : 0;
    //         const query = filterConditionsByRole(data);
    //         query.DeleteFlag = DELETE_FLAG[200];
    //         if (status) {
    //             query.Status = STATUS[+status];
    //         }
    //         if (!isEmpty(data.Roles)) {
    //             if (!isEmpty(query.RoleObjectId)) {
    //                 query.RoleObjectId.$in = convertToArrayObjectId(data.Roles);
    //             } else {
    //                 query.RoleObjectId = { $in: convertToArrayObjectId(data.Roles) };
    //             }
    //         }
    //         if (!isEmpty(data.Branches)) {
    //             query.Branches = { $in: convertToArrayObjectId(data.Branches) };
    //         }
    //         if (!isEmpty(search)) {
    //             search = RegExpSearch(search);
    //             if (isEmpty(query.$or)) {
    //                 query.$or = [
    //                     {
    //                         UserName: search,
    //                     }, {
    //                         'Info.FullName': search,
    //                     },
    //                 ];
    //             } else {
    //                 query.$or.map((qr) => {
    //                     qr.$or = [
    //                         {
    //                             UserName: search,
    //                         }, {
    //                             'Info.FullName': search,
    //                         },
    //                     ];
    //                     return qr;
    //                 });
    //             }
    //         }
    //         const populate = [{
    //             path: 'RoleObjectId',
    //             select: { RoleCode: 1, RoleName: 1 },
    //             match: { DeleteFlag: DELETE_FLAG[200]},
    //         }];
    //         const fieldsSelected = 'UserName Email Mobile Info DeviceID Ancestors RoleObjectId Status Branches CreatedDate';
    //         const options = {
    //             select: fieldsSelected,
    //             sort: {
    //                 [sortKey]: sortOrder,
    //             },
    //             populate: populate,
    //             lean: true,
    //             page,
    //             limit,
    //         };
    //         const result = await Users.paginate(query, options);
    //         return promiseResolve(result);
    //     } catch (err) {
    //         return promiseReject(err);
    //     }
    // },
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
    // findAllChildren: async (data) => {
    //     try {
    //         const conn = connectDatabase(data.Database);
    //         const Users = conn.model('users', UsersSchema);
    //         const conditions = filterConditionsByRole(data);
    //         conditions.Status = STATUS[200];
    //         conditions.DeleteFlag = DELETE_FLAG[200];
    //         const fields = '_id UserName Info.FullName RoleObjectId Avatar Email Mobile';
    //         const populate = [
    //             { path: 'RoleObjectId', select: 'RoleName RoleCode' },
    //         ];
    //         const result = await Users.find(conditions, fields).populate(populate).sort({_id: -1});
    //         return promiseResolve(result);
    //     } catch (err) {
    //         return promiseReject(err);
    //     }
    // },
    // updateDeviceID: async (data) => {
    //     try {
    //         const conn = connectDatabase(data.Database);
    //         const UserModel = conn.model('users', UsersSchema);
    //         const conditions = {
    //             _id: data.UserObjectId,
    //             DeleteFlag: DELETE_FLAG[200],
    //         };
    //         const set = {
    //             DeviceID: data.DeviceID.trim(),
    //         };
    //         const result = await UserModel.findOneAndUpdate(conditions, set, {
    //             new: true,
    //         });
    //         return promiseResolve(result);
    //     } catch (err) {
    //         return promiseReject(err);
    //     }
    // },
    // findOneUser: async (data) => {
    //     try {
    //         const conn = connectDatabase(data.Database);
    //         const Users = conn.model('users', UsersSchema);
    //         conn.model('roles', RolesSchema);
    //         const conditions = {
    //             DeleteFlag: DELETE_FLAG[200],
    //         };
    //         if (data.UserCode) {
    //             conditions.UserCode = data.UserCode;
    //         }
    //         const Language = data.Language || LANGUAGE[100];
    //         const populate = [{
    //             path: 'RoleObjectId',
    //             select: {
    //                 _id: 0,
    //                 RoleCode: 1,
    //                 Info: {
    //                     $elemMatch: {
    //                         Language,
    //                     },
    //                 },
    //             },
    //             match: {
    //                 Status: {
    //                     $ne: 'Deleted',
    //                 },
    //             },
    //         }];
    //         const fields = data.FieldsSelected || '_id Categories Status';
    //         const result = await Users.findOne(conditions).select(fields).populate(populate);
    //         return promiseResolve(result);
    //     } catch (err) {
    //         return promiseReject(err);
    //     }
    // },
};
