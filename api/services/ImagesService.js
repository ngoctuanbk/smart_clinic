const ImageModel = require('../models/Images');
const {
    generatorTime,
    promiseReject,
    escapeRegExp,
    trimValue,
    promiseResolve,
    compareValue,
    convertToObjectId,
    isEmpty,
    lookupAggre,
    unwindAggre,
} = require('../libs/shared');
const { STATUS, DELETE_FLAG} = require('../constants/constants');

module.exports = {
    create: async (data) => {
        try {
            const set = {
                ImageCode: data.ImageCode,
                PatientObjectId: data.PatientObjectId,
                Type: data.Type,
                Note: data.Note || '',
                CreatedDate: generatorTime(),
                CreatedBy: data.CreatedBy,
            };
            const result = await ImageModel.create(set);
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
            const conditions = {
                DeleteFlag: DELETE_FLAG[200],
            };
            if (search) {
                const regex = new RegExp(escapeRegExp(search), 'i');
                conditions.$or = [
                    { ImageCode: regex }];
            }
            if (data.Type) {
                conditions.Type = data.Type;
            }
            if (data.PatientObjectId) {
                conditions.PatientObjectId = data.PatientObjectId;
            }
            const fieldsSelect = 'ImageCode Type Status UpdatedDate CreatedDate';
            const populate = [{
                path: 'PatientObjectId',
                select: '_id FullName',
                match: {
                    DeleteFlag: DELETE_FLAG[200],
                },
            },
            {
                path: 'UserObjectId',
                select: '_id Info',
                match: {
                    DeleteFlag: DELETE_FLAG[200],
                },
            },
            {
                path: 'Images',
                select: '_id ImagesDir',
            }
        ];
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
            const result = ImageModel.paginate(conditions, options);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    update: async (data) => {
        try {
            const conditions = {
                _id: data.ImageObjectId,
                DeleteFlag: DELETE_FLAG[200],
            };
            const set = {
                ImageCode: data.ImageCode,
                PatientObjectId: data.PatientObjectId,
                UserObjectId: data.UserObjectId,
                Type: data.Type,
                Note: data.Note || '',
                UpdatedDate: generatorTime(),
                UpdatedBy: data.UpdatedBy,
            };
            if (data.Images) {
                set.$push = {Images: data.Images};
            }
            if (data.ImageObjectIdDeleted) {
                const set1 = {};
                set1.$pullAll = {Images: data.ImageObjectIdDeleted};
                await ImageModel.findOneAndUpdate(conditions, set1, {new: true});
            }
            const result = await ImageModel.findOneAndUpdate(conditions, set, { new: true});
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    checkImageCodeExist: async (data) => {
        try {
            const conditions = {
                ImageCode: data.ImageCode,
            };
            const result = await ImageModel.findOne(conditions);
            if (result) {
                if (compareValue(result._id, data.ImageObjectId)) {
                    return promiseResolve(false);
                }
                return promiseResolve(true);
            }
            return promiseResolve(false);
        } catch (err) {
            return promiseReject(err);
        }
    },
    listByPatient: async (data) => {
        try {
            const search = trimValue(data.Search);
            const page = +data.Page || 1;
            const limit = +data.Limit || 10;
            const skip = (page - 1) * limit;
            const sortKey = data.SortKey || 'CreatedDate';
            const sortOrder = +data.SortOrder || -1;
            const match = {
                DeleteFlag: DELETE_FLAG[200],
                PatientObjectId: convertToObjectId(data.PatientObjectId),
            };
            if (search) {
                const regex = new RegExp(escapeRegExp(search), 'i');
                conditions.$or = [
                    { ImageCode: regex }];
            }
            const pipelineCount = [
                {$match: match},
                {$group: 
                    {_id: {$substr: ['$CreatedDate', 0, 10]}}
                },
                {$count: 'total'},
            ];
            const resultCount = await ImageModel.aggregate(pipelineCount) || [];
            const totalRecord = !isEmpty(resultCount) ? resultCount[0].total : 0;
            const pages = Math.ceil(totalRecord / limit);
            const response = {
                docs: [],
                total: totalRecord,
                limit,
                page,
                pages,
            };
            if (!isEmpty(totalRecord)) {
                const pipeline = [
                    {$match: match},
                    {
                        $sort: {
                            [sortKey]: sortOrder,
                        },
                    },
                ];
                const fieldsPushed = {
                    ImageObjectId: '$_id',
                    ImageCode: '$ImageCode',
                    Status: '$Status',
                    UpdatedDate: '$UpdatedDate',
                    Type: '$Type',
                    User: '$User.Info.FullName',
                    Image: '$Image.ImagesDir'
                };
                const group = {
                    _id: {
                        CreatedDate: {$substr: ['$CreatedDate', 0, 10]},
                    },
                    Images: {
                        $push: fieldsPushed,
                    },
                };
                const lookupUser = lookupAggre('users', 'UserObjectId', '_id', 'User');
                const unwindUser = unwindAggre('$User');
                const lookupImage = lookupAggre('photos', 'Images', '_id', 'Image');
                const project = {
                    _id: 0,
                    CreatedDate: '$_id.CreatedDate',
                    Images: 1,
                };
                pipeline.push(
                    {$lookup: lookupUser},
                    {$lookup: lookupImage},
                    {$group: group},
                    {$unwind: unwindUser},
                    {$project: project},
                    {$skip: skip },
                    {$limit: limit},
                );
                console.log(pipeline)
                const result = await ImageModel.aggregate(pipeline);
                response.docs = result;
            }
            return promiseResolve(response);
        } catch (err) {
            return promiseReject(err);
        }
    },
    updateStatus: async (data) => {
        try {
            const conditions = {
                _id: data.ImageObjectId,
                DeleteFlag: DELETE_FLAG[200],
            };
            const set = {
                Status: STATUS[+data.Status],
                UpdatedDate: generatorTime(),
                UpdatedBy: data.UpdatedBy,
            };
            const result = await ImageModel.findOneAndUpdate(conditions, set, { new: true });
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
    infoPatient: async (data) => {
        try {
            const conditions = {
                DeleteFlag: DELETE_FLAG[200],
                _id: data.ImageObjectId,
            };
            const fieldsSelect = 'PatientObjectId Type';
            const result = ImageModel.find(conditions).select(fieldsSelect);
            return promiseResolve(result);
        } catch (err) {
            return promiseReject(err);
        }
    },
};
