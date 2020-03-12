const ProvincesController = require('../../controllers/ProvincesController');

// eslint-disable-next-line func-names
function ProvincesRoute(authRouter) {
    authRouter.route('/provinces').get(ProvincesController.index);
    authRouter.route('/provinces/listActive').get(ProvincesController.listActive);
    authRouter.route('/districts/listByProvince').get(ProvincesController.listByProvince);
    authRouter.route('/wards/listByDistrict').get(ProvincesController.listByDistrict);
}

module.exports = ProvincesRoute;
