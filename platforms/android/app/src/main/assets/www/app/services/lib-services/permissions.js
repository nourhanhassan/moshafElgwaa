app.factory("permissions", ["httpHandler", "$q", "$timeout", function (httpHandler, $q, $timeout) {
    var service = {

        permissions: "",

        init: function () {
            if (typeof (cordova) != "undefined") {
                if (cordova.plugins)
                    service.permissions = cordova.plugins.permissions;
            }
        },

        checkpermission: function (permission) {
            var deferred = $q.defer();
            service.permissions = cordova.plugins.permissions;
            service.permissions.checkPermission(permission, function (ret) {
                deferred.resolve(ret)
            }, function (err) {
                deferred.reject(err)
            });
            return deferred.promise;
        },

        requestPermission: function (permission) {
            var deferred = $q.defer();
            service.permissions = cordova.plugins.permissions;
            service.permissions.requestPermission(permission, function (ret) {
                deferred.resolve(ret)
            }, function (err) {
                deferred.reject(err)
            });
            return deferred.promise;
        },
    }
    service.init();
    return service;
}]);