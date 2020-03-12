const PatientsController = require('../../controllers/PatientsController');

function PatientsRoute(apiRouter) {
    apiRouter.route('/patients/create').post(PatientsController.create);
    apiRouter.route('/patients/list').get(PatientsController.list);
}

module.exports = PatientsRoute;
