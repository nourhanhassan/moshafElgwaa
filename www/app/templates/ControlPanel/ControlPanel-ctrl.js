app.controller("ControlPanelController", ["$scope", "$state", "$rootScope", "enums", "device", "file", "fileTransfer", "network", "permissions", "$ionicModal", "moshafdb", "moshafdbKalon", "moshafdbShmr", "moshafdata", "ayatData", "ayatTafseer", "$q", "settings", "mark", "toast","moshafdbwarsh", function ($scope, $state, $rootScope, enums, device, file, fileTransfer, network, permissions, $ionicModal, moshafdb, moshafdbKalon, moshafdbShmr, moshafdata, ayatData, ayatTafseer, $q, settings, mark, toast,moshafdbwarsh) {
   
    /*moshaf-copy*/

    $scope.download = function (MoshafId) {
        downloadImages(MoshafId);
    }

    function downloadImages(MoshafId) {
        $scope.downloading=true; 
        var downloader = new BackgroundTransfer.BackgroundDownloader();

        $rootScope.modal.show();
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
            //if (device.getPlatform() == "android") {

            window.resolveLocalFileSystemURL(
                directoryName,
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
            //}
            file.checkDir(targetPath).then(function (res1) {

                file.checkDir(filePath).then(function (res1) {
                    var pageNum = 1;
                    downloadeImage(pageNum);
                }, function (error) {
                    file.createDir(filePath).then(function (result) {
                        var pageNum = 1;
                        downloadeImage(pageNum);
                    })
                })
            }, function (error) { // create  folder if not exist
                file.createDir(targetPath).then(function (result) {
                    file.createDir(filePath).then(function (result) {
                        var pageNum = 1;
                        downloadeImage(pageNum);
                    })
                })
            })
        }, function (error) {
            file.createDir(AppName).then(function (res) {
                console.log(AppName + " created");
                //if (device.getPlatform() == "android") {
                window.resolveLocalFileSystemURL(
                    directoryName,
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
                //}
                file.createDir(targetPath).then(function (result) {
                    file.createDir(filePath).then(function (result) {
                        var pageNum = 1;
                        downloadeImage(pageNum);
                    })
                })
            })
        })

        function downloadeImage(pageNumber) {
            if($scope.downloading){
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
                        //fileTransfer.download(sourceUrl, dest, "").then(function (ret) {
                        //    console.log(sourceUrl + " " + dest + " downloaded");
                        //    pageNumber++;
                        //    if (pageNumber <= pagesCount) {
                        //        downloadeImage(pageNumber)
                        //    }
                        //    if (pageNumber == pagesCount + 1) {
                        //        $rootScope.modal.hide();
                        //        initMoshafDB(MoshafId);
                        //    }
                        //}).then(function (err) {
                        //    console.log(err);
                        //});
                        window.resolveLocalFileSystemURL(directoryName + filePath, function(dirEntry) {
                            dirEntry.getFile( pageName + ".png", { create: true }, function (targetFile) {
                                // Create a new download operation.
                                var download = downloader.createDownload(sourceUrl, targetFile);
                                // Start the download and persist the promise to be able to cancel the download.
                                app.downloadPromise = download.startAsync().then(function (suc){ 
                                    console.log(suc); 
                                    pageNumber++;
                                    if (pageNumber <= pagesCount) {
                                        downloadeImage(pageNumber)
                                    }
                                    if (pageNumber == pagesCount + 1) {
                                        $rootScope.modal.hide();;
                                        initMoshafDB(MoshafId);
                    
                                    }
                                }, function (err){ console.log(error); }, function (prog){ console.log(prog); });
                            })
                        }, function(error) {
                            console.log(error)
                            console.log("error")
                        })
                    }
                    else {
                        network.showNetworkOfflineMsg();
                    }

                });

            }

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
            initMoshafWarshDB(MoshafId);
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


    $rootScope.closeLoadingModal = function (MoshafId) {
        $scope.downloading=false;
        $rootScope.modal.hide();
    }
    
    $ionicModal.fromTemplateUrl('app/templates/popovers/loading.html', {
        scope: $rootScope,
        animation: 'slide-in-up',
    }).then(function (modal) {
        $rootScope.modal = modal;

    });

    $scope.goToCopySurahs = function (MoshafId) {
        $rootScope.selectedCopy = MoshafId;
        $state.go("copy-surahs");
    }

    //$scope.init = function () {
    //    $scope.enums = enums;
    //    document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    //    $rootScope.hideMem = true;
    //    //$rootScope.hafsCount = 0;
    //    //$rootScope.shamrlyCount = 0;
    //    //$rootScope.qalonCount = 0;
    //    window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + enums.appData.targetPath + "/" + enums.mosahfCopy.hafs.nameEn, function (fileSystem) {
    //        var reader = fileSystem.createReader();
    //        reader.readEntries(
    //            function (entries) {
    //                $rootScope.hafsCount = entries.length;
    //                console.log("iniiiiit", entries.length);
    //                if(entries.length == 0)
    //                    $scope.canDeleteHafs = true;
    //                else
    //                    $scope.canDeleteHafs = false;
    //                //if (entries.length == enums.mosahfCopy.hafs.pagesCount) {
    //                //    $rootScope.hafs = true;
    //                //    //$rootScope.nohafs = false;
    //                //    settings.sethafsIsDownloadedValue(true);
    //                //} else {
    //                //    if (entries.length == 0)
    //                //    { $rootScope.nohafs = true; }
    //                //    //$rootScope.hafs = false;
    //                //    settings.sethafsIsDownloadedValue(false);
    //                //}
    //            },
    //            function (err) {
    //                console.log(err);
    //            }
    //        );
    //    }, function (err) { console.log(err); });
    //    window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + enums.appData.targetPath + "/" + enums.mosahfCopy.shamrly.nameEn, function (fileSystem) {
    //        var reader = fileSystem.createReader();
    //        reader.readEntries(
    //            function (entries) {
    //                $rootScope.shamrlyCount = entries.length;
    //                console.log("iniiiiit", entries.length);
    //                if(entries.length == 0)
    //                    $scope.canDeleteshamrly = true;
    //                else
    //                    $scope.canDeleteshamrly = false;
    //                //if (entries.length == enums.mosahfCopy.shamrly.pagesCount) {
    //                //    $rootScope.shamrly = true;
    //                //    $rootScope.noshamrly = false;
    //                //    settings.setshamrlyIsDownloadedValue(true);
    //                //} else {
    //                //    if (entries.length == 0)
    //                //    { $rootScope.noshamrly = true; }
    //                //    $rootScope.shamrly = false;
    //                //    settings.setshamrlyIsDownloadedValue(false);
    //                //}
    //            },
    //            function (err) {
    //                console.log(err);
    //            }
    //        );
    //    }, function (err) { console.log(err); });
    //    window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + enums.appData.targetPath + "/" + enums.mosahfCopy.qalon.nameEn, function (fileSystem) {
    //        var reader = fileSystem.createReader();
    //        reader.readEntries(
    //            function (entries) {
    //                $rootScope.qalonCount = entries.length;
    //                //if (entries.length == enums.mosahfCopy.qalon.pagesCount) {
    //                //    $rootScope.qalon = true;
    //                //    $rootScope.noqalon = false;
    //                //    settings.setqalonIsDownloadedValue(true);
    //                //} else {
    //                //    if (entries.length == 0)
    //                //    { $rootScope.noqalon = true; }
    //                //    $rootScope.qalon = false;
    //                //    settings.setqalonIsDownloadedValue(false);
    //                //}
    //            },
    //            function (err) {
    //                console.log(err);
    //            }
    //        );
    //    }, function (err) { console.log(err); });

    //}

    $scope.goToRemoveTelawa = function () {
        $state.go("remove-telawa");
    }

    $scope.deleteRowaya = function (MoshafId) {
        var directoryName = "";
        var path = "";
        if (device.getPlatform() == "ios") {
            directoryName = cordova.file.dataDirectory;
        }
        else directoryName = cordova.file.externalRootDirectory;
        if (MoshafId == enums.MoshafId.hafs) {
            path = directoryName + enums.appData.targetPath + "/" + enums.mosahfCopy.hafs.nameEn;
            $rootScope.hafsCount = 0;
            $scope.canDownloadHafs=!$scope.canDownloadHafs;
        }
        else if (MoshafId == enums.MoshafId.shamrly) {
            path = directoryName + enums.appData.targetPath + "/" + enums.mosahfCopy.shamrly.nameEn;
            $rootScope.shamrlyCount = 0;
            $scope.canDownloadhamrly=!$scope.canDownloadhamrly;
        }
        else if (MoshafId == enums.MoshafId.qalon) {
            path = directoryName + enums.appData.targetPath + "/" + enums.mosahfCopy.qalon.nameEn;
            $rootScope.qalonCount = 0;
            $scope.canDownloadQalon=!$scope.canDownloadQalon;
        }
        else if (MoshafId == enums.MoshafId.warsh) {
            path = directoryName + enums.appData.targetPath + "/" + enums.mosahfCopy.warsh.nameEn;
            $rootScope.warshCount = 0;
        }

        window.resolveLocalFileSystemURL(path, function (fileSystem) {
            var reader = fileSystem.createReader();
            reader.readEntries(
                function (entries) {

                    angular.forEach(entries, function (value, key) {
                        file.removeFile(value.name, path);
                    });
                    $scope.canDeleteSurahs = [];
                },
                function (err) {
                    console.log(err);
                }
            );
        }, function (err) { console.log(err); });
        var msg = "تم حذف الرواية";
        toast.info("", msg)

    }


    /*remove telawa*/

    $scope.init = function () {
        $rootScope.MoshafId = settings.settingsData.MoshafId.toString();
        $rootScope.canCancel=true;
        var directory = "";
        if (device.getPlatform() == "ios") {
            directory = cordova.file.dataDirectory;
        }
        else directory = cordova.file.externalRootDirectory;

        window.resolveLocalFileSystemURL(directory + enums.appData.audioTargetPath, function (fileSystem) {
            var reader = fileSystem.createReader();
            reader.readEntries(
                function (entries) {
                    $scope.telawat = entries;
                    angular.forEach(entries, function (value, key) {
                        console.log(value);
                        console.log(key);
                        window.resolveLocalFileSystemURL(directory + enums.appData.audioTargetPath + "/" + value.name, function (fileSystem) {
                            var reader = fileSystem.createReader();
                            reader.readEntries(
                                function (entries) {
                                    if (entries.length == 0) {
                                        $scope.telawat[key].canDelete = false;
                                    } else {
                                        $scope.telawat[key].canDelete = true;
                                    }
                                    //$scope.telawat=$scope.telawat.filter(x=>x.name!=telawa.name);
                                    //$scope.$apply();
                                },
                                function (err) {
                                    console.log(err);
                                }
                            );
                        }, function (err) { console.log(err); });


                    });

                    moshafdata.getSurahs().then(function (result) {

                        $scope.surahs = result;
                        angular.forEach(entries, function (value, key) {
                            value.name = value.name.replace(".png", "");

                        });
                        angular.forEach($scope.surahs, function (x, key) {
                            x.StartPage = x.StartPage < 10 ? "page00" + x.StartPage : x.StartPage < 100 ? "page0" + x.StartPage : "page" + x.StartPage;
                            x.EndPage = x.EndPage < 10 ? "page00" + x.EndPage : x.EndPage < 100 ? "page0" + x.EndPage : "page" + x.EndPage;
                        });

                        $scope.surahs.forEach(function (entry) {
                            entries.forEach(function (e) {
                                var entryName = e.name.replace("page", "");
                                var StartPage = entry.StartPage.replace("page", "");
                                var EndPage = entry.EndPage.replace("page", "");
                                if (entryName >= StartPage && entryName <= EndPage && $scope.canDeleteSurahs.filter(item => item.Id == entry.Id).length == 0) {
                                    $scope.canDeleteSurahs.push(entry)
                                }
                            });
                        });
                    });
                    //}
                },
                function (err) {
                    console.log(err);
                }
            );
        }, function (err) { console.log(err); });
        $scope.enums = enums;
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
        $rootScope.hideMem = true;
        //$rootScope.hafsCount = 0;
        //$rootScope.shamrlyCount = 0;
        //$rootScope.qalonCount = 0;

        window.resolveLocalFileSystemURL(directory + enums.appData.targetPath + "/" + enums.mosahfCopy.hafs.nameEn, function (fileSystem) {
            var reader = fileSystem.createReader();
            reader.readEntries(
                function (entries) {
                    $rootScope.hafsCount = entries.length;
                    console.log("iniiiiit", entries.length);
                    if(entries.length == 0)
                        $scope.canDownloadHafs = true;
                    else
                        $scope.canDownloadHafs = false;
                    //if (entries.length == enums.mosahfCopy.hafs.pagesCount) {
                    //    $rootScope.hafs = true;
                    //    //$rootScope.nohafs = false;
                    //    settings.sethafsIsDownloadedValue(true);
                    //} else {
                    //    if (entries.length == 0)
                    //    { $rootScope.nohafs = true; }
                    //    //$rootScope.hafs = false;
                    //    settings.sethafsIsDownloadedValue(false);
                    //}
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
                    console.log("iniiiiit", entries.length);
                    if(entries.length == 0)
                        $scope.canDownloadhamrly = true;
                    else
                        $scope.canDownloadhamrly = false;
                    //if (entries.length == enums.mosahfCopy.shamrly.pagesCount) {
                    //    $rootScope.shamrly = true;
                    //    $rootScope.noshamrly = false;
                    //    settings.setshamrlyIsDownloadedValue(true);
                    //} else {
                    //    if (entries.length == 0)
                    //    { $rootScope.noshamrly = true; }
                    //    $rootScope.shamrly = false;
                    //    settings.setshamrlyIsDownloadedValue(false);
                    //}
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
                    if(entries.length == 0)
                        $scope.canDownloadQalon = true;
                    else
                        $scope.canDownloadQalon = false;
                    //if (entries.length == enums.mosahfCopy.qalon.pagesCount) {
                    //    $rootScope.qalon = true;
                    //    $rootScope.noqalon = false;
                    //    settings.setqalonIsDownloadedValue(true);
                    //} else {
                    //    if (entries.length == 0)
                    //    { $rootScope.noqalon = true; }
                    //    $rootScope.qalon = false;
                    //    settings.setqalonIsDownloadedValue(false);
                    //}
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

    }
    $scope.deleteTelawa = function (telawa, index) {
        var directory = "";
        if (device.getPlatform() == "ios") {
            directory = cordova.file.dataDirectory;
        }
        else directory = cordova.file.externalRootDirectory;
        window.resolveLocalFileSystemURL(directory + enums.appData.audioTargetPath + "/" + telawa.name, function (fileSystem) {
            var reader = fileSystem.createReader();
            reader.readEntries(
                function (entries) {
                    var path = directory + enums.appData.audioTargetPath + "/" + telawa.name;
                    $scope.telawaAudios = entries;
                    angular.forEach($scope.telawaAudios, function (value, key) {
                        file.removeFile(value.name, path).then(function (removedAudio) {
                            //$scope.telawat=$scope.telawat.filter(x=>x.name!=telawa.name);
                        });
                    });
                    $scope.telawat[index].canDelete = false;
                },
                function (err) {
                    console.log(err);
                }
            );
        }, function (err) { console.log(err); });

    }
    $scope.goToTelawaSurahs = function (selectedTelawa) {
        $rootScope.selectedTelawa = selectedTelawa;
        $state.go("telawa-surahs");
    }

    $scope.open = function (MoshafId) {
        var lastPage = mark.getLastReadPage();

        if (MoshafId == enums.MoshafId.hafs) {

            if ($rootScope.hafsCount == enums.mosahfCopy.hafs.pagesCount) {
                settings.setMoshafIdValue(MoshafId);
                $state.go("tab.page", { page: lastPage.pageNumber });
            }
            else {
                downloadImages(MoshafId);
            }

        }
        else if (MoshafId == enums.MoshafId.shamrly) {
            if ($rootScope.shamrlyCount == enums.mosahfCopy.shamrly.pagesCount) {
                settings.setMoshafIdValue(MoshafId);
                $state.go("tab.page", { page: lastPage.pageNumber });
            }
            else {
                downloadImages(MoshafId);
            }
        }
        else if (MoshafId == enums.MoshafId.qalon) {
            if ($rootScope.qalonCount == enums.mosahfCopy.qalon.pagesCount) {
                settings.setMoshafIdValue(MoshafId);
                $state.go("tab.page", { page: lastPage.pageNumber });
            }
        }
        else if (MoshafId == enums.MoshafId.warsh) {
            if ($rootScope.warshCount == enums.mosahfCopy.warsh.pagesCount) {
                settings.setMoshafIdValue(MoshafId);
                $state.go("tab.page", { page: lastPage.pageNumber });
            }
        }
        else {
            downloadImages(MoshafId);
        }
        



    }

    $scope.init();
}]);
