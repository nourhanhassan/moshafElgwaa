app.factory("downloadSoarImage", ["$cordovaFileTransfer", "$timeout", "$cordovaFile", "$q", "ionicLoading", "$cordovaToast", "$ionicPopup", "$rootScope", function ($cordovaFileTransfer, $timeout, $cordovaFile, $q, ionicLoading, $cordovaToast, $ionicPopup, $rootScope) {
    var service = {
        url: "",
        targetPath: "",
        downloadImage: function (pageNum) {
            var deferred = $q.defer();
            var _this = this; // for use in the callbacks

            // get the next image from the array
            var image = this.remoteImages.pop();
            var imageName = image.split('/').pop(); // just the image name (eg image1.jpg)

            // access the filesystem
            // "LocalFileSystem.PERSISTENT" means it is permanent and not temporary
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                // the "create: true" option will create the file if it doesn't exist
                // the "exclusive: true" option will skip the file if it already exists instead of re-downloading it
                fileSystem.root.getFile(imageName, {create: true, exclusive: true}, function(fileEntry) {
                    // get the full path to the newly created file on the device
                    var localPath = fileEntry.fullPath;

                    // massage the path for android devices (not tested)
                    if (device.platform === "Android" && localPath.indexOf("file://") === 0) {
                        localPath = localPath.substring(7);
                    }

                    // download the remote file and save it
                    var remoteFile = encodeURI(image.ProductImage);
                    var fileTransfer = new FileTransfer();
                    fileTransfer.download(remoteFile, localPath, function(newFileEntry) {
                        // successful download, continue to the next image
                        _this.downloadImages();
                    },
                    function(error) { // error callback for #download
                        console.log('Error with #download method.', error);
                        _this.downloadImages(); // continue working
                    });
                },
                function(error) { // error callback for #getFile
                    console.log('Error with #getFile method.', error);
                    _this.downloadImages(); // continue working
                });
            },
            function(error) { // error callback for #requestFileSystem
                console.log('Error with #requestFileSystem method.', error);
            });
        
            return deferred.promise;
        }
    }
    return service;
}]);
