app.controller("unMemorizedController", function ($scope, moshafdata, memorizedayat, $filter, $ionicPopup, $timeout, $anchorScroll, $location, ionicLoading, target, enums, $state, $rootScope, mark, enums, settings) {
    $scope.init = function () {
        //$scope.loadMore = 20;
        $rootScope.hideMem = true;
        $scope.start = 0;
        $scope.end = 20;
        $scope.noMoreItemsAvailable = false;
        moshafdata.surahs.forEach(function (surah) {

            surah.unMemorizedayat = memorizedayat.getSurahNotMemorizedAyat(surah.Id);
        })

        var unMemorized= moshafdata.surahs.filter(function (surah) { return surah.unMemorizedayat.length > 0 })
     
        $scope.unMemorizedList = [];

        unMemorized.forEach(function (surah) {
            $scope.unMemorizedList.push(surah);
            surah.isCompleted = surah.unMemorizedayat.length == surah.AyatCount;
            if (!surah.isCompleted) {
                var ayatArray = angular.copy(surah.unMemorizedayat);
                ayatArray.forEach(function (el) {

                    var i = ayatArray.indexOf(el)

                    if (i > 0 && !(ayatArray[i - 1].id == el.id - 1)) {
                        //  newArr.push(el)
                        var surahCopy = angular.copy(surah)

                        $scope.unMemorizedList[$scope.unMemorizedList.length - 1].unMemorizedayat = ayatArray.filter(function (aya) {
                            return aya.id < el.id
                        })
                        surahCopy.unMemorizedayat = ayatArray.filter(function (aya) {
                            return aya.id >= el.id
                        })
                        $scope.unMemorizedList.push(surahCopy)
                        ayatArray = surahCopy.unMemorizedayat;
                    }
                    //  console.log(newArr)
                    //   return newArr;
                })
            }
        })
        $scope.viewUnMemorizedList = $scope.unMemorizedList.slice($scope.start, $scope.end);
        $scope.start += 20;
        $scope.end += 20;
    }


    $scope.loadMore = function () {
        console.log("loading more")
   
        $scope.viewUnMemorizedList = $scope.viewUnMemorizedList.concat($scope.unMemorizedList.slice($scope.start, $scope.end));
        $scope.start += 20;
        $scope.end += 20;
        if ($scope.viewUnMemorizedList.length >= $scope.unMemorizedList.length) {
        
          $scope.noMoreItemsAvailable = true;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };
    $scope.goToPage = function (PageNum, ayaId) {
        var MoshafId = settings.settingsData.MoshafId.toString();
        var PageNum2 = moshafdata.getAyaByID(ayaId).PageNum;
        if (MoshafId == enums.MoshafId.hafstext) {
            $state.go("tab.quranText", { page: PageNum2, aya: ayaId });
        }
        else  {
            $state.go("tab.page", { page: PageNum2, aya: ayaId });
        }
    }
    $scope.init();
  //  console.log($scope.unMemorizedList);
})
