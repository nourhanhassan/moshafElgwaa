app.controller("setTargetDetailsController", ["$scope", "$state", "$stateParams", "target", "enums", "ayatData", "groupAdd", "$rootScope", "settings", function ($scope, $state, $stateParams, target, enums, ayatData, groupAdd, $rootScope, settings) {
    var storedTargets = [];
    $scope.init = function () {
        $scope.ayatValid = true;
        $scope.minPageError = false;
        var moshafId = settings.settingsData.MoshafId;
        if (moshafId == "4" || moshafId == "3")
            $scope.minPageNum = 2;
        else
            $scope.minPageNum = 1;
        if ($stateParams.mode == enums.memorizeMode.individual)
        $rootScope.addgroup = false;

        $scope.ayatMemorizeValid = true;
        $rootScope.hideMem = true;
        //target.resetTargetData();
        target.resetTargetData();
        var prev = $rootScope.$previousState;
        ayatData.getSurahs().then(function (res) {
            $scope.surahs = res;
            ayatData.getParts().then(function (res) {
                $scope.parts = res;
            });
        });
        storedTargets = target.getAllTargets();
        if (!storedTargets) {
            storedTargets = [];
        }
        $scope.enums = enums;
        $scope.targetData = target.data;
        $scope.ayatData = ayatData;
        if (typeof (prev) != 'undefined') {
            if (prev.url.indexOf("setTargetDuration") == -1) {
                $scope.targetData.juzId = 1;
                $scope.targetData.surahId = 1;
                $scope.validateTarget();
            }
        }
        target.data.memorizeMode = $stateParams.mode;

        $scope.isTargetValid = true;
        $scope.ispageNumberValid = true;
        $scope.pageToValid = true;
        $scope.pageFromValid = true;
        //$scope.validateTarget();
    }

    $scope.setTargetDuration = function () {
        //target.data.targetType = $scope.targetData.targetType;
        //target.data.juzId = $scope.targetData.juzId;
        //target.data.surahId = $scope.targetData.surahId;
        if (target.data.targetType == enums.targetType.page) {
            $scope.ayatMemorizeValid = true;
            target.data.startPage = target.data.pageFrom;
            target.data.endPage = target.data.pageTo;
            $scope.validatePageNumber(target.data.pageFrom, target.data.pageTo)
        }
        else if (target.data.targetType == enums.targetType.juz) {
            $scope.ayatMemorizeValid = true;
            var juzData = ayatData.getJuzData($scope.targetData.juzId);
            target.data.startPage = juzData.StartPage;
            target.data.endPage = juzData.EndPage;
        }
        else if (target.data.targetType == enums.targetType.aya) {
            target.data.startSoura = target.data.selectedAyahStart.surah;
            target.data.startAya = target.data.selectedAyahStart.ayahNum;
            target.data.startAyaNum = target.data.selectedAyahStart.ayahNum;
            target.data.endSoura = target.data.selectedAyahEnd.surah;
            target.data.endAyaNum = target.data.selectedAyahEnd.ayahNum;
            target.data.noOfAyah = target.data.selectedAyahEnd.id - target.data.selectedAyahStart.id+1;
            target.data.ayatCount = target.data.noOfAyah;
            target.data.allAyat = [];
            for (var i = target.data.selectedAyahStart.id; i <= target.data.selectedAyahEnd.id; i++) {
                target.data.allAyat.push(ayatData.getAya(i));
            }
            console.log(target.data.allAyat);
            if (isNaN(target.data.ayatCount))
                $scope.ayatValid = false;
            else
                if (target.data.ayatCount <= 0)
                    $scope.ayatMemorizeValid = false;
                else {
                    $scope.ayatMemorizeValid = true;
                    $scope.ayatValid = true;

                }
        }
        else {
            $scope.ispageNumberValid = true;
            $scope.ayatValid = true;
        }
        if ($scope.validateTarget() && $scope.ispageNumberValid && $scope.pageFromValid && $scope.pageToValid && $scope.ayatMemorizeValid && $scope.ayatValid) {
            $state.go("set-target-duration")
        }
    }



    $scope.validateTarget = function () {

        $scope.isTargetValid = true;

        if (target.data.memorizeMode != enums.memorizeMode.group) {
            for (var i = 0; i < storedTargets.length; i++) {

                if ((storedTargets[i].surahId == target.data.surahId && storedTargets[i].targetType == target.data.targetType && target.data.targetType == enums.targetType.sura) || (storedTargets[i].juzId == target.data.juzId && storedTargets[i].targetType == target.data.targetType && target.data.targetType == enums.targetType.juz) || (storedTargets[i].pageFrom == target.data.pageFrom && storedTargets[i].pageTo == target.data.pageTo && storedTargets[i].targetType == target.data.targetType && target.data.targetType == enums.targetType.page)) {

                    $scope.isTargetValid = false;
                    break;
                }

            }

        }
        if (target.data.targetType != enums.targetType.page) {
            $scope.ispageNumberValid = true;
            $scope.pageFromValid = true;
            $scope.pageToValid = true;

        }
        if (target.data.targetType != enums.targetType.aya)
        {
                                $scope.ayatValid = true;

        }
        return $scope.isTargetValid;



    }
    $scope.changeToSurahStart = function () {
        $scope.surahAyatStart = ayatData.getSurahAyat(Number($scope.targetData.selectedSurahStart));
    }
    $scope.changeToAyahStart = function () {
    }
    $scope.changeToSurahEnd = function () {
        $scope.surahAyatEnd = ayatData.getSurahAyat(Number($scope.targetData.selectedSurahEnd));
    }
    $scope.changeToAyahEnd = function () {
    }
    $scope.validatePageNumber = function (pageFrom, pageTo) {
        debugger
        if (pageFrom != undefined && pageTo != undefined) {
            if (pageFrom > pageTo || pageTo < pageFrom || pageFrom == undefined || pageTo == undefined) {
                $scope.isTargetValid = true;
                $scope.ispageNumberValid = false;
                $scope.minPageError = false;
            }
            else if (pageFrom < $scope.minPageNum)
                $scope.minPageError = true;
            else {
                $scope.ispageNumberValid = true;
                $scope.minPageError = false;
            }

        }
        if (pageFrom == undefined) {
            $scope.pageFromValid = false;

        }
        else {
            $scope.pageFromValid = true;
        }
        if (pageTo == undefined) {
            $scope.pageToValid = false;

        }
        else {
            $scope.pageToValid = true;
        }
    }
    $scope.init();

}]);