const BrandsController = require('../../controllers/BrandsController');

// eslint-disable-next-line func-names
function BrandsRoute(authRouter) {
    authRouter.route('/brands').get(BrandsController.index);
    authRouter.route('/brands/list').get(BrandsController.list);
    authRouter.route('/brands/listActive').get(BrandsController.listActive);
    authRouter.route('/brands/create').post(BrandsController.create);
    authRouter.route('/brands/update').put(BrandsController.update);
    authRouter.route('/brands/updateStatus').put(BrandsController.updateStatus);
    authRouter.route('/brands/delete').put(BrandsController.delete);
}

module.exports = BrandsRoute;
