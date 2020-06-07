app.factory("doaaBook", ["httpHandler", "$q", "search", function (httpHandler, $q, search) {
    var service = {
        getAllDoaaBookContents: function () {
            var deferred = $q.defer();
            httpHandler.get("DoaaBook/DoaaBookContents", null, true).then(function (results) {
                deferred.resolve(results);
            });
            return deferred.promise;
        },
        searchInDoaaBook: function (searchKey) {
            var deferred = $q.defer();
            search.searchInDoaaBook(searchKey).then(function (results) {
                deferred.resolve(results);
            });
            return deferred.promise;
        },
    }
    return service;
}]);