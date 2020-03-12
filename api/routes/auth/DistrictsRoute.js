const DistrictsController = require('../../controllers/DistrictsController');

// eslint-disable-next-line func-names
function DistrictsRoute(apiRouter) {
    apiRouter.route('/districts/create').post(DistrictsController.create);
    apiRouter.route('/districts/listActiveByProvince').get(DistrictsController.listActiveByProvince);
}

module.exports = DistrictsRoute;
