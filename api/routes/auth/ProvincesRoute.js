const ProvincesController = require('../../controllers/ProvincesController');

function ProvincesRoute(apiRouter) {
    apiRouter.route('/provinces/create').post(ProvincesController.create);
    apiRouter.route('/provinces/listActive').get(ProvincesController.listActive);
}

module.exports = ProvincesRoute;
