'use strict';
angular.module('app.core')
    .service('PubSub', function (SocketService) {
        let container = [];
        return {
            subscribe: function (options, callback) {
                if (options) {
                    let collectionName = options.collectionName;
                    let modelId = options.modelId;
                    let method = options.method;
                    if (modelId !== '') {
                        if (method === 'POST') {
                            let name = '';
                            if (!modelId) {
                                name = '/' + collectionName + '/' + method;
                            }
                            else {
                                name = '/' + collectionName + '/' + modelId + '/' + method;
                            }
                            //console.log(name);
                            SocketService.on(name, callback);
                        }
                        else {
                            let name = '/' + collectionName + '/' + modelId + '/' + method;
                            SocketService.on(name, callback);
                        }
                        //Push the container..
                        this.pushContainer(name);
                    } else {
                        SocketService.on(collectionName, callback);
                    }


                } else {
                    throw 'Error: Option must be an object';
                }
            }, //end subscribe

            pushContainer: function (subscriptionName) {
                container.push(subscriptionName);
            },

            //Unsubscribe all containers..
            unSubscribeAll: function () {
                for (var i = 0; i < container.length; i++) {
                    SocketService.removeAllListeners(container[i]);
                }
                //Now reset the container..
                container = [];
            }
        };
    });