app.controller("DownloadTelawasController", ["$scope", "$state", "target", "enums", "ayatData", "$rootScope", "ionicPopup", "settings", "recitations", "audio", "toast", "device", "$ionicModal", "moshafdata", function ($scope, $state, target, enums, ayatData, $rootScope, ionicPopup, settings, recitations, audio, toast, device, $ionicModal, moshafdata) {
    
    $rootScope.activePage = 'downloadTelawa';

    $scope.init = function () {
        $scope.model = {};
        $scope.recitations = recitations.recitations;
        ayatData.getSurahs().then(function (result) {
            $scope.allSurahs = result;
            console.log("allSurahs", $scope.allSurahs);
        });

        $scope.changeToSurahStart = function () {
            $scope.surahAyatStart = ayatData.getSurahAyat(Number($scope.model.selectedSurahStart.Id));
        }
        $scope.changeToAyahStart = function () {
        }
        $scope.changeToSurahEnd = function () {
            $scope.surahAyatEnd = ayatData.getSurahAyat(Number($scope.model.selectedSurahEnd.Id));
        }
        $scope.changeToAyahEnd = function () {
            //$scope.flag = ($scope.model.selectedAyahEnd.id < $scope.model.selectedAyahStart.id);
        }

        function downloadAudioByAya(ayaNumber, fromAya, toAya) {
            //$rootScope.downloadingPercentage = ayaNumber * (100 / (toAya - fromAya + 1));
            $rootScope.downloadingPercentage = (ayaNumber - fromAya) * 100 / (toAya - fromAya);
            var directoryName;
            var onlineUrl = "";
            var media = recitations.currentRecitation.media[recitations.currentRecitation.defaultMedia];
            if (recitations.currentRecitation.id == 4) {
                onlineUrl = "http://almoshafalsharef.qvtest.com/DataUpload/Ayat/minshawimujawwad_mp3/" + ayaNumber + ".mp3";
            }

            else if (recitations.currentRecitation.id == 19) {
                onlineUrl = "http://almoshafalsharef.qvtest.com/DataUpload/Ayat/Quraan-saoodshuraym_mp3/" + ayaNumber + ".mp3";
            }
            else {
                onlineUrl = "http:" + media.path + ayaNumber;
            }
            if (device.getPlatform() == "ios") {
                directoryName = cordova.file.dataDirectory;
            }
            else directoryName = cordova.file.externalRootDirectory;
            var localUrl = "Moshaf Elgwaa/audio/" + recitations.currentRecitation.name + "/" + ayaNumber + "." + media.type;
          localUrl = directoryName + localUrl;
          audio.checkAndDownloadAudio(localUrl, onlineUrl , ayaNumber).then(function () {
                console.log("suc downloading" + localUrl);
                if (ayaNumber <toAya)
                {
                    ayaNumber++;
                    downloadAudioByAya(ayaNumber, fromAya, toAya);
                }
                else
                {
                    var targetPageNum = moshafdata.getAyaByID($scope.model.selectedAyahStart.id).PageNum;
                    $rootScope.modal.hide();
                    var MoshafId = settings.settingsData.MoshafId;
                        if (MoshafId == enums.MoshafId.hafstext) {
                          
                            $state.go("tab.quranText", { page: targetPageNum/*$scope.model.selectedSurahStart.StartPage*/, aya: $scope.model.selectedAyahStart.id, repeatMode: true, ayaEnd: $scope.model.selectedAyahEnd.id, repeatCount: 1 });
                        }
                        else {
                            
                            $state.go("tab.page", { page: targetPageNum/*$scope.model.selectedSurahStart.StartPage*/, aya: $scope.model.selectedAyahStart.id, repeatMode: true, ayaEnd: $scope.model.selectedAyahEnd.id, repeatCount: 1 });
                        }
                }
            }, function (err) {
                console.log("error downloading" + localUrl);
                   
            })
        }

        $scope.saveRange = function () {
            $rootScope.canCancel = false;
            $scope.model;
            var MoshafId = settings.settingsData.MoshafId;
            if ($scope.model.selectedAyahEnd.id > $scope.model.selectedAyahStart.id) {
                $rootScope.modal.show();
                
                //for (var ayaNumber = $scope.model.selectedAyahStart.id; ayaNumber < $scope.model.selectedAyahEnd.id; ayaNumber++) {
                //    audio.downloadAudio(ayaNumber);
                //    $rootScope.downloadingPercentage = ayaNumber * (100 / ayaNumber);
                //}
                //$rootScope.modal.hide();

                //audio.download($scope.model.selectedAyahStart.id, $scope.model.selectedAyahEnd.id).then(function () {
                //    debugger
                //    if (MoshafId == enums.MoshafId.hafstext) {
                //        $state.go("tab.quranText", { page: $scope.model.selectedSurahStart.StartPage });
                //    }
                //    else {
                //        $state.go("tab.page", { page: $scope.model.selectedSurahStart.StartPage, aya: $scope.model.selectedAyahStart.id, repeatMode: true, ayaEnd: $scope.model.selectedAyahEnd.id, repeatCount: 1 });
                //    }
                //},      function (err) {  console.log("error downloading telawat") })
   
                downloadAudioByAya($scope.model.selectedAyahStart.id,$scope.model.selectedAyahStart.id, $scope.model.selectedAyahEnd.id);
            }
        }

        $scope.checkValues = function (myForm) {
            myForm.$setPristine();
            return ($scope.model.selectedAyahEnd.id < $scope.model.selectedAyahStart.id);
        }
        
        $scope.changeRecitation = function () {
            settings.setRecitationIdValue($scope.model.recitationId);
            recitations.setCurrentRecitation($scope.model.recitationId)
        }
        
    }
    $ionicModal.fromTemplateUrl('app/templates/popovers/loading.html', {
        scope: $rootScope,
        animation: 'slide-in-up',
    }).then(function (modal) {
        $rootScope.modal = modal;

    });
    $scope.init();
}]);

