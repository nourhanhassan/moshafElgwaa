app.controller("setKhatmaDurationController", ["$scope", "$state", "khatma", "enums", "ayatData", "localNotification", "$cordovaLocalNotification", "groupAdd", "ionicTimePicker", "$ionicScrollDelegate", "$timeout", "$rootScope", "settings", function ($scope, $state, khatma, enums, ayatData, localNotification, $cordovaLocalNotification, groupAdd, ionicTimePicker, $ionicScrollDelegate, $timeout, $rootScope, settings) {
    $scope.maxDays;
    if (khatma.data.id) {
        khatma.data = khatma.getTargetByID(khatma.data.id);
        $scope.title = 'تعديل هدف';
    }
    $scope.enums = enums;
    $scope.targetData = khatma.data;
    //$scope.targetData = khatma.getProgressDays($scope.targetData);
    //$scope.targetData.name = khatma.getTargetTitle($scope.targetData.targetType, $scope.targetData.surahId, $scope.targetData.juzId, $scope.targetData.pageFrom, $scope.targetData.pageTo);




    $scope.notificationTime = {
        hour: new Date($scope.targetData.startDate).getHours(),
        minute: new Date($scope.targetData.startDate).getMinutes(),
        ampm: new Date($scope.targetData.startDate).getHours() > 11 ? "pm" : "am",
        dayofWeek: new Date($scope.targetData.startDate).getDay(),
    }
    var h = $scope.notificationTime.hour;
    var m = $scope.notificationTime.minute;

    alert(h);
    $scope.selectedTime = ((h * 60 * 60) + (m * 60));


    $scope.getHour = function () {
        var hour = $scope.notificationTime.hour;
        if (hour > 12) {
            hour -= 12;
        }
        if (hour == 0) { hour = 12 }
        return hour;
    }
    $scope.getAmPm = function () {
        var hour = $scope.notificationTime.hour;
        var ampm = "ص";
        if (hour >= 12) {
            ampm = "م";
        }
        return ampm;
    };

    $scope.hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

    $scope.minutes = [];

    for (var i = 0; i < 60; i++) {
        $scope.minutes.push(i);
    }

    //$scope.selectedTime = (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60));
    $scope.vaildateAyatCount = function () {
        $timeout(function () {
            if ($scope.targetData.ayatCount > $scope.targetData.noOfAyah) {
                $scope.targetData.ayatCount = $scope.targetData.noOfAyah;
            }
            //if ($scope.targetData.ayatCount < 1) { $scope.targetData.ayatCount=1 }
            $scope.targetData = khatma.getProgressDays($scope.targetData);
        }, 500)
    }
    $scope.increaseAyatCount = function () {
        $scope.targetData.ayatCount += 1;
        $scope.vaildateAyatCount();
    }
    $scope.decreaseAyatCount = function () { if ($scope.targetData.ayatCount > 1) { $scope.targetData.ayatCount -= 1; $scope.vaildateAyatCount(); } }

    $scope.increaseDaysCount = function () {
        if ($scope.targetData.daysCount < $scope.maxDays) {
            $scope.targetData.daysCount += 1;
            $scope.getTarget($scope.targetData.daysCount);
            // $scope.countPartsAndQarters($scope.targetData.daysCount);
        }
    }
    $scope.decreaseDaysCount = function () {
        if ($scope.targetData.daysCount > 1) {
            $scope.targetData.daysCount -= 1;
            $scope.getTarget($scope.targetData.daysCount);
            //$scope.countPartsAndQarters($scope.targetData.daysCount);
        }
    }

    $scope.increaseAya = function () {
        if ($scope.targetData.ayatCount < $scope.maxAyat) {
            $scope.targetData.ayatCount += 1;
            $scope.countDaysAccourdingToAya($scope.targetData.ayatCount);
        }
    }
    $scope.decreaseAya = function () {
        if ($scope.targetData.ayatCount > 1) {
            $scope.targetData.ayatCount -= 1;
            $scope.countDaysAccourdingToAya($scope.targetData.ayatCount);
        }
    }

    $scope.increasePages = function () {
        if ($scope.targetData.pagesCount < $scope.maxPages) {
            $scope.targetData.pagesCount += 1;
            $scope.countDaysAccourdingToPages($scope.targetData.pagesCount);
        }
    }
    $scope.decreasePages = function () {
        if ($scope.targetData.pagesCount > 1) {
            $scope.targetData.pagesCount -= 1;
            $scope.countDaysAccourdingToPages($scope.targetData.pagesCount);
        }
    }

    $scope.setTime = function () {

        $scope.timePicker = {
            callback: function (val) {      //Mandatory
                if (typeof (val) === 'undefined') {
                    console.log('Time not selected');
                } else {
                    $scope.selectedTime = val;
                    var selectedTime = new Date(val * 1000);
                    var h = $scope.notificationTime.hour = selectedTime.getUTCHours();
                    alert(h);
                    var m = $scope.notificationTime.minute = selectedTime.getUTCMinutes();

                    $scope.setTargetNotificationTime();
                }
            },
            inputTime: $scope.selectedTime,   //Optional
            format: 12,         //Optional
            step: 1,           //Optional
            setLabel: 'ضبط',  //Optional
            closeLabel: 'إغلاق'
        };
        ionicTimePicker.openTimePicker($scope.timePicker);
    }
    $scope.setTargetNotificationTime = function () {
        var hour = $scope.notificationTime.hour; //the selected notification hour
        var minute = $scope.notificationTime.minute; //the selected notification minute
        var currentDate = new Date(); //current date
        var selectedTime = new Date(); //set the selectedTime to be the same as the date now
        selectedTime.setHours(hour, minute); //set selectedTime hour and minute to be the same as the time in the view
        //get the time difference
        var timeDifference = selectedTime.getTime() - currentDate.getTime();
        //If the selected time is in the future,then set the notification time to be the same selected time
        //If the user selected daily notifications
        if ($scope.targetData.periodType == enums.periodType.daily) {
            //If the notification time is in the past,then adjust the notification time and add 1 
            //if (timeDifference < 0) {

            //    selectedTime.setDate(selectedTime.getDate() + 1);
            //}
            var frequency = "day";

            var text = "daily " + hour + ":" + minute;
        }
            //If the user selected weekly notifications
        else if ($scope.targetData.periodType == enums.periodType.weekly) {

            //If the notification time is in the past,then adjust the notification time and add 7

            var curDayOfWeek = currentDate.getDay();
            var selectedDayOfWeek = new Date(khatma.data.startDate).getDay();
            selectedDayOfWeek = $scope.notificationTime.dayofWeek;
            var dayDifference = selectedDayOfWeek - curDayOfWeek;
            var addedDays = 0;
            //If the day is before today, it will get the day of next week
            if (dayDifference < 0) {
                addedDays = dayDifference + 7;
            }
            else if (dayDifference > 0) {
                addedDays = dayDifference;
            }
                //If the selected time is less than the current time and the selected day is the same as today then set the date to be in next week
            else if (timeDifference < 0 && dayDifference == 0) {
                addedDays = dayDifference + 7;
            }
            selectedTime.setDate(selectedTime.getDate() + addedDays);
            var frequency = "week";
            var text = "weekly " + enums.weekDays[$scope.notificationTime.dayofWeek].name + " - " + hour + ":" + minute;
        }
        khatma.data.startDate = selectedTime.getTime();
    }

    $scope.savetarget = function () {
        if ($scope.targetData.ayatCount >= 1 && $scope.targetData.title != "") {
            khatma.saveTarget($scope.targetData);
            if ($scope.targetData.id != null && $scope.targetData.notificationMode == enums.notificationMode.off) {
                khatma.cancelNotification($scope.targetData);
            }
        }
    }

    $scope.notificationModes = enums.notificationMode;
    $scope.toggleNotification = function () {
        if ($scope.targetData.notificationModeSelection) {
            $scope.targetData.notificationMode = enums.notificationMode.on
        }
        else {
            $scope.targetData.notificationMode = enums.notificationMode.off
        }

    }
    $scope.clearTargets = function () {

        khatma.clearTargets();

    }
    $scope.init = function () {
        $scope.MoshafPages = 604;
        var MoshafId = settings.settingsData.MoshafId.toString();

        if (MoshafId == enums.MoshafId.shamrly) {
            $scope.MoshafPages = 521;
        }


        $rootScope.hideMem = true;
        khatma.resetTargetData();
        var prev = $rootScope.$previousState;
        ayatData.getParts().then(function (res) {
            $scope.parts = res;
        });
        $scope.enums = enums;
        $scope.targetData = khatma.data;
        $scope.getTarget($scope.targetData.daysCount);

        //    $scope.quarters = [
        //    { id: 1, Name: "ربع" },
        //    { id: 2, Name: "ربعان" },
        //{ id: 3, Name: "3ارباع" },
        //{ id: 4, Name: "حزب" },
        //{ id: 5, Name: "5ارباع" },
        //{ id: 6, Name: "6ارباع" },
        //{ id: 7, Name: "7ارباع" }
        //    ];

        //    $scope.parts = [
        //         { id: 0, Name: "-" },
        //        { id: 1, Name: "جزء" },
        //        { id: 2, Name: "جزءان" },
        //    { id: 3, Name: "3اجزاء" },
        //    { id: 4, Name: "4اجزاء" },
        //    { id: 5, Name: "5اجزاء" },
        //    { id: 6, Name: "6اجزاء" },
        //    { id: 7, Name: "7اجزاء" },
        //    { id: 8, Name: "8اجزاء" },
        //    { id: 9, Name: "9اجزاء" },
        //    { id: 10, Name: "10اجزاء" }
        //    ];

        //var noOFquarters = 240;
        //if ($scope.targetData.targetType == enums.khatmaType.juz) {
        //    var noOFquarters = (30 - ($scope.targetData.juzId - 1)) * 8;
        //}


        //$scope.countPartsAndQarters(khatma.data.daysCount);
        //$scope.targetData = khatma.getProgressDays($scope.targetData);
        // $scope.targetData.name = khatma.getTargetTitle($scope.targetData.targetType, $scope.targetData.surahId, $scope.targetData.juzId, $scope.targetData.pageFrom, $scope.targetData.pageTo);
        //if ($scope.targetData.id == null) {
        //    $scope.targetData.periodType = 1;
        //}
        //if ($scope.targetData.noOfAyah < $scope.targetData.ayatCount) {

        //    $scope.targetData.ayatCount = $scope.targetData.noOfAyah;
        //}
        if ($scope.targetData.notificationMode == enums.notificationMode.on) {
            $scope.targetData.notificationModeSelection = true
        }
        setTimeout(function () {
            $scope.$apply();
        }, 500)

    }

    $scope.countDaysAccourdingToPages = function (pagesCount) {
        if ($scope.targetData.juzId == 1) {
            $scope.targetData.daysCount = Math.ceil($scope.MoshafPages / pagesCount);
            $scope.maxPages = $scope.MoshafPages;
        }
        else {
            var juzData = ayatData.getJuzData($scope.targetData.juzId);
            $scope.targetData.daysCount = Math.ceil(($scope.MoshafPages - juzData.StartPage - 1) / pagesCount);
            $scope.maxPages = $scope.MoshafPages - juzData.StartPage - 1;
        }
    }

    $scope.countDaysAccourdingToAya = function (ayatCount) {
        if ($scope.targetData.juzId == 1) {
            $scope.targetData.daysCount = Math.ceil(6236 / ayatCount);
            $scope.maxAyat = 6236;
        }
        else {
            var juzData = ayatData.getJuzData($scope.targetData.juzId);
            $scope.targetData.daysCount = Math.ceil((6236 - juzData.StartAyah - 1) / ayatCount);
            $scope.maxAyat = 6236 - juzData.StartAyah - 1;
        }
    }
    $scope.getTarget = function (daysCount) {
        if ($scope.targetData.juzEndId >= $scope.targetData.juzId) {
            //ayat
            if ($scope.targetData.targetSectionType == enums.khatmaSectionsType.aya) {
                //if ($scope.targetData.juzId == 1) {
                //    $scope.targetData.ayatCount = Math.round(6236 / daysCount);
                //    $scope.targetData.startAya = 1;
                //    $scope.targetData.endAya = 6236;
                //    $scope.targetData.totalAyatCount = 6236;
                //    $scope.targetData.nextAya = 1;
                //    $scope.targetData.pagesCount = Math.round($scope.MoshafPages / daysCount);
                //    $scope.targetData.startPage = 1;
                //    $scope.targetData.endPage = $scope.MoshafPages;
                //    $scope.targetData.totalPagesCount = $scope.MoshafPages;
                //    $scope.targetData.nextPage = 1;
                //    $scope.maxDays = 6236;
                //    $scope.maxAyat = 6236;
                //}
                //else {
                var juzData = ayatData.getJuzData($scope.targetData.juzId);
                var juzEndData = ayatData.getJuzData($scope.targetData.juzEndId);
                $scope.targetData.ayatCount = Math.round((juzEndData.EndAyah - juzData.StartAyah) / daysCount);
                $scope.targetData.startAya = juzData.StartAyah;
                $scope.targetData.endAya = juzEndData.EndAyah;
                $scope.targetData.totalAyatCount = juzEndData.EndAyah - juzData.StartAyah + 1;
                $scope.targetData.nextAya = juzData.StartAyah;
                $scope.targetData.pagesCount = Math.round((juzEndData.EndPage - juzData.StartPage + 1) / daysCount);
                $scope.targetData.startPage = juzData.StartPage;
                $scope.targetData.endPage = juzEndData.EndPage;
                $scope.targetData.totalPagesCount = juzEndData.EndPage - juzData.StartPage + 1;
                $scope.targetData.nextPage = juzData.StartPage;
                $scope.maxDays = juzEndData.EndAyah - juzData.StartAyah + 1;
                $scope.maxAyat = juzEndData.EndAyah - juzData.StartAyah + 1;
                //}
            }
            else {
                //pages
                //if ($scope.targetData.juzId == 1) {
                //    $scope.targetData.ayatCount = Math.round(6236 / daysCount);
                //    $scope.targetData.startAya = 1;
                //    $scope.targetData.endAya = 6236;
                //    $scope.targetData.totalAyatCount = 6236;
                //    $scope.targetData.nextAya = 1;
                //    $scope.targetData.pagesCount = Math.round($scope.MoshafPages / daysCount);
                //    $scope.targetData.startPage = 1;
                //    $scope.targetData.endPage = $scope.MoshafPages;
                //    $scope.targetData.totalPagesCount = $scope.MoshafPages;
                //    $scope.targetData.nextPage = 1;
                //    $scope.maxDays = $scope.MoshafPages;
                //    $scope.maxAyat = $scope.MoshafPages;
                //}
                //else {
                var juzData = ayatData.getJuzData($scope.targetData.juzId);
                var juzEndData = ayatData.getJuzData($scope.targetData.juzEndId);
                if ((juzEndData.EndPage - juzData.StartPage + 1)<30) {
                    daysCount = juzEndData.EndPage - juzData.StartPage + 1;
                    $scope.targetData.daysCount = daysCount;
                }
                $scope.targetData.ayatCount = Math.round((juzEndData.EndAyah - juzData.StartAyah + 1) / daysCount);
                $scope.targetData.startAya = juzData.StartAyah;
                $scope.targetData.endAya = juzEndData.EndAyah;
                $scope.targetData.totalAyatCount = juzEndData.EndAyah - juzData.StartAyah + 1;
                $scope.targetData.nextAya = juzData.StartAyah;
                $scope.targetData.pagesCount = Math.round((juzEndData.EndPage - juzData.StartPage + 1) / daysCount);
                $scope.targetData.startPage = juzData.StartPage;
                $scope.targetData.endPage = juzEndData.EndPage;
                $scope.targetData.totalPagesCount = juzEndData.EndPage - juzData.StartPage + 1;
                $scope.targetData.nextPage = juzData.StartPage;
                $scope.maxDays = juzEndData.EndPage - juzData.StartPage + 1;
                $scope.maxPages = juzEndData.EndPage - juzData.StartPage + 1;
                //}
            }
        }
        
    }
    //$scope.getTarget = function (daysCount) {
    //    //ayat
    //    if ($scope.targetData.targetSectionType == enums.khatmaSectionsType.aya) {
    //        if ($scope.targetData.juzId == 1) {
    //            $scope.targetData.ayatCount = Math.round(6236 / daysCount);
    //            $scope.targetData.startAya = 1;
    //            $scope.targetData.endAya = 6236;
    //            $scope.targetData.totalAyatCount = 6236;
    //            $scope.targetData.nextAya = 1;
    //            $scope.targetData.pagesCount = Math.round($scope.MoshafPages / daysCount);
    //            $scope.targetData.startPage = 1;
    //            $scope.targetData.endPage = $scope.MoshafPages;
    //            $scope.targetData.totalPagesCount = $scope.MoshafPages;
    //            $scope.targetData.nextPage = 1;
    //            $scope.maxDays = 6236;
    //            $scope.maxAyat = 6236;
    //        }
    //        else {
    //            var juzData = ayatData.getJuzData($scope.targetData.juzId);
    //            $scope.targetData.ayatCount = Math.round((6236 - juzData.StartAyah - 1) / daysCount);
    //            $scope.targetData.startAya = juzData.StartAyah;
    //            $scope.targetData.endAya = 6236;
    //            $scope.targetData.totalAyatCount = 6236 - juzData.StartAyah + 1;
    //            $scope.targetData.nextAya = juzData.StartAyah;
    //            $scope.targetData.pagesCount = Math.round(($scope.MoshafPages - juzData.StartPage + 1) / daysCount);
    //            $scope.targetData.startPage = juzData.StartPage;
    //            $scope.targetData.endPage = $scope.MoshafPages;
    //            $scope.targetData.totalPagesCount = $scope.MoshafPages - juzData.StartPage + 1;
    //            $scope.targetData.nextPage = juzData.StartPage;
    //            $scope.maxDays = 6236 - juzData.StartAyah + 1;
    //            $scope.maxAyat = 6236 - juzData.StartAyah + 1;
    //        }
    //    }
    //    else {
    //        //pages
    //        if ($scope.targetData.juzId == 1) {
    //            $scope.targetData.ayatCount = Math.round(6236 / daysCount);
    //            $scope.targetData.startAya = 1;
    //            $scope.targetData.endAya = 6236;
    //            $scope.targetData.totalAyatCount = 6236;
    //            $scope.targetData.nextAya = 1;
    //            $scope.targetData.pagesCount = Math.round($scope.MoshafPages / daysCount);
    //            $scope.targetData.startPage = 1;
    //            $scope.targetData.endPage = $scope.MoshafPages;
    //            $scope.targetData.totalPagesCount = $scope.MoshafPages;
    //            $scope.targetData.nextPage = 1;
    //            $scope.maxDays = $scope.MoshafPages;
    //            $scope.maxAyat = $scope.MoshafPages;
    //        }
    //        else {
    //            var juzData = ayatData.getJuzData($scope.targetData.juzId);
    //            if ($scope.targetData.juzId == 30) {
    //                daysCount = juzData.EndPage - juzData.StartPage + 1;
    //                $scope.targetData.daysCount = daysCount;
    //            }
    //            $scope.targetData.ayatCount = Math.round((6236 - juzData.StartAyah + 1) / daysCount);
    //            $scope.targetData.startAya = juzData.StartAyah;
    //            $scope.targetData.endAya = 6236;
    //            $scope.targetData.totalAyatCount = 6236 - juzData.StartAyah + 1;
    //            $scope.targetData.nextAya = juzData.StartAyah;
    //            $scope.targetData.pagesCount = Math.round(($scope.MoshafPages - juzData.StartPage + 1) / daysCount);
    //            $scope.targetData.startPage = juzData.StartPage;
    //            $scope.targetData.endPage = $scope.MoshafPages;
    //            $scope.targetData.totalPagesCount = $scope.MoshafPages - juzData.StartPage + 1;
    //            $scope.targetData.nextPage = juzData.StartPage;
    //            $scope.maxDays = $scope.MoshafPages - juzData.StartPage + 1;
    //            $scope.maxPages = $scope.MoshafPages - juzData.StartPage + 1;
    //        }
    //    }
    //}

    //$scope.countDaysbyParts = function (quarterId, partId) {

    //    var noOFquarters=240;
    //    if($scope.targetData.targetType==enums.khatmaType.juz)
    //    {
    //        var noOFquarters = (30 - ($scope.targetData.juzId - 1)) * 8;
    //    }
    //    if (quarterId &&!partId)
    //    {
    //        $scope.targetData.daysCount = noOFquarters / quarterId;
    //    }
    //    if (!quarterId && partId) {
    //        $scope.targetData.daysCount = noOFquarters / (8 * partId);
    //    }
    //    else
    //    {
    //        var noOfQuarters=quarterId+(8*partId)
    //        $scope.targetData.daysCount = Math.round(noOFquarters / noOfQuarters);
    //    }
    //}

    //$scope.countPartsAndQarters = function (daysCount) {

    //    var noOFquarters = 240;
    //    if ($scope.targetData.targetType == enums.khatmaType.juz) {
    //        var noOFquarters = (30 - ($scope.targetData.juzId - 1)) * 8;
    //    }
    //    var totalNoOfQuartesrs = noOFquarters / daysCount;
    //    $scope.targetData.partId = Math.floor(totalNoOfQuartesrs / 8);
    //    $scope.targetData.quarterId = Math.round(totalNoOfQuartesrs % 8);
    //}

    $scope.init();
}]);