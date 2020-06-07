app.controller("surahAudiosController", ["$scope", "$rootScope", "$stateParams", "$state", "enums", "moshafdata","file","device", function ($scope, $rootScope, $stateParams, $state, enums, moshafdata,file,device) {
    $rootScope.activePage = "surahAudios";
    
    $scope.init = function () {
        $scope.audios=[];
        $scope.directoryName = "";
        if (device.getPlatform() == "ios") {
            $scope.directoryName = cordova.file.dataDirectory;
        }
        else $scope.directoryName = cordova.file.externalRootDirectory;
        window.resolveLocalFileSystemURL($scope.directoryName + enums.appData.audioTargetPath+"/"+$rootScope.selectedTelawa, function (fileSystem) {
            var reader = fileSystem.createReader();
            reader.readEntries(
              function (entries) {
                          
                  entries.forEach(function (e) {
                      var entryName=e.name.replace(".mp3","");
                      $rootScope.selectedSurahAudios.forEach(function(audio){
                          if (entryName==audio.audio) {
                              $scope.audios.push(e);
                          }
                      })
                  });
              },
              function (err) {
                  console.log(err);
              }
            );
        }, function (err) { console.log(err); });

    }
    $scope.deleteAudio = function (selectedAudio) {
        var path=$scope.directoryName + enums.appData.audioTargetPath + "/" + $rootScope.selectedTelawa;
        file.removeFile(selectedAudio.name, path).then(function (removedAudio) {
            $scope.audios = $scope.audios.filter(x=>x.name!=removedAudio);
            $rootScope.selectedSurahAudios=$rootScope.selectedSurahAudios.filter(x=>!removedAudio.includes(x.audio));
        });
    }
    $scope.init();
}]);
