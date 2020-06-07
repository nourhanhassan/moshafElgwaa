app.factory("user", ["httpHandler", "$q", "localStorage", function (httpHandler, $q, localStorage) {


    var service = {
        UserDataKey: "User",
        data: {
            profile: {
                id: 0,
                name: "",
                email: "",
                phone: "",
                isMale: false,
                isActive: false,
                Code: "",
                IsEdit: false,
                registerationType: "",
                registerationId: "",
                NotificationOn:false
            },
            memorizedAyat: [],
        },

        registerUser: function () {
            var deferred = $q.defer();
            httpHandler.post("User/RegisterUser",
                {
                    iId: this.data.profile.id,
                    strName: this.data.profile.name, strEmail: this.data.profile.email,
                    strPhone: this.data.profile.phone, bIsMale: this.data.profile.isMale,
                    registerationId: this.data.profile.registerationId, registerationType: this.data.profile.registerationType
                }, true).then(
                function (resp) {
                    service.data.profile.id = resp;//set saved user id
                    deferred.resolve(resp);
                    service.saveUserInfo();
                }
                );
            return deferred.promise;
        },


        verifyUserCode: function (code) {
            var deferred = $q.defer();
            httpHandler.post("User/VerfiyUserCode",
                {
                    strCode: code,
                    iUserID: this.data.profile.id
                }, true).then(
                function (isActivated) {
                    service.data.profile.isActive = isActivated;//set saved user id
                    deferred.resolve(isActivated);
                    service.saveUserInfo();
                }
                );
            return deferred.promise;
        },
        toggleUserNotification: function (notificationOn) {
            var deferred = $q.defer();
            httpHandler.post("User/ToggleNamesOfAllahNotification",
                {
                    userID: this.data.profile.id,
                    notificationOn: notificationOn
                }, true).then(
                function (user) {
                    service.data.profile.NotificationOn = notificationOn;
                    deferred.resolve(user);
                    service.saveUserInfo();
                }
                );
            return deferred.promise;
        },

        setUserRegisterationID: function (registeration) {
            return httpHandler.post("User/SetUserRegisterationID",
                { registerationId: registeration.id, registerationType: registeration.type }
                , false)

        },
        removeUserRegisterationID: function (registeration) {
            return httpHandler.post("User/RemoveRegisterationID",
                { registerationId: registeration.id, registerationType: registeration.type }
                , false)

        },
        saveUserInfo: function () {
            var UserInfo = {
                iId: this.data.profile.id,
                strName: this.data.profile.name, strEmail: this.data.profile.email,
                strPhone: this.data.profile.phone, bIsMale: this.data.profile.isMale,
                registerationId: this.data.profile.registerationId,
                registerationType: this.data.profile.registerationType,
                bisActive: this.data.profile.isActive,
                NotificationOn: this.data.profile.NotificationOn
            }
            localStorage.set(service.UserDataKey, UserInfo);
        },
        getUserInfo: function () {
            var deferred = $q.defer();
            var UserInfo = localStorage.get(service.UserDataKey);
            if (UserInfo != undefined) {

                this.data.profile.id = UserInfo.iId;
                this.data.profile.name = UserInfo.strName;
                this.data.profile.email = UserInfo.strEmail;

                this.data.profile.phone = UserInfo.strPhone;

                this.data.profile.isMale = UserInfo.bIsMale;

                this.data.profile.registerationId = UserInfo.registerationId,
                this.data.profile.registerationType = UserInfo.registerationType,

                this.data.profile.isActive = UserInfo.bisActive;
                this.data.profile.NotificationOn = UserInfo.NotificationOn;
            }
            deferred.resolve(UserInfo);
            return deferred.promise;

        }
    }
    service.getUserInfo();

    return service;

}]);