//this service for phonegap-plugin-push
//using ionic.native => so we use ionic 2 functions for the plugin
//useful links: http://ionicframework.com/docs/v2/native/
//              https://github.com/phonegap/phonegap-plugin-push/blob/master/docs/API.md#pushonevent-callback


function pushNotificationProvider() {
    var SenderID = "";
    //window.acceptCallbackName = function (data) {

    //    //  alert("acceeeeeeeeept");
    //    localStorage.set("accept", "true");
    //};

    //window.rejectCallbackName = function (data) {

    //    //  alert("rejeeect");
    //    localStorage.set("reject", "true");
    //};
    this.setSenderID = function (senderID) {
        SenderID = senderID;
    };
    this.$get = ["$cordovaPush", "$q", "device", "$state", "localStorage", "$rootScope", "$ionicHistory", function ($cordovaPush, $q, device, $state, localStorage, $rootScope, $ionicHistory) {


        var registeredLabels = [];

        var options = {
            android: {
                // senderID: "61208132993"
                senderID: SenderID,
                "forceShow": "true"
            },
            browser: {
                pushServiceURL: 'http://push.api.phonegap.com/v1/push'
            },
            ios: {
                alert: "true",
                badge: true,
                sound: 'true'
            },
            windows: {}
        };
        var platform = "";
        function getPlatformType() {
            var platformType = "";
            if (typeof (cordova) != "undefined") {
                if (device.getPlatform() == 'android' || device.getPlatform() == "amazon-fireos") {
                    platformType = "android";
                }
                else {
                    platformType = "ios"
                }
            }
            return platformType;
        }

        var registeration = {
            registerationType: "",
            registerationId: "",
        }

        return {
            push: null,
            init: function () {
                var deferred = $q.defer();
                if (typeof (PushNotification) != "undefined") {
                    if (this.push == null) {
                        this.push = PushNotification.init(options);
                    }
                    this.push.on('notification', function (data) {
                        var additionalData = data.additionalData;
  
                        if (additionalData.foreground == false) {
                            if (additionalData.NotificationType == 1) {
                                $ionicHistory.clearCache();
                                $ionicHistory.clearHistory();
                                $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
                                $state.go("group-details", { id: additionalData.GroupId });

                            }

                        }
                        else {
   
                        }
                    });

                    this.push.on('registration', function (data) {
                        debugger;
                        //return the registrationid 
                        registeration.registerationId = data.registrationId;
            
                        if (platform == "android") {
                            registeration.registerationType = "gcm";
                        }
                        else {
                            registeration.registerationType = "apns";
                        }
               
                        deferred.resolve(registeration);

                        //    deferred.resolve(registeration);
                    });
                }
                else {
                    console.log("Notifications are not defined . Are you in a browser?")
                }

                this.push.on('error', function (e) {
                    console.log(e);
                });

                platform = getPlatformType();
                return deferred.promise;
            },

            getRegistrationId: function () {
                var deferred = $q.defer();
                if (typeof (PushNotification) != "undefined") {

                    if (registeration.registerationId == "") {
                        this.init().then(function (registeration) { deferred.resolve(registeration); });

                        this.push.on("error", function (err) {
                            console.log(err.message);
                            deferred.reject(err);
                        })

                    }
                    else {
                        deferred.resolve(registeration);
                    }
                }
                else {
                    deferred.reject();
                }
                return deferred.promise;
            },

            onNotification: function (label) {
                debugger;
                var deferred = $q.defer();
                if (typeof (PushNotification) != "undefined") {

                    if (this.push == null) {
                        this.init();
                    }
                    //this.init();

                    var isRegisteredBefore = false;
                    if (label && registeredLabels[label]) {
                        isRegisteredBefore = true;
                    }

                    if (!isRegisteredBefore) {
                        this.push.on('notification', function (data) {
                            deferred.notify(data);
                        });
                        registeredLabels[label] = true;
                    }

                }
                else {
                    deferred.resolve("0")
                }
                return deferred.promise;
            },
            clearAll: function () {
                var deferred = $q.defer();
                if (typeof (PushNotification) != "undefined") {
                    if (this.push == null) {
                        this.init();
                    }
                    this.push.clearAllNotifications(function (res) {
                        deferred.resolve(res);
                    }, function () {
                        console.log('error');
                    });


                }
                else {
                    deferred.resolve("0")
                }
                return deferred.promise;
            },
            setIconBadgeNumber: function (number) {
                var deferred = $q.defer();
                if (typeof (PushNotification) != "undefined") {
                    if (this.push == null) {
                        this.init();
                    }
                    this.push.setApplicationIconBadgeNumber(function (res) {
                        deferred.resolve(res);
                    }, function () {
                        console.log('error');
                    }, number);


                }
                else {
                    deferred.resolve("0")
                }
                return deferred.promise;

            }


        }

    }];
}
app.provider("pushNotification", pushNotificationProvider)
