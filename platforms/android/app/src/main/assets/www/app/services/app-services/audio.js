app.factory("audio", ["httpHandler", "$q", "file", "CreateAppFolder", "fileTransfer", "$timeout", "network", "$cordovaMedia", "permissions", "device", "recitations", "settings", "$state", function (httpHandler, $q, file, CreateAppFolder, fileTransfer, $timeout, network, $cordovaMedia, permissions, device, recitations, settings, $state) {
    var service = {
        //  media: {},
        onlineUrl: "",
        localUrl: "",
        mediaStatus: "",
        currentAyaNumber: "",
        rate : "1.0",
        statusEnum: { none: 0, starting: 1, running: 2, paused: 3, stopped: 4 },
        audioSettings: {},
        play: function (ayaNumber, quality, rate) {
            if (rate == undefined)
                rate = this.rate;
            this.rate = rate;
            var deferred = $q.defer();
            if ($state.current.name == "tab.page" || $state.current.name == "tab.quranText") {
                if (service.currentAyaNumber != ayaNumber || service.mediaStatus == "") {
                    //if (!angular.equals({}, service.media))
                    //   service.media.stop();
                    service.currentAyaNumber = ayaNumber;
                    var directoryName;
                    var media = recitations.currentRecitation.media[recitations.currentRecitation.defaultMedia];


                    if (recitations.currentRecitation.id == 4) {
                        service.onlineUrl = "http://almoshafalsharef.qvtest.com/DataUpload/Ayat/minshawimujawwad_mp3/" + ayaNumber + ".mp3";
                    }

                    else if (recitations.currentRecitation.id == 19) {
                        service.onlineUrl = "http://almoshafalsharef.qvtest.com/DataUpload/Ayat/Quraan-saoodshuraym_mp3/" + ayaNumber + ".mp3";
                    }
                    else {
                        if (quality == "" || quality == undefined) {
                            service.onlineUrl = "http:" + media.path + ayaNumber;
                        }
                        else {
                            service.onlineUrl = "http:" + media.path + ayaNumber + "/" + quality;
                        }

                    }
                    console.log(service.onlineUrl, this.rate)
                    if (device.getPlatform() == "ios") {
                        directoryName = cordova.file.dataDirectory;
                        //directoryName = cordova.file.syncedDataDirectory;
                    }
                    else directoryName = cordova.file.externalRootDirectory;
                    var localUrl = "Moshaf Elgwaa/audio/" + recitations.currentRecitation.name + "/" + ayaNumber + "." + media.type;
                    service.localUrl = directoryName + localUrl;
                    if (device.getPlatform() == "ios") {
                        service.localUrl = service.localUrl.replace("file:///", "/");
                        service.localUrl = decodeURI(service.localUrl);
                    }
                    service.checkAndDownloadFile(localUrl, ayaNumber, service.onlineUrl).then(function () {
                        service.playUrl(service.localUrl, rate).then(function (duration) {
                            deferred.resolve(duration);
                        }, function (err) { deferred.reject(err) }, function (status) {
                            deferred.notify(status);
                        });

                    },
                    function (err) { alert("reject"); deferred.reject(err) })

                }
                else if ((service.mediaStatus == service.statusEnum.paused || service.mediaStatus == service.statusEnum.stopped) && service.currentAyaNumber == ayaNumber) {
                    service.media.play();
                    service.media.setRate(rate);
                    deferred.resolve();
                }
                else {
                    service.media.play();
                    service.media.setRate(rate);
                    deferred.resolve();
                }
            }
            else {
                deferred.reject();
            }
            return deferred.promise;
        },

        checkAndDownloadFile: function (url, ayaNumber,onlineUrl) {
            var deferred = $q.defer();
            file.checkFile(url).then(function (success) {
                deferred.resolve();
            }, function (error) {
                if (network.isOnline()) {
                    var media = recitations.currentRecitation.media[recitations.currentRecitation.defaultMedia];

                    var title = ayaNumber + "." + media.type;

                    CreateAppFolder.createAppFolder("Moshaf Elgwaa").then(function (result) {
            
                        fileTransfer.download(onlineUrl, result.nativeURL + title, result.fullPath).then(function (ret) {
                            deferred.resolve();
                        }).then(function (err) {
                            deferred.reject();
                        })
                    })
                }
                else {
                    network.showNetworkOfflineMsg();
                    deferred.reject("networkError");
                }
            });
            return deferred.promise;
        },
        checkPermissionAndPlay: function () {
            var deferred = $q.defer();
            permissions.checkpermission(permissions.permissions.WRITE_EXTERNAL_STORAGE).then(function (s) {

                if (s.hasPermission) {
                    deferred.resolve();
                }
                else {
                    permissions.requestPermission(permissions.permissions.WRITE_EXTERNAL_STORAGE).then(function (r) {

                        if (r.hasPermission) {
                            deferred.resolve();
                        }
                        else {
                            deferred.reject();
                        }

                    })
                }

            },
          function (er) { })
            return deferred.promise;
        },
        playUrl: function (url, rate) {
            var deferred = $q.defer();
            service.checkPermissionAndPlay().then(function () {
                if (url.length > 0) {
                    if (service.media && service.media.src == url && service.mediaStatus == service.statusEnum.paused) {
                        
                            service.media.play();
                            service.mediaStatus = 2;
                            if (rate)
                                service.media.setRate(rate);
                            deferred.resolve();
                    }
                    else {
                        if (service.media)
                            service.stop();
                        service.media =
                            new Media(url,
                // success callback
                            function () {
                                service.media.release();
                            },
                // error callback
                            function (err) {
                                deferred.reject(err);
                            },
                            function (status) {
                                service.mediaStatus = status

                                deferred.notify(status);

                            });
                        // service.media.setRate(2.0);
                        service.media.play();
                        console.log(rate);
                        if (rate)
                            service.media.setRate(rate);

                    }
                }
            })
            return deferred.promise;
        },
        downloadAudio: function (ayaNumber) {
            var directoryName;
            var media = recitations.currentRecitation.media[recitations.currentRecitation.defaultMedia];


            if (recitations.currentRecitation.id == 4) {
                service.onlineUrl = "http://almoshafalsharef.qvtest.com/DataUpload/Ayat/minshawimujawwad_mp3/" + ayaNumber + ".mp3";
            }

            else if (recitations.currentRecitation.id == 19) {
                service.onlineUrl = "http://almoshafalsharef.qvtest.com/DataUpload/Ayat/Quraan-saoodshuraym_mp3/" + ayaNumber + ".mp3";
            }
            else {
                    service.onlineUrl = "http:" + media.path + ayaNumber;
            }
            if (device.getPlatform() == "ios") {
                directoryName = cordova.file.dataDirectory;
                //directoryName = cordova.file.syncedDataDirectory;
            }
            else directoryName = cordova.file.externalRootDirectory;
            var localUrl = "Moshaf Elgwaa/audio/" + recitations.currentRecitation.name + "/" + ayaNumber + "." + media.type;
            service.localUrl = directoryName + localUrl;
            if (device.getPlatform() == "ios") {
                service.localUrl = service.localUrl.replace("file:///", "/");
                service.localUrl = decodeURI(service.localUrl);
            }
            service.checkAndDownloadFile(localUrl, ayaNumber)

        },
        download: function (fromAya, toAya) {
            var deferred = $q.defer();
            var ayaNumber = fromAya;
            service.downloadAudioByAya(ayaNumber, fromAya, toAya).then(function () {
                debugger
                deferred.resolve();
            });
            return deferred.promise;
        },
        downloadAudioByAya: function (ayaNumber, fromAya, toAya) {
            var deferred = $q.defer();
            var directoryName;
            var media = recitations.currentRecitation.media[recitations.currentRecitation.defaultMedia];
            if (recitations.currentRecitation.id == 4) {
                service.onlineUrl = "http://almoshafalsharef.qvtest.com/DataUpload/Ayat/minshawimujawwad_mp3/" + ayaNumber + ".mp3";
            }

            else if (recitations.currentRecitation.id == 19) {
                service.onlineUrl = "http://almoshafalsharef.qvtest.com/DataUpload/Ayat/Quraan-saoodshuraym_mp3/" + ayaNumber + ".mp3";
            }
            else {
                service.onlineUrl = "http:" + media.path + ayaNumber;
            }
            if (device.getPlatform() == "ios") {
                directoryName = cordova.file.dataDirectory;
            }
            else directoryName = cordova.file.externalRootDirectory;
            var localUrl = "Moshaf Elgwaa/audio/" + recitations.currentRecitation.name + "/" + ayaNumber + "." + media.type;
            service.localUrl = directoryName + localUrl;
            if (device.getPlatform() == "ios") {
                service.localUrl = service.localUrl.replace("file:///", "/");
                service.localUrl = decodeURI(service.localUrl);
            }
            service.checkAndDownloadFile(localUrl, ayaNumber).then(function () {
                console.log("suc downloading" + localUrl);
                if (ayaNumber <toAya)
                {
                    ayaNumber++;
                    service.downloadAudioByAya(ayaNumber, fromAya, toAya);
                }
                else
                {
                    deferred.resolve();
                //    if (retval == (toAya - fromAya + 1)) {
                //        deferred.resolve();
                //    }
                //    else {
                //        deferred.reject();
                //    }
                  // return deferred.promise;
                }
            }, function (err) {
                console.log("error downloading" + localUrl);

            })
            return deferred.promise;
        },
        checkAndDownloadAudio: function (url,srcUrl, ayaNumber) {
            var deferred = $q.defer();
            file.checkFile(url).then(function (success) {
                deferred.resolve();
            }, function (error) {
                if (network.isOnline()) {
                    var media = recitations.currentRecitation.media[recitations.currentRecitation.defaultMedia];

                    var title = ayaNumber + "." + media.type;

                    CreateAppFolder.createAppFolder("Moshaf Elgwaa").then(function (result) {

                        fileTransfer.download(srcUrl, result.nativeURL + title, result.fullPath).then(function (ret) {
                            deferred.resolve();
                        }).then(function (err) {
                            deferred.reject();
                        })
                    })
                }
                else {
                    network.showNetworkOfflineMsg();
                    deferred.reject("networkError");
                }
            });
            return deferred.promise;
        },
        downloadAudioRange: function (startAya, EndAya) {
            //var deferred = $q.defer();
            var directoryName;
            var media = recitations.currentRecitation.media[recitations.currentRecitation.defaultMedia];


            if (recitations.currentRecitation.id == 4) {
                service.onlineUrl = "http://almoshafalsharef.qvtest.com/DataUpload/Ayat/minshawimujawwad_mp3/" + ayaNumber + ".mp3";
            }

            else if (recitations.currentRecitation.id == 19) {
                service.onlineUrl = "http://almoshafalsharef.qvtest.com/DataUpload/Ayat/Quraan-saoodshuraym_mp3/" + ayaNumber + ".mp3";
            }
            else {
                    service.onlineUrl = "http:" + media.path + ayaNumber;
            }
            if (device.getPlatform() == "ios") {
                directoryName = cordova.file.dataDirectory;
                //directoryName = cordova.file.syncedDataDirectory;
            }
            else directoryName = cordova.file.externalRootDirectory;
            var localUrl = "Moshaf Elgwaa/audio/" + recitations.currentRecitation.name + "/" + ayaNumber + "." + media.type;
            service.localUrl = directoryName + localUrl;
            if (device.getPlatform() == "ios") {
                service.localUrl = service.localUrl.replace("file:///", "/");
                service.localUrl = decodeURI(service.localUrl);
            }
            service.checkAndDownloadFile(localUrl, ayaNumber);
            for (var ayaNumber = startAya; ayaNumber < EndAya; ayaNumber++) {
                service.checkAndDownloadFile(localUrl, ayaNumber);
            }
            //deferred.resolve();
        },
        pause: function (ayaNumber) {
            service.media.pause();
            service.mediaStatus = 3;
        },
        stop: function () {
            if (service.media) {
                service.media.stop();
                service.media.release();
            }
        },
        init: function () {
            var recitationId = settings.settingsData.recitationId;
            recitationId = recitationId > 0 ? recitationId : 1;
            recitations.setCurrentRecitation(recitationId);

            this.resetAudioSettings();
        },
        resetAudioSettings: function () {
            this.audioSettings = { currentAya: 0, status: 0, stoppedByUser: false };
        }
    }
    service.init();
    return service;
}]);
