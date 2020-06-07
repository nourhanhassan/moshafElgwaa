app.controller("setReviewTargetDetailsController", ["$scope", "$state", "$stateParams", "reviewTarget", "enums", "ayatData", "groupAdd", "$rootScope", "moshafdata", "memorizedayat", function ($scope, $state, $stateParams, reviewTarget, enums, ayatData, groupAdd, $rootScope, moshafdata, memorizedayat) {
    
    $scope.init = function () {
        reviewTarget.resetTargetData();
        var prev = $rootScope.$previousState;
        $scope.enums = enums;
        $scope.model={};
        $scope.model.allSurahsChecked = false;
        $scope.targetData = reviewTarget.data;
        $scope.ayatData = ayatData;
        if (typeof (prev) != 'undefined') {
            if (prev.url.indexOf("setReviewTargetDuration") == -1) {
                $scope.targetData.ayat = [];
                $scope.validateTarget();
            }
        }
        $scope.isTargetValid = true;

            $scope.start = 0;
            $scope.end = 25;
            $scope.noMoreItemsAvailable = false;
            moshafdata.surahs.forEach(function (surah) {

                surah.memorizedayat = memorizedayat.getSurahMemorizedAyat(surah.Id);
            })

            var memorized = [];
           memorized= moshafdata.surahs.filter(function (surah) { return surah.memorizedayat.length > 0 })

            $scope.memorizedList = [];

            memorized.forEach(function (surah) {
                if ($scope.targetData.ayat.length == 0)
                    surah.inReviewWerd = false;
                $scope.memorizedList.push(surah);
                surah.isCompleted = surah.memorizedayat.length == surah.AyatCount;
                if (!surah.isCompleted) {
                    var ayatArray = angular.copy(surah.memorizedayat);
                    ayatArray.forEach(function (el) {
                        debugger;

                        var i = ayatArray.indexOf(el)
                        debugger;
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
                    })
                }
            })
            $scope.AyatMemorizedList = $scope.memorizedList.slice($scope.start, $scope.end);
            $scope.start += 25;
            $scope.end += 25;
    }

    $scope.setTargetDuration = function () {

        if ($scope.validateTarget()) {
            $state.go("app.set-review-target-duration")
        }
    }

  

    $scope.validateTarget = function () {

        if (reviewTarget.data.ayat.length > 0)
            $scope.isTargetValid = true;
        else
            $scope.isTargetValid = false;
        return $scope.isTargetValid;
        

        
    }
    $scope.loadMore = function () {
        console.log("loading more")

        $scope.AyatMemorizedList = $scope.AyatMemorizedList.concat($scope.memorizedList.slice($scope.start, $scope.end));
        $scope.start += 25;
        $scope.end += 25;
        if ($scope.AyatMemorizedList.length >= $scope.memorizedList.length) {

            $scope.noMoreItemsAvailable = true;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };
    $scope.toggleAllMemorizedAyatCheck = function () {
        $scope.memorizedList.forEach(function (surah) {
            if (!surah.inReviewWerd) {
                surah.inReviewWerd = $scope.model.allSurahsChecked;
                if ($scope.model.allSurahsChecked) {
                    surah.memorizedayat.forEach(function (aya) {
                        var reviewAyaObject = {
                            id: aya.id,
                            isReviewed: false,
                            pageNum: aya.PageNum
                        }
                        reviewTarget.data.ayat.push(reviewAyaObject);
                    })
                }
            }
            })
        if (!$scope.model.allSurahsChecked) {
            reviewTarget.data.ayat = [];
            $scope.memorizedList.forEach(function (surah) {
                surah.inReviewWerd = false;
            })
        }
    }
    $scope.checkSurah = function (surah) {
        if (surah.inReviewWerd)
        {
            surah.memorizedayat.forEach(function (aya) {
                var reviewAyaObject = {
                    id: aya.id,
                    isReviewed: false,
                    pageNum: aya.PageNum
                }
                reviewTarget.data.ayat.push(reviewAyaObject);
            })
        }
        else
        {
            surah.memorizedayat.forEach(function (aya) {
                var reviewAyaObject = {
                    id: aya.id,
                    isReviewed: false,
                    pageNum: aya.PageNum
                }
                reviewTarget.data.ayat.pop(reviewAyaObject);
            })
        }
        $scope.notReviewCount = $scope.memorizedList.filter(function (obj) { return obj.inReviewWerd != true }).length;
        $scope.model.allSurahsChecked = $scope.notReviewCount == 0 ? true : false;
    }
    $scope.init();

}]);