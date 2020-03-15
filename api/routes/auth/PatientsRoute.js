const PatientsController = require('../../controllers/PatientsController');

function PatientsRoute(apiRouter) {
    apiRouter.route('/patients/create').post(PatientsController.create);
    apiRouter.route('/patients/list').get(PatientsController.list);
    apiRouter.route('/patients/updateStatus').put(PatientsController.updateStatus);
    apiRouter.route('/patients/listActive').get(PatientsController.listActive);
}

module.exports = PatientsRoute;
