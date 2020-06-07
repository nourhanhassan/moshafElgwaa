app.factory("groupAdd", ["httpHandler", "$q", "contacts", "ionicLoading", "localStorage", "settings", "enums", "$filter", function (httpHandler, $q, contacts, ionicLoading, localStorage, settings, enums, $filter) {

    var service = {

        data: {
            id: 0,
            name: "",
            members: []
        },

        resetData: function () {
            this.data = {
                id: 0,
                name: "",
                members: [],
            };
        },
        getUserId: function () {
            var Profile = localStorage.get("User");
            console.log(Profile)
            if (typeof (Profile) != "undefined" && Profile.iId > 0) { return Profile.iId }
            else { return 0; }
        },
        getAllMembers: function (groupId) {
            var deferred = $q.defer();
            ionicLoading.show({ templateText: "جاري التحميل برجاء الانتظار" });
            contacts.getContacts().then(function (result) {
                var Members = [];
                httpHandler.post("User/GetUsersRegistered", { GroupId: groupId, arrUsers: result[1], iUserID: 0 }, true).then(function (results) {
                    for (i = 0; i < results.length; i++)
                    {
                        var member = results[i];
                        member.DisplayName = $filter('filter')(result[0], { number: member.Phone }, true)[0].name;
                        Members.push(member);
                    }
                    deferred.resolve(Members);

                });
            });

            return deferred.promise;
        },


        getGroupWithAllDetails: function (IdGroup, IdUser) {
            var deferred = $q.defer();

            httpHandler.get("Group/GetGroupsWithAllDetails", { GroupID: IdGroup, iUserID: IdUser }, true).then(function (result) {
                deferred.resolve(result);

            });

            return deferred.promise;
        },

        addGroup: function (Id, UserId, strGroupName, UsersIds, targetType, periodType, juzId, surahId, ayatCount, notificationTime, notificationID, startPage, endPage, PagesCount, startAya, endAya, endSurah) {
            var deferred = $q.defer();
            var MoshafId = settings.settingsData.MoshafId.toString();
            httpHandler.post("Group/AddGroup", {
                Id: Id, iUserID: UserId, strGroupName: strGroupName, UsersIds: UsersIds
            , TargetTypeID: targetType, PeriodTypeID: periodType, JuzID: juzId,
            SurahID: surahId, AyaatCount: ayatCount, NotificationTime: notificationTime,
            NotificationID: notificationID, startPage: startPage, endPage: endPage,
            PagesCount: PagesCount, MoshafId: MoshafId, startAya: startAya, endAya: endAya, EndSurahID : endSurah
            }, true).then(

                function (result) {
                    deferred.resolve(result);
                }
                );
            return deferred.promise;
        },

        deleteUserFromGroup: function (IdUser, IdGroup) {
            var deferred = $q.defer();
            httpHandler.post("Group/DeleteUserFromGroup", { UserId: IdUser, GroupId: IdGroup, iUserID: 0 }, true).then(

                function (result) {
                    deferred.resolve(result);
                }
                );
            return deferred.promise;
        },

        getAllMembersProgress: function (groupId, targetId) {
            var deferred = $q.defer();
            httpHandler.get("GroupTarget/GetGroupUsersProgress", { GroupId: groupId ,iUserID:this.getUserId() }, true).then(function (results) {
                deferred.resolve(results);

            });



            return deferred.promise;
        },

        sendNotificationToLateUser: function (userId, groupId) {
            var deferred = $q.defer();
            httpHandler.get("Group/SendLateNotification", { UserId: userId, GroupId: groupId, iUserID: 0 }, true).then(function (results) {
                deferred.resolve(results);

            });



            return deferred.promise;
        },

    }

    return service;
}]);