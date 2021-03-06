const {
    getInfoUserSession,
    responseError,
    sendDataToClient,
    sendFormDataToAPI,
    getHeaders,
    isEmpty,
    beforeUpload,
    fileFilterImage,
    fsCreateReadStream,
    storage,
    uploadFile,
    sendQueryToAPI,
    sendBodyToAPI,
    formatDateToDMY,
    filterStatus,
    getColumnExcel,
    getDMYCurrent,
    newSheetExcel,
    writeFileExcel,
    deleteFile,
    styleExcel,
} = require('../libs/shared');

const { TITLE_ADMIN } = require('../configs/constants');
const uploadImage = uploadFile(storage('users', 'images'), fileFilterImage, 'File');
const { response404, response403 } = require('../libs/httpResponse');

module.exports = {
    index: async (req, res) => {
        const Info = getInfoUserSession(req);
        res.render('users/index', {
            layout: 'users',
            title: TITLE_ADMIN,
            activity: 'Users',
            Info,
        });
    },
    add: async (req, res) => {
        const Info = getInfoUserSession(req);
        return res.render('users/add', {
            layout: 'user_add',
            title: TITLE_ADMIN,
            activity: 'Users',
            Info,
        });
    },
    edit: async (req, res) => {
        const UserObjectId = req.query.id ? req.query.id : '';
        const Info = getInfoUserSession(req);
        const { getInfo } = module.exports;
            req.query.UserObjectId = UserObjectId;
            const data = await getInfo(req, res);
            if (isEmpty(data)) {
                return response404(res);
            }
        return res.render('users/edit', {
            layout: 'user_edit',
            title: TITLE_ADMIN,
            activity: 'Users',
            Info,
            data: JSON.stringify(data),
            UserObjectId,
        });
    },
    create: async (req, res) => {
        try {
            beforeUpload(req, res, async () => {
                const formData = {};
                for (const prop in req.body) {
                    if (!isEmpty(req.body[prop])) {
                        formData[prop] = req.body[prop];
                    }
                }
                if (!isEmpty(req.file)) {
                    const stream = fsCreateReadStream(req.file.path);
                    formData.Image = stream;
                }
                const result = await sendFormDataToAPI('POST', 'api/users/create', getHeaders(req), formData, true);
                sendDataToClient(req, res, result);
            }, uploadImage);
        } catch (err) {
            res.status(500).json(responseError(1001, err));
        }
    },
    list: async (req, res) => {
        try {
            const result = await sendQueryToAPI('GET', 'api/users/list', getHeaders(req), req.query, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    getInfo: async (req) => {
        try {
            const result = await sendQueryToAPI('GET', 'api/users/getInfo', getHeaders(req), req.query, true);
            if (result.Success) {
                return result.Data;
            }
            return {};
        } catch (err) {
            return {};
        }
    },
    listDoctorActive: async (req, res) => {
        try {
            const result = await sendQueryToAPI('GET', 'api/users/listDoctorActive', getHeaders(req), req.query, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    update: async (req, res) => {
        try {
            beforeUpload(req, res, async () => {
                const formData = {};
                for (const prop in req.body) {
                    if (!isEmpty(req.body[prop])) {
                        formData[prop] = req.body[prop];
                    }
                }
                if (!isEmpty(req.file)) {
                    const stream = fsCreateReadStream(req.file.path);
                    formData.Image = stream;
                }
                const result = await sendFormDataToAPI('PUT', 'api/users/update', getHeaders(req), formData, true);
                sendDataToClient(req, res, result);
            }, uploadImage);
        } catch (err) {
            res.status(500).json(responseError(1001, err));
        }
    },
    getUser: async (req, res) => {
        try {
            const result = await sendQueryToAPI('GET', 'api/users/getUser', getHeaders(req), req.query, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    updateStatus: async (req, res) => {
        try {
            const result = await sendBodyToAPI('PUT', 'api/users/updateStatus', getHeaders(req), req.body, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            console.log(err)
            return res.status(500).json(responseError(1001, err));
        }
    },
    delete: async (req, res) => {
        try {
            const result = await sendBodyToAPI('PUT', 'api/users/delete', getHeaders(req), req.body, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    updateAvatar: async (req, res) => {
        try {
            beforeUpload(req, res, async () => {
                const formData = {};
                for (const prop in req.body) {
                    if (!isEmpty(req.body[prop])) {
                        formData[prop] = req.body[prop];
                    }
                }
                if (!isEmpty(req.file)) {
                    const stream = fsCreateReadStream(req.file.path);
                    formData.Image = stream;
                }
                const result = await sendFormDataToAPI('PUT', 'api/users/updateAvatar', getHeaders(req), formData, true);
                return sendDataToClient(req, res, result);
            }, uploadImage);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    exportFile: async (req, res) => {
        try {
            const result = await sendQueryToAPI('GET', 'api/users/export', getHeaders(req), req.query, true);
            const { StatusCode } = result || {};
            if (StatusCode === 40014) {
                return response403(res);
            }
            const { workbook, worksheet } = newSheetExcel('Nhân viên');
            const columns = [
                'Họ tên nhân viên',
                'Tên đăng nhập',
                'Số điện thoại',
                'Email',
                'Passport',
                'Địa chỉ',
                'Quyền',
                'Giới tính',
                'Ngày tháng năm sinh',
                'Ngày gia nhập',
                'Trạng thái'
            ];
            worksheet.columns = getColumnExcel(columns);
            const data = result.Success ? result.Data.docs || [] : [];
            console.log(data)
            for (let i = 0, leng = data.length; i < leng; i++) {
                const item = data[i];
                const rowValues = [
                    item.Info.FullName,
                    item.UserName,
                    (item.Mobile || ''),
                    (item.Email || ''),
                    (item.Info.Passport || ''),
                    (item.Info.Address || ''),
                    ((item.RoleObjectId || '') && item.RoleObjectId.RoleName),
                    item.Sex || '',
                    (formatDateToDMY(item.DateOfBirth) || ''),
                    formatDateToDMY(item.JoinDate, 'DD-MM-YYYY HH:mm:ss'),
                    filterStatus(item.Status),
                ];
                worksheet.addRow(rowValues).font = styleExcel.fontBody;
            }
            const filePath = `./public/data/DS_nhân_viên_${getDMYCurrent()}.xlsx`;
            await writeFileExcel(workbook, filePath);
            res.download(filePath);
            setTimeout(() => {
                deleteFile(filePath);
            }, 1000);
        } catch (err) {
            console.log(err)
            return res.status(500).json(responseError(1001));
        }
    },
};
