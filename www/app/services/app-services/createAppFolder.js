app.factory("CreateAppFolder", ["httpHandler", "$q", "file", "recitations", function (httpHandler, $q, file, recitations) {
    var service = {
        localUrl: "",
        AppName: "",
        FolderName:"",
        createAppFolder: function (AppName) {
            service.AppName = AppName;//Moshaf Elgwaa

            var deferred = $q.defer();
            // check app name directory
            file.checkDir(AppName).then(function (res) {
                service.FolderName = service.AppName + "/audio";//Moshaf Elgwaa/audio
                // check audio folder
                file.checkDir(AppName + "/audio").then(function (res1) {
                    file.checkDir(service.FolderName + "/" + recitations.currentRecitation.name).then(function (res2) {
                        deferred.resolve(res2);
                    },function(error){
                        file.createDir(service.FolderName + "/" + recitations.currentRecitation.name).then(function (res2) {
                            deferred.resolve(res2);
                        })
                    })
                }, function (error) { // create audio folder if not exist
                    file.createDir(AppName + "/audio").then(function (result) {
                        file.createDir(result.fullPath.substr(1) + recitations.currentRecitation.name).then(function (res) {
                                    deferred.resolve(res);
                                })
                    })
                })
            }, function (error) {
                file.createDir(service.AppName).then(function (res) {
                    file.createDir(service.AppName + "/audio").then(function (result) {
                        file.createDir(result.fullPath.substr(1) + recitations.currentRecitation.name).then(function (res) {
                            deferred.resolve(res);
                        })
                    })
                })
            })
            return deferred.promise
        }

    }

    return service;
}]);