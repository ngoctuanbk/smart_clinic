const LabsController = require('../../controllers/LabsController');

function LabsRoute(apiRouter) {
    apiRouter.route('/labs/create').post(LabsController.create);
    apiRouter.route('/labs/list').get(LabsController.list);
    apiRouter.route('/labs/update').put(LabsController.update);
}

module.exports = LabsRoute;