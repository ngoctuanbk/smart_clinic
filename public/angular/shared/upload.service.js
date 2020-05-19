(function () {
    angular.module('app.core')
        .service('UploadService', UploadService);

    UploadService.$inject = ['$http', 'exception'];

    function UploadService($http, exception) {
        function hasObject(obj) {
            if (obj && obj !== null && obj !== undefined) {
                return true;
            }
            return false;
        }
        function isObject(a) {
            return !!a && a.constructor === Object && !!Object.keys(a).length;
        }
        function isArray(value) {
            return Array.isArray(value);
        }
        this.uploadDataAndImageBase64 = function (method, url, obj, img) {
            const formData = new FormData();
            if (hasObject(img)) {
                const imageBase64 = img.split(',')[1];
                const blob = base64toBlob(imageBase64, 'image/png');
                const file = new File([blob], 'Image.png');
                formData.append('File', file);
            }
            for (const prop in obj) {
                if (Array.isArray(obj[prop]) || isObject(obj[prop])) {
                    formData.append(prop, JSON.stringify(obj[prop]));
                    continue;
                }
                formData.append(prop, obj[prop]);
            }
            return $http({
                method,
                url,
                data: formData,
                withCredentials: true,
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined,
                },
            })
                .then(response => response.data).catch(error => handlingError('error ', error));
        };

        this.uploadImage = (method, url, data, files, fieldName) => {
            console.log("abc")
            const formData = new FormData();
            if (files) {
                if (isArray(files)) {
                    files.map((item, idx) => {
                        formData.append('File', item);
                    });
                } else {
                    formData.append('File', files);
                }
            }
            for (const prop in data) {
                if (Array.isArray(data[prop]) || isObject(data[prop])) {
                    formData.append(prop, JSON.stringify(data[prop]));
                    continue;
                }
                formData.append(prop, data[prop]);
            }
            return $http({
                method,
                url,
                data: formData,
                withCredentials: true,
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined,
                },
            })
                .then(response => response.data)
                .catch((err) => {
                    handlingError('Error occurred when upload image', err);
                });
        };
        this.uploadFile = (method, url, file, obj = {}) => {
            try {
                const fd = new FormData();
                for (const prop in obj) {
                    if (obj[prop]) {
                        fd.append(prop, obj[prop]);
                    }
                }
                if (file) {
                    fd.append('File', file);
                }
                return $http({
                    method,
                    url,
                    data: fd,
                    withCredentials: true,
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined,
                    },
                })
                    .then(response => response.data)
                    .catch((err) => {
                        handlingError('Error occurred when upload file', err);
                    });
            } catch (err) {
                handlingError('Error occurred when upload file', err);
            }
        };

        this.downloadfile = (method, url, data) => {
            try {
                return $http({
                    method,
                    url,
                    data,
                    // withCredentials: true,
                    // transformRequest: angular.identity,
                    // responseType: 'arraybuffer',
                    // headers: {
                    //     'Content-Type': undefined,
                    // }
                })
                    .then(response => response.data)
                    .catch((err) => {
                        handlingError('Error occurred when download file', err);
                    });
            } catch (err) {
                handlingError('Error occurred when upload file', err);
            }
        };
        this.uploadMultiImage = (method, url, data, img) => {
            try {
                const formData = new FormData();
                if (img && img.length) {
                    for (let i = 0; i < img.length; i++) {
                        const imageBase64 = img[i].split(',')[1];
                        const blob = base64toBlob(imageBase64, 'image/png');
                        const file = new File([blob], 'Image.png');
                        formData.append('file', file);
                    }
                }
                for (const i in data) {
                    formData.append(i, data[i]);
                }
                return $http({
                    method: 'POST',
                    url,
                    data: formData,
                    withCredentials: true,
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined,
                    },
                })
                    .then(response => response.data).catch(error => handlingError('error ', error));
            } catch (err) {
                handlingError('Error occurred when upload image. File is not image', err);
            }
        };

        this.upload = (img) => {
            const imageBase64 = img[0].split(',')[1];
            const blob = base64toBlob(imageBase64, 'image/png');
            const file = new File([blob], 'Image.png');
            const fd = new FormData();
            fd.append('file', file);
            return $http.post('/admin/setting/banner/create', fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined,
                },
            })
                .then(response => response.data)
                .catch(err => handlingError('Error occurred when upload image', err));
        };

        this.deleteFile = data => $http.post('/admin/deleteFile', data)
            .then(response => response.data)
            .catch(err => handlingError('Lỗi xảy ra khi xóa file ', err));


        function base64toBlob(base64Data, contentType) {
            contentType = contentType || 'image/png';
            const sliceSize = 1024;
            const byteCharacters = atob(base64Data);
            const bytesLength = byteCharacters.length;
            const slicesCount = Math.ceil(bytesLength / sliceSize);
            const byteArrays = new Array(slicesCount);

            for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
                const begin = sliceIndex * sliceSize;
                const end = Math.min(begin + sliceSize, bytesLength);

                const bytes = new Array(end - begin);
                for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
                    bytes[i] = byteCharacters[offset].charCodeAt(0);
                }
                byteArrays[sliceIndex] = new Uint8Array(bytes);
            }
            return new Blob(byteArrays, {
                type: contentType,
            });
        }

        function handlingError(msg, err) {
            return exception.catcher(msg)(err);
        }
    }
}());
