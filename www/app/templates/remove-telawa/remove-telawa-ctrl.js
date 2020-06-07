app.controller("removeTelawaController", ["$scope", "$rootScope", "$stateParams", "$state", "enums", "moshafdata","file","device", function ($scope, $rootScope, $stateParams, $state, enums, moshafdata,file,device) {
    $rootScope.activePage = "removeTelawa";
    
    $scope.init = function () {
        var directoryName = "";
        //var path = "";
        if (device.getPlatform() == "ios") {
            directoryName = cordova.file.dataDirectory;
        }
        else directoryName = cordova.file.externalRootDirectory;
        window.resolveLocalFileSystemURL(directoryName + enums.appData.audioTargetPath, function (fileSystem) {
            var reader = fileSystem.createReader();
            reader.readEntries(
              function (entries) {
                  $scope.telawat=entries;
                  angular.forEach(entries, function (value, key) {
                      console.log(value);
                      console.log(key);
                      window.resolveLocalFileSystemURL(directoryName + enums.appData.audioTargetPath+"/"+value.name, function (fileSystem) {
                          var reader = fileSystem.createReader();
                          reader.readEntries(
                            function (entries) {
                                if(entries.length==0){
                                    $scope.telawat[key].canDelete=false;
                                }else{
                                    $scope.telawat[key].canDelete=true;
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
                          value.name=value.name.replace(".png", "");

                      });
                      angular.forEach($scope.surahs, function (x, key) {
                          x.StartPage= x.StartPage < 10 ? "page00" + x.StartPage : x.StartPage < 100 ? "page0" + x.StartPage : "page" + x.StartPage;
                          x.EndPage = x.EndPage < 10 ? "page00" + x.EndPage : x.EndPage < 100 ? "page0" + x.EndPage : "page" + x.EndPage;
                      });
                          
                      $scope.surahs.forEach(function (entry) {
                          entries.forEach(function (e) {
                              var entryName=e.name.replace("page","");
                              var StartPage=entry.StartPage.replace("page","");
                              var EndPage=entry.EndPage.replace("page","");
                              if (entryName >= StartPage && entryName <= EndPage && $scope.canDeleteSurahs.filter(item=> item.Id == entry.Id).length == 0) {
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

    }
    $scope.deleteTelawa=function(telawa,index){
        var directoryName = "";
        //var path = "";
        if (device.getPlatform() == "ios") {
            directoryName = cordova.file.dataDirectory;
        }
        else directoryName = cordova.file.externalRootDirectory;
        window.resolveLocalFileSystemURL(directoryName + enums.appData.audioTargetPath+"/"+telawa.name, function (fileSystem) {
            var reader = fileSystem.createReader();
            reader.readEntries(
              function (entries) {
                  var path=directoryName + enums.appData.audioTargetPath+"/"+telawa.name;
                  $scope.telawaAudios=entries;
                  angular.forEach($scope.telawaAudios, function (value, key) {
                      file.removeFile(value.name, path).then(function (removedAudio) {
                          //$scope.telawat=$scope.telawat.filter(x=>x.name!=telawa.name);
                      });
                  });
                  $scope.telawat[index].canDelete=false;
              },
              function (err) {
                  console.log(err);
              }
            );
        }, function (err) { console.log(err); });

    }
    $scope.goToTelawaSurahs=function(selectedTelawa){
        $rootScope.selectedTelawa=selectedTelawa;
        $state.go("telawa-surahs");
    }
    $scope.init();
}]);
