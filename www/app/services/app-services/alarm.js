app.factory("alarm", ["$state", "localStorage", "enums", "localNotification", "groupAdd", "user", "ionicLoading", "guid", "$filter", "$rootScope", "settings", "$timeout", function ($state, localStorage, enums, localNotification, groupAdd, user, ionicLoading, guid, $filter, $rootScope, settings, $timeout) {

    var storageKey = "alarm";
    var service = {
        storageKey: "alarm",
        allTargets: [],
        data: {
            id: 0,
            //smallIcon: 'res://calendar',
            icon: 'https://image.flaticon.com/icons/png/512/62/62834.png',
            title: "",
            startDate: new Date().getTime(),
            notificationDayIndex: 0,
            notificationIDs: [],
            notificationMode: enums.notificationMode.on,
            notificationTitle: "ايقاف",
            //at: new Date(),
            timeText: "",
            dayText: "",
            trigger: {  },
            periodType: 1,
            foreground: true,
            lockscreen: true,
            priority: 2,
            sound: true,
            //sound: 'file:///storage/emulated/0/Moshaf%20Elgwaa/alarm/Soft_Alarm_Bell.mp3',
            soundName : "alarm01.mp3",
            wakeup: true,
            vibrate: false,
            snoozeCount: 5,
            onSilent: true,
            repeat: false,
            repeatValues: [],
            autoClear: false,
            hasSnooze: false,
            //ongoing: true,
            led: { color: '#0000FF', on: 500, off: 5000 },
            actions: [
               // { id: 'snooze', title: 'غفوة' },
                //{ id: 'stop', title: 'إيقاف' }
                { id: 'dismiss', title: 'إيقاف' }
            ],
            data: { state: true, snoozeCount: 1, initialMinutes: 0, repeat: false},
            //quarterId: 1,
            //partId:1
        },

        getNotificationTime: function (startDate, periodType) {

            var daysOfWeek = enums.weekDays;
            var notificationTime = "";
            var serNotificationTime = {
                hour: new Date(this.data.startDate).getHours(),
                minute: new Date(this.data.startDate).getMinutes(),
                ampm: new Date(this.data.startDate).getHours() > 11 ? "pm" : "am",
            }

            if (periodType == enums.periodType.weekly) {
                notificationTime = " يوم " + daysOfWeek[new Date(this.data.startDate).getDay()].name + " الساعة " + serNotificationTime.minute + " : " + service.getHour(serNotificationTime) + service.getAmPm(serNotificationTime);
                return notificationTime;
            }
            else {
                notificationTime = " الساعة " + serNotificationTime.minute + " : " + service.getHour(serNotificationTime) + service.getAmPm(serNotificationTime);
                return notificationTime;
            }
        },
        getHour: function (serNotificationTime) {
            var hour = serNotificationTime.hour;
            if (hour > 12) {
                hour -= 12;
            }
            if (hour == 0) { hour = 12 }
            return hour;
        },
        getAmPm: function (serNotificationTime) {
            var hour = serNotificationTime.hour;
            var ampm = "ص";
            if (hour >= 12) {
                ampm = "م";
            }
            return ampm;
        },

        resetalarm: function () {
            this.data = {
                id: 0,
                //smallIcon: 'res://calendar',
                icon: 'https://image.flaticon.com/icons/png/512/62/62834.png',
                title: "",
                startDate: new Date().getTime(),
                notificationDayIndex: 0,
                notificationIDs: [],
                notificationMode: enums.notificationMode.on,
                notificationTitle: "ايقاف",
                //at: new Date(),
                timeText: "",
                dayText: "",
                trigger: { },
                periodType: 1,
                foreground: true,
                lockscreen: true,
                priority: 2,
                sound: true,
                soundName: "alarm01.mp3",
                wakeup: true,
                vibrate: false,
                snoozeCount: 5,
                onSilent: true,
                repeat: false,
                repeatValues: [],
                autoClear: false,
                hasSnooze: false,
                //ongoing: true,
                led: { color: '#0000FF', on: 500, off: 5000 },
                actions: [
                    //{ id: 'snooze', title: 'غفوة' },
                    //{ id: 'stop', title: 'إيقاف' }
                     { id: 'dismiss', title: 'إيقاف' }
                ],
                data: { state: true, snoozeCount: 1, initialMinutes: 0, repeat: false},
            }


        },

        saveTarget: function (alarm) {
            debugger;
            if (alarm.id == 0) //add mode
            {
                this.addTarget(alarm);
            }
            else { //update mode
                this.updateTarget(alarm);
            }
            service.resetalarm();
            //$state.go("alarm-list")
        },

        addTarget2: function (alarm) {
            alarm.id = guid.generate(); //generate a unique id for the target          
            if (this.data.notificationMode == enums.notificationMode.on) {
                this.saveTargetNotification(alarm);
            }
           
            //var key =  storageKey;
            
            //localStorage.append(key, alarm);
        },

  addTarget: function (alarm) {
            alarm.id = guid.generate(); //generate a unique id for the target          
            if (this.data.notificationMode == enums.notificationMode.on) {
                this.saveTargetNotification(alarm);
            }
           
            //var key =  storageKey;
            
            //localStorage.append(key, alarm);
        },      updateTarget: function (alarm) {
            if (alarm.notificationMode == enums.notificationMode.on) {
                this.cancelNotification(alarm);
                this.saveTargetNotification(alarm);
            }
            else {
                this.cancelNotification(alarm);
                var targetObj = null;
                var key = storageKey;

                var storedTargets = localStorage.get(key);
                for (var i = 0; i < storedTargets.length; i++) {
                    if (storedTargets[i].id == alarm.id) {
                        targetObj = storedTargets[i];
                        break;
                    }
                }
                angular.copy(alarm, targetObj);
                localStorage.set(key, storedTargets);
            }
           
        },

        saveTargetNotification: function (alarm) {
            var actions = {};
            if (typeof (cordova) != "undefined") {
                if (alarm.repeat == true) {
                    var frequency = "week";
                    angular.forEach(alarm.repeatValues, function (key, value) {
                        var notificationTime = new Date(alarm.startDate);
                        notificationTime.setSeconds(0);
                        notificationTime.setMilliseconds(0);
                        var trigger = {};
                        if (alarm.hasSnooze) {
                            alarm.actions = [
                                { id: 'snooze', title: 'غفوة' },
                                { id: 'stop', title: 'إيقاف' }
                            ]
                        }
                        else {
                            alarm.actions = [
                                { id: 'stop', title: 'إيقاف' }
                            ]
                        }
                        var notification = {
                            //smallIcon: alarm.smallIcon,
                            icon: alarm.icon,
                            title: alarm.title,
                            text: alarm.timeText,
                            channel: alarm.title,
                            foreground: true,
                            lockscreen: true,
                            priority: 2,
                            trigger: {
                                every: {
                                    weekday: key,
                                    hour: notificationTime.getHours(),
                                    minute: notificationTime.getMinutes(),
                                    count: 3
                                }
                            },
                            sound: alarm.sound,
                            wakeup: true,
                            vibrate: alarm.vibrate,
                            autoClear: false,
                            led: alarm.led,
                            //sticky : true,
                            actions: alarm.actions,
                            data: {
                                state: true,
                                snoozeCount: alarm.snoozeCount,
                                initialMinutes: notificationTime.getMinutes(),
                                repeat: true
                            },
                        }
                        localNotification.scheduleAlarm(notification).then(function (res) {

                            console.log("notification saved ", notification);

                        });
                        alarm.notificationIDs.push(notification.id);
                    });
                    var targetObj = null;
                    var key = storageKey;
                    if (alarm.id != 0) {
                        var storedTargets = localStorage.get(key);
                        if (storedTargets != null) {
                            for (var i = 0; i < storedTargets.length; i++) {
                                if (storedTargets[i].id == alarm.id) {
                                    targetObj = storedTargets[i];
                                    break;
                                }
                            }
                            if (targetObj != null) {
                                angular.copy(alarm, targetObj);
                                localStorage.set(key, storedTargets);
                            }
                            else
                                localStorage.append(key, alarm);
                        }
                        else
                            localStorage.append(key, alarm);
                    }
                    else
                        localStorage.append(key, alarm);
                }
                else {
                    var notificationTime = new Date(alarm.startDate);
                    //var trigger = { at: alarm.startDate };
                    
                    notificationTime.setSeconds(0);
                    notificationTime.setMilliseconds(0);
                    if (notificationTime <= new Date().getTime())
                        notificationTime = new Date(notificationTime).getTime() + (1000 * 60 * 60 * 24);
                    var frequency = "day";
                    var trigger = {};
                    if (alarm.hasSnooze) {
                        alarm.actions = [
                                { id: 'snooze', title: 'غفوة' },
                                { id: 'stop', title: 'إيقاف' }
                        ]
                    }
                    var notification = {
                        //smallIcon: alarm.smallIcon,
                        icon: alarm.icon,
                        title: alarm.title,
                        text: alarm.timeText,
                        channel: alarm.title,
                        channelDescription : alarm.timeText,
                        foreground: true,
                        lockscreen: true,
                        priority: 2,
                        trigger: {
                            every: {
                                weekday: notificationTime.getDay(),
                                hour: notificationTime.getHours(),
                                minute: notificationTime.getMinutes(),
                                count: 3
                            }
                        },
                        sound: alarm.sound,
                        wakeup: true,
                        vibrate: alarm.vibrate,
                        autoClear: false,
                        led: alarm.led,
                        //sticky: true,
                        actions: alarm.actions,
                        data: {
                            state: true,
                            snoozeCount: alarm.snoozeCount,
                            initialMinutes: notificationTime.getMinutes(),
                            repeat: false
                        },

                    }
                        localNotification.scheduleAlarm(notification).then(function (res) {
                            console.log(res, notification.id);
                            alarm.notificationIDs.push(notification.id);
                            var targetObj = null;
                            var key = storageKey;
                            if (alarm.id != 0) {
                                var storedTargets = localStorage.get(key);
                                if (storedTargets != null) {
                                    for (var i = 0; i < storedTargets.length; i++) {
                                        if (storedTargets[i].id == alarm.id) {
                                            targetObj = storedTargets[i];
                                            break;
                                        }
                                    }
                                    if (targetObj != null) {
                                        angular.copy(alarm, targetObj);
                                        localStorage.set(key, storedTargets);
                                    }
                                    else
                                        localStorage.append(key, alarm);
                                }
                                else
                                    localStorage.append(key, alarm);
                            }
                            else
                                localStorage.append(key, alarm);
                        });
                        
                }
            }
        },

        cancelNotification: function (alarm) {
            console.log(alarm.notificationIDs);
            for (var i = 0; i < alarm.notificationIDs.length; i++) {
                localNotification.cancelNotification(alarm.notificationIDs[i]).then(function (res) {
                    console.log("notification cancelled" + JSON.stringify(res));
                });
            }
        },

        clearTargets: function () {
            var key= storageKey;
            localStorage.remove(key);
            alert("canceling notification");
            service.cancelNotification(alarm).then(function (res) {
                alert("notification cancelled" + JSON.stringify(res));
            });

        },

        getAllTargets: function () {
            var key = storageKey;
            var test = localStorage.get(key);
            return test;
        },

        getTargetByID: function (id) {
            var key = storageKey;
            var storedTargets = localStorage.get(key);
            var res;
            for (var i = 0; i < storedTargets.length; i++) {
                if (storedTargets[i].id == id) {
                    return storedTargets[i];
                    break;
                }
            }
        },

        getTargetByNotificationID: function (notificationId) {
            var targets = this.getAllTargets();
            for (var i = 0; i < targets.length; i++) {
                for (var y = 0; y < targets[i].notificationIDs.length; y++) {
                    if (targets[i].notificationIDs[y] == notificationId) {
                        return targets[i];
                        break;
                    }
                }
              
            }
        },

        setTargetByID: function (id) {
            var key = storageKey;
            var storedTargets = localStorage.get(key);
            var res;
            for (var i = 0; i < storedTargets.length; i++) {
                if (storedTargets[i].id == id) {
                    service.data = storedTargets[i]
                    return storedTargets[i];
                    break;
                }

            }
        },

        cancelFinishedTargetsNotification: function () {
            var allTargets = service.getAllTargets();
            for (var i = 0 ; i < allTargets.length ; i++) {
                if (allTargets[i].isDone == true) {
                    service.cancelNotification(allTargets[i]);
                }
            }
        },

        deleteTarget: function (alarm) {
            var key = storageKey;
            var storedTargets = localStorage.get(key);
            for (var i = 0; i < storedTargets.length; i++) {
                if (storedTargets[i].id == alarm.id) {
                    storedTargets.splice(i, 1);
                    break;
                }
            }
            localStorage.set(key, storedTargets);
            service.cancelNotification(alarm);
        },
    }
    return service;
}]);
