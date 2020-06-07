app.controller("surahsController", ["$scope", "moshafdata", "$state", "ayatData", "$rootScope", "enums", "memorizedayat", "settings", "enums", function ($scope, moshafdata, $state, ayatData, $rootScope, enums, memorizedayat, settings, enums) {
    $rootScope.appMode = enums.appModes.read;
    $rootScope.activeTab = 'surah';
    $scope.surahs;
    $scope.items;
    $scope.noMoreItemsAvailable = false;
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
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
        $rootScope.activePage = "suar";
 
        moshafdata.getSurahs().then(function (result) {
            $scope.surahs = result;

            $scope.items = result.slice($scope.start, $scope.end);
            $scope.start += 10;
            $scope.end += 10;
        });
        $rootScope.hideMem = true;


    }
    //$scope.loadMore = 10;
    $scope.start = 0;
    $scope.end = 10;
    $scope.onInfinite = function () {
        $scope.items= $scope.items.concat($scope.surahs.slice($scope.start, $scope.end));
        if ($scope.items.length < $scope.surahs.length) {
            $scope.start += 10;
            $scope.end += 10;
            $scope.noMoreItemsAvailable = false;
        }
        else
        {
            $scope.noMoreItemsAvailable = true;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    $scope.loadMoreData = function () {
  
        //$scope.loadMore += 10;
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };

    $scope.moreDataCanBeLoaded = function () {
        if ($scope.surahs.length > $scope.loadMore)
            return true;
        else
            return false;
    };
    $scope.init();
    $scope.getSurahProgress = function(surah)
    {
        surah.memorizedayat = memorizedayat.getSurahMemorizedAyat(surah.Id);

        return Math.ceil((surah.memorizedayat.length / surah.AyatCount) * 100);
    }
}]);
app.directive("repeatEnd", function () {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            if (scope.$last) {
                scope.$eval(attrs.repeatEnd);
            }
        }
    };
});