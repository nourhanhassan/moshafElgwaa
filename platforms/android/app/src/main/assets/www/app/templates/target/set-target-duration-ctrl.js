app.controller("setTargetDurationController", ["$scope", "$state", "target", "enums", "ayatData", "localNotification", "$cordovaLocalNotification", "groupAdd", "ionicTimePicker", "$ionicScrollDelegate", "$timeout", "$rootScope", function ($scope, $state, target, enums, ayatData, localNotification, $cordovaLocalNotification, groupAdd, ionicTimePicker, $ionicScrollDelegate, $timeout, $rootScope) {
    //$scope.title = 'تعيين هدف جديد';
    if (target.data.id) {
        target.data = target.getTargetByID(target.data.id);
        $scope.title = 'تعديل هدف';
    }
    $scope.enums = enums;
    $scope.targetData = target.data;
    $scope.targetData = target.getProgressDays($scope.targetData);
    $scope.targetData.name = target.getTargetTitle($scope.targetData.targetType,
        $scope.targetData.surahId,
        $scope.targetData.juzId,
        $scope.targetData.pageFrom,
        $scope.targetData.pageTo,
        $scope.targetData.startSoura,
        $scope.targetData.startAya,
        $scope.targetData.endSoura,
        $scope.targetData.endAya);

    //If the mode is group and it's edit group mode
    if (target.data.memorizeMode == enums.memorizeMode.group && groupAdd.data.id != 0) {
        $scope.targetData.periodType = target.data.periodType;
        $scope.targetData.startDate = target.data.startDate;
        $scope.targetData.ayatCount = target.data.ayatCount;
     
    }


    
    $scope.notificationTime = {
        hour: new Date($scope.targetData.startDate).getHours(),
        minute: new Date($scope.targetData.startDate).getMinutes(),
        ampm: new Date($scope.targetData.startDate).getHours() > 11 ? "pm" : "am",
        dayofWeek: new Date($scope.targetData.startDate).getDay(),
    }
    var h = $scope.notificationTime.hour;
    var m = $scope.notificationTime.minute;
    $scope.selectedTime = ((h * 60 * 60) + (m * 60));


    $scope.getHour = function () {
        var hour = $scope.notificationTime.hour;
        if (hour>12 ) {
            hour -= 12;
        }
        if(hour==0){hour=12}
        return hour;
    }
    $scope.getAmPm = function () {
        var hour = $scope.notificationTime.hour;
        var ampm="ص";
        if (hour >= 12) {
            ampm ="م";
        }
        return ampm;
    };
    $scope.hours = [0,1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

    $scope.minutes = [];

    for (var i = 0; i < 60; i++) {
        $scope.minutes.push(i);
    }

    //$scope.selectedTime = (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60));
    $scope.vaildateAyatCount = function () {
        $timeout(function(){
        if ($scope.targetData.ayatCount > $scope.targetData.noOfAyah) {
            $scope.targetData.ayatCount = $scope.targetData.noOfAyah;
        }
        //if ($scope.targetData.ayatCount < 1) { $scope.targetData.ayatCount=1 }
        $scope.targetData = target.getProgressDays($scope.targetData);
        },500)
    }

    $scope.vaildatePagesCount = function () {
        $timeout(function () {
            if ($scope.targetData.PagesCount > $scope.targetData.noOfPage) {
                $scope.targetData.PagesCount = $scope.targetData.noOfPage;
            }
            //if ($scope.targetData.ayatCount < 1) { $scope.targetData.ayatCount=1 }
            $scope.targetData = target.getProgressDays($scope.targetData);
        }, 500)
    }
    $scope.increasePagesCount = function () {
        $scope.targetData.PagesCount += 1;
        $scope.vaildatePagesCount();
    }
    $scope.decreasePagesCount = function () {
        if ($scope.targetData.PagesCount > 1)
        { $scope.targetData.PagesCount -= 1; $scope.vaildatePagesCount(); }
    }

    $scope.increaseAyatCount = function () {
        $scope.targetData.ayatCount += 1;
        $scope.vaildateAyatCount();
    }
    $scope.decreaseAyatCount = function () { if ($scope.targetData.ayatCount > 1) { $scope.targetData.ayatCount -= 1; $scope.vaildateAyatCount(); } }

    $scope.setTime = function () {

        $scope.timePicker = {
            callback: function (val) {      //Mandatory
                if (typeof (val) === 'undefined') {
                } else {
                    $scope.selectedTime = val;
                    var selectedTime = new Date(val * 1000);
                    var h = $scope.notificationTime.hour = selectedTime.getUTCHours();
                    alert(h);
                    var m =$scope.notificationTime.minute= selectedTime.getUTCMinutes();
             
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
        $scope.targetData = target.getProgressDays($scope.targetData);
        var hour = $scope.notificationTime.hour; //the selected notification hour
        
        //if ($scope.notificationTime.ampm == "pm") {
        //    hour += 12;
        //} 
        //alert(hour);

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
            var selectedDayOfWeek = new Date(target.data.startDate).getDay();
            selectedDayOfWeek = $scope.notificationTime.dayofWeek;
            var dayDifference = selectedDayOfWeek - curDayOfWeek;
          
            var addedDays = 0;
            //If the day is before today, it will get the day of next week
            if (dayDifference < 0) {
                addedDays = dayDifference + 7;
                
            }
            else if(dayDifference>0) {
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

        target.data.startDate = selectedTime.getTime();
    }

    $scope.saveTarget = function () {
        if ($scope.targetData.ayatCount >= 1) {
            target.saveTarget();

            if ($scope.targetData.id != null && $scope.targetData.notificationMode == enums.notificationMode.off) {
                target.cancelNotification($scope.targetData.notificationID);
            }
        }

        if ($rootScope.addgroup == true)
        {
            $state.go("group");
        }
        else
        {
            $state.go("target-list");
        }
        

    }

    $scope.notificationModes = enums.notificationMode;
    $scope.toggleNotification = function () {
        if ($scope.targetData.notificationModeSelection)
        {
            $scope.targetData.notificationMode = enums.notificationMode.on
        }
        else {
            $scope.targetData.notificationMode = enums.notificationMode.off
        }

    }
    $scope.clearTargets = function () {

        target.clearTargets();
       
    }
    $scope.init = function () {
        $rootScope.hideMem = true;
        $scope.enums = enums;
        $scope.targetData = target.data;
        $scope.targetData = target.getProgressDays($scope.targetData);
        $scope.targetData.name = target.getTargetTitle($scope.targetData.targetType,
            $scope.targetData.surahId,
            $scope.targetData.juzId,
            $scope.targetData.startPage,
            $scope.targetData.endPage,
            $scope.targetData.startSoura,
            $scope.targetData.startAyaNum,
            $scope.targetData.endSoura,
            $scope.targetData.endAyaNum);
        if ($scope.targetData.id == null)
        {
            $scope.targetData.periodType = 1;
        }
        if ($scope.targetData.noOfAyah < $scope.targetData.ayatCount) {

            $scope.targetData.ayatCount = $scope.targetData.noOfAyah;
        }
        if($scope.targetData.notificationMode == enums.notificationMode.on)
        {
            $scope.targetData.notificationModeSelection = true
        }
        setTimeout(function () {
            $scope.$apply();
        },500)
      
    }
    $scope.init();
}]);