const PatientsController = require('../../controllers/PatientsController');

function PatientsRoute(apiRouter) {
    apiRouter.route('/patients/create').post(PatientsController.create);
    apiRouter.route('/patients/list').get(PatientsController.list);
    apiRouter.route('/patients/info').get(PatientsController.info);
    apiRouter.route('/patients/updateStatus').put(PatientsController.updateStatus);
    apiRouter.route('/patients/listActive').get(PatientsController.listActive);
    apiRouter.route('/patients/update').put(PatientsController.update);
    apiRouter.route('/patients/updateHealthStatus').put(PatientsController.updateHealthStatus);
    apiRouter.route('/patients/updateDiagnose').put(PatientsController.updateDiagnose);
    apiRouter.route('/patients/countPatient').get(PatientsController.countPatient);
    apiRouter.route('/patients/patientByDate').get(PatientsController.patientByDate);
    apiRouter.route('/patients/patientByMonth').get(PatientsController.patientByMonth);
}

module.exports = PatientsRoute;
