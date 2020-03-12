const WardsController = require('../../controllers/WardsController');

function WardsRoute(apiRouter) {
    apiRouter.route('/wards/create').post(WardsController.create);
    apiRouter.route('/wards/listActiveByDistrict').get(WardsController.listActiveByDistrict);
}

module.exports = WardsRoute;
