app.factory("article", ["httpHandler", "$q", function (httpHandler, $q) {


    var service = {
        getAllArticles: function () {
            var deferred = $q.defer();
            httpHandler.get("Article/GetAllArticles", true).then(
                function (resp) {
                    console.log(resp);
                    deferred.resolve(resp);
                }
                );
            return deferred.promise;
        },
        getAllArticlesForIndex: function () {
            var deferred = $q.defer();
            httpHandler.get("Article/GetAllArticlesForIndex", true).then(
                function (resp) {
                    deferred.resolve(resp);
                }
                );
            return deferred.promise;
        }
    }
    

    return service;

}]);