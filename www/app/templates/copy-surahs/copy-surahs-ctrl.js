app.controller("copySurahsController", ["$scope", "$rootScope", "$stateParams", "$state", "enums", "moshafdata","$cordovaFile","file","device", function ($scope, $rootScope, $stateParams, $state, enums, moshafdata,$cordovaFile,file,device) {
    $rootScope.activePage = "copySurahs";
    
    $scope.init = function () {
        $scope.moshafId = $rootScope.selectedCopy;
        if ($scope.moshafId == enums.MoshafId.hafs ) {
            $scope.moshafName= enums.mosahfCopy.hafs.nameEn;
        }
        else if ($scope.moshafId == enums.MoshafId.shamrly ) {
            $scope.moshafName= enums.mosahfCopy.shamrly.nameEn;
        }
        else if ($scope.moshafId == enums.MoshafId.qalon ) {
            $scope.moshafName= enums.mosahfCopy.qalon.nameEn;
        }
        else if ($scope.moshafId == enums.MoshafId.warsh) {
            $scope.moshafName= enums.mosahfCopy.warsh.nameEn;
        }
        $scope.canDeleteSurahs = [];
        var directory = "";
        if (device.getPlatform() == "ios") {
            directory = cordova.file.dataDirectory;
        }
        else directory = cordova.file.externalRootDirectory;
        window.resolveLocalFileSystemURL(directory + enums.appData.targetPath + "/" + $scope.moshafName, function (fileSystem) {
            var reader = fileSystem.createReader();
            reader.readEntries(
              function (entries) {
                  //if (entries.length == enums.mosahfCopy.hafs.pagesCount) {
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
    $scope.deleteImages=function(surah){
        var directory = "";
        if (device.getPlatform() == "ios") {
            directory = cordova.file.dataDirectory;
        }
        else directory = cordova.file.externalRootDirectory;
        var path = directory+"Moshaf Elgwaa/quran/"+$scope.moshafName;
        var filename="";
        var startPage=surah.StartPage.replace("page","");
        var endPage=surah.EndPage.replace("page","");

        var incrementvalue=startPage;

        filename="page"+incrementvalue+".png";
        file.removeFile(filename,path);


        while (incrementvalue<endPage) {
            // coerce the previous variable as a number and add 1
            incrementvalue = (+incrementvalue) + 1;
            // insert leading zeroes with a negative slice
            incrementvalue = ("000" + incrementvalue).slice(-3); // -> result: "0126"
            filename="page"+incrementvalue+".png";

            file.removeFile(filename,path);
        }

        $scope.canDeleteSurahs = $scope.canDeleteSurahs.filter(function(item) {
            return item.Name !== surah.Name;
        })


    }
    $scope.goToSurahPages=function(surah){
        $rootScope.selectedSurah=surah;
        $state.go("surah-pages");
    }
    $scope.deleteRowaya=function(){
        var directory = "";
        if (device.getPlatform() == "ios") {
            directory = cordova.file.dataDirectory;
        }
        else directory = cordova.file.externalRootDirectory;
        var path = directory+"Moshaf Elgwaa/quran/"+$scope.moshafName;
        window.resolveLocalFileSystemURL(directory + enums.appData.targetPath + "/" + $scope.moshafName, function (fileSystem) {
            var reader = fileSystem.createReader();
            reader.readEntries(
              function (entries) {
                          
                  angular.forEach(entries, function (value, key) {
                      file.removeFile(value.name,path);
                  });
                  $scope.canDeleteSurahs=[];
              },
              function (err) {
                  console.log(err);
              }
            );
        }, function (err) { console.log(err); });

    }
    $scope.init();
}]);
