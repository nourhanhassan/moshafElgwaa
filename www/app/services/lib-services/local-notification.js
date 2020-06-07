
app.factory("localNotification", ["$q", "$cordovaLocalNotification", function ($q, $cordovaLocalNotification) {

    /*
        //Notification structure
        {
          
            title:,
            text:,
            data:

        }

    */

    var service = {

        scheduledNotifications: [],
        lastScheduledID: 0,

        //notification
        scheduleNotification: function (notification, time) {


            setNotificationOptions(notification, {
                startAt: time
            });
            alert(JSON.stringify(notification));
            return $cordovaLocalNotification.schedule(notification);

        },

        //frequency values: "minute","hour", "day", "week"
        scheduleRepeatedNotification: function (notification, frequency, startAt) {
            setNotificationOptions(notification, {
                frequency: frequency,
                startAt: startAt,
            });
            var ret = $cordovaLocalNotification.schedule(notification);
            console.log("notification");
            console.log(ret)
            return ret;

        },

        updateNotification: function (id, notification) {

            notification.id = id;
            return $cordovaLocalNotification.update(notification)

        },
        scheduleAlarm: function (notification) {

            setNotificationOptions(notification)
            alert(JSON.stringify(notification));
            return $cordovaLocalNotification.schedule(notification);

        },
        getAllScheduledNotifications: function () {

            return $cordovaLocalNotification.getAll();
        },

        cancelNotification: function (id) {
            var ids = [];
            alert(typeof (id));
            id = parseInt(id);

            alert(typeof (id));
            ids.push(id);
            return $cordovaLocalNotification.cancel(ids);

        }


    }


    function setNotificationOptions(notification, options) {
        if (!notification.id) {
            setNotificationIDs(notification);
        }
        if (typeof (options) != "undefined") {
            notification.trigger = {};
            if (options.frequency) {
                notification.trigger["every"] = options.frequency;
            }
            if (options.startAt) {
                var event = new Date(options.startAt).getTime();
                notification.trigger["at"] = event;
                notification.priority = 2;
            }

        }

    }

    function setNotificationIDs(notification) {
        var notificationID = Math.round(Math.random() * (999999999));
        notification.id = notificationID;


    }

    return service;

}]);