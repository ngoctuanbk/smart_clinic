/* eslint-disable prefer-arrow-callback */
(function () {
    angular.module('SmartClinic')
        .controller('loginController', loginController)
        .directive('ngEnter', ngEnter);

    loginController.$inject = ['$scope', 'validatorLogin', 'loginService', '$timeout', '$cookies', 'logger'];

    function loginController($scope, validatorLogin, loginService, $timeout, $cookies, logger) {
        $scope.formLogin = {};
        $scope.formForgot = {};
        $scope.formReset = {};
        $scope.validationLogin = validatorLogin.validationOptions();

        $scope.login = function (form) {
            if (form.validate()) {
                loginService.login($scope.formLogin).then(function (response) {
                    console.log(response);
                    console.log($scope.formLogin);
                    if (response.Success) {
                        $scope.formLogin = null;
                        $scope.changeCss();
                        window.location.href = '/admin';
                    } else {
                        $scope.alertShow = true;
                        angular.element('.alert').show();
                        $scope.message = response.Message;
                    }
                }).catch(function (error) {
                    logger.error(error, 'Thông báo');
                });
            } else {
                // $scope.alertShow = true;
                // angular.element('.alert').show();
                // $scope.message = "Hãy nhập tài khoản và mật khẩu";
            }
        };

        $scope.closeAlert = function () {
            angular.element('.alert').hide();
            $scope.message = '';
            $scope.alertShow = false;
        };

        $scope.EnabledFormlogin = true;
        $scope.movetoForm = function () {
            $scope.EnabledFormFogotPassword = true;
            $scope.EnabledFormlogin = false;
            $scope.showFormResetPassword = false;
            $scope.alertShow = false;
            $scope.changeCss();
        };

        $scope.back = function () {
            $scope.alertShow = false;
            $scope.EnabledFormFogotPassword = false;
            $scope.EnabledFormlogin = true;
            $scope.showFormResetPassword = false;
            $scope.changeCss();
        };

        // change css
        $scope.changeCss = function () {
            angular.element('.form-group').removeClass('has-error');
            angular.element('.form-group').removeClass('has-success');
            angular.element('.error-block').css('display', 'none');
        };
    }

    /* directive================ */
    function ngEnter(scope, element, attrs) {
        return element.bind('keydown keypress', function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    }
}());
