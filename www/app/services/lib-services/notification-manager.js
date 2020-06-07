//

app.factory("notificationManager", ["device", "$q", "$rootScope",  function (device, $q, $rootScope) {

    //Sender ID user for registeration with Android GCM service
    // var senderID = "554382996913";
    var senderID = "521517381557"; //adels new gmal account
    //var senderID = "919245716897"; //qvision account
    //Platform type is determined according to the device
    var platformType = "";
    if (typeof (cordova) != "undefined") {
        if (device.getPlatform() == 'android' || device.getPlatform() == "amazon-fireos") {
            platformType = "android";
        }
        else {
            platformType = "ios"
        }
    }

    //alert(" my platform is " + platformType);

    //callbacks object that contain the available callback functions for each platform
    var callbacks = {
        android: {
            register: [],
            foreground: [],
            background: [],
            coldstart: [],
        },

        ios: {
            register: [],
            foreground: [],
            background: [],
        }

    }


    //function to invoke the callback for a given event
    var invokeCallBacks = function (event, response) {

        try {
            var eventCallBacks = callbacks[platformType][event];
            for (var i = 0; i < eventCallBacks.length; i++) {

                if (typeof (eventCallBacks[i]) == "function") {
                    eventCallBacks[i](response);
                }

            }
        }
        catch (err) {
            console.log("error in invoking callbacks " + err.message);
        }


    }

    //This method is for ios and is invoked in the following events (foreground, background) (note that the register event handler is set in the register function) 
    window._iosGlobalCallBack = function (e) {
        alert("ios global notification");
        alert(e.badge);
        if (e.foreground == 1) { //foreground notification
            invokeCallBacks("foreground", e);
        }
        else {
            invokeCallBacks("background", e);

        }
        try {
            if (e.badge) {
                service.setBadgeCount(e.badge);
            }
        }
        catch (ex) {
            alert("ERROR" + JSON.stringify(ex.message));
        }



    }


    //This method must be attached to window object because it must be a global function.
    //This method is for android and is invoked in any of the following events (register,foreground,background,background)
    window._androidGlobalCallBack = function (e) {
        // alert("global");
        switch (e.event) {
            case 'registered':

                service.isRegistered = true;
                registerationId = e.regid;
                $rootScope.$apply(function () {
                    // myservice.isRegistered = true;
                });
                // alert(e.regid);
                console.log("registered in global callback " + e.regid);
                invokeCallBacks("register", e.regid);

                break;

            case 'message':
                // if this flag is set, this notification happened while we were in the foreground.
                // you might want to play a sound to get the user's attention, throw up a dialog, etc.

                if (e.foreground) {
                    console.log("foreground service notification received");
                    invokeCallBacks("foreground", e.payload);


                }
                else {  // otherwise we were launched because the user touched a notification in the notification tray.



                    if (e.coldstart) {
                        console.log("coldstart  notification received");
                        invokeCallBacks("coldstart", e.payload);
                    }
                    else {
                        console.log("background  notification received");
                        invokeCallBacks("background", e.payload);
                    }

                }

                break;

            case 'error':
                console("Error: " + e.msg);
                break;

            default:
                console("unknown error .. it should never come here probably..");
                break;
        }
    }


    //The service that will be returned from the factory
    var service = {
        register: function (options) {

            var deferred = $q.defer();

            if (platformType == "android") {

                //The register function it returns promise (normally we should handle the error event because the success event is not very useful)
                alert("registering android")
                window.plugins.pushNotification.register(
                 //The success callback is not very important (it just returns "OK" and I have no idea what does it mean (I guess it means that there are no errors?)
                function (res) {
                    console.log("registering " + JSON.stringify(res));
                    alert("registering " + JSON.stringify(res));
                    deferred.resolve(res);
                },

                //The error callback function is called when there is an error in registeration
                function (err) {
                    console.log("Error in registeration " + JSON.stringify(err));
                    alert("Error in registeration " + JSON.stringify(err));

                    deferred.reject(err);
                },

               {
                   "senderID": senderID,
                   //The callback function to be called in case of GCM events (register,foreground,bacjground,coldstart)
                   "ecb": "_androidGlobalCallBack"
               });

            }
                //IOS
            else {
                alert("I am registering ios");
                window.plugins.pushNotification.register(
                    //regiser callback function the callback. the result is the APNS registeration id
                function (result) {
                    // alert("registered ios " + result);
                    console.log("registering " + result);
                    alert("registering " + result);
                    try {
                        invokeCallBacks("register", result);
                    }
                    catch (ex) {
                        alert("error invoking register callback");
                        alert(ex.message);
                    }
                    deferred.resolve(result);

                },
                //error callback function 
               function (err) {
                   alert("Error in registeration " + JSON.stringify(err));
                   console.log("Error in registeration " + JSON.stringify(err));
                   deferred.reject(err);
               },

                {
                    "badge": "true",
                    "sound": "true",
                    "alert": "true",
                    "ecb": "_iosGlobalCallBack" //The call back function to be called in the foreground and background notification
                });
            }

            return deferred.promise;

        },
        registerationId: null,
        setBadgeCount: function (count) {

            var deferred = $q.defer();
            if (typeof (cordova) != "undefined") {
                cordova.plugins.notification.badge.set(count, function (res) {
                    deferred.resolve();
                });
            }
            /*
             if (platformType == "ios") {
                 window.plugins.pushNotification.setApplicationIconBadgeNumber(function (res) {
                     alert("success setting notification badge " + count);
                     deferred.resolve(res);
                 },
                 function (err) {
                     alert("error setting notification badge " + count);
                     deferred.reject(err);
                 },
 
                 count);
             }
             else {
                 deferred.reject("ios only");
 
             }
             */
            return deferred.promise;

        },
        isRegistered: false,
        on: function (platform, event, callback) {
            if (typeof (callback) == "function") {
                callbacks[platform][event].push(callback);
            }
        }
    }


    return service;



}])



