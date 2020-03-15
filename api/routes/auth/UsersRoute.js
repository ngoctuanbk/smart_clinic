const UsersController = require('../../controllers/UsersController');

function usersRoute(apiRouter) {
    apiRouter.route('/users/create').post(UsersController.create);
    apiRouter.route('/users/list').get(UsersController.list);
    apiRouter.route('/users/listDoctorActive').get(UsersController.listDoctorActive);
}
module.exports = usersRoute;
