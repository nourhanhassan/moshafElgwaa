app.controller("GroupController", ["$scope", "$state", "group", "groupAdd", "user", "target", "enums", "settings", "ayatData", "$rootScope", function ($scope, $state, group, groupAdd, user, target, enums, settings, ayatData, $rootScope) {
    $rootScope.hideMem = true;
    $scope.Groups = [];
    $scope.getGroups = function () {
        group.getGroups(user.data.profile.id).then(function (data) {
            $scope.Groups = data;         
        });
        group.syncAyatLocalToServer();
    }

    $scope.getGroups();
   
    $scope.select = function (id) {
        if (id != 0) 
        {
            $state.go("group-details", { id: id });
        }
    };
    $scope.addNewGroup = function () {
        groupAdd.resetData();
        target.resetTargetData();
        $state.go("group-add", { id: 0 });
    }; 
    $scope.Back = function () {
        $state.go("tab.memo");
    };
    $scope.memorize = function (idGroup) {
       
        groupAdd.getGroupWithAllDetails(idGroup, user.data.profile.id).then(function (data) {
            target.data.title = target.getTargetTitle(data.TargetTypeID, data.SurahID, data.JuzID);
            target.data.memorizeMode = enums.memorizeMode.group;
            target.data.periodType = data.PeriodTypeID;
            target.data.targetType = data.TargetTypeID;
            target.data.ayatCount = data.AyaatCount;
            target.data.startDate = data.NotificationTime;
            target.data.notificationID = data.NotificationID;
            target.data.surahId = data.SurahID;
            target.data.juzId = data.JuzID;
            target.data.StartPage = data.StartPage;
            target.data.EndPage = data.EndPage;
        
            //alert(JSON.stringify(target.data));
            //$state.go("memorize");
            var MoshafId = settings.settingsData.MoshafId;
     
            if (MoshafId == enums.MoshafId.hafstext) {
                if (data.TargetTypeID == enums.targetType.page) {
                    $state.go("tab.quranText", { page: data.StartPage });
                }
                else if (data.TargetTypeID == enums.targetType.juz) {
                    var juz = ayatData.getjuz(data.JuzID);
                    $state.go("tab.quranText", { page: juz.StartPage });
                }
                else {
                    var surah = ayatData.getSurah(data.SurahID);
                    $state.go("tab.quranText", { page: surah.StartPage });
                }
            }
           else {
                if (data.TargetTypeID == enums.targetType.page) {
                    $state.go("tab.page", { page: data.StartPage });
                }
                else if (data.TargetTypeID == enums.targetType.juz) {
                    var juz = ayatData.getjuz(data.JuzID);
                    $state.go("tab.page", { page: juz.StartPage });
                }
                else {
                    var surah = ayatData.getSurah(data.SurahID);
                    $state.go("tab.page", { page: surah.StartPage });
                }

            }
        });
        
        
    };
}]);