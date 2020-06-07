app.factory("doaa", ["httpHandler", "$q", function (httpHandler, $q) {
    var service = {
        getAllDoaaMainCategories: function () {
            var deferred = $q.defer();
            httpHandler.get("Doaa/DoaaMainCategories", null, false).then(function (results) {
                deferred.resolve(results);
            });
            return deferred.promise;
        },
        getAllDoaas: function () {
            var deferred = $q.defer();
            httpHandler.get("Doaa/Doaas", null, false).then(function (results) {
                deferred.resolve(results);
            });
            return deferred.promise;
        }

    }
    return service;
}]);