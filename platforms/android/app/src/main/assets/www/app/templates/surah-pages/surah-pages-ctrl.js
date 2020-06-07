app.controller("surahPagesController", ["$scope", "$rootScope", "$stateParams", "$state", "enums", "moshafdata", "file", "device", function ($scope, $rootScope, $stateParams, $state, enums, moshafdata, file, device) {
    $rootScope.activePage = "surahPages";

    $scope.init = function () {
        $scope.surahImages = [];
        $scope.moshafId = $rootScope.selectedCopy;
        if ($scope.moshafId == enums.MoshafId.hafs) {
            $scope.moshafName = enums.mosahfCopy.hafs.nameEn;
        }
        else if ($scope.moshafId == enums.MoshafId.shamrly) {
            $scope.moshafName = enums.mosahfCopy.shamrly.nameEn;
        }
        else if ($scope.moshafId == enums.MoshafId.qalon) {
            $scope.moshafName = enums.mosahfCopy.qalon.nameEn;
        }
        else if ($scope.moshafId == enums.MoshafId.warsh) {
            $scope.moshafName = enums.mosahfCopy.warsh.nameEn;
        }
        $scope.canDeleteSurahs = [];
        $scope.directoryName = "";
        if (device.getPlatform() == "ios") {
            $scope.directoryName = cordova.file.dataDirectory;
        }
        else $scope.directoryName = cordova.file.externalRootDirectory;
        window.resolveLocalFileSystemURL($scope.directoryName + enums.appData.targetPath + "/" + $scope.moshafName, function (fileSystem) {
            var reader = fileSystem.createReader();
            reader.readEntries(
              function (entries) {
                  //if (entries.length == enums.mosahfCopy.hafs.pagesCount) {
                  moshafdata.getSurahs().then(function (result) {
                      $scope.surahs = result;
                      $scope.surahs = $scope.surahs.filter(function (e) {
                          return e.Id === $rootScope.selectedSurah.Id;
                      });
                      angular.forEach(entries, function (value, key) {
                          value.name = value.name.replace(".png", "");

                      });
                      angular.forEach($scope.surahs, function (x, key) {
                          x.StartPage = x.StartPage < 10 ? "00" + x.StartPage : x.StartPage < 100 ? "0" + x.StartPage : x.StartPage;
                          x.EndPage = x.EndPage < 10 ? "00" + x.EndPage : x.EndPage < 100 ? "0" + x.EndPage : x.EndPage;
                      });
                      var incrementvalue = $scope.surahs[0].StartPage;
                      entries.forEach(function (e) {
                          if (e.name.includes(incrementvalue)) {
                              $scope.surahImages.push(e);
                          };
                      });

                      while (incrementvalue < $scope.surahs[0].EndPage) {
                          // coerce the previous variable as a number and add 1
                          incrementvalue = (+incrementvalue) + 1;
                          // insert leading zeroes with a negative slice
                          incrementvalue = ("000" + incrementvalue).slice(-3); // -> result: "0126"

                          entries.forEach(function (e) {
                              if (e.name.includes(incrementvalue)) {
                                  $scope.surahImages.push(e);
                              };
                          });
                      }
                      console.log()

                  });
                  //}
              },
              function (err) {
                  console.log(err);
              }
            );
        }, function (err) { console.log(err); });

    }
    $scope.deleteImage = function (image) {
        var path = $scope.directoryName + "Moshaf Elgwaa/quran/" + $scope.moshafName;
        var filename = "";
        filename = image.name + ".png";
        file.removeFile(filename, path).then(function (removedImage) {
            $scope.surahImages = $scope.surahImages.filter(function (item) {
                var deleted = removedImage.replace(".png", "");
                return !item.name.includes(deleted);
            })
        });
    }
    $scope.init();
}]);