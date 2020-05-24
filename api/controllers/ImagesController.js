const ImagesService = require('../services/ImagesService');
const PhotosService = require('../services/PhotosService');
const ActivitiesService = require('../services/ActivitiesService');
const {
    listValidator,
    updateStatusValidator,
    createValidator,
    updateValidator,
    BrandObjectIdValidator,
    PatientObjectIdValidator,
} = require('../validators/ImageValidator');

const {
    isEmpty,
    responseError,
    responseSuccess,
    resJsonError,
    beforeUpload,
    isJSON,
    uploadManyFile,
    storage,
    fileFilterImage,
    generatorTime,
    deleteFile,
} = require('../libs/shared');
function getPathUploadPhoto() {
    const pathName = `/uploads/images/`;
    return pathName;
}

function getPhotoUrl(filename) {
    const photoUrl = getPathUploadPhoto() + filename;
    return photoUrl;
}
const uploadImage = (...forlderSaved) => uploadManyFile(storage(...forlderSaved), fileFilterImage, 'Images');

module.exports = {
    create: async (req, res) => {
        try {
            req.checkBody(createValidator);
            const errors = req.validationErrors();
            if (errors) {
                return res.json(responseError(40003, errors));
            }
            req.body.Database = req.decoded.Database;
            req.body.CreatedBy = req.decoded.UserObjectId;
            const existCode = await ImagesService.checkImageCodeExist(req.body);
            if (existCode) {
                return res.json(responseError(40181));
            }
            const result = await ImagesService.create(req.body);
            if (!isEmpty(result)) {
                return res.json(responseSuccess(10190));
            }
            return res.json(responseError(40180));
        } catch (errors) {
            console.log(errors)
            return resJsonError(res, errors, 'image');
        }
    },
    list: async (req, res) => {
        try {
            req.checkQuery(listValidator);
            const errors = req.validationErrors();
            if (errors) {
                return res.json(responseError(40003, errors));
            }
            const result = await ImagesService.list(req.query);
            return res.json(responseSuccess(10191, result));
        } catch (errors) {
            return resJsonError(res, errors, 'image');
        }
    },
    update: async (req, res) => {
        const {Database, UserObjectId} = req.decoded;
        beforeUpload(req, res, async (err) => {
            try {
                req.body.Database = req.decoded.Database;
                req.body.UpdatedBy = req.decoded.UserObjectId;
                req.body.UserObjectId = UserObjectId;
                for (const i in req.body) {
                    if (isJSON(req.body[i])) {
                        req.body[i] = JSON.parse(req.body[i]);
                    }
                }
                req.checkBody(updateValidator);
                const errors = req.validationErrors();
                if (errors) {
                    if (req.file) {
                        deleteFile(req.file.path);
                    }
                    return res.json(responseError(40003, errors));
                }
                const paramsCreateImage = {
                    Database,
                    records: [],
                };
                req.body.Images = [];
                if (!isEmpty(req.files)) {
                    req.files.map((item) => {
                        req.body.Image = [];
                        const ImagesDir = getPhotoUrl(item.filename);
                        paramsCreateImage.records.push({
                            ImagesDir,
                            CreatedBy: UserObjectId,
                            CreatedDate: generatorTime(),
                        });
                    });
                    const imagesCreated = await PhotosService.createMany(paramsCreateImage) || [];
                    if (isEmpty(imagesCreated)) {
                        return res.json(responseError(40001, err));
                    }
                    req.body.Images = imagesCreated.map(image => image._id);
                }
                const paramsupdateStatusImage = {
                    ImageObjectId: req.body.ImageObjectId,
                    Status: 400,
                    UpdatedBy: req.decoded.UserObjectId
                };
                const updateStatusImage = await ImagesService.updateStatus(paramsupdateStatusImage);
                if (isEmpty(updateStatusImage)) {
                    return res.json(responseError(40182, err));
                }
                const result = await ImagesService.update(req.body);
                if (!isEmpty(result)) {
                    return res.json(responseSuccess(10192));
                }
                return res.json(responseError(40182));
            } catch (errors) {
                console.log(errors)
                if (req.file && req.file.path) {
                    deleteFile(req.file.path);
                }
                return resJsonError(res, errors, 'image');
            }
        }, uploadImage('images'));
    },
    listByPatient: async (req, res) => {
        try {
            req.checkQuery(PatientObjectIdValidator);
            const errors = req.validationErrors();
            if (errors) {
                return res.json(responseError(40003, errors));
            }
            const result = await ImagesService.listByPatient(req.query);
            return res.json(responseSuccess(10191, result));
        } catch (errors) {
            console.log(errors)
            return resJsonError(res, errors, 'image');
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
            const infoPatient = await ImagesService.infoPatient({ImageObjectId: req.body.ImageObjectId})
            if (req.body.Status === 200) {
                const paramsCreateActivity = {
                    records: [],
                };
                paramsCreateActivity.records.push({
                    ActivityName: infoPatient[0].Type,
                    UserObjectId: req.decoded.UserObjectId,
                    CreatedDate: generatorTime(),
                    PatientObjectId: infoPatient[0].PatientObjectId,
                });
                const activityCreated = await ActivitiesService.create(paramsCreateActivity);
                    if (isEmpty(activityCreated)) {
                        return res.json(responseError(40153, err));
                    }
            }
            const result = await ImagesService.updateStatus(req.body);
            if (!isEmpty(result)) {
                return res.json(responseSuccess(10192));
            }
            return res.json(responseError(40182));
        } catch (errors) {
            console.log(errors)
            return resJsonError(res, errors, 'image');
        }
    },
};
