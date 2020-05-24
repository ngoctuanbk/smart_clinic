const PatientsController = require('../../controllers/PatientsController');

// eslint-disable-next-line func-names
function PatientsRoute(authRouter) {
    authRouter.route('/patients').get(PatientsController.index);
    authRouter.route('/patients/info').get(PatientsController.info);
    authRouter.route('/patients/list').get(PatientsController.list);
    authRouter.route('/patients/create').post(PatientsController.create);
    authRouter.route('/patients/updateStatus').put(PatientsController.updateStatus);
    authRouter.route('/patients/listActive').get(PatientsController.listActive);
    authRouter.route('/patients/update').put(PatientsController.update);
    authRouter.route('/patients/updateHealthStatus').put(PatientsController.updateHealthStatus);
    authRouter.route('/prescriptions/create').post(PatientsController.createPrescription);
    authRouter.route('/prescriptions/list').get(PatientsController.listPrescription);
    authRouter.route('/patients/countPatient').get(PatientsController.countPatient);
    authRouter.route('/patients/patientByDate').get(PatientsController.patientByDate);
    authRouter.route('/patients/patientByMonth').get(PatientsController.patientByMonth);
    authRouter.route('/diagnose/list').get(PatientsController.listDiagnose);
    authRouter.route('/diagnose/create').post(PatientsController.createDiagnose);
}

module.exports = PatientsRoute;
