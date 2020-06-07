app.controller("AlarmListController", ["$scope", "$state", "alarm", "device", "enums", "ayatData", "device", "audio", "file", "alarmStorage", "$rootScope", "$ionicModal", "ionicPopup", "$ionicLoading", "file", "network", "fileTransfer", function ($scope, $state, alarm, device, enums, ayatData, device, audio, file, alarmStorage, $rootScope, $ionicModal, ionicPopup, $ionicLoading, file, network, fileTransfer) {
    //$rootScope.appMode = enums.appModes.memorize;
    var targets = alarm.getAllTargets();
    //$rootScope.appMode = enums.appModes.memorize;
    //cordova.plugins.notification.local.clearAll()
    $rootScope.activePage = 'alarm-list';
    if (typeof (targets) != "undefined") {
        $scope.targets = targets.reverse();
    }
    if (device.getPlatform() == "ios") {
        $scope.directoryName = cordova.file.dataDirectory;
    }
    else $scope.directoryName = cordova.file.externalRootDirectory;
    var source = "http://app2aw.qv-site.com/moshaf/alarm";
    var sourceUrl = "";
    var dest = "";
    $scope.editAlarm = function (curTarget, $event) {
        $event.stopPropagation();
        $event.preventDefault();
        alarm.data = curTarget;
        $state.go("alarm");
    }
    $scope.deleteAlarm = function (curTarget) {
        var confirm = ionicPopup.confirm("تاكيد", "هل تريد حذف التنبيه", "الغاء", "نعم").then(function (confirm) {
            if (confirm) {

                alarm.deleteTarget(curTarget);
                var targets = alarm.getAllTargets();
                if (typeof (targets) != "undefined") {
                    $scope.targets = targets.reverse();
                }
            }
        })
    }
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
        $scope.nowPlaying = "";
        audio.stop();
        $scope.toneURL = $scope.directoryName + "Moshaf Elgwaa/alarm/" + tone.name;
        $scope.nowPlaying = "جاري الإستماع إلى " + tone.name;
        audio.playUrl($scope.toneURL);
    }

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
    //$scope.yalla=function()()

    $scope.toggleOptions = function (curTarget) {
        $scope.selectedTarget = curTarget;
    }
    var downloadMore = false;
    $scope.init = function () {
        $rootScope.hideMem = true;
        var downloadMore = false;
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
        $scope.alarmCounter = 0;
        if ($rootScope.initialAlarmDownloadStart)
            console.log($rootScope.initialAlarmDownloadStart);
        else {
            $rootScope.initialAlarmDownloadStart = 1;
            downloadAlarmTones($rootScope.initialAlarmDownloadStart);
        }
        $rootScope.hideMem = true;
        var targets = alarm.getAllTargets();
        console.log(targets);
    }

    $rootScope.downloadMoreAlarms = function () {
        downloadMore = true;
        $scope.alarmCounter = 0;
        $scope.editRingtonesModal.hide();
        //$rootScope.closeAddAlarmRingTone();
        $rootScope.initialAlarmDownloadStart = parseInt($rootScope.initialAlarmDownloadStart);
        downloadAlarmTones($rootScope.initialAlarmDownloadStart + 1);
        //$rootScope.openAddAlarmRingtone();
    }
    $scope.notificationModes = enums.notificationMode;
    $scope.toggleNotification = function (curTarget) {
        if (curTarget.notificationModeSelection) {
            curTarget.notificationMode = enums.notificationMode.on
        }
        else {
            curTarget.notificationMode = enums.notificationMode.off
        }
        alarm.saveTarget(curTarget);
    }
    $scope.init();

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
        if (device.getPlatform() == "ios") {
            path = path.replace("file:///", "/");
            path = decodeURI(path);
        }
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
                    });
                }
                else {
                    network.showNetworkOfflineMsg();
                }

            });

        }
    }
}]);

