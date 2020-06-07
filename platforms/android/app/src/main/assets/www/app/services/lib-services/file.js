app.factory("file", [ "$cordovaFile", "$q", "httpHandler", "device", "ionicLoading",
    function ($cordovaFile, $q, httpHandler, device, ionicLoading) {
        return {
            checkDir: function (dirName) {
                var deferred = $q.defer();
                var directoryName = ""
                if (device.getPlatform() == "ios") {
                    directoryName=cordova.file.dataDirectory;
                }
                else directoryName = cordova.file.externalRootDirectory;
                $cordovaFile.checkDir(directoryName, dirName).then(function (success) {
                    deferred.resolve(success);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise

            },
            createDir: function (dirName) {
                var deferred = $q.defer();
                var fileEntry = "";
                if (device.getPlatform() == "ios") {
                     fileEntry=cordova.file.dataDirectory;
                }
                else fileEntry = cordova.file.externalRootDirectory;
                $cordovaFile.createDir(fileEntry, dirName, true).then(function (success) {
                    deferred.resolve(success);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise

            },
            deleteDir: function (dirName) {
                var deferred = $q.defer();
                var fileEntry = "";
                if (device.getPlatform() == "ios") {
                    // fileEntry=cordova.file.dataDirectory;
                    fileEntry = cordova.file.syncedDataDirectory;

                }
                else fileEntry = cordova.file.externalRootDirectory;

                $cordovaFile.removeDir(fileEntry, dirName).then(function (success) {
                    // success
                    deferred.resolve(success);

                }, function (error) {
                    // error
                    deferred.reject(error);

                });
                return deferred.promise

            },
            checkFile: function (fileName)
            {
                var deferred = $q.defer();
                var directoryName = ""
                if (device.getPlatform() == "ios") {
                    directoryName = cordova.file.dataDirectory;
                    //directoryName = cordova.file.syncedDataDirectory;
                }
                else directoryName = cordova.file.externalRootDirectory;
                //cordova.file.dataDirectory
                $cordovaFile.checkFile(directoryName, fileName).then(function (success) {
                    deferred.resolve(success);

                    // success
                }, function (error) {
                    deferred.reject(error);

                });
                return deferred.promise

            }
            ,
            removeRecursively: function (dirName) {
                var deferred = $q.defer();
                var fileEntry = "";
                if (device.getPlatform() == "ios") {
                    // fileEntry=cordova.file.dataDirectory;
                    fileEntry = cordova.file.syncedDataDirectory;

                }
                else fileEntry = cordova.file.externalRootDirectory;

                $cordovaFile.removeRecursively(fileEntry, dirName).then(function (success) {
                    // success
                    deferred.resolve(success);

                }, function (error) {
                    // error
                    deferred.reject(error);

                });


                return deferred.promise

            }
            ,
            removeFile: function (filename, path) {
                var deferred = $q.defer();
                window.resolveLocalFileSystemURL(path, function (dir) {
                    dir.getFile(filename, { create: false }, function (fileEntry) {
                        fileEntry.remove(function () {
                            deferred.resolve(filename);
                            console.log("The file has been removed succesfully");
                        }, function (error) {
                            console.log("Error deleting the file");
                        }, function () {
                            console.log("The file doesn't exist");
                        });
                    });
                });
                return deferred.promise
            }

        }
    }
        
    
]);

