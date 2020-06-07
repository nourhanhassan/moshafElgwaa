app.controller("GroupDetailsController", ["$scope", "$state", "$stateParams", "$ionicPopup", "groupAdd", "target", "enums", "ionicLoading", "user", "$ionicScrollDelegate", "$timeout", "settings", "ayatData", function ($scope, $state, $stateParams, $ionicPopup, groupAdd, target, enums, ionicLoading, user, $ionicScrollDelegate, $timeout, settings, ayatData) {

    groupAdd.resetData();
    target.resetTargetData();
    $scope.groupData = groupAdd.data;
    $scope.targetData = target.data;
    $scope.Users = [];
  
    groupAdd.data.id = $stateParams.id;
    groupAdd.getGroupWithAllDetails($stateParams.id, user.data.profile.id).then(function (data) {
        groupAdd.data.name = data.Name;
        groupAdd.data.members = data.MemberIds;
        target.data.targetType = data.TargetTypeID;
        target.data.memorizeMode = enums.memorizeMode.group;
        target.data.startAyaNum = ayatData.getAya(data.StartAya).ayahNum;
        if(data.EndAya != null)
        target.data.endAyaNum = ayatData.getAya(data.EndAya).ayahNum;

        target.data.title = target.getTargetTitle(data.TargetTypeID, data.SurahID,
            data.JuzID, data.StartPage, data.EndPage, data.SurahID,
            target.data.startAyaNum, data.EndSurahID, target.data.endAyaNum);
        $scope.targetData.title = target.data.title;
       
        target.data.periodType = data.PeriodTypeID;
        
        target.data.ayatCount = data.AyaatCount;
        target.data.startDate = data.NotificationTime;
        target.data.notificationID = data.NotificationID;
        target.data.surahId = data.SurahID;
        target.data.juzId = data.JuzID;
        target.data.allAyat = [];
        for (var i = data.StartAya; i <= data.EndAya; i++) {
            target.data.allAyat.push(ayatData.getAya(i));
        }

        target.data.startSoura = data.SurahID;
        target.data.startAya = data.StartAya;
        target.data.endSoura = data.EndSurahID;
        target.data.isGroupMemorize = true;
        target.data.startPage = data.StartPage;
       
        $scope.Users = data.Users;      
        $scope.notificationTime = target.getNotificationTime(target.data.startDate, target.data.periodType);
        $scope.IsAdmin = data.IsAdmin;
        groupAdd.data.IsAdmin = data.IsAdmin;
        //$scope.targetData = data;
        //This is to update the local notification everytime the user open the group details
        target.saveTargetNotification();
       
    });

    $scope.groupData.id = groupAdd.data.id;
    $scope.groupData.name = groupAdd.data.name;
    $scope.targetData.title = target.data.title;

    $ionicScrollDelegate.resize();

    $scope.select = function (id) {
        if (id != 0) {
            $state.go("group-add", { id: id });
        }
    };

    
    $scope.memorize = function (targetData) {
        //$state.go("memorize");
        var MoshafId = settings.settingsData.MoshafId;
    
        if (MoshafId == enums.MoshafId.hafstext) {
            $state.go("tab.quranText", { aya: targetData.id });
        }
        else  {
            $state.go("tab.page", { target: targetData.id });
        }
    };

    $scope.leaveGroup = function () {
        target.cancelNotification(target.data.notificationID);
       
        var myPopup = $ionicPopup.show({
            title: 'تأكيد الحذف',
            cssClass: '',
            subTitle: '',
            template: 'هل أنت متأكد من مغادرة هذه المجموعة؟',
            templateUrl: '',
            scope: null,
            buttons: [{
                text: 'نعم',
                type: 'button-positive',
                onTap: function (e) {
                    groupAdd.deleteUserFromGroup(user.data.profile.id, groupAdd.data.id).then(function (data) {
                        ionicLoading.showMessage("تم مغادرة هذه المجموعة").then(function () {
                            $state.go("group");
                        });
                    });
                }
            },{
                text: 'لا',
                type: 'button-default',
                onTap: function (e) {
                    myPopup.close();
                }
            }]
        });
        myPopup.then(function (res) {
            console.log('Tapped!', res);
        });
    };
    $scope.showPopup = function (idUser, idGroup) {
        var myPopup = $ionicPopup.show({
            title: 'تأكيد الحذف', 
            cssClass: '', 
            subTitle: '', 
            template: 'هل أنت متأكد من حذف العضو؟', 
            templateUrl: '', 
            scope: null, 
            buttons: [{
                text: 'نعم',
                type: 'button-positive',
                onTap: function (e) {
                    groupAdd.deleteUserFromGroup(idUser, idGroup).then(function (data) {
                        ionicLoading.showMessage("تم حذف العضو من المجموعة").then(function () {
                            $state.go($state.current, {}, { reload: true });
                            //$state.go("app.group-details", { id: idGroup }, { reload: true });
                            //$window.location.reload(true);
                        });
                    });                  
                }
            },{ 
                text: 'لا',
                type: 'button-default',
                onTap: function (e) {
                    myPopup.close();
                }
            }]
        });
        myPopup.then(function (res) {
            console.log('Tapped!', res);
        });
    };

}]);