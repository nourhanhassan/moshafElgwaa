app.factory("group", ["httpHandler", "$q", "memorizedayat", "settings", function (httpHandler, $q, memorizedayat, settings) {
    var service = {
        getGroups: function (Id) {
            var deferred = $q.defer();
            var MoshafId = settings.settingsData.MoshafId.toString();
            httpHandler.get("Group/GetGroups", { iUserID: Id ,MoshafId:MoshafId}, true).then(function (results) {
                deferred.resolve(results);
            });

            return deferred.promise;
        },
        syncAyatLocalToServer: function () {
            memorizedayat.syncMemorizedAyatLocalToServer();
        }

    }

    return service;
}]);