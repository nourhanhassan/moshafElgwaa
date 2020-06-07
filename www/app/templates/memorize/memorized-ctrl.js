app.controller("memorizedController", function ($scope, moshafdata, memorizedayat, $filter, $ionicPopup, $timeout, $anchorScroll, $location, ionicLoading, target, enums, $state, $rootScope, mark, enums, settings) {
    $scope.init = function () {
        $rootScope.hideMem = true;
        $scope.start = 0;
        $scope.end = 20;
        $scope.noMoreItemsAvailable = false;
        moshafdata.surahs.forEach(function (surah) {

            surah.memorizedayat = memorizedayat.getSurahMemorizedAyat(surah.Id);
        })

        var memorized = moshafdata.surahs.filter(function (surah) { return surah.memorizedayat.length > 0 })
 
        $scope.memorizedList = [];

        memorized.forEach(function (surah) {
            $scope.memorizedList.push(surah);
            surah.isCompleted = surah.memorizedayat.length == surah.AyatCount;
            if (!surah.isCompleted) {
                var ayatArray = angular.copy(surah.memorizedayat);
                ayatArray.forEach(function (el) {

                    var i = ayatArray.indexOf(el)

                    if (i > 0 && !(ayatArray[i - 1].id == el.id - 1)) {
                        //  newArr.push(el)
                        var surahCopy = angular.copy(surah)

                        $scope.memorizedList[$scope.memorizedList.length - 1].memorizedayat = ayatArray.filter(function (aya) {
                            return aya.id < el.id
                        })
                        surahCopy.memorizedayat = ayatArray.filter(function (aya) {
                            return aya.id >= el.id
                        })
                        $scope.memorizedList.push(surahCopy)
                        ayatArray = surahCopy.memorizedayat;
                    }
                    //  console.log(newArr)
                    //   return newArr;
                })
            }
        })
        $scope.viewMemorizedList = $scope.memorizedList.slice($scope.start, $scope.end);
        $scope.start += 20;
        $scope.end += 20;
    }


    $scope.loadMore = function () {

        $scope.viewMemorizedList = $scope.viewMemorizedList.concat($scope.memorizedList.slice($scope.start, $scope.end));
        $scope.start += 20;
        $scope.end += 20;
        if ($scope.viewMemorizedList.length >= $scope.memorizedList.length) {

            $scope.noMoreItemsAvailable = true;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };
    $scope.goToPage = function (ayaId) {
        var MoshafId = settings.settingsData.MoshafId.toString();
        var PageNum = moshafdata.getAyaByID(ayaId).PageNum;
        if (MoshafId == enums.MoshafId.hafstext) {
            $state.go("tab.quranText", { page: PageNum });
        }
        else  {
            $state.go("tab.page", { page: PageNum });
        }
    }
    $scope.init();
  //  console.log($scope.memorizedList);
})
