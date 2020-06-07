app.controller("TargetListController", ["$scope", "$state", "target", "enums", "ayatData", "$rootScope", "ionicPopup", "settings", function ($scope, $state, target, enums, ayatData, $rootScope, ionicPopup, settings) {
    $rootScope.appMode = enums.appModes.memorize;
    $rootScope.hideMem = true;
    var targets = target.getTargetsByMoshafId();
    $rootScope.appMode = enums.appModes.memorize;
    $rootScope.activePage = 'target';
    if (typeof (targets) != "undefined") {
        $scope.targets=targets.reverse();
    }
    $scope.targetModes = enums.memorizeMode;
    $scope.notificationModes = enums.notificationMode;
    $scope.notification = function (curTarget)
    {
        if (curTarget.notificationMode == enums.notificationMode.on) {

            alert(curTarget.notificationID);
            curTarget.notificationMode = enums.notificationMode.off;

           
            curTarget.notificationTitle = "تشغيل";

            target.data = curTarget;
            target.saveTarget();
          
            target.cancelNotification(curTarget.notificationID);

           
            alert(curTarget.id);
        }
        else {
            curTarget.notificationMode = enums.notificationMode.on;
            curTarget.notificationTitle = "ايقاف";
            target.data = curTarget;
            target.saveTarget();
          
            alert(curTarget.id);
        }
    }
    $scope.memorize = function (curTarget)
    {
        target.data = curTarget;
        var MoshafId = settings.settingsData.MoshafId;

        if (MoshafId == enums.MoshafId.hafstext) {
            $state.go("tab.quranText", { target: curTarget.id });
        }
        else {
            //settings.settingsData.MoshafId = enums.MoshafId.hafs;
            $state.go("tab.page", { target: curTarget.id });
        }
 
    }
    $scope.editTarget = function (curTarget, $event) {
        $event.stopPropagation();
        $event.preventDefault();
        target.data = curTarget;
        $state.go("set-target-duration");
    }
    $scope.deleteTarget = function (curTarget, $event) {
        $event.stopPropagation();
        $event.preventDefault();
        var confirm = ionicPopup.confirm("تأكيد", "هل تريد حذف الهدف", "إلغاء", "نعم").then(function (confirm) {
            if (confirm) {
                target.data = curTarget;
                target.deleteTarget();
                var targets = target.getAllTargets();
                if (typeof (targets) != "undefined") {
                    $scope.targets = targets.reverse();
                }
            }
        })
  
   
    }

    $scope.toggleOptions = function (curTarget) {
        $scope.selectedTarget = curTarget;
    }

    $scope.mgoBack = function () {
        //$ionicHistory.goBack();
        $state.go("tab.memo")
    };
    //$scope.sortTarget = function (target) {
    //    var date = new Date(target.startDate);
    //    return date;
    //};
}]);

