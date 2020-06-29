const {
    getInfoUserSession,
    sendQueryToAPI,
    getHeaders,
    sendDataToClient,
    responseError,
    sendBodyToAPI,
    isEmpty,
    formatDateToDMY,
    getColumnExcel,
    getDMYCurrent,
    newSheetExcel,
    writeFileExcel,
    deleteFile,
    styleExcel,
    filterStatusPatient,
} = require('../libs/shared');

const { TITLE_ADMIN } = require('../configs/constants');

module.exports = {
    index: async (req, res) => {
        const Info = getInfoUserSession(req);
        res.render('patients/index', {
            layout: 'patients',
            title: TITLE_ADMIN,
            activity: 'Patients',
            Info,
        });
    },
    info: async (req, res) => {
        try {
        const PatientObjectId = req.query.id ? req.query.id : '';
        const Info = getInfoUserSession(req);
        const {
            listInfo,
        } = module.exports;
        req.query.PatientObjectId = PatientObjectId;
        const data = await listInfo(req);
        if (isEmpty(data)) {
            return response404(res);
        }
        return res.render('patients/info', {
            layout: 'patients',
            title: TITLE_ADMIN,
            activity: 'Patients',
            Info,
            data: JSON.stringify(data),
            PatientObjectId,
        });
    } catch (err) {
        return res.status(500).json(responseError(1001, err));
    }
    },
    list: async (req, res) => {
        try {
            const result = await sendQueryToAPI('GET', 'api/patients/list', getHeaders(req), req.query, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    listInfo: async (req) => {
        try {
            const result = await sendQueryToAPI('GET', 'api/patients/info', getHeaders(req), req.query, true);
            if (result.Success) {
                return result.Data;
            }
            return {};
        } catch (err) {
            {};
        }
    },
    listActive: async (req, res) => {
        try {
            const result = await sendQueryToAPI('GET', 'api/patients/listActive', getHeaders(req), req.query, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    create: async (req, res) => {
        try {
            const result = await sendBodyToAPI('POST', 'api/patients/create', getHeaders(req), req.body, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    updateStatus: async (req, res) => {
        try {
            const result = await sendBodyToAPI('PUT', 'api/patients/updateStatus', getHeaders(req), req.body, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    update: async (req, res) => {
        try {
            const result = await sendBodyToAPI('PUT', 'api/patients/update', getHeaders(req), req.body, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    updateHealthStatus: async (req, res) => {
        try {
            const result = await sendBodyToAPI('PUT', 'api/patients/updateHealthStatus', getHeaders(req), req.body, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    createPrescription: async (req, res) => {
        try {
            const result = await sendBodyToAPI('POST', 'api/prescriptions/create', getHeaders(req), req.body, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    listPrescription: async (req, res) => {
        try {
            const result = await sendQueryToAPI('GET', 'api/prescriptions/list', getHeaders(req), req.query, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    listDiagnose: async (req, res) => {
        try {
            const result = await sendQueryToAPI('GET', 'api/diagnose/list', getHeaders(req), req.query, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    createDiagnose: async (req, res) => {
        try {
            const result = await sendBodyToAPI('POST', 'api/diagnose/create', getHeaders(req), req.body, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    // updateDiagnose: async (req, res) => {
    //     try {
    //         const result = await sendBodyToAPI('PUT', 'api/patients/updateDiagnose', getHeaders(req), req.body, true);
    //         return sendDataToClient(req, res, result);
    //     } catch (err) {
    //         return res.status(500).json(responseError(1001, err));
    //     }
    // },
    countPatient: async (req, res) => {
        try {
            const result = await sendQueryToAPI('GET', 'api/patients/countPatient', getHeaders(req), req.query, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    patientByDate: async (req, res) => {
        try {
            const result = await sendQueryToAPI('GET', 'api/patients/patientByDate', getHeaders(req), req.query, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    patientByMonth: async (req, res) => {
        try {
            const result = await sendQueryToAPI('GET', 'api/patients/patientByMonth', getHeaders(req), req.query, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
    exportFile: async (req, res) => {
        try {
            const result = await sendQueryToAPI('GET', 'api/patients/export', getHeaders(req), req.query, true);
            const { StatusCode } = result || {};
            if (StatusCode === 40014) {
                return response403(res);
            }
            const { workbook, worksheet } = newSheetExcel('Bệnh nhân');
            const columns = [
                'Mã bệnh nhân',
                'Tên bệnh nhân',
                'Giới tính ',
                'Ngày tháng năm sinh',
                'Tuổi',
                'Số điện thoại',
                'Địa chỉ',
                'Phường/Xã',
                'Quận/Huyện',
                'Tỉnh/TP',
                'Nghề nghiệp',
                'Ngày khám',
                'Lý do khám bệnh',
                'Liên hệ',
                'Trạng thái'
            ];
            worksheet.columns = getColumnExcel(columns);
            const data = result.Success ? result.Data.docs || [] : [];
            console.log(data)
            for (let i = 0, leng = data.length; i < leng; i++) {
                const item = data[i];
                const rowValues = [
                    item.PatientID,
                    item.FullName,
                    (item.Sex === 'Male' ? 'Nam' : 'Nữ') || '',
                    formatDateToDMY(item.DateOfBirth),
                    item.Age || '',
                    (item.Mobile || ''),
                    (item.Address.Street || ''),
                    ((item.Address.WardObjectId || '') && item.Address.WardObjectId.WardName),
                    ((item.Address.DistrictObjectId || '') && item.Address.DistrictObjectId.DistrictName),
                    ((item.Address.ProvinceObjectId || '') && item.Address.ProvinceObjectId.ProvinceName),
                    item.Career || '',
                    formatDateToDMY(item.CreatedDate, 'DD-MM-YYYY HH:mm:ss'),
                    item.Reason || '',
                    item.Contact || '',
                    filterStatusPatient(item.Status),
                ];
                worksheet.addRow(rowValues).font = styleExcel.fontBody;
            }
            const filePath = `./public/data/DS_bệnh nhân_${getDMYCurrent()}.xlsx`;
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
