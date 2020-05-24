(function () {
    'use strict';
    angular
        .module('app.core')
        .directive('fileModel', fileModel)
        .directive('fileUpload', fileUpload)

    fileModel.$inject = ['$q', 'logger', '$parse'];
    fileUpload.$inject = ['$parse'];

    function fileModel($q, logger, $parse) {
        return {
            restrict: 'A',
            scope: false,
            require: '?ngModel',
            link: link
        }

        function link(scope, element, attrs, ngModel) {
            scope.imageCorrect = true;
            element.bind('change', function (e) {
                var elem = e.target;
                var deferred = $q.defer();
                var promise = readFile(elem.files[0]);

                $q.all([promise]).then((values) => {
                    ngModel.$setViewValue(values.length ? values[0] : null);
                })

                function readFile(file) {
                    if (!file) {
                        return false;
                    }
                    if (!(/image/i).test(file.type)) {
                        scope.imageCorrect = false;
                        logger.error("Chọn hình ảnh hợp lệ");
                        return false;
                    } else {
                        scope.imageCorrect = true;
                        angular.element('.file-choose-image span').text(" ");
                        var reader = new FileReader();
                        reader.readAsArrayBuffer(file);
                        reader.onload = function (e) {
                            var blob = new Blob([e.target.result]);
                            window.URL = window.URL || window.webkitURL;
                            let blobURL = window.URL.createObjectURL(blob);
                            let image = new Image();
                            image.src = blobURL;
                            image.onload = function () {
                                let resized = resizeMe(image);
                                deferred.resolve(resized);
                            };
                        }

                        reader.onerror = function (error) {
                            deferred.reject(error)
                        }
                        return deferred.promise;
                    }
                }

                function resizeMe(img) {
                    var canvas = document.createElement('canvas');
                    canvas.width = 300;
                    canvas.height = 300;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, 300, 300);
                    return canvas.toDataURL("image/png", 0.7);
                }

            })
        }
    }

    function fileUpload($parse) {
        const directive = {
            restrict: 'AE',
            link: linkFc
        };

        return directive;

        function linkFc(scope, element, attrs) {
            let model = $parse(attrs.fileUpload);
            let modelSetter = model.assign;

            element.bind('change', function () {
                console.log(element[0].files[0])
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });

            /* sau khi import thanh cong, reload gia tri cho element */
            scope.$on('reloadImport', () =>{
                element[0].value = '';
            })
        }
    }
})();