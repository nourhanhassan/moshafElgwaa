var storedLocalNotification = null;
var app = angular.module('moshafk', ['ionic', 'ngCordova', 'ionic-timepicker', 'ngSanitize', 'ionic.ion.imageCacheFactory', 'toaster'])
document.addEventListener("deviceready", function () {
    cordova.plugins.notification.local.on("click", function (notification) {
        storedLocalNotification = notification;
    });
    cordova.plugins.notification.local.on("trigger", function (notification) {
        alert("triggered: " + notification.id);
    });
   
}, false);
app.run(function ($ionicPlatform, localStorage, $rootScope, $ionicNavBarDelegate, $stateParams, $cordovaNetwork, $state, ionicLoading, device, localNotification, $cordovaLocalNotification, contacts, target, memorizedayat, enums, moshafdb, mark, moshafdata, ayatData, $q, downloadSoarImage, $timeout, file, $ionicHistory, settings, ayatTafseer, audio, reviewTarget, file, fileTransfer, network, $ionicLoading, moshafdbShmr, moshafdbKalon, $ionicModal, moshafdbwarsh) {
 
    $rootScope.activeTab = 'surah';
    $rootScope.imagesPathInDevice = "file:///storage/emulated/0/Moshaf/Images/";
    $rootScope.nightMode = settings.settingsData.nightMode;
    $rootScope.inDoaaBook = false;
    $rootScope.search = function () {
        $rootScope.searchIcon = true;
        $state.go("app.search");
    }
    $rootScope.searchInDoaaBook = function () {
        $rootScope.searchIcon = true;
        $state.go("searchDoaaBook");
    }
    if (localStorage.get("firstTime") == undefined) {
        localStorage.set("firstTime", true);
    } else {
        localStorage.set("firstTime", false);
    }
    $rootScope.getArabicNumber = function (num) {
        if (typeof (num) == "number")
            return num.toIndiaDigits();
    }

    //Set this flag to true in development  (to enable //alerts)
    function handleNotificationClickEvent(notification) {
        try {
            var data = angular.fromJson(notification.data);
            var targetData = data.targetData;
            //var targetData = JSON.parse(notification.data).targetData;
            if (targetData.targetMode == enums.targetMode.werd) {
                target.data = targetData;
                if (targetData.memorizeMode == enums.memorizeMode.group) {
                    memorizedayat.syncMemorizedAyatLocalToServer();
                }
                isPageRedirected = true;
                $timeout(function () {
                    //bug fix
                    $state.go("tab.page", {
                        target: targetData.id
                    });
                }, 300);
            } else {
                reviewTarget.data = targetData;
                isPageRedirected = true;
                $state.go("tab.page", {
                    reviewTarget: targetData.id
                });
            }
        } catch (ex) { }

    }

    function goToLastPageAndMode() {
        var lastPage = mark.getLastPage();
        $rootScope.lastPage = lastPage;
        //if (localStorage.get("firstTime") != undefined) {
        if (lastPage.mode == enums.appModes.memorize) {
            $state.go("tab.page", {
                page: lastPage.pageNumber,
                target: lastPage.target
            });
            //$state.go("app.test", { page: lastPage.pageNumber, target: lastPage.target });

            $rootScope.appMode = enums.appModes.memorize;
        } else if (lastPage.mode == enums.appModes.read) {
            $state.go("tab.page", {
                page: lastPage.pageNumber
            });
            $rootScope.appMode = enums.appModes.read;
        }
        else if (lastPage.mode == enums.appModes.review) {
            $state.go("tab.page", {
                page: lastPage.pageNumber,
                reviewTarget: lastPage.target
            });
            $rootScope.appMode = enums.appModes.review;
        } else {
            // $state.go("app.page", { page: lastPage.pageNumber });
            $state.go("dashboard")

            $rootScope.appMode = enums.appModes.read;
        }
    }

    function setFullScreenMode() {
        var devicePlatform = device.platform;
        if (devicePlatform != "Android" && typeof (window.StatusBar) != "undefined") {
            StatusBar.styleLightContent();
        }
        if (settings.settingsData.fullScreen) {
            if (typeof (AndroidFullScreen) != "undefined") {
                if (devicePlatform == "Android")
                    AndroidFullScreen.immersiveMode()
                else
                    StatusBar.hide();
            }
        } else {
            if (devicePlatform == "Android")


                AndroidFullScreen.showSystemUI();
        }
    }
    var debugMode = false;

    var isPageRedirected = false; //flag to check if the page should be redirected to another page or not

    if (!debugMode) {
        window.alert = function (msg) {
        }
    }
    $ionicPlatform.ready(function () {

        //update app 
        cordova.getAppVersion(function (version) {
            console.log("userVersion", version);
            //    $state.go("update");
            if (device.getPlatform() != "ios") {
                $.get("https://play.google.com/store/apps/details?id=com.qvsite.MoshafThird", function (data) {
                    playStoreVersion = $('<div/>').html(data).contents().find('div[class="IQ1z0d"]')[3].innerText;
                    if (version >= playStoreVersion) {
                        $state.go("dashboard");
                    } else {
                        $state.go("update");
                    }
                });
            } else {
                window.AppUpdate.checkAppUpdate(
                    function (appStoreVersion) {
                        if (version >= appStoreVersion) {
                            $state.go("dashboard");
                        } else {
                            $state.go("update");
                        }
                    });
            }
        });

        setFullScreenMode();
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
                //goToLastPageAndMode();
            })
        });

        //For the notifications that come while the application is on background (in recent apps)
        if (typeof (cordova) != "undefined") {
            cordova.plugins.notification.local.on("click", function (notification) {
                handleNotificationClickEvent(notification);
            });
        }
        if (storedLocalNotification != null) {
            handleNotificationClickEvent(storedLocalNotification);
        }
        if (typeof (cordova) != "undefined") {
            window.addEventListener('native.keyboardshow', function (e) {
                if ($(".pull-up").length > 0) {
                    var keyboardHeight = e.keyboardHeight;
                    var windowHeight = window.innerHeight;

                    $.each($(".pull-up"), function (i, el) {
                        var popupHeight = $(el).height();
                        $(el).css({
                            top: windowHeight - (keyboardHeight + popupHeight) + 'px'
                        })
                    })
                }
            });
            window.addEventListener('native.keyboardhide', function (e) {
                if ($(".pull-up").length > 0) {
                    $.each($(".pull-up"), function (i, el) {
                        $(el).removeAttr('style');
                    });
                }
                setFullScreenMode();
            });
        }
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        //orintaion
        screen.orientation.unlock();
        //keepAwake
        window.plugins.insomnia.keepAwake();
        //permissions
        var permissions = cordova.plugins.permissions;
        permissions.requestPermission(permissions.READ_EXTERNAL_STORAGE, success, error);
        function error() {
            console.warn('READ_EXTERNAL_STORAGE permission is not turned on');
        }
        function success(status) {
            if (!status.hasPermission) error();
            var MoshafId = settings.settingsData.MoshafId.toString();

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
            $rootScope.hafsCount = 0;
            $rootScope.shamrlyCount = 0;
            $rootScope.qalonCount = 0;
            $rootScope.warshCount = 0;
            //var directoryName = "";
            //if (device.getPlatform() == "ios") {
            //    directoryName = cordova.file.dataDirectory;
            //}
            //else directoryName = cordova.file.externalRootDirectory;
            //window.resolveLocalFileSystemURL(directoryName + enums.appData.targetPath + "/" + enums.mosahfCopy.hafs.nameEn, function (fileSystem) {
            //    var reader = fileSystem.createReader();
            //    reader.readEntries(
            //      function (entries) {
            //          $rootScope.hafsCount = entries.length;
            //      },
            //      function (err) {
            //          console.log(err);
            //      }
            //    );
            //}, function (err) { console.log(err); });
            //window.resolveLocalFileSystemURL(directoryName + enums.appData.targetPath + "/" + enums.mosahfCopy.shamrly.nameEn, function (fileSystem) {
            //    var reader = fileSystem.createReader();
            //    reader.readEntries(
            //      function (entries) {
            //          $rootScope.shamrlyCount = entries.length;
            //      },
            //      function (err) {
            //          console.log(err);
            //      }
            //    );
            //}, function (err) { console.log(err); });
            //window.resolveLocalFileSystemURL(directoryName + enums.appData.targetPath + "/" + enums.mosahfCopy.qalon.nameEn, function (fileSystem) {
            //    var reader = fileSystem.createReader();
            //    reader.readEntries(
            //      function (entries) {
            //          $rootScope.qalonCount = entries.length;
            //      },
            //      function (err) {
            //          console.log(err);
            //      }
            //    );
            //}, function (err) { console.log(err); });


        }

    });

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
            })
        });
    }

    //Handle Hardware Back Button
    $ionicPlatform.on("resume", function (event) {
        // will execute when device resume.
        setFullScreenMode();
    });
    $ionicPlatform.registerBackButtonAction(function () {
        console.log($state.current.name);
        //console.log($ionicHistory.backView().stateName);
        if ($state.current.name == "dashboard") {
            navigator.app.exitApp();
        }
        else if ($state.current.name == "tab.page" || $state.current.name == "alarm-list") {
            $state.go("dashboard");
        }
        else if ($state.current.name == "index") {
            $state.go("dashboard");
        }
        else if ($state.current.name == "article-list" || $state.current.name == "doaa-list" || $state.current.name == "namesofallah") {
            $state.go("index");
        }
        else if ($state.current.name == "verify-code") {
            $state.go("register");
        }
        else if ($state.current.name == "update") {
            navigator.app.exitApp();
        }
        else if ($state.current.name == "article" || $state.current.name == "doaa") {
            if ($ionicHistory.backView().stateName == "searchDoaaBook")
                $rootScope.searchInDoaaBook();
            else
                $state.go("index");
        }
        else {
            if ($ionicHistory.backView() == null || $ionicHistory.backView().stateName == "dashboard" || $ionicHistory.backView().stateName == "tab.page") {
                goToLastPageAndMode();
            }
            else if ($state.current.name == "group") {
                $state.go("tab.memo");
            }
            else if ($state.current.name == "tab.memo") {
                goToLastPageAndMode();
            }
            else {
                navigator.app.backHistory();
            }
        }
    }, 100);
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (toState.name == "parts") ionicHistory.removeBackView();
        audio.stop();
    });
})
    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, pushNotificationProvider) {
        pushNotificationProvider.setSenderID("737113918212");
        $ionicConfigProvider.views.maxCache(0);
        $ionicConfigProvider.views.swipeBackEnabled(false);
        //Back Button settings
        $ionicConfigProvider.backButton.text('').previousTitleText(false);
        $ionicConfigProvider.scrolling.jsScrolling(true);

        $ionicConfigProvider.tabs.position('bottom');

        $stateProvider
            .state('tab', {
                abstract: true,
                url: "/tab",
                templateUrl: "app/layouts/tabs.html"
            })
            .state('dashboard', {
                abstract: false,
                url: "/dashboard",
                templateUrl: "app/templates/dashboard/dashboard.html"
            })

            .state('tab.page', {
                url: "/page/:page/:aya/:target/:date/:reviewTarget/:repeatMode/:ayaEnd/:repeatCount",
                cache: false,
                views: {
                    "tab-page": {
                        templateUrl: "app/templates/quran/page.html",
                    }
                }
            })
              .state('tab.quranText', {
                  url: "/page/:page/:aya/:target/:date/:reviewTarget/:repeatMode/:ayaEnd/:repeatCount",
                  views: {
                      "tab-page": {
                          templateUrl: "app/templates/quranText/quranText.html",
                      }
                  }
              })
            .state('about', {
                url: "/about",
                templateUrl: "app/templates/aboutApp/about.html"
            })
            .state('downloadTelawas', {
                url: "/downloadTelawas",
                templateUrl: "app/templates/download-telawas/downloadTelawas.html"
            })
            .state('copy-surahs', {
                url: "/copy-surahs",
                templateUrl: "app/templates/copy-surahs/copy-surahs.html"
            })
            .state('surah-audios', {
                url: "/surah-audios",
                templateUrl: "app/templates/surah-audios/surah-audios.html"
            })
            .state('surah-pages', {
                url: "/surah-pages",
                templateUrl: "app/templates/surah-pages/surah-pages.html"
            })
            .state('telawa-surahs', {
                url: "/telawa-surahs",
                templateUrl: "app/templates/telawa-surahs/telawa-surahs.html"
            })
            .state('remove-telawa', {
                url: "/remove-telawa",
                templateUrl: "app/templates/remove-telawa/remove-telawa.html"
            })
             .state('alarm', {
                 url: "/alarm/:id",
                 templateUrl: "app/templates/alarm/alarm.html"
             })
              .state('alarm-list', {
                  url: "/alarm-list",
                  templateUrl: "app/templates/alarm/alarm-list.html"
              })
            .state('settings', {
                url: "/settings",
                templateUrl: "app/templates/settings/settings.html"

            })
              .state('tab.doaa', {
                  url: "/doaa/:doaaActive",
                  cache: false,
                  views: {
                      "mainContent": {
                          templateUrl: "app/templates/doaa/doaa.html"
                      }
                  }
              })
                         .state('tab.memorize-home', {
                             url: "/memorize-home",
                             views: {
                                 "tab-memorize-home": {
                                     templateUrl: "app/templates/memorize/memorize-home.html"
                                 }
                             }
                         })
                         .state('tab.memo', {
                             url: "/memo",
                             views: {
                                 "tab-memo": {
                                     templateUrl: "app/layouts/memo-tab.html"
                                 }
                             }
                         })

             .state('target-list', {
                 url: "/target",
                 cache: false,
                 templateUrl: "app/templates/target/target-list.html"
             })
               .state('set-target-details', {
                   url: "/setTargetDetails/:mode",
                   cache: false,
                   templateUrl: "app/templates/target/set-target-details.html"

               })
            .state('set-target-duration', {
                url: "/setTargetDuration",
                templateUrl: "app/templates/target/set-target-duration.html"
            })
            .state('tab.khatma-list', {
                url: "/khatma",
                cache: false,
                views: {
                    "tab-khatma": {
                        templateUrl: "app/templates/khatmAlmoshaf/khatma-list.html"
                    }
                }
            })
                .state('set-khatma-details', {
                    cache: false,
                    url: "/setkhatmaDetails/:ID",
                    templateUrl: "app/templates/khatmAlmoshaf/set-khatma-details.html"
                })
                .state('set-khatma-duration', {
                    cache: false,
                    url: "/setkhatmaDuration",
                    templateUrl: "app/templates/khatmAlmoshaf/set-khatma-duration.html"
                })
               .state('search', {
                   abstract: false,
                   url: "/search",
                   templateUrl: "app/templates/search/search.html"
               })
             .state('searchDoaaBook', {
                 abstract: false,
                 url: "/search",
                 templateUrl: "app/templates/searchDoaaBook/searchDoaaBook.html"
             })
              .state('archive', {
                  abstract: false,
                  url: "/archive",
                  templateUrl: "app/templates/archive/archive.html"
              })
              .state('archive.bookmarks', {
                  url: "/bookmarks",
                  views: {
                      "archive-bookmarks": {
                          templateUrl: "app/templates/marks/marksList.html"
                      }
                  }
              })
            .state('archive.notes', {
                url: "/notes",

                views: {
                    "archive-notes": {
                        templateUrl: "app/templates/notes/notesList.html"
                    }
                }
            })
            .state('archive.favs', {
                url: "/favs",

                views: {
                    "archive-favs": {
                        templateUrl: "app/templates/favs/favList.html"
                    }
                }
            })

            .state('archiveDoaaBook', {
                abstract: false,
                url: "/archiveDoaaBook",
                templateUrl: "app/templates/archiveDoaaBook/archiveDoaaBook.html"
            })
              .state('archiveDoaaBook.bookmarks', {
                  url: "/bookmarks",
                  views: {
                      "archive-bookmarks": {
                          templateUrl: "app/templates/doaa-bookmarks/doaa-bookmarks.html"
                      }
                  }
              })
            .state('archiveDoaaBook.notes', {
                url: "/notes",

                views: {
                    "archive-notes": {
                        templateUrl: "app/templates/notes/notesList.html"
                    }
                }
            })
            .state('archiveDoaaBook.favList', {
                url: "/favList",

                views: {
                    "archive-favList": {
                        templateUrl: "app/templates/favs/article-favList.html"
                    }
                }
            })


         .state('tab.pager', {
             url: "/pager",
             //cache: false,
             views: {
                 "tab-pager": {
                     templateUrl: "app/layouts/pager-tabs.html"
                 }
             }
         })
            .state('tab.pager.parts', {
                url: "/parts",
                cache: false,
                views: {
                    'pager-parts': {
                        templateUrl: "app/templates/parts/partsList.html"
                    }
                }
            })
            .state('tab.pager.surahs', {
                url: "/surahs",
                cache: false,
                views: {
                    "tab-pager": {
                        templateUrl: "app/templates/parts/partsList.html"
                    }
                      ,
                    'pager-surahs': {
                        templateUrl: "app/templates/surahs/surahsList.html"
                    }
                }
            })
            .state('tab.pager.pages', {
                url: "/pages",
                cache: false,
                views: {
                    'pager-pages': {
                        templateUrl: "app/templates/pages/pages.html"
                    }
                }
            })
            .state('app.test', {
                url: "/page/:page/:aya/:target/:date/:reviewTarget",
                views: {
                    "mainContent": {
                        templateUrl: "app/templates/testTajweed/page.html"
                    }
                }
            })
            .state('app.guides', {
                url: "/guides",
                views: {
                    "mainContent": {
                        templateUrl: "app/templates/help/guides.html"
                    }
                }
            })
            .state('app.home', {
                url: "/home",
                views: {
                    "mainContent": {
                        templateUrl: "app/templates/home/home.html"
                    }
                }
            })
            .state('memorized', {
                url: "/memorized",
                cache: false,
                templateUrl: "app/templates/memorize/memorized.html"
            })
            .state('un-memorized', {
                url: "/unMemorized",
                cache: false,
                templateUrl: "app/templates/memorize/un-memorized.html"
            })

            .state('searchResult', {
                url: "/searchResult",
                views: {
                    "mainContent": {
                        templateUrl: "app/templates/search/searchResult.html"
                    }
                }
            })
            .state('searchDoaaBookResult', {
                url: "/searchResult",
                views: {
                    "mainContent": {
                        templateUrl: "app/templates/search/searchDoaaBookResult.html"
                    }
                }
            })
            .state('app.backup', {
                url: "/backup",

                views: {
                    "mainContent": {
                        templateUrl: "app/templates/Backup/backup.html"
                    }
                }
            })
            .state('app.set-review-target-details', {
                url: "/setReviewTargetDetails",
                cache: false,
                views: {
                    "mainContent": {
                        templateUrl: "app/templates/reviewTarget/set-review-target-details.html"
                    }
                }
            })
            .state('app.set-review-target-duration', {
                url: "/setReviewTargetDuration",
                cache: false,
                views: {
                    "mainContent": {
                        templateUrl: "app/templates/reviewTarget/set-review-target-duration.html"
                    }
                }
            })
            .state('app.review-target-list', {
                url: "/reviewTarget",
                cache: false,
                views: {
                    "mainContent": {
                        templateUrl: "app/templates/reviewTarget/review-target-list.html"
                    }
                }
            })
            .state('group-manage', {
                url: "/group-manage",
                templateUrl: "app/templates/group/group-manage.html"
            })
            .state('group', {
                url: "/group",
                templateUrl: "app/templates/group/group.html"
            })
            .state('group-add', {
                url: "/group-add/:id",
                templateUrl: "app/templates/group/group-add.html"
            })
            .state('group-members-add', {
                url: "/group-members-add",
                templateUrl: "app/templates/group/group-members-add.html"
            })
            .state('group-details', {
                url: "/group-details/:id",
                templateUrl: "app/templates/group-details/group-details.html"
            })
            .state('group-progress', {
                url: "/group-progress/:id",
                templateUrl: "app/templates/group-details/group-progress.html"
            })
            .state('register', {
                url: "/register",
                templateUrl: "app/templates/user/register.html"
            })


              //.state('tab.memo', {
              //    url: "/memo",
              //    cache: false,
              //    views: {
              //        "tab-memo": {
              //            templateUrl: "app/templates/memorize/memorize-home.html"
              //            // controller: 'MainCtrl'
              //        }
              //    }
              //})
            .state('verify-code', {
                url: "/verifyCode",
                templateUrl: "app/templates/user/verify-code.html"
            })
            .state('memorize', {
                url: "/memorize",
                templateUrl: "app/templates/memorize/memorize.html"
            })
            .state('app.khatma-list', {
                url: "/khatma",
                cache: false,
                views: {
                    "mainContent": {
                        templateUrl: "app/templates/khatmAlmoshaf/khatma-list.html"
                    }
                }
            })
            .state('app.set-khatma-details', {
                url: "/setKhatmaDetails",
                cache: false,
                views: {
                    "mainContent": {
                        templateUrl: "app/templates/khatmAlmoshaf/set-khatma-details.html"
                    }
                }
            })
            .state('app.set-khatma-duration', {
                url: "/setKhatmaDuration",
                cache: false,
                views: {
                    "mainContent": {
                        templateUrl: "app/templates/khatmAlmoshaf/set-khatma-duration.html"
                    }
                }
            })
     .state('moshafCopy', {
         abstract: false,
         cache: false,
         url: "/moshafCopy",
         templateUrl: "app/templates/moshafCopy/moshafCopy.html"
     }).state('index', {
         url: "index",
         templateUrl: "app/templates/doaa-book/index/index.html"

     }).state('update', {
         url: "update",
         templateUrl: "app/templates/update/update.html"

     }).state('doaa-list', {
         url: "doaa-list",
         templateUrl: "app/templates/doaa-book/doaa/doaa-list.html"

     }).state('article-list', {
         url: "article-list",
         templateUrl: "app/templates/doaa-book/article/article-list.html"

     }).state('doaa', {
         url: "doaa/:id",
         templateUrl: "app/templates/doaa-book/doaa/doaa.html"
     }).state('article', {
         url: "article/:id",
         templateUrl: "app/templates/doaa-book/article/article.html"
     }).state('namesofallah', {
         url: "namesofallah",
         templateUrl: "app/templates/doaa-book/namesofallah/namesofallah.html"
     })
                  .state('download', {
                      url: "/download",
                      params: {
                          MoshafId: null
                      },
                      templateUrl: "app/templates/download/download.html"
                  })
             .state('ControlPanel', {
                 url: "/ControlPanel",
                 templateUrl: "app/templates/ControlPanel/ControlPanel.html"
             })
        ;
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/dashboard');
    })
Number.prototype.toIndiaDigits = function () { // to convert numbers to arabic
    var id = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return this.toString().replace(/[0-9]/g, function (w) {
        return id[+w]
    });
}