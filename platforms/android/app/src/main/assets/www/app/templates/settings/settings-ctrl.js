/// <reference path="settings-ctrl.js" />
app.controller("settingsController", ["$scope", "localStorage", "namesOfAllah", "settings", "recitations", "device", "backup", "$state", "mark", "$rootScope", "alarmStorage", "enums", "file", "fileTransfer", "network", "$ionicLoading", "moshafdb", "moshafdata", "ayatData", "ayatTafseer", "$q", "moshafdbShmr", "moshafdbKalon", "$ionicModal", "ionicPopup", "$ionicPopup", "audio", "permissions", "localNotification", "user", "moshafdbwarsh", function ($scope, localStorage, namesOfAllah, settings, recitations, device, backup, $state, mark, $rootScope, alarmStorage, enums, file, fileTransfer, network, $ionicLoading, moshafdb, moshafdata, ayatData, ayatTafseer, $q, moshafdbShmr, moshafdbKalon, $ionicModal, ionicPopup, $ionicPopup, audio, permissions, localNotification, user, moshafdbwarsh) {

    $scope.init = function () {
        $scope.enums = enums;
        $rootScope.canCancel = true;
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
        $scope.model = settings.settingsData;
        $scope.recitations = recitations.recitations;
        $scope.model.recitationId = settings.settingsData.recitationId.toString();
        $rootScope.hideMem = true;
        $scope.model.MoshafId = settings.settingsData.MoshafId.toString();
        $scope.model.namesOfAllahEnabled = user.data.profile.NotificationOn;
        $scope.userInfo = user.data.profile;

        $scope.namesOfAllah = localStorage.get("namesOfAllah");
        if ($scope.namesOfAllah == undefined) {
            namesOfAllah.getAllNamesOfAllah().then(function (res) {
                $scope.namesOfAllah = res;
                localStorage.set("namesOfAllah", $scope.namesOfAllah);
            })
        }

        var directoryName = "";
        if (device.getPlatform() == "ios") {
            directoryName = cordova.file.dataDirectory;
        }
        else directoryName = cordova.file.externalRootDirectory;

        window.resolveLocalFileSystemURL(directoryName + enums.appData.targetPath + "/" + enums.mosahfCopy.hafs.nameEn, function (fileSystem) {
            var reader = fileSystem.createReader();
            reader.readEntries(
              function (entries) {
                  $rootScope.hafsCount = entries.length;
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
        window.resolveLocalFileSystemURL(directoryName + enums.appData.targetPath + "/" + enums.mosahfCopy.shamrly.nameEn, function (fileSystem) {
            var reader = fileSystem.createReader();
            reader.readEntries(
              function (entries) {
                  $rootScope.shamrlyCount = entries.length;
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
        window.resolveLocalFileSystemURL(directoryName + enums.appData.targetPath + "/" + enums.mosahfCopy.qalon.nameEn, function (fileSystem) {
            var reader = fileSystem.createReader();
            reader.readEntries(
              function (entries) {
                  $rootScope.qalonCount = entries.length;
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
        window.resolveLocalFileSystemURL(directoryName + enums.appData.targetPath + "/" + enums.mosahfCopy.warsh.nameEn, function (fileSystem) {
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


        // all responses from the audio player are channeled through successCallback and errorCallback

        // set wakeup timer
        // window.wakeuptimer.wakeup(successCallback,
        //errorCallback,
        // a list of alarms to set
        //{
        //    alarms: [{
        //type: 'onetime',
        // time: { hour: 22, minute: 58 },
        //   extra: { message: 'json containing app-specific information to be posted when alarm triggers' },
        //     message: 'Alarm has expired!'
        //   }]
        // }
        //);

        //// set repeating wakeup timer
        //window.wakeuptimer.wakeup(successCallback,
        //   errorCallback,
        //   // a list of alarms to set
        //   {
        //       alarms: [{
        //           type: 'repeating',
        //           time: { minutes: 10 },
        //           extra: { message: 'json containing app-specific information to be posted when alarm triggers' },
        //           message: 'Alarm has expired!'
        //       }]
        //   }
        //);

        //// set timer, but skip launch if user is using the phone (screen is on)
        //window.wakeuptimer.wakeup(successCallback,
        //   errorCallback,
        //   // a list of alarms to set
        //   {
        //       alarms: [{
        //           type: 'onetime',
        //           skipOnAwake: true,
        //           time: { hour: 12, minute: 10 },
        //           extra: { message: 'json containing app-specific information to be posted when alarm triggers' },
        //           message: 'Alarm has expired!'
        //       }]
        //   }
        //);

        //// set wakeup timer, but skip launch if app is already running
        //window.wakeuptimer.wakeup(successCallback,
        //   errorCallback,
        //   // a list of alarms to set
        //   {
        //       alarms: [{
        //           type: 'onetime',
        //           skipOnRunning: true,
        //           time: { hour: 11, minute: 20 },
        //           extra: { message: 'json containing app-specific information to be posted when alarm triggers' },
        //           message: 'Alarm has expired!'
        //       }]
        //   }
        //);

        //// snooze...
        //window.wakeuptimer.snooze(successCallback,
        //    errorCallback,
        //    {
        //        alarms: [{
        //            type: 'snooze',
        //            time: { seconds: 60 }, // snooze for 60 seconds
        //            extra: {}, // json containing app-specific information to be posted when alarm triggers
        //            message: this.get('message'),
        //            sound: this.get('sound'),
        //            action: this.get('action')
        //        }]
        //    }
        // );

        // example of a callback method
        //var successCallback = function (result) {
        //  if (result.type === 'wakeup') {
        //    console.log('wakeup alarm detected--' + result.extra);
        //} else if (result.type === 'set') {
        //  console.log('wakeup alarm set--' + result);
        //} else {
        //     console.log('wakeup unhandled type (' + result.type + ')');
        //}
        //};

        $rootScope.hideMem = true;
        var downloadMore = false;
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
        $scope.alarmCounter = 0;
        //if ($rootScope.initialAlarmDownloadStart)
        //    console.log($rootScope.initialAlarmDownloadStart);
        //else {
        //    $rootScope.initialAlarmDownloadStart = 1;
        //    downloadAlarmTones($rootScope.initialAlarmDownloadStart);
        //}
        $rootScope.hideMem = true;

    }
    if (device.getPlatform() == "ios") {
        $scope.directoryName = cordova.file.dataDirectory;
    }
    else $scope.directoryName = cordova.file.externalRootDirectory;
    var source = "http://app2aw.qv-site.com/moshaf/alarm";
    var sourceUrl = "";
    var dest = "";
    $rootScope.openAddAlarmRingtone = function (source) {
        console.log(source);
        if (source == "add")
            var templateUrl = 'app/templates/popovers/add-alarm-ringtone.html';
        else
            var templateUrl = 'app/templates/popovers/edit-alarm-ringtones.html';
        //if ($scope.editRingtonesModal )
        //    $scope.editRingtonesModal.hide();
        function listDir(path) {
            window.resolveLocalFileSystemURL(path,
              function (fileSystem) {
                  var reader = fileSystem.createReader();
                  reader.readEntries(
                    function (entries) {
                        $rootScope.ringtones = entries;
                        $rootScope.initialAlarmDownloadStart = entries[entries.length - 1].name.replace(".mp3", "").replace("alarm", "")
                        console.log($rootScope.initialAlarmDownloadStart);
                        if (source == "add")
                            $rootScope.openAddAlarmRingtoneModal(templateUrl);
                        else
                            $scope.openEditAlarmRingtoneModal(templateUrl);
                        console.log(entries);
                    },
                    function (err) {
                        console.log(err);
                    }
                  );
              }, function (err) {
                  console.log(err);
              }
            );
        }

        listDir($scope.directoryName + "Moshaf Elgwaa/alarm/");
        //var _date = new Date($scope.gregDate).toLocaleDateString('ar-SA');
        //console.log(_date);
    }
    $scope.playTone = function (tone) {
        if (audio.mediaStatus == audio.statusEnum.running && audio.audioSettings.currentTone == tone.name) {
            tone.hidePlaybutton = false;
            tone.isPaused = true;
            $scope.lastTone = tone;
            audio.pause();
        }
        else {
            if (tone.isPaused != true || audio.audioSettings.currentTone != tone.name) {
                audio.stop();
                $scope.resetPlayButtons = true;
                if ($scope.lastTone)
                    $scope.lastTone.hidePlaybutton = false;
                $scope.lastTone = tone;
            }
            audio.audioSettings.currentTone = tone.name;
            tone.hidePlaybutton = true;
            tone.isPaused = false;
            $scope.nowPlaying = "";
            $scope.toneURL = $scope.directoryName + "Moshaf Elgwaa/alarm/" + tone.name;
            $scope.nowPlaying = "جاري الإستماع إلى " + tone.name;
            audio.playUrl($scope.toneURL);
        }
    }
    var downloadMore = false;
    $scope.openEditAlarmRingtoneModal = function (templateUrl) {
        $ionicModal.fromTemplateUrl(templateUrl, {
            scope: $scope,
            animation: 'slide-in-up',
            //backdropClickToClose: false,
        }).then(function (modal) {
            $scope.editRingtonesModal = modal;
            $scope.editRingtonesModal.show();
        });
    }

    $scope.stopTone = function (tone) {
        audio.audioSettings.currentTone = "";
        tone.hidePlaybutton = false;
        tone.isPaused = false;
        $scope.nowPlaying = "";
        audio.stop();
    }


    $scope.deleteTone = function (tone) {
        audio.stop();
        $scope.nowPlaying = "";
        $scope.toneURL = $scope.directoryName + "Moshaf Elgwaa/alarm";
        var confirm = ionicPopup.confirm("تأكيد", "هل تريد حذف النغمة " + tone.name + "؟", "الغاء", "نعم").then(function (confirm) {
            if (confirm) {
                file.removeFile(tone.name, $scope.toneURL).then(function (removedAudio) {
                    console.log(removedAudio);
                    var deletedAlarmID = parseInt(tone.name.replace(".mp3", "").replace("alarm", ""));
                    alarmStorage.addTarget(deletedAlarmID);
                    $scope.editRingtonesModal.hide();
                    $rootScope.openAddAlarmRingtone('edit');
                });
            }
        })
    }

    $scope.closeEditAlarmRingtoneModal = function () {
        audio.stop();
        $scope.nowPlaying = "";
        $scope.editRingtonesModal.hide();
    }

    $rootScope.downloadMoreAlarms = function () {
        $rootScope.initialAlarmDownloadStart = parseInt($rootScope.initialAlarmDownloadStart);
        if ($rootScope.initialAlarmDownloadStart == 45) {
            $ionicPopup.alert({
                title: "نغمات التنبيه",
                template: 'لقد تم تحميل جميع نغمات التنبيه المتاحة',
            })
        }
        else {
            downloadMore = true;
            $scope.alarmCounter = 0;
            $scope.editRingtonesModal.hide();
            downloadAlarmTones($rootScope.initialAlarmDownloadStart + 1);
        }
    }

    function downloadAlarmTones(alarmNum) {
        var AppName = "Moshaf Elgwaa";
        var targetPath = "Moshaf Elgwaa/alarm";
        var directoryName = "";
        var path = "";
        if (device.getPlatform() == "ios") {
            directoryName = cordova.file.dataDirectory;
        }
        else directoryName = cordova.file.externalRootDirectory;
        path = directoryName + targetPath;

        var source = "http://app2aw.qv-site.com/moshaf/alarm";
        var sourceUrl = "";
        var dest = "";
        file.checkDir(AppName).then(function (res) {
            var FolderName = AppName + "/alarm";
            file.checkDir(AppName + "/alarm").then(function (res1) {
                // var pageNum = 1;
                downloadTone(alarmNum);

            }, function (error) { // create  folder if not exist
                file.createDir(AppName + "/alarm").then(function (result) {
                    // var pageNum = 1;
                    downloadTone(alarmNum);
                })
            })
        }, function (error) {
            file.createDir(AppName).then(function (res) {
                file.createDir(AppName + "/alarm").then(function (result) {
                    // var pageNum = 1;
                    downloadTone(alarmNum);
                })
            })
        })

        var loadingshown = false;
        function downloadTone(alarmNumber) {
            if (alarmNumber > 45) {
                $ionicPopup.alert({
                    title: "نغمات التنبيه",
                    template: 'لقد تم تحميل جميع نغمات التنبيه المتاحة',
                })
            }
            else {
                //$scope.alarmCounter++;
                $rootScope.downloadingPercentage = $scope.alarmCounter * (100 / 10);
                var alarmName = alarmNumber < 10 ? "alarm0" + alarmNumber : "alarm" + alarmNumber;
                var sourceUrl = source + "/" + alarmName + ".mp3";
                var dest = path + "/" + alarmName + ".mp3";
                var filePath = "Moshaf Elgwaa/alarm/" + alarmName + ".mp3";
                file.checkFile(filePath).then(function (success) {
                    alarmNumber++;
                    if (alarmNumber <= ($rootScope.initialAlarmDownloadStart + 9)) {
                        downloadTone(alarmNumber)
                    }
                    if (alarmNumber == ($rootScope.initialAlarmDownloadStart + 10)) {
                        $ionicLoading.hide();
                        //$rootScope.modal.hide();
                        loadingshown = false;
                    }
                }, function (error) {
                    if (alarmStorage.checkIfTargetIsStored(alarmNumber)) {
                        console.log("ywes");
                        if (alarmNumber <= ($rootScope.initialAlarmDownloadStart + 9) && downloadMore) {
                            //$scope.alarmCounter--;
                            alarmNumber++;
                            $rootScope.initialAlarmDownloadStart++;
                            downloadTone(alarmNumber)
                        }
                    }
                    else if (network.isOnline()) {
                        if (!loadingshown) {
                            loadingshown = true;
                            //$ionicLoading.show({
                            //    template: '<p>جاري تحميل النغمات .. برجاء الانتظار</p>'
                            //});
                        }
                        $rootScope.modal.show();
                        console.log(sourceUrl, dest);
                        permissions.checkpermission(permissions.permissions.WRITE_EXTERNAL_STORAGE).then(function (s) {

                            if (s.hasPermission) {
                                fileTransfer.download(sourceUrl, dest, "").then(function (ret) {
                                    alarmNumber++;
                                    $scope.alarmCounter++;
                                    console.log(ret);
                                    if (alarmNumber <= ($rootScope.initialAlarmDownloadStart + 9)) {
                                        downloadTone(alarmNumber)
                                    }
                                    if (alarmNumber == ($rootScope.initialAlarmDownloadStart + 10)) {
                                        $ionicLoading.hide();
                                        $rootScope.modal.hide();
                                        loadingshown = false;
                                        if (downloadMore)
                                            $rootScope.openAddAlarmRingtone('edit');
                                    }
                                }).then(function (err) {
                                    console.log(err)
                                    $ionicLoading.hide();
                                    $rootScope.modal.hide();
                                    loadingshown = false;
                                    if (downloadMore)
                                        $rootScope.openAddAlarmRingtone('edit');
                                });
                            }
                            else {
                                permissions.requestPermission(permissions.permissions.WRITE_EXTERNAL_STORAGE).then(function (r) {

                                    if (r.hasPermission) {
                                        fileTransfer.download(sourceUrl, dest, "").then(function (ret) {
                                            alarmNumber++;
                                            $scope.alarmCounter++;
                                            console.log(ret);
                                            if (alarmNumber <= ($rootScope.initialAlarmDownloadStart + 9)) {
                                                downloadTone(alarmNumber)
                                            }
                                            if (alarmNumber == ($rootScope.initialAlarmDownloadStart + 10)) {
                                                $ionicLoading.hide();
                                                $rootScope.modal.hide();
                                                loadingshown = false;
                                                if (downloadMore)
                                                    $rootScope.openAddAlarmRingtone('edit');
                                            }
                                        }).then(function (err) {
                                            console.log(err);
                                            $ionicLoading.hide();
                                            $rootScope.modal.hide();
                                            loadingshown = false;
                                            if (downloadMore)
                                                $rootScope.openAddAlarmRingtone('edit');
                                        });
                                    }
                                    else {
                                        deferred.reject();
                                    }

                                })
                            }

                        },
           function (er) { });

                    }
                    else {
                        network.showNetworkOfflineMsg();
                    }

                });
            }
        }
    }

    $scope.goToBackup = function () {
        $scope.user = backup.getUserData();

        if (typeof ($scope.user) == "undefined") {
            $state.go("app.register")
        }
        else {
            $state.go("app.backup")
        }
    }

    $scope.openControlPanel = function () {
        $state.go("ControlPanel")
    }

    $scope.changeMarkMemorizedAyat = function () {
        settings.setMarkMemorizedAyatValue($scope.model.markMemorizedAyat)
    }

    $scope.isAndroid = true;
    $scope.changeFullScreen = function () {
        settings.setFullScreenValue($scope.model.fullScreen)
    }

    $scope.changeRecitation = function () {
        settings.setRecitationIdValue($scope.model.recitationId);
        recitations.setCurrentRecitation($scope.model.recitationId)
    }

    $scope.rate = function () {
        AppRate.preferences.customLocale = {
            title: "قيم %@",
            message: "إذا أعجبك برنامج %@ ، هل تمانع تقييمه؟ شكراً لدعمك",
            cancelButtonLabel: "لا, شكراً",
            laterButtonLabel: "ذكرني لاحقاً  ",
            rateButtonLabel: "قيم البرنامج الآن",
            yesButtonLabel: "نعم!",
            noButtonLabel: "لا",
            appRatePromptTitle: 'اذا اعجبك برنامج %@',
            feedbackPromptTitle: 'هل تمانع ان تشاركنا رايك?',
        };
        AppRate.preferences.storeAppURL = {

            android: 'https://play.google.com/store/apps/details?id=com.almoshaf.alsharef',


        };
        AppRate.preferences.useLanguage = 'ar';
        AppRate.promptForRating(true);
    }

    $scope.changeNightMode = function () {
        settings.setNightModeValue($scope.model.nightMode);
    }
    $scope.toggleNotification = function () {

        //user.getUserInfo().then(function (res) {
        if ($scope.userInfo.id > 0) {
            user.toggleUserNotification($scope.model.namesOfAllahEnabled);
        } else {
            $state.go("register", { fromSetting: true });
        }
        //    debugger;
        //});
        //settings.setNamesOfAllahNotification($scope.model.namesOfAllahEnabled);



        //if ($scope.model.namesOfAllahEnabled) {

        //    var date = new Date();
        //    date.setMinutes(date.getMinutes() + 1);
        //    var hours = date.getHours();
        //    var minutes = date.getMinutes();

        //    var setting = {
        //        timerInterval: 3600000,//60000, // interval between ticks of the timer in milliseconds (Default: 60000)
        //        startOnBoot: true, // enable this to start timer after the device was restarted (Default: false)
        //        stopOnTerminate: true, // set to true to force stop timer in case the app is terminated (User closed the app and etc.) (Default: true)

        //        hours: hours, // delay timer to start at certain time (Default: -1)
        //        minutes: minutes, // delay timer to start at certain time (Default: -1)
        //    }
        //    window.BackgroundTimer.start(/*successCallback*/function () {
        //        console.log("timer plugin configured successfully")

        //    }, /*errorCallback*/function () {
        //        console.log("an error occurred")
        //    }, setting);

        //    window.BackgroundTimer.onTimerEvent(function () {
        //        console.log("subscribe");
        //        var nameOfAllahNo = Math.floor(Math.random() * 100);
        //        $scope.namesOfAllah = localStorage.get("namesOfAllah");
        //        var nameOfAllah = $scope.namesOfAllah.find(function (element) {
        //            return element.Number == nameOfAllahNo;
        //        });
        //        var notificationTime = new Date(new Date().getTime());
        //        notificationTime.setSeconds(0);
        //        notificationTime.setMilliseconds(0);
        //        //var frequency = "day";
        //        //if (this.data.periodType == enums.periodType.weekly) {
        //        //    frequency = "week";
        //        //}
        //        if (typeof (cordova) != "undefined") {

        //            var notification = {
        //                smallIcon: 'icon',
        //                icon: 'icon',
        //                title: nameOfAllah.NameOfAllah,
        //                text: nameOfAllah.NameOfAllahMeaning,
        //                data: {
        //                    targetData: nameOfAllah
        //                },

        //            }
        //            //If the target already has notification id, then override it
        //            //if (this.data.notificationID) {
        //            notification.id = nameOfAllah.ID;
        //            //}

        //            localNotification.scheduleNotification(notification,
        //            notificationTime
        //            ).then(function (res) {
        //                alert("notification saved " + notification.id);
        //            });
        //        }
        //    }); // subscribe on timer event


        //} else {
        //    window.BackgroundTimer.stop(function () {
        //        // timer tick
        //    }, function (e) {
        //        // an error occurred
        //    });
        //}
    }
    $scope.changeMoshaf = function () {
        $rootScope.MoshafId = $scope.model.MoshafId;
        settings.setMoshafIdValue($scope.model.MoshafId);
        initMoshafDB($scope.model.MoshafId);
       
        $rootScope.activePage = 'read';

        if ($scope.model.MoshafId == enums.MoshafId.hafstext) {
            $state.go("tab.quranText");
        }
        else {
            if ($scope.model.MoshafId == enums.MoshafId.hafs && $rootScope.hafsCount < enums.mosahfCopy.hafs.pagesCount) {
                downloadImages($scope.model.MoshafId);
            }
            else if ($scope.model.MoshafId == enums.MoshafId.shamrly && $rootScope.shamrlyCount < enums.mosahfCopy.shamrly.pagesCount) {
                downloadImages($scope.model.MoshafId);
            }
            else if ($scope.model.MoshafId == enums.MoshafId.qalon && $rootScope.qalonCount < enums.mosahfCopy.qalon.pagesCount) {
                downloadImages($scope.model.MoshafId);
            }
            else if ($scope.model.MoshafId == enums.MoshafId.warsh && $rootScope.warshCount < enums.mosahfCopy.warsh.pagesCount) {
                downloadImages($scope.model.MoshafId);
            }
            else {

                $state.go("tab.page", { page: 1 });

            }

        }

    }

    function downloadImages(MoshafId) {
        $scope.downloading = true;
        var downloader = new BackgroundTransfer.BackgroundDownloader();

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
                    file.createDir(filePath).then(function (result) {
                        var pageNum = 1;
                        downloadeImage(pageNum);
                    })
                })
            })
        })

        function downloadeImage(pageNumber) {
            if ($scope.downloading) {
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
                                        settings.setMoshafIdValue($scope.model.MoshafId);
                                        initMoshafDB(MoshafId);
                                        $state.go("tab.page", { page: 1 });
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
                        window.resolveLocalFileSystemURL(directoryName + filePath, function (dirEntry) {
                            dirEntry.getFile(pageName + ".png", { create: true }, function (targetFile) {
                                // Create a new download operation.
                                var download = downloader.createDownload(sourceUrl, targetFile);
                                // Start the download and persist the promise to be able to cancel the download.
                                app.downloadPromise = download.startAsync().then(function (suc) {
                                    console.log(suc);
                                    pageNumber++;
                                    if (pageNumber <= pagesCount) {
                                        downloadeImage(pageNumber)
                                    }
                                    if (pageNumber == pagesCount + 1) {
                                        $rootScope.modal.hide();
                                        settings.setMoshafIdValue($scope.model.MoshafId);
                                        initMoshafDB(MoshafId);
                                        $state.go("tab.page", { page: 1 });

                                    }
                                }, function (err) { console.log(error); }, function (prog) { console.log(prog); });
                            })
                        }, function (error) {
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

    $rootScope.closeLoadingModal = function (MoshafId) {
        $scope.downloading = false;
        $rootScope.modal.hide();
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
                var lastPage = mark.getLastReadPage();
                //$state.go("tab.page", { page: lastPage.pageNumber });
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
                var lastPage = mark.getLastReadPage();
               // $state.go("tab.page", { page: 1 });

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
                var lastPage = mark.getLastReadPage();
                //$state.go("tab.page", { page: 1 });

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
                var lastPage = mark.getLastReadPage();
            })
        });
    }


    $ionicModal.fromTemplateUrl('app/templates/popovers/loading.html', {
        scope: $rootScope,
        animation: 'slide-in-up',
    }).then(function (modal) {
        $rootScope.modal = modal;

    });

    $scope.openDeletePopup = function () {
        function listDir(path) {
            window.resolveLocalFileSystemURL(path,
              function (fileSystem) {
                  var reader = fileSystem.createReader();
                  reader.readEntries(
                    function (entries) {
                        $scope.ringtones = entries;
                        $ionicModal.fromTemplateUrl('app/templates/popovers/remove-moshaf.html', {
                            scope: $scope,
                            animation: 'slide-in-up',
                            //backdropClickToClose: false,
                        }).then(function (modal) {
                            $scope.ringtonesModal = modal;
                            $scope.ringtonesModal.show();
                        });

                        console.log(entries);
                    },
                    function (err) {
                        console.log(err);
                    }
                  );
              }, function (err) {
                  console.log(err);
              }
            );
        }

        listDir($scope.directoryName + "Moshaf Elgwaa/quran/");
    }

        $scope.openURL = function (url) {
        window.open(url, "_system", "location=yes,enableViewportScale=yes,hidden=no");
    }
    $scope.init();
}]);
