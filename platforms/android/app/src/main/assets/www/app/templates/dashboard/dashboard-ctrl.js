app.controller("dashboardController", ["$scope", "$rootScope", "$stateParams", "$state", "mark", "settings", "enums", "user", "device", "file", "fileTransfer", "network", "$ionicLoading", "$ionicModal", "moshafdb", "moshafdbKalon", "moshafdbShmr", "moshafdata", "ayatData", "ayatTafseer", "$q", "settings", "mark", "$ionicPlatform", function ($scope, $rootScope, $stateParams, $state, mark, settings, enums, user, device, file, fileTransfer, network, $ionicLoading, $ionicModal, moshafdb, moshafdbKalon, moshafdbShmr, moshafdata, ayatData, ayatTafseer, $q, settings, mark, $ionicPlatform) {

    $scope.init = function () {
        $rootScope.activePage = "dashboard";
        $rootScope.canCancel = false;
        $scope.enums = enums;
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
        //document.getElementsByTagName('ion-nav-bar')[1].style.display = 'none';
        $rootScope.hideCancelMem = true;
        $ionicPlatform.ready(function () {
            var directory = "";
            if (device.getPlatform() == "ios") {
                directory = cordova.file.dataDirectory;
            }
            else directory = cordova.file.externalRootDirectory;

            window.resolveLocalFileSystemURL(directory + enums.appData.targetPath + "/" + enums.mosahfCopy.hafs.nameEn, function (fileSystem) {
                var reader = fileSystem.createReader();
                reader.readEntries(
                  function (entries) {
                      $rootScope.hafsCount = entries.length;
                  },
                  function (err) {
                      console.log(err);
                  }
                );
            }, function (err) { console.log(err); });
            window.resolveLocalFileSystemURL(directory + enums.appData.targetPath + "/" + enums.mosahfCopy.shamrly.nameEn, function (fileSystem) {
                var reader = fileSystem.createReader();
                reader.readEntries(
                  function (entries) {
                      $rootScope.shamrlyCount = entries.length;
                  },
                  function (err) {
                      console.log(err);
                  }
                );
            }, function (err) { console.log(err); });
            window.resolveLocalFileSystemURL(directory + enums.appData.targetPath + "/" + enums.mosahfCopy.qalon.nameEn, function (fileSystem) {
                var reader = fileSystem.createReader();
                reader.readEntries(
                  function (entries) {
                      $rootScope.qalonCount = entries.length;
                  },
                  function (err) {
                      console.log(err);
                  }
                );
            }, function (err) { console.log(err); });
            window.resolveLocalFileSystemURL(directory + enums.appData.targetPath + "/" + enums.mosahfCopy.warsh.nameEn, function (fileSystem) {
                var reader = fileSystem.createReader();
                reader.readEntries(
                  function (entries) {
                      $rootScope.warshCount = entries.length;
                  },
                  function (err) {
                      console.log(err);
                  }
                );
            }, function (err) { console.log(err); });

        });
    }

    $scope.readMode = function () {

        $rootScope.activePage = 'read';
        var MoshafId = settings.settingsData.MoshafId.toString();
        var settingsData = settings.settingsData;
        var lastPage = mark.getLastReadPage();
        var pageNum = 1;
        if (Object.keys(lastPage).length) {
            pageNum = lastPage.pageNumber;
        }

        if (MoshafId == enums.MoshafId.hafstext) {
            $rootScope.inDoaaBook = false;
            $state.go("tab.quranText", { page: lastPage.pageNumber });
        }
        else {

            $rootScope.inDoaaBook = false;

            if ((MoshafId == enums.MoshafId.hafs && $rootScope.hafsCount == enums.mosahfCopy.hafs.pagesCount)
        || (MoshafId == enums.MoshafId.shamrly && $rootScope.shamrlyCount == enums.mosahfCopy.shamrly.pagesCount)
            || (MoshafId == enums.MoshafId.qalon && $rootScope.qalonCount == enums.mosahfCopy.qalon.pagesCount)
                   || (MoshafId == enums.MoshafId.warsh && $rootScope.warshCount == enums.mosahfCopy.warsh.pagesCount)
                ) {
                var lastPage = mark.getLastReadPage();
                $state.go("tab.page", { page: lastPage.pageNumber });
            }
            else if ((MoshafId == enums.MoshafId.hafs && $rootScope.hafsCount < enums.mosahfCopy.hafs.pagesCount && $rootScope.hafsCount > 0)
|| (MoshafId == enums.MoshafId.shamrly && $rootScope.shamrlyCount < enums.mosahfCopy.shamrly.pagesCount && $rootScope.shamrlyCount > 0)
    || (MoshafId == enums.MoshafId.qalon && $rootScope.qalonCount < enums.mosahfCopy.qalon.pagesCount && $rootScope.qalonCount > 0)
                    || (MoshafId == enums.MoshafId.warsh && $rootScope.warshCount < enums.mosahfCopy.warsh.pagesCount && $rootScope.warshCount > 0)
                ) {
                downloadImages(MoshafId);
            }
            else {
                $state.go("moshafCopy");
            }


        }
    }

    $scope.setAlarm = function () {
        $rootScope.activePage = 'alarm-list';
        $state.go("alarm-list");
        $rootScope.inDoaaBook = false;

    }
    $scope.doaaBook = function () {
        $rootScope.activePage = 'index';
        $rootScope.inDoaaBook = true;
        $state.go("index");
    }

    ///////////////////
    //check if user logged in
    $scope.userInfo = user.data.profile;
    $scope.canRegister = true;
    if ($scope.userInfo.id > 0 && $scope.userInfo.isActive == true) {
        $scope.canRegister = false;
    }

    $scope.shareApp = function () {
        var socialLink = "";
        if (device.getPlatform() == "ios") {
            socialLink = "https://apps.apple.com/us/app/مصحف-الجواء/id1461142764";
        } else {
            socialLink = "https://play.google.com/store/apps/details?id=com.qvsite.MoshafThird";

        }
        window.plugins.socialsharing.share('مصحف الجواء',
     null,
 null,
     socialLink)
    }

    $ionicModal.fromTemplateUrl('app/templates/popovers/soon.html', {
        scope: $scope,
        animation: 'slide-in-up',
    }).then(function (modal) {
        $scope.modal = modal;

    });

    $scope.soon = function () {
        $scope.modal.show();
    }

    $scope.closeModal = function () {
        $scope.modal.hide();
    };

    function downloadImages(MoshafId) {
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
        var source = "";
        var pagesCount = 0;
        var filePath = "";
        if (MoshafId == enums.MoshafId.hafs) {
            source = enums.appData.imagesLink + enums.mosahfCopy.hafs.nameEn + "/";
            pagesCount = enums.mosahfCopy.hafs.pagesCount;
            path = path + "/" + enums.mosahfCopy.hafs.nameEn;
            filePath = targetPath + "/" + enums.mosahfCopy.hafs.nameEn;
        }
        else if (MoshafId == enums.MoshafId.shamrly) {
            source = enums.appData.imagesLink + enums.mosahfCopy.shamrly.nameEn + "/";
            pagesCount = enums.mosahfCopy.shamrly.pagesCount;
            path = path + "/" + enums.mosahfCopy.shamrly.nameEn;
            filePath = targetPath + "/" + enums.mosahfCopy.shamrly.nameEn;
        }
        else if (MoshafId == enums.MoshafId.qalon) {
            source = enums.appData.imagesLink + enums.mosahfCopy.qalon.nameEn + "/";
            pagesCount = enums.mosahfCopy.qalon.pagesCount;
            path = path + "/" + enums.mosahfCopy.qalon.nameEn;
            filePath = targetPath + "/" + enums.mosahfCopy.qalon.nameEn;
        }
        else if (MoshafId == enums.MoshafId.warsh) {
            source = enums.appData.imagesLink + enums.mosahfCopy.warsh.nameEn + "/";
            pagesCount = enums.mosahfCopy.warsh.pagesCount;
            path = path + "/" + enums.mosahfCopy.warsh.nameEn;
            filePath = targetPath + "/" + enums.mosahfCopy.warsh.nameEn;
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

                var pageNum = 1;
                downloadeImage(pageNum);
            }, function (error) { // create  folder if not exist
                file.createDir(targetPath).then(function (result) {
                    console.log(targetPath + " created");
                    var pageNum = 1;
                    downloadeImage(pageNum);
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
                    var pageNum = 1;
                    downloadeImage(pageNum);
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
                if (pageNumber <= pagesCount) {
                    downloadeImage(pageNumber)
                }
                if (pageNumber == pagesCount + 1) {
                    $rootScope.modal.hide();
                    initMoshafDB(MoshafId);
                }
            }, function (error) {
                console.log(imagePath + " not found");
                if (network.isOnline()) {
                    fileTransfer.download(sourceUrl, dest, "").then(function (ret) {
                        console.log(sourceUrl + " " + dest + " downloaded");
                        pageNumber++;
                        if (pageNumber <= pagesCount) {
                            downloadeImage(pageNumber)
                        }
                        if (pageNumber == pagesCount + 1) {
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
                var lastPage = mark.getLastReadPage();
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

    function initMoshafWarshDB(MoshafId) {
        moshafdbwarsh.initDb().then(function () {
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



    $scope.init();
}]);
