app.controller("homeController", function ($scope, $state, enums, $cordovaSocialSharing, target, user,httpHandler) {

    $scope.enums = enums; 
    alert("home")
    window.http = httpHandler;

    $scope.share = function () {
        //alert('share');
        $cordovaSocialSharing.share(enums.appInfo.shareTitle, null, null, enums.appInfo.shareURL);
    };

    $scope.redirect = function () {
        var mode = enums.memorizeMode.individual;

        if (typeof target.getAllTargets() != "undefined" ) {
            $state.go("target-list")
        }
        else {

            $state.go("set-target-details", { mode: mode })
        }
    };

    $scope.redirectGroup = function () {
        if (user.data.profile.isActive) {
            $state.go("group")
        }
        else {

            $state.go("register")
        }
    };


    var backgroundNotificationHandler = function (payload) {
        switch (payload.NotificationType) {
          
            case enums.notificationType.addToGroup:
                {
                    $state.go("group-details", { id: payload.GroupId });
                    break;
                }
            case enums.notificationType.removeFromGroup:
                {
                    $state.go("group");
                    break;
                }

            case enums.notificationType.reminderToMemorize:
                {
                    target.data.id = payload.ID;
                    target.data.title = target.getTargetTitle(payload.TargetTypeID, payload.SurahID, payload.JuzID);
                    target.data.memorizeMode = enums.memorizeMode.group;
                    target.data.periodType = parseInt( payload.PeriodTypeID);
                    target.data.targetType = parseInt( payload.TargetTypeID);
                    target.data.ayatCount = parseInt(payload.AyaatCount);
                    target.data.startDate = parseInt(payload.NotificationTime);
                    target.data.notificationID = payload.NotificationID;
                    target.data.surahId = parseInt( payload.SurahID);
                    target.data.juzId =parseInt( payload.JuzID);
                    $state.go("memorize");
                    break;
                }

                   
        }
    }

   // document.addEventListener("deviceready", function () {
    //--------------------foreground notifications handling --------------------//
    //notificationManager.register();
    //notificationManager.on("android", "register", function (regId) {
    //    var reg = {};
    //    reg.id = regId;
    //    reg.type = "gcm";
    //    if (user.data.profile.registerationId != regId && user.data.profile.id > 0)
    //    {
           
    //        user.setUserRegisterationID(reg);
    //    }
    //    if (user.data.profile.id == 0)
    //    {
    //        user.removeUserRegisterationID(reg)
    //    }
    //    user.data.profile.registerationId = regId;
    //    user.data.profile.registerationType = "gcm";
    //    user.saveUserInfo();
    //    //alert("registered android " + id);
    //    //user.data.profile.registerationId = id;

    //    //user.data.profile.registerationType = "gcm";
    //    //ionicLoading.hide();
    //    //notificationRegisterDeferred.resolve(id);
    //});
    ////notificationManager.on("android", "foreground", backgroundNotificationHandler);
    //notificationManager.on("android", "background", backgroundNotificationHandler);
    //notificationManager.on("android", "coldstart", backgroundNotificationHandler);

    //}, false);
});


