app.factory("alarmNotification", ["alarm", "enums", "$cordovaLocalNotification", "$state", function (alarm, enums, $cordovaLocalNotification, $state) {

    var service = {}
    //increase alarm timing when hitting snooze
    cordova.plugins.notification.local.on('snooze', function (notification, eopts) {
        var currDate = new Date();
        var data = angular.fromJson(notification.data);
        var newMins = currDate.getMinutes() + data.snoozeCount;
        var newHrs = notification.trigger.every.hour
        if (newMins >= 60) {
            newHrs = notification.trigger.every.hour + 1;
            newMins = 0;
        }
        var trigger =  {
                every: {
                    weekday: notification.trigger.every.weekday,
                    hour: newHrs,
                    minute: newMins,
                    count: notification.trigger.every.count + 1
                }
            }
       // }
        //else {
            //trigger = {
            //    every: {
            //        hour: newHrs,
            //        minute: newMins,
            //        count: notification.trigger.every.count + 1
            //    }
         //   }
        //}
        cordova.plugins.notification.local.update({
            id: notification.id,
            trigger: trigger,
            data: data
        }, function (res) {
            console.log(res);
            cordova.plugins.notification.local.get(notification.id, function (res) {
                console.log(res);
                $cordovaLocalNotification.schedule(res)
            })
        });
    });

    //reschedule alarm when hitting stop if it's repeated
    //cancel alarm if it's once
    cordova.plugins.notification.local.on('stop', function (notification, eopts) {
        var data = angular.fromJson(notification.data);
        var trigger = {};
        if (data.repeat) {
            trigger = {
                every: {
                    weekday: notification.trigger.every.weekday,
                    hour: notification.trigger.every.hour,
                    minute: data.initialMinutes,
                    count: 5
                }
            }
            cordova.plugins.notification.local.update({
                id: notification.id,
                trigger: trigger,
                data: data
            }, function (res) {
                console.log(res);
                cordova.plugins.notification.local.get(notification.id, function (res) {
                    if (data.initialMinutes == new Date().getMinutes())
                        $timeout(function () {
                            $cordovaLocalNotification.schedule(res)
                        }, 60000);
                    else
                        $cordovaLocalNotification.schedule(res)
                })
            });
        }
        else {
            cordova.plugins.notification.local.clear(notification.id, function () {
                var target = alarm.getTargetByNotificationID(notification.id);
                console.log(target);
                target.notificationMode = enums.notificationMode.off;
                target.notificationModeSelection = false;
                target.notificationIDs = [];
                alarm.saveTarget(target);
                console.log("done");
            });
        }

    });

    //canceling alarm if there's no snooze 
    cordova.plugins.notification.local.on('dismiss', function (notification, eopts) {
        cordova.plugins.notification.local.clear(notification.id, function () {
            var target = alarm.getTargetByNotificationID(notification.id);
            console.log(target);
            target.notificationMode = enums.notificationMode.off;
            target.notificationModeSelection = false;
            target.notificationIDs = [];
            alarm.saveTarget(target);
            console.log(target);
            console.log("done");
            //$state.go("alarm-list");
        });

    });

 
    return service;
}]);