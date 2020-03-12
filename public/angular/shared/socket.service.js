(function () {
    angular.module('app.core')
        .service('SocketService', function () {
            //  var port = document.location.port;
            let port = 8081;
            let hostname = 'api.salefie.vn';
            //let hostname = 'localhost';
            //var socket = io('wss://' + hostname, { transports: ['websocket', 'polling'] });
            // console.log('ws://' + hostname + ':' + port);
            //let socket = io('wss://' + hostname+':'+port , {secure: true});
            let socket = io('ws://' + hostname + ':' + port);
            return socket;
        })

})();
