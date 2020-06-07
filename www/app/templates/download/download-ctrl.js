app.controller("downloadController", ["$scope", "$state", "$rootScope", "enums", "device", "file", "fileTransfer", "network", "permissions", "$ionicModal", "moshafdb", "moshafdbKalon", "moshafdbShmr", "moshafdata", "ayatData", "ayatTafseer", "$q", "settings", "mark", "$stateParams", function ($scope, $state, $rootScope, enums, device, file, fileTransfer, network, permissions, $ionicModal, moshafdb, moshafdbKalon, moshafdbShmr, moshafdata, ayatData, ayatTafseer, $q, settings, mark, $stateParams) {


    $scope.downloadImages = function (MoshafId, all, start, end) {
        var settingsData = settings.settingsData;
        var AppName = enums.appData.nameEn;
        var targetPath = enums.appData.targetPath;
        var directoryName = "";
        var path = "";
        if (device.getPlatform() == "ios") {
            directoryName = cordova.file.dataDirectory;
        }
        else directoryName = cordova.file.externalRootDirectory;
        path = directoryName + targetPath;
        if (device.getPlatform() == "ios") {
            path = path.replace("file:///", "/");
            path = decodeURI(path);
        }
        var source = "";
        var pagesCount = 0;
        var filePath = "";
        if (MoshafId == enums.MoshafId.hafs) {
            source = enums.appData.imagesLink + enums.mosahfCopy.hafs.nameEn + "/";
            if (all == true) {
                pagesCount = enums.mosahfCopy.hafs.pagesCount;
                start = 1;
                end = pagesCount;
            }
            path = path + "/" + enums.mosahfCopy.hafs.nameEn;
            filePath = targetPath + "/" + enums.mosahfCopy.hafs.nameEn;
        }
        else if (MoshafId == enums.MoshafId.shamrly) {
            source = enums.appData.imagesLink + enums.mosahfCopy.shamrly.nameEn + "/";
            if (all == true) {
                pagesCount = enums.mosahfCopy.shamrly.pagesCount;
                start = 1;
                end = pagesCount;
            }
            path = path + "/" + enums.mosahfCopy.shamrly.nameEn;
            filePath = targetPath + "/" + enums.mosahfCopy.shamrly.nameEn;
        }
        else if (MoshafId == enums.MoshafId.qalon) {
            source = enums.appData.imagesLink + enums.mosahfCopy.qalon.nameEn + "/";
            if (all == true) {
                pagesCount = enums.mosahfCopy.qalon.pagesCount;
                start = 1;
                end = pagesCount;
            }
            path = path + "/" + enums.mosahfCopy.qalon.nameEn;
            filePath = targetPath + "/" + enums.mosahfCopy.qalon.nameEn;
        }
        else if (MoshafId == enums.MoshafId.warsh) {
            source = enums.appData.imagesLink + enums.mosahfCopy.warsh.nameEn + "/";
            if (all == true) {
                pagesCount = enums.mosahfCopy.warsh.pagesCount;
                start = 1;
                end = pagesCount;
            }
            path = path + "/" + enums.mosahfCopy.warsh.nameEn;
            filePath = targetPath + "/" + enums.mosahfCopy.warsh.nameEn;
        }

        if (all == false) {
            pagesCount = end - start + 1;
        }

        var sourceUrl = "";
        var dest = "";
        file.checkDir(AppName).then(function (res) {
            if (device.getPlatform() == "android") {

                window.resolveLocalFileSystemURL(
                    cordova.file.externalRootDirectory,
                    function (dir) {
                        dir.getFile(
                            AppName + '/.nomedia',
                            { create: true },
                            function (file) {
                                console.log('got the file ', file);
                            }
                        );
                    }
                );
            }
            file.checkDir(targetPath).then(function (res1) {
                downloadeImage(start);
            }, function (error) { // create  folder if not exist
                file.createDir(targetPath).then(function (result) {
                    console.log(targetPath + " created");
                    downloadeImage(start);
                })
            })
        }, function (error) {
            file.createDir(AppName).then(function (res) {
                console.log(AppName + " created");
                if (device.getPlatform() == "android") {
                    window.resolveLocalFileSystemURL(
                        cordova.file.externalRootDirectory,
                        function (dir) {
                            dir.getFile(
                                AppName + '/.nomedia',
                                { create: true },
                                function (file) {
                                    console.log('got the file ', file);
                                }
                            );
                        }
                    );
                }
                file.createDir(targetPath).then(function (result) {
                    console.log(targetPath + " created");
                    downloadeImage(start);
                })
            })
        })

        function downloadeImage(pageNumber) {
            $rootScope.modal.show();
            $rootScope.downloadingPercentage = pageNumber * (100 / pagesCount);
            var pageName = pageNumber < 10 ? "page00" + pageNumber : pageNumber < 100 ? "page0" + pageNumber : "page" + pageNumber;
            var sourceUrl = source + pageName + ".png";
            var dest = path + "/" + pageName + ".png";
            var imagePath = filePath + "/" + pageName + ".png";

            file.checkFile(imagePath).then(function (success) {
                console.log(imagePath + " exist");
                pageNumber++;
                if (pageNumber <= end) {
                    downloadeImage(pageNumber)
                }
                if (pageNumber == end + 1) {
                    $rootScope.modal.hide();
                    initMoshafDB(MoshafId);
                }
            }, function (error) {
                console.log(imagePath + " not found");
                if (network.isOnline()) {
                    fileTransfer.download(sourceUrl, dest, "").then(function (ret) {
                        console.log(sourceUrl + " " + dest + " downloaded");
                        pageNumber++;
                        if (pageNumber <= end) {
                            downloadeImage(pageNumber)
                        }
                        if (pageNumber == end + 1) {
                            $rootScope.modal.hide();
                            initMoshafDB(MoshafId);
                        }
                    }).then(function (err) {
                        console.log(err);
                    });
                }
                else {
                    network.showNetworkOfflineMsg();
                }

            });

        }

    }

    function initMoshafDB(MoshafId) {
        if (MoshafId == enums.MoshafId.hafs) {
            initMoshafHafsDB(MoshafId);
        }
        else if (MoshafId == enums.MoshafId.shamrly) {
            initMoshafShamrlyDB(MoshafId);
        }
        else if (MoshafId == enums.MoshafId.qalon) {
            initMoshafQalonDB(MoshafId);
        }
        else if (MoshafId == enums.MoshafId.warsh) {

        }
    }
    function initMoshafDB(MoshafId) {
        if (MoshafId == enums.MoshafId.hafs) {
            initMoshafHafsDB(MoshafId);
        }
        else if (MoshafId == enums.MoshafId.shamrly) {
            initMoshafShamrlyDB(MoshafId);
        }
        else if (MoshafId == enums.MoshafId.qalon) {
            initMoshafQalonDB(MoshafId);
        }
        else if (MoshafId == enums.MoshafId.warsh) {

        }
    }

    function initMoshafHafsDB(MoshafId) {
        moshafdb.initDb().then(function () {
            var surahsPromise = moshafdata.getSurahs();
            surahsPromise.then(function (result) {
                ayatData.surahs = result;
            });

            var partsPromise = moshafdata.getParts();
            partsPromise.then(function (result) {
                ayatData.juzs = result;

            })
            var ayatPromise = moshafdata.getAyat();
            ayatPromise.then(function (result) {
                ayatData.ayat = result.sort(function (a, b) {
                    return a.id - b.id;
                });
            });
            var ayatTafseerPromise = moshafdata.getAyatTafseer();
            ayatTafseerPromise.then(function (result) {
                ayatTafseer.ayatTafseer = result.sort(function (a, b) {
                    return a.id - b.id;
                });
            });
            $q.all([surahsPromise, partsPromise, ayatPromise, ayatTafseerPromise]).then(function () {
                settings.setMoshafIdValue(MoshafId);
                $rootScope.hafs = true;
                $state.go("tab.page", { page: 1 });
            })
        });
    }

    function initMoshafQalonDB(MoshafId) {
        moshafdbKalon.initDb().then(function () {
            var surahsPromise = moshafdata.getSurahs();
            surahsPromise.then(function (result) {
                ayatData.surahs = result;
            });

            var partsPromise = moshafdata.getParts();
            partsPromise.then(function (result) {
                ayatData.juzs = result;

            })
            var ayatPromise = moshafdata.getAyat();
            ayatPromise.then(function (result) {
                ayatData.ayat = result.sort(function (a, b) {
                    return a.id - b.id;
                });
            });
            var ayatTafseerPromise = moshafdata.getAyatTafseer();
            ayatTafseerPromise.then(function (result) {
                ayatTafseer.ayatTafseer = result.sort(function (a, b) {
                    return a.id - b.id;
                });
            });
            $q.all([surahsPromise, partsPromise, ayatPromise, ayatTafseerPromise]).then(function () {
                settings.setMoshafIdValue(MoshafId);
                $rootScope.qalon = true;
                $state.go("tab.page", { page: 1 });

            })
        });
    }

    function initMoshafShamrlyDB(MoshafId) {
        moshafdbShmr.initDb().then(function () {
            var surahsPromise = moshafdata.getSurahs();
            surahsPromise.then(function (result) {
                ayatData.surahs = result;
            });

            var partsPromise = moshafdata.getParts();
            partsPromise.then(function (result) {
                ayatData.juzs = result;

            })
            var ayatPromise = moshafdata.getAyat();
            ayatPromise.then(function (result) {
                ayatData.ayat = result.sort(function (a, b) {
                    return a.id - b.id;
                });
            });
            var ayatTafseerPromise = moshafdata.getAyatTafseer();
            ayatTafseerPromise.then(function (result) {
                ayatTafseer.ayatTafseer = result.sort(function (a, b) {
                    return a.id - b.id;
                });
            });
            $q.all([surahsPromise, partsPromise, ayatPromise, ayatTafseerPromise]).then(function () {
                settings.setMoshafIdValue(MoshafId);
                $rootScope.shamrly = true;
                $state.go("tab.page", { page: 1 });

            })
        });
    }

    $ionicModal.fromTemplateUrl('app/templates/popovers/loading.html', {
        scope: $rootScope,
        animation: 'slide-in-up',
    }).then(function (modal) {
        $rootScope.modal = modal;

    });

    $scope.download = function (MoshafId, pageFrom, pageTo) {
        if ($scope.ispageNumberValid && $scope.pageFromValid && $scope.pageToValid) {
            $scope.downloadImages(MoshafId, false, pageFrom, pageTo);
        }
    }

    $scope.validatePageNumber = function (pageFrom, pageTo) {
        if (pageFrom != undefined && pageTo != undefined) {
            if (pageFrom > pageTo || pageTo < pageFrom || pageFrom == undefined || pageTo == undefined) {

                $scope.ispageNumberValid = false;
            }
            else
                $scope.ispageNumberValid = true;

        }
        if (pageFrom == undefined) {
            $scope.pageFromValid = false;

        }
        else {
            $scope.pageFromValid = true;
        }
        if (pageTo == undefined) {
            $scope.pageToValid = false;

        }
        else {
            $scope.pageToValid = true;
        }
    }

    $scope.init = function () {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
        $rootScope.hideMem = true;
        $scope.ispageNumberValid = true;
        $scope.pageToValid = true;
        $scope.pageFromValid = true;
        $scope.MoshafId = $stateParams.MoshafId;
        var ImagesPath = "";
        $scope.disabled = false;
        var directoryName = "";
        //var path = "";
        if (device.getPlatform() == "ios") {
            directoryName = cordova.file.dataDirectory;
        }
        else directoryName = cordova.file.externalRootDirectory;
        if ($scope.MoshafId == enums.MoshafId.hafs) {
            window.resolveLocalFileSystemURL(directoryName + enums.appData.targetPath + "/" + enums.mosahfCopy.hafs.nameEn, function (fileSystem) {
                var reader = fileSystem.createReader();
                reader.readEntries(
                  function (entries) {
                      $rootScope.hafsCount = entries.length;
                      if (entries.length == enums.mosahfCopy.hafs.pagesCount) {
                          $scope.disabled = true;
                          //$rootScope.hafs = true;
                          //$rootScope.nohafs = false;
                          //settings.sethafsIsDownloadedValue(true);
                      } else {
                          if (entries.length == 0) { //$rootScope.nohafs = true; 
                          }
                          //$rootScope.hafs = false;
                          //settings.sethafsIsDownloadedValue(false);
                      }
                  },
                  function (err) {
                      console.log(err);
                  }
                );
            }, function (err) { console.log(err); });
        }
        else if (MoshafId == enums.MoshafId.shamrly) {
            window.resolveLocalFileSystemURL(directoryName + enums.appData.targetPath + "/" + enums.mosahfCopy.shamrly.nameEn, function (fileSystem) {
                var reader = fileSystem.createReader();
                reader.readEntries(
                  function (entries) {
                      $rootScope.shamrlyCount = entries.length;
                      if (entries.length == enums.mosahfCopy.shamrly.pagesCount) {
                          $scope.disabled = true;
                          //$rootScope.shamrly = true;
                          //$rootScope.noshamrly = false;
                          //settings.setshamrlyIsDownloadedValue(true);
                      } else {
                          if (entries.length == 0) {
                              //$rootScope.noshamrly = true;
                          }
                          //$rootScope.shamrly = false;
                          //settings.setshamrlyIsDownloadedValue(false);
                      }
                  },
                  function (err) {
                      console.log(err);
                  }
                );
            }, function (err) { console.log(err); });

        }
        else if (MoshafId == enums.MoshafId.qalon) {
            window.resolveLocalFileSystemURL(directoryName + enums.appData.targetPath + "/" + enums.mosahfCopy.qalon.nameEn, function (fileSystem) {
                var reader = fileSystem.createReader();
                reader.readEntries(
                  function (entries) {
                      $rootScope.qalonCount = entries.length;
                      if (entries.length == enums.mosahfCopy.qalon.pagesCount) {
                          $scope.disabled = true;
                          //$rootScope.qalon = true;
                          //$rootScope.noqalon = false;
                          //settings.setqalonIsDownloadedValue(true);
                      } else {
                          if (entries.length == 0) {
                              //$rootScope.noqalon = true;
                          }
                          //$rootScope.qalon = false;
                          //settings.setqalonIsDownloadedValue(false);
                      }
                  },
                  function (err) {
                      console.log(err);
                  }
                );
            }, function (err) { console.log(err); });

        }
        else if (MoshafId == enums.MoshafId.warsh) {

        }


    }

    $scope.init();
}]);
