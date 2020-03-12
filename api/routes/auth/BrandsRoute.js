const BrandsController = require('../../controllers/BrandsController');

function BrandsRoute(apiRouter) {
    apiRouter.route('/brands/create').post(BrandsController.create);
    apiRouter.route('/brands/list').get(BrandsController.list);
    apiRouter.route('/brands/update').put(BrandsController.update);
    apiRouter.route('/brands/updateStatus').put(BrandsController.updateStatus);
    apiRouter.route('/brands/delete').put(BrandsController.delete);
}

module.exports = BrandsRoute;
