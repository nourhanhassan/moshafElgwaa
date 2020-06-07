app.controller("telawaSurahsController", ["$scope", "$rootScope", "$stateParams", "$state", "enums", "moshafdata","file","device", function ($scope, $rootScope, $stateParams, $state, enums, moshafdata,file,device) {
    $rootScope.activePage = "telawaSurahs";
    
    $scope.init = function () {
        $scope.existedAudios = [];
        $scope.directoryName = "";
        if (device.getPlatform() == "ios") {
            $scope.directoryName = cordova.file.dataDirectory;
        }
        else $scope.directoryName = cordova.file.externalRootDirectory;
        window.resolveLocalFileSystemURL($scope.directoryName + enums.appData.audioTargetPath+"/"+$rootScope.selectedTelawa, function (fileSystem) {
            var reader = fileSystem.createReader();
            reader.readEntries(
              function (entries) {
                  moshafdata.getSurahs().then(function (result) {
                          
                      $scope.surahs = result;
                      angular.forEach(entries, function (value, key) {
                          value.name=value.name.replace(".mp3", "");

                      });
                          
                      $scope.surahs.forEach(function (entry) {
                          entries.forEach(function (e) {
                              if (e.name >= entry.StartAyah && e.name <= entry.EndAyah) {
                                  var canDeleteAudio = {};
                                  canDeleteAudio.surahName = entry.Name;
                                  canDeleteAudio.audio = e.name;
                                  $scope.existedAudios.push(canDeleteAudio);
                              }
                          });
                      });
                      $scope.result  = $scope.existedAudios.map(x=>x.surahName);
                      $scope.shownArray= $scope.result.filter(function(item, pos) {
                          return $scope.result.indexOf(item) == pos;
                      })
                  });
                  //}
              },
              function (err) {
                  console.log(err);
              }
            );
        }, function (err) { console.log(err); });

    }
    
    $scope.deleteSurahAudios=function(selectedSurah){
        $scope.canDeleteSurahAudios=$scope.existedAudios.filter(x=>x.surahName==selectedSurah);
        var path=$scope.directoryName + enums.appData.audioTargetPath + "/" + $rootScope.selectedTelawa;
        angular.forEach($scope.canDeleteSurahAudios, function (value, key) {
            file.removeFile(value.audio+".mp3", path).then(function (removedAudio) {
                $scope.shownArray = $scope.shownArray.filter(function(x){return x!=selectedSurah}   );
            });
        });
     
    
    }
    $scope.goToSurahAudios=function(selectedSurah){
        $scope.existedAudios;
        $rootScope.selectedSurahAudios=$scope.existedAudios.filter(x=>x.surahName==selectedSurah);
        $state.go("surah-audios");
    }
    $scope.init();
}]);
