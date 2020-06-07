app.controller("setKhatmaDetailsController", ["$scope", "$state", "$stateParams", "khatma", "enums", "ayatData", "groupAdd", "$rootScope", "ionicPopup", "mark", "enums", "settings", "moshafdata", function ($scope, $state, $stateParams, khatma, enums, ayatData, groupAdd, $rootScope, ionicPopup, mark, enums, settings, moshafdata) {

    $scope.go = function () {
        //var PageNum = $scope.targetData.nextPage;
        var ayaId = $scope.targetData.nextAya;
        var PageNum = moshafdata.getAyaByID(ayaId).PageNum;
        var MoshafId = settings.settingsData.MoshafId.toString();

        if (MoshafId == enums.MoshafId.hafstext) {
            $state.go("tab.quranText", { page: PageNum, aya: ayaId });
        }
        else {
            $state.go("tab.page", { page: PageNum, aya: ayaId });
        }
    }

    $scope.done = function () {
        if ($scope.targetData.targetSectionType == enums.khatmaSectionsType.aya) {
            if ($scope.targetData.dayNo < $scope.targetData.daysCount) {
                $scope.targetData.finishedAyat = $scope.targetData.finishedAyat + $scope.targetData.ayatCount;
                $scope.targetData.nextAya = $scope.targetData.nextAya + $scope.targetData.ayatCount;
                $scope.targetData.nextPage = ayatData.getAya($scope.targetData.nextAya).PageNum;
                $scope.targetData.dayNo++;
                $scope.targetData.progress = ($scope.targetData.finishedAyat / $scope.targetData.totalAyatCount) * 100;
                khatma.saveTarget($scope.targetData);
                $scope.getData();
                //$scope.init();
                // $state.go("tab.set-khatma-details", { ID: $scope.targetData.id });

            }
            else {
                $scope.targetData.finishedAyat = $scope.targetData.totalAyatCount;
                $scope.targetData.nextAya = $scope.targetData.endAya;
                $scope.targetData.nextPage = ayatData.getAya($scope.targetData.nextAya).PageNum;
                $scope.targetData.KatmaFinished = 1;
                $scope.targetData.progress = ($scope.targetData.finishedAyat / $scope.targetData.totalAyatCount) * 100;
                khatma.saveTarget($scope.targetData);
                $state.go("tab.khatma-list");
            }
        }
        else {
            if ($scope.targetData.dayNo < $scope.targetData.daysCount) {
                $scope.targetData.finishedPages = $scope.targetData.finishedPages + $scope.targetData.pagesCount;
                $scope.targetData.nextPage = $scope.targetData.nextPage + $scope.targetData.pagesCount;
                $scope.targetData.nextAya = $scope.targetData.nextAya + $scope.targetData.ayatCount;
                $scope.targetData.dayNo++;
                $scope.targetData.progress = ($scope.targetData.finishedPages / $scope.targetData.totalPagesCount) * 100;
                khatma.saveTarget($scope.targetData);
                $scope.getData();
                //$scope.init();
                // $state.go("tab.set-khatma-details", { ID: $scope.targetData.id });
            }
            else {
                $scope.targetData.finishedPages = $scope.targetData.totalPagesCount;
                $scope.targetData.nextPage = $scope.targetData.endPage;
                $scope.targetData.KatmaFinished = 1;
                $scope.targetData.progress = ($scope.targetData.finishedPages / $scope.targetData.totalPagesCount) * 100;
                khatma.saveTarget($scope.targetData);
                $state.go("tab.khatma-list");
            }

        }
    }

    $scope.deleteTarget = function (curTarget, $event) {
        $event.stopPropagation();
        $event.preventDefault();
        var confirm = ionicPopup.confirm("تأكيد", "هل تريد حذف الختمة", "إلغاء", "نعم").then(function (confirm) {
            if (confirm) {
                khatma.deleteTarget(curTarget);
                $state.go("tab.khatma-list");
            }
        })
    }

    $scope.getData = function () {
        $scope.total;
        $scope.finished;
        var id = $stateParams.ID;
        $scope.targetData = khatma.getTargetByID(id);
        $scope.progress = $scope.targetData.progress;
        var juz = ayatData.getJuzData($scope.targetData.juzId);
        $scope.juzName = juz.Name;

        if ($scope.targetData.targetSectionType == enums.khatmaSectionsType.aya) {
            $scope.type = "اية";
            $scope.total = $scope.targetData.totalAyatCount;
            $scope.finished = $scope.targetData.finishedAyat;
            var fromAya = ayatData.getAya($scope.targetData.nextAya);
            var fromSurah = ayatData.getSurah(fromAya.surah);
            var toAya;
            var toSurah;
            if ($scope.targetData.dayNo < $scope.targetData.daysCount) {
                toAya = ayatData.getAya($scope.targetData.nextAya + $scope.targetData.ayatCount - 1);
            }
            else {
                toAya = ayatData.getAya($scope.targetData.endAya);
            }
            toSurah = ayatData.getSurah(toAya.surah);
            $scope.current = fromSurah.Name + " اية " + fromAya.ayahNum + " : " + toSurah.Name + " اية " + toAya.ayahNum;
        }
        else {
            $scope.type = "صفحة";
            $scope.total = $scope.targetData.totalPagesCount;
            $scope.finished = $scope.targetData.finishedPages;
            var frompage = ayatData.getSurahByPageId($scope.targetData.nextPage);
            var topage;
            if ($scope.targetData.dayNo < $scope.targetData.daysCount) {
                topage = ayatData.getSurahByPageId($scope.targetData.nextPage + $scope.targetData.pagesCount - 1);
                var endPage = $scope.targetData.nextPage + $scope.targetData.pagesCount - 1;
            }
            else {
                topage = ayatData.getSurahByPageId($scope.targetData.endPage);
                var endPage = $scope.targetData.endPage;
            }

            $scope.current = frompage.Name + " صفحة" + $scope.targetData.nextPage + " : " + topage.Name + " صفحة " + endPage;
        }
        if ($scope.targetData.notificationID != null) {
            $scope.showAlarm = true;
            $scope.notificationTime = khatma.getNotificationTime($scope.targetData.startDate, $scope.targetData.targetSectionType);
        }
        else {
            $scope.showAlarm = false;

        }
    }
    $scope.init = function () {
        $rootScope.hideMem = true;
        $scope.showAlarm = true;
        $scope.getData();
    }

    $scope.init();
}]);