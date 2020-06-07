app.controller("alarmController", ["$scope", "$state", "localStorage", "$stateParams", "device", "$rootScope", "$ionicPopup", "$ionicModal", "ionicTimePicker", "audio", "toast", "mark", "enums", "settings", "alarm", "ionicLoading", "alarmNotification", function ($scope, $state, localStorage, $stateParams, device, $rootScope, $ionicPopup, $ionicModal, ionicTimePicker, audio, toast, mark, enums, settings, alarm, ionicLoading, alarmNotification) {
    $scope.weekDays = [{
        name: "الأحد",
        id: 0,
        value: false,
    }, {
        name: "الإثنين",
        id: 1,
        value: false,
    }, {
        name: "الثلاثاء",
        id: 2,
        value: false,
    }, {
        name: "الأربعاء",
        id: 3,
        value: false,
    }, {
        name: "الخميس",
        id: 4,
        value: false,
    }, {
        name: "الجمعة",
        id: 5,
        value: false,
    }, {
        name: "السبت",
        id: 6,
        value: false,
    }, ];
    if (device.getPlatform() == "ios") {
        $scope.directoryName = cordova.file.dataDirectory;
    }
    else $scope.directoryName = cordova.file.externalRootDirectory;
    //$scope.toneURL = "";
    if ($stateParams.id != 0) {
        $scope.targetAlarm = alarm.getTargetByID($stateParams.id);
        $scope.title = 'تعديل تنبيه';
        console.log($scope.targetAlarm)
        //$scope.toneURL = targetAlarm.soundIndex
        angular.forEach($scope.targetAlarm.repeatValues, function (id, val) {
            $scope.weekDays[id].value = true;
        })
        $scope.targetAlarm.repeatDaysText = $scope.targetAlarm.dayText;
        $scope.noRepeat = true;
    }
    else {
        $scope.title = 'إضافة تنبيه';
        alarm.resetalarm();
        $scope.targetAlarm = alarm.data;
        $scope.targetAlarm.sound = $scope.directoryName + "Moshaf Elgwaa/alarm/" + $scope.targetAlarm.soundName;
        console.log($scope.targetAlarm)
        $scope.targetAlarm.repeatDaysText = "";
        $scope.noRepeat = true;
    }
    $scope.hejriDate = "";
    $scope.canSave = false;
    $scope.gregDate = new Date();
    $scope.init = function () {
        $rootScope.hideMem = true;
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
        $rootScope.activePage = "alarm";

        $scope.maxSnooze = 30;
        $rootScope.hideMem = true;

        var prev = $rootScope.$previousState;

        $scope.enums = enums;

        //$scope.getTarget($scope.targetData.daysCount);

        //if (angular.fromJson($scope.targetAlarm.data).state == true) {
        //    $scope.targetAlarm.notificationModeSelection = true
        //}
        if ($scope.targetAlarm.notificationMode == enums.notificationMode.on) {
            $scope.targetAlarm.notificationModeSelection = true
        }
        setTimeout(function () {
            $scope.$apply();
        }, 500)

        //var date = new Date(Date.UTC($scope.year, $scope.month, $scope.day, 3, 0, 0));

        //var _date = new Date().toLocaleDateString('ar-SA');
        //var _date2 = new Date(Date.UTC($scope.year, $scope.month, $scope.day)).toLocaleDateString('en-US');
        //console.log(_date, _date2);

    }
    $ionicModal.fromTemplateUrl('app/templates/popovers/add-alarm-repeat-days.html', {
        scope: $scope,
        animation: 'slide-in-up',
        //backdropClickToClose: false,
    }).then(function (modal) {
        $scope.repeatDaysModal = modal;

    });
    $scope.toggleRepeatDays = function () {
        $scope.repeatDaysModal.show();
        $scope.canSave = false;
        $scope.noRepeat = true;
    }
    $scope.saveDaysChecklist = function () {
        $scope.targetAlarm.repeatDaysText = "";
        if ($scope.targetAlarm.repeat == true) {
            angular.forEach($scope.weekDays, function (day) {
                console.log(day);
                if (day.value == true)
                    $scope.targetAlarm.repeatDaysText = $scope.targetAlarm.repeatDaysText + " " + day.name;
            })
            if ($scope.targetAlarm.repeatDaysText == "") {
                $scope.noRepeat = true;
                $ionicPopup.alert({
                    title: $scope.targetAlarm.title,
                    template: 'برجاء إختيار يوم واحد على الاقل للتكرار',
                })
            }
            else {
                $scope.repeatDaysModal.hide();
                $scope.canSave = true;
                $scope.noRepeat = false;
            }
        }
        else
            $scope.targetAlarm.repeatDaysText = "";
    }
    $scope.closeDaysChecklist = function () {
        $scope.repeatDaysModal.hide();
        angular.forEach($scope.weekDays, function (day) {
            day.value = false;
        })
        angular.forEach($scope.targetAlarm.repeatValues, function (id) {
            console.log(id)
            $scope.weekDays[id].value = true;
        })
        $scope.targetAlarm.repeatDaysText = $scope.targetAlarm.dayText;
    }


    $scope.playTone = function (tone) {
        audio.stop();
        $scope.toneURL = $scope.directoryName + "Moshaf Elgwaa/alarm/" + tone.name;
        audio.playUrl($scope.toneURL);
    }

    $rootScope.closeAddAlarmRingTone = function () {
        audio.stop();
        console.log("close ", $scope.targetAlarm.sound);
        $scope.addRingtonesModal.hide();
    }

    $scope.saveAddAlarmRingTone = function () {
        audio.stop();
        $scope.targetAlarm.sound = $scope.toneURL;
        $scope.addRingtonesModal.hide();
    }
    $rootScope.openAddAlarmRingtoneModal = function (templateUrl) {
        $ionicModal.fromTemplateUrl(templateUrl, {
            scope: $scope,
            animation: 'slide-in-up',
            //backdropClickToClose: false,
        }).then(function (modal) {
            $scope.addRingtonesModal = modal;
            $scope.addRingtonesModal.show();
        });
    }
    $scope.init();
    $scope.saveAlarm = function (model) {
        console.log($scope.targetAlarm.repeat, $scope.noRepeat)
        if ($scope.targetAlarm.repeat && $scope.targetAlarm.repeatDaysText == "") {
            $ionicPopup.alert({
                title: $scope.targetAlarm.title,
                template: 'برجاء إختيار يوم واحد على الاقل للتكرار',
            })
        }
        else {
            var text = "";
            $scope.targetAlarm.dayText = text;
            console.log($scope.weekDays);
            console.log($scope.targetAlarm);
            var hour = $scope.notificationTime.hour; //the selected notification hour
            var minute = $scope.notificationTime.minute; //the selected notification minute
            var currentDate = new Date(); //current date
            var selectedTime = new Date(); //set the selectedTime to be the same as the date now
            selectedTime.setHours(hour, minute); //set selectedTime hour and minute to be the same as the time in the view
            var dayDiff = 0;
            var hourDiff = hour - currentDate.getHours();
            var minDiff = minute - currentDate.getMinutes();
            console.log("before ", new Date(selectedTime).getTime());
            if (selectedTime <= new Date().getTime() && !$scope.targetAlarm.repeat)
                $scope.targetAlarm.startDate = new Date(selectedTime).getTime() + (1000 * 60 * 60 * 24);
            if (hourDiff == 0 && minDiff == 0 && !$scope.targetAlarm.repeat)
                dayDiff = 1;
            console.log("after ", $scope.targetAlarm.startDate);

            //get the time difference
            var timeDifference = selectedTime.getTime() - currentDate.getTime();
            console.log("hourDiff ", hourDiff);
            console.log("minDiff ", minDiff);
            console.log("currentDate.getHours() ", currentDate.getHours(), currentDate.getMinutes());

            var diff = new Date($scope.targetAlarm.startDate - new Date());
            if ($scope.targetAlarm.repeat) {
                $scope.targetAlarm.repeatValues = [];
                //check which days are selected and fill repeatValues list
                angular.forEach($scope.weekDays, function (id, value) {
                    console.log(id.value, value);
                    if (id.value == true) {
                        $scope.targetAlarm.dayText = $scope.targetAlarm.dayText + enums.weekDays[value].name + " ";
                        $scope.targetAlarm.repeatValues.push(value);
                    }
                })
                console.log("day ", new Date($scope.targetAlarm.repeatValues[0]), currentDate.getDay());
                dayDiff = new Date($scope.targetAlarm.repeatValues[0]) - currentDate.getDay();
                if (dayDiff < 0)
                    dayDiff += 7;
                // text = 'تم تحديد التنبيه في خلال ' + diff.getUTCHours() + " ساعات و " + diff.getMinutes() + " دقيقة";
            }
            if (hourDiff < 0) {
                hourDiff = hourDiff + 24;
                if (dayDiff > 0)
                    dayDiff -= 1;
            }
            if (minDiff < 0) {
                minDiff = minDiff + 60;
                if (hourDiff == 0)
                    hourDiff = 23;
                else
                    hourDiff -= 1;
            }
            alarm.saveTarget($scope.targetAlarm);
            text = 'تم تحديد التنبيه في خلال ' + dayDiff + " يوم و " + hourDiff + " ساعات و " + minDiff + " دقيقة";
            //ionicLoading.show({ templateText: text, duration: 3000 })
            //$state.go("alarm-list");
            $ionicPopup.alert({
                title: $scope.targetAlarm.title,
                template: text,
                okText: 'تأكيد',
            }).then(function () {
                $state.go("alarm-list");
            });
        }
    }
    $scope.setTime = function () {
        //var myDate = new Date(); // From model.

        //cordova.plugins.DateTimePicker.show({
        //    mode: "time",
        //    date: myDate,
        //    is24HourView:false,
        //    success: function (newDate) {
        //        // Handle new date.
        //        console.info(newDate);
        //        myDate = newDate;
        //        var selectedTime = myDate.getTime();
        //        var time = new Date(selectedTime).getHours();

        //        var h = $scope.notificationTime.hour = new Date(selectedTime).getHours();
        //        var m = $scope.notificationTime.minute = new Date(selectedTime).getMinutes();
        //        $scope.selectedTime = ((h * 60 * 60) + (m * 60));
        //                    $scope.setTargetNotificationTime();
        //    }
        //});
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


    //if (alarm.data.id) {
    //    alarm.data = alarm.getTargetByID(alarm.data.id);
    //    $scope.title = 'تعديل تنبيه';
    //}


    $scope.notificationTime = {
        hour: new Date($scope.targetAlarm.startDate).getHours(),
        minute: new Date($scope.targetAlarm.startDate).getMinutes(),
        ampm: new Date($scope.targetAlarm.startDate).getHours() > 11 ? "pm" : "am",
        dayofWeek: new Date($scope.targetAlarm.startDate).getDay(),
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


    $scope.increaseSnoozeCount = function () {
        if ($scope.targetAlarm.snoozeCount < $scope.maxSnooze)
            $scope.targetAlarm.snoozeCount += 1;
    }
    $scope.decreaseSnoozeCount = function () {
        if ($scope.targetAlarm.snoozeCount > 1)
            $scope.targetAlarm.snoozeCount -= 1;
    }

    $scope.targetAlarm.timeText = "";
    $scope.targetAlarm.timeText = $scope.getHour() + ":" + $scope.notificationTime.minute + $scope.getAmPm();


    $scope.setTargetNotificationTime = function () {
        var hour = $scope.notificationTime.hour; //the selected notification hour
        var minute = $scope.notificationTime.minute; //the selected notification minute
        var currentDate = new Date(); //current date
        var selectedTime = new Date(); //set the selectedTime to be the same as the date now
        selectedTime.setHours(hour, minute); //set selectedTime hour and minute to be the same as the time in the view
        selectedTime.setSeconds(0);
        selectedTime.setMilliseconds(0);
        //get the time difference
        var timeDifference = selectedTime.getTime() - currentDate.getTime();
        //If the selected time is in the future,then set the notification time to be the same selected time
        alarm.data.startDate = selectedTime.getTime();
        $scope.targetAlarm.startDate = selectedTime.getTime();
        $scope.targetAlarm.timeText = "";
        $scope.targetAlarm.timeText = hour + ":" + minute + $scope.getAmPm();
    }

    $scope.notificationModes = enums.notificationMode;
    $scope.toggleNotification = function (curTarget) {
        if (curTarget.notificationModeSelection) {
            curTarget.notificationMode = enums.notificationMode.on
        }
        else {
            curTarget.notificationMode = enums.notificationMode.off
        }
        //alarm.saveTarget(curTarget);
    }


}]);