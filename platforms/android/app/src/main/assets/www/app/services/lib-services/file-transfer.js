app.factory("fileTransfer", ["$cordovaFileTransfer", "$cordovaFile", "$q", "$timeout", "httpHandler", "device", "ionicLoading", "file", 
    function ($cordovaFileTransfer, $cordovaFile, $q, $timeout, httpHandler, device, ionicLoading, file) {
        return {
            //resolve URL File
            resolvefile: function(fileEntry, filetype) {
              
                if (device.getPlatform() == "ios") {
                    if (fileEntry.indexOf("file://") < 0) {
                        fileEntry = "file://" + fileEntry;
                    }
                }

                ////alert('resolvefile');
                ////alert(JSON.stringify(fileEntry));
                var self = this;
                var deferred = $q.defer();
                // //alert(typeof (window.resolveLocalFileSystemURL));
                // //alert(typeof (resolveLocalFileSystemURL));
                
                    window.resolveLocalFileSystemURL(fileEntry, function() {
                      
                        self.upload(fileEntry, filetype).then(function(response) {
                            deferred.resolve(response);
                        });
                    }, function(error) {
                        deferred.reject(error);
                    });
                



                return deferred.promise
            },

            //main upload function take fileEntry and type of this file 
            //filetype image,audio,video
            upload: function(fileEntry, filetype) {
                ////alert('uploadfunction');
                ////alert(fileEntry);           
                var serverURL = httpHandler.URLDataUploadDonationImage;
                var name = fileEntry.substr(fileEntry.lastIndexOf('/') + 1);
                options = new FileUploadOptions();
                options.fileKey = "fileupload";
                chunkedMode: false,
                options.fileName = name;

               if (filetype == "image") {
                    options.mimeType = "image/jpeg";
                }
                else if (filetype == "audio") {
                    options.mimeType = "audio/mp3";
                }
                else if (filetype == "video") {
                    options.mimeType = "video/mp4";
                }
                options.chunkedMode = false;
                options.params = { // Whatever you populate options.params with, will be available in req.body at the server-side.
                    "description": "Uploaded from my phone"
                };
                //alert("serverURL" + serverURL);
                //alert("fileEntry" + fileEntry);

                ionicLoading.show({ templateText: "جاري التحميل .. برجاء الانتظار" });
                return $cordovaFileTransfer.upload(serverURL, fileEntry, options).then(function(result) {
                    //alert("SUCCESS: " + JSON.stringify(result.response));
                    console.log("SUCCESS: " + JSON.stringify(result.response));
                    ionicLoading.hide();
                    ////alert(JSON.stringify(result.response));
                    return result.response;
                }, function (err) {
                    ionicLoading.hide();
                    //alert("ERROR: " + JSON.stringify(err));
                }, function(progress) {
                    // constant progress updateshttp:
                });
            },
            download: function (url, targetPath,dir) {
                var trustHosts = true;
                var options = {};
                var deferred = $q.defer();
                var self = this;
                //   ionicLoading.show({ templateText: "Loading .. Please wait" });
                $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
      .then(function (result) {
          // Success!
          deferred.resolve(result);
        //  ionicLoading.show({ templateText: "Download completed successfully " });

          $timeout(function () {
              ionicLoading.hide();

          },900);
      }, function (err) {
          // Error
          console.log(err)
          //  deferred.reject(err);
          if (err.exception.toLowerCase().indexOf("permission denied") != -1) {
              file.removeRecursively(dir).then(function (res) {
                return  self.download(url, targetPath)

              })
          }
          else
         {
          //ionicLoading.show({ templateText: " An error has occurred. There is an error in the link " });

          //$timeout(function () {
          //    ionicLoading.hide();


          //    }, 900);
          }

      }, function (progress) {
         
      });
                return deferred.promise

            
            }

        }
    }
]);