var PushNotification = function () {
};


// Call this to register for push notifications. Content of [options] depends on whether we are working with APNS (iOS) or GCM (Android)
PushNotification.prototype.register = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }


    if (typeof errorCallback != "function") {

        console.log("PushNotification.register failure: failure parameter not a function");
        return
    }

    if (typeof successCallback != "function") {

        console.log("PushNotification.register failure: success callback parameter must be a function");
        return
    }

    try {
        cordova.exec(successCallback, errorCallback, "PushPlugin", "register", [options]);

    } catch (e) {

        alert("message: " + e.message);
    }

};

// Call this to unregister for push notifications
PushNotification.prototype.unregister = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }

    if (typeof errorCallback != "function") {
        console.log("PushNotification.unregister failure: failure parameter not a function");
        return
    }

    if (typeof successCallback != "function") {
        console.log("PushNotification.unregister failure: success callback parameter must be a function");
        return
    }

    cordova.exec(successCallback, errorCallback, "PushPlugin", "unregister", [options]);
};

// Call this if you want to show toast notification on WP8
PushNotification.prototype.showToastNotification = function (successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function () { } }

    if (typeof errorCallback != "function") {
        console.log("PushNotification.register failure: failure parameter not a function");
        return
    }

    cordova.exec(successCallback, errorCallback, "PushPlugin", "showToastNotification", [options]);
}
// Call this to set the application icon badge
PushNotification.prototype.setApplicationIconBadgeNumber = function (successCallback, errorCallback, badge) {
    if (errorCallback == null) { errorCallback = function () { } }

    if (typeof errorCallback != "function") {
        console.log("PushNotification.setApplicationIconBadgeNumber failure: failure parameter not a function");
        return
    }

    if (typeof successCallback != "function") {
        console.log("PushNotification.setApplicationIconBadgeNumber failure: success callback parameter must be a function");
        return
    }

    cordova.exec(successCallback, errorCallback, "PushPlugin", "setApplicationIconBadgeNumber", [{ badge: badge }]);
};

//-------------------------------------------------------------------

if (!window.plugins) {
    window.plugins = {};
}
if (!window.plugins.pushNotification) {
    window.plugins.pushNotification = new PushNotification();
}

if (typeof module != 'undefined' && module.exports) {
    module.exports = PushNotification;
}
