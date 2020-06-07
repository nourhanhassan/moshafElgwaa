app.controller("tabsController", ["$scope", "$rootScope", "$state", "$ionicModal", "mark", "settings", "enums", function ($scope, $rootScope, $state, $ionicModal, mark, settings, enums) {
    $rootScope.hideMem = true;
    $scope.readMode = function () {
        $rootScope.activePage = 'read';
        var lastPage = mark.getLastReadPage();
        var MoshafId = settings.settingsData.MoshafId;
     
        if (MoshafId == enums.MoshafId.hafstext) {
            $state.go("tab.quranText", { page: lastPage.pageNumber });
        }
        else  {
            $state.go("tab.page", { page: lastPage.pageNumber });
        }
    }
}]);