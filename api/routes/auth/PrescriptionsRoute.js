const PrescriptionsController = require('../../controllers/PrescriptionsController');

function PrescriptionsRoute(apiRouter) {
    apiRouter.route('/prescriptions/create').post(PrescriptionsController.create);
    apiRouter.route('/prescriptions/list').get(PrescriptionsController.list);
}

module.exports = PrescriptionsRoute;
