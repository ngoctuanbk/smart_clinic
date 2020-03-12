(function () {
    'use strict';
    angular
        .module('app.core')
        .directive('fileModel', fileModel)
        .directive('fileUploadModel', fileUploadModel)

    fileModel.$inject = ['$q', 'logger'];
    fileUploadModel.$inject = ['$parse'];
    function fileModel($q, logger) {
        let slice = Array.prototype.slice;
        const directive = {
            restrict: 'A',
            require: '?ngModel',
            link: linkFc
        };

        return directive;

        function linkFc(scope, element, attrs, ngModel) {
            if (!ngModel) return;

            ngModel.$render = function () {
            };
            element.bind('change', function (e) {
                let element = e.target;
                let width = element.getAttribute('data-width');
                let height = element.getAttribute('data-height');

                $q.all(slice.call(element.files, 0).map(readFile))
                    .then(function (values) {
                        if (element.multiple) ngModel.$setViewValue(values);
                        else ngModel.$setViewValue(values.length ? values[0] : null);
                        element.value = null;
                        element.disabled = false;
                    });

                function readFile(file) {
                    let deferred = $q.defer();
                    if (!( /image/i ).test(file.type)) {
                        logger.error("File " + file.name + " is not an image.");
                        return false;
                    }

                    let reader = new FileReader();
                    reader.readAsDataURL(file);

                    reader.onload = function (e) {
                        deferred.resolve(e.target.result);
                        // let blob = new Blob([e.target.result]);
                        // window.URL = window.URL || window.webkitURL;
                        // let blobURL = window.URL.createObjectURL(blob);
                        // let image = new Image();
                        // image.src = blobURL;
                        // image.onload = function () {
                        //     let resized = resizeMe(image);
                        //     deferred.resolve(resized);
                        // };

                    };
                    reader.onerror = function (e) {
                        deferred.reject(e);
                    };
                    return deferred.promise;
                }

                function resizeMe(img) {
                    let canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    let ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);

                    return canvas.toDataURL("image/png", 0.7);
                }
            })
        }
    }
    function fileUploadModel($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileUploadModel);
                var modelSetter = model.assign;
                element.bind('change', function (e) {
                    scope.$apply(function () {
                        var url =  URL.createObjectURL(element[0].files[0]);
                        scope.url = url;
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }
})();