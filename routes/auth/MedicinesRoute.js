const MedicinesController = require('../../controllers/MedicinesController');

// eslint-disable-next-line func-names
function MedicinesRoute(authRouter) {
    authRouter.route('/medicines').get(MedicinesController.index);
    authRouter.route('/medicines/list').get(MedicinesController.list);
    authRouter.route('/medicines/create').post(MedicinesController.create);
    authRouter.route('/medicines/update').put(MedicinesController.update);
    authRouter.route('/medicines/listActive').get(MedicinesController.listActive);
    authRouter.route('/medicines/updateStatus').put(MedicinesController.updateStatus);
    authRouter.route('/medicines/delete').put(MedicinesController.delete);
}

module.exports = MedicinesRoute;
