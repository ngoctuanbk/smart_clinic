const UsersController = require('../../controllers/UsersController');

function usersRoute(apiRouter) {
    apiRouter.route('/users/create').post(UsersController.create);
    apiRouter.route('/users/list').get(UsersController.list);
    apiRouter.route('/users/listDoctorActive').get(UsersController.listDoctorActive);
    apiRouter.route('/users/getInfo').get(UsersController.getInfo);
    apiRouter.route('/users/update').put(UsersController.update);
    apiRouter.route('/users/getUser').get(UsersController.getUser);
}
module.exports = usersRoute;
