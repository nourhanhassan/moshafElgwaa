app.controller("partsController", ["$scope", "moshafdata", "$state", "$rootScope", "enums", "memorizedayat", "settings", function ($scope, moshafdata, $state, $rootScope, enums, memorizedayat, settings) {
    $rootScope.appMode = enums.appModes.read;
    $rootScope.activePage = "suar";
    $rootScope.activeTab = 'parts';
    $scope.parts;
    $scope.goToPage = function (pageNum) {
        var MoshafId = settings.settingsData.MoshafId;
      
        if (MoshafId == enums.MoshafId.hafstext) {
            $state.go("tab.quranText", { page: pageNum });
        }
        else  {
            $state.go("tab.page", { page: pageNum });
        }
    }
    $scope.init = function () {
        $scope.start = 1;
        $scope.end = 15;
        moshafdata.getParts().then(function (result) {
            //$scope.parts = result;
            $scope.parts = [];
            angular.forEach(result, function (value, key) {
                value.juzProgress =  $scope.getJuzProgress(value);
                $scope.parts.push(value);
            });
            $rootScope.hideMem = true;
         //   $scope.parts.push({})
         //   $scope.parts.push({})
            //console.log($scope.parts)
        })
    }



    $scope.getJuzProgress = function (juz) {
        var memorizedLength = memorizedayat.getJuzMemorizedAyat(juz.Id).length;
        var allLength = juz.EndAyah - juz.StartAyah + 1;

        return Math.ceil((memorizedLength / allLength) * 100);
    }

    $scope.init();
}]);
