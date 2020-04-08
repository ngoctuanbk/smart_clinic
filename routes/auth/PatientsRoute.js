const PatientsController = require('../../controllers/PatientsController');

// eslint-disable-next-line func-names
function PatientsRoute(authRouter) {
    authRouter.route('/patients').get(PatientsController.index);
    authRouter.route('/patients/list').get(PatientsController.list);
    authRouter.route('/patients/create').post(PatientsController.create);
    authRouter.route('/patients/updateStatus').put(PatientsController.updateStatus);
    authRouter.route('/patients/listActive').get(PatientsController.listActive);
    authRouter.route('/patients/update').put(PatientsController.update);
}

module.exports = PatientsRoute;
