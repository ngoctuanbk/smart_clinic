/* eslint-disable quotes */
const util = require('util');
const RoleModel = require('../models/Roles');
const { DELETE_FLAG} = require('../constants/constants');
const {
    promiseReject,
    promiseResolve,
    convertToObjectId,
} = require('../libs/shared');

module.exports = {
    create: async (data) => {
        try {
            const set = {};
            set.RoleCode = data.RoleCode;
            set.RoleName = data.RoleName;
            const result = await RoleModel.create(set);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    findOneRole: async (data) => {
        try {
            const conditions = {};
            conditions.DeleteFlag = DELETE_FLAG[200];
            conditions._id = convertToObjectId(data.RoleObjectId);
            const fields = {
                RoleCode: 1, RoleName: 1
            };
            const resData = await RoleModel.findOne(conditions, fields).sort({ Order: 1 });
            return promiseResolve(flatten(resData.Children));
        } catch (err) {
            return promiseReject(err);
        }
    },
    listActive: async (data) => {
        try {
            const conditions = {DeleteFlag: DELETE_FLAG[200]};
            const fields = {
                _id: 1, RoleName: 1
            };
            const result = await RoleModel.find(conditions).select(fields).sort({Order: 1});
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
};
