
app.controller("searchResultController", ["$scope", "moshafdata", "$state", "$rootScope", "$sce", "$ionicHistory","mark", "enums","settings", function ($scope, moshafdata, $state, $rootScope, $sce, $ionicHistory,mark, enums,settings) {
    //$rootScope.showMenu = false;
    //$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    //    debugger;
    //    viewData.enableBack = true;
    //});
    $scope.getHtml = function (text) {
        return $sce.trustAsHtml(text);
    }
    $scope.ayas = moshafdata.searchData.searchResult;
    $scope.number = $scope.ayas.length;
    $scope.searchKey = moshafdata.searchData.searchKey
    $scope.search = function () {
        debugger;
    }
    $scope.mgoBack = function () {
        $ionicHistory.goBack();
    };
    $scope.goToPage = function (PageNum,ayaId) {
        var MoshafId = settings.settingsData.MoshafId.toString();
      
        if (MoshafId == enums.MoshafId.hafstext) {
            $state.go("tab.quranText", {page:PageNum,aya:ayaId});
        }
        else {
                $state.go("tab.page", { page: PageNum, aya: ayaId });
            }
    }
    $scope.init = function () {
        $rootScope.hideMem = true;
    }
    $scope.init();
}]);


