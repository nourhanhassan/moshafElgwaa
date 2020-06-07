app.factory("namesOfAllah", ["httpHandler", "$q", function (httpHandler, $q) {
    var service = {
        getAllNamesOfAllah: function () {
            var deferred = $q.defer();
            httpHandler.get("NamesOfAllah/NamesOfAllah", null, true).then(function (results) {
                deferred.resolve(results);
            });
            return deferred.promise;
        }
    }
    return service;
}]);