/* eslint-disable no-param-reassign */
(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('fileModel', fileModel)
        .directive('fileUpload', fileUpload);

    fileModel.$inject = ['$q', 'logger', '$parse'];
    fileUpload.$inject = ['$parse'];

    function fileModel($q, logger) {
        return {
            restrict: 'A',
            scope: false,
            require: '?ngModel',
            link,
        };

        function link(scope, element, attrs, ngModel) {
            scope.imageCorrect = true;
            element.bind('change', (e) => {
                const elem = e.target;
                const deferred = $q.defer();
                const promise = readFile(elem.files[0]);

                $q.all([promise]).then((values) => {
                    ngModel.$setViewValue(values.length ? values[0] : null);
                });

                function readFile(file) {
                    if (!file) return null;
                    if (!(/image/i).test(file.type)) {
                        scope.imageCorrect = false;
                        logger.error('Chọn hình ảnh hợp lệ');
                        return false;
                    }
                    scope.imageCorrect = true;
                    angular.element('.file-choose-image span').text(' ');
                    const reader = new FileReader();
                    reader.readAsArrayBuffer(file);
                    reader.onload = function (e) {
                        const blob = new Blob([e.target.result]);
                        window.URL = window.URL || window.webkitURL;
                        const blobURL = window.URL.createObjectURL(blob);
                        const image = new Image();
                        image.src = blobURL;
                        image.onload = function () {
                            const resized = resizeMe(image);
                            deferred.resolve(resized);
                        };
                    };

                    reader.onerror = function (error) {
                        deferred.reject(error);
                    };
                    return deferred.promise;
                }

                function resizeMe(img) {
                    const canvas = document.createElement('canvas');
                    canvas.width = 300;
                    canvas.height = 300;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, 300, 300);
                    return canvas.toDataURL('image/png', 0.7);
                }
            });
        }
    }

    function fileUpload($parse) {
        const directive = {
            restrict: 'AE',
            link: linkFc,
        };

        return directive;

        function linkFc(scope, element, attrs) {
            const model = $parse(attrs.fileUpload);
            const modelSetter = model.assign;

            element.bind('change', () => {
                scope.$apply(() => {
                    modelSetter(scope, element[0].files[0]);
                });
            });

            /* sau khi import thanh cong, reload gia tri cho element */
            scope.$on('reloadImport', () => {
                element[0].value = '';
            });
        }
    }
}());
