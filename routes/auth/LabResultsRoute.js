const LabResultController = require('../../controllers/LabResultController');

// eslint-disable-next-line func-names
function LabResultsRoute(authRouter) {
    authRouter.route('/lab_result').get(LabResultController.index);
}

module.exports = LabResultsRoute;
