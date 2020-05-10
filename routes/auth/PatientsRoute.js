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
    authRouter.route('/patients/updateDiagnose').put(PatientsController.updateDiagnose);
    authRouter.route('/patients/countPatient').get(PatientsController.countPatient);
}

module.exports = PatientsRoute;
