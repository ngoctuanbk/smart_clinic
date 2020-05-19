const {
    getInfoUserSession,
    sendQueryToAPI,
    getHeaders,
    sendDataToClient,
    responseError,
    sendBodyToAPI,
    isEmpty,
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
    updateDiagnose: async (req, res) => {
        try {
            const result = await sendBodyToAPI('PUT', 'api/patients/updateDiagnose', getHeaders(req), req.body, true);
            return sendDataToClient(req, res, result);
        } catch (err) {
            return res.status(500).json(responseError(1001, err));
        }
    },
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
};
