app.controller("setReviewTargetDurationController", ["$scope", "$state", "reviewTarget", "enums", "ayatData", "localNotification", "$cordovaLocalNotification", "groupAdd", "ionicTimePicker", "$ionicScrollDelegate", "$timeout", "validations", function ($scope, $state, reviewTarget, enums, ayatData, localNotification, $cordovaLocalNotification, groupAdd, ionicTimePicker, $ionicScrollDelegate, $timeout, validations) {
    if (reviewTarget.data.id) {
        reviewTarget.data = reviewTarget.getTargetByID(reviewTarget.data.id);
        $scope.title = 'تعديل هدف';

        //$scope.targetData.title = "مراجعة";
    }


    
    $scope.enums = enums;
    $scope.targetData = reviewTarget.data;
    console.log("target")
    console.log(reviewTarget.data)
    $scope.targetData = reviewTarget.getProgressDays($scope.targetData);
    
    $scope.notificationTime = {
        hour: new Date($scope.targetData.startDate).getHours(),
        minute: new Date($scope.targetData.startDate).getMinutes(),
        ampm: new Date($scope.targetData.startDate).getHours() > 11 ? "pm" : "am",
        dayofWeek: new Date($scope.targetData.startDate).getDay(),
    }
    var h = $scope.notificationTime.hour;
    var m = $scope.notificationTime.minute;

    alert(h);
    console.log($scope.notificationTime)
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
    console.log($scope.notificationTime);

    $scope.hours = [0,1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

    $scope.minutes = [];

    for (var i = 0; i < 60; i++) {
        $scope.minutes.push(i);
    }

    $scope.vaildateAyatCount = function () {
        $timeout(function(){
        if ($scope.targetData.ayatCount > $scope.targetData.noOfAyah) {
            $scope.targetData.ayatCount = $scope.targetData.noOfAyah;
        }
        $scope.targetData = reviewTarget.getProgressDays($scope.targetData);
        },500)
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
                    console.log('Time not selected');
                } else {
                    $scope.selectedTime = val;
                    console.log($scope.selectedTime);
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
        $scope.targetData = reviewTarget.getProgressDays($scope.targetData);
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
            var selectedDayOfWeek = new Date(reviewTarget.data.startDate).getDay();
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

        reviewTarget.data.startDate = selectedTime.getTime();


        console.log(selectedTime);

    }

    $scope.saveTarget = function () {
        debugger;
        if ($scope.targetData.ayatCount >= 1 && !$scope.checkReviewTargetDuplicate($scope.targetData.title, $scope.targetData.id)) {
            reviewTarget.saveTarget();

            if ($scope.targetData.id != null && $scope.targetData.notificationMode == enums.notificationMode.off) {
                reviewTarget.cancelNotification($scope.targetData.notificationID);
            }
        }
        //$state.go("app.target-list");

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

        reviewTarget.clearTargets();
       
    }
    $scope.init = function () {
        $scope.titleDuplicate = false;
        $scope.validations = validations.validationExepresions;
        console.log($scope.targetData)

        $scope.enums = enums;
        $scope.targetData = reviewTarget.data;
        console.log("target")
        console.log(reviewTarget.data)
        $scope.targetData = reviewTarget.getProgressDays($scope.targetData);
        if ($scope.targetData.id == null)
        {
            $scope.targetData.periodType = 1;
        }
        else
        {
            $scope.checkReviewTargetDuplicate($scope.targetData.title, $scope.targetData.id);
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
    $scope.checkReviewTargetDuplicate = function (value, id) {
        if (typeof (value) == "undefined")
            $scope.titleDuplicate = false;
        else {
            $scope.titleDuplicate = reviewTarget.checkTargetNameDuplicate($scope.targetData.id, value);
            return $scope.titleDuplicate;
        }
    }

    $scope.init();
}]);