app.controller("KhatmaListController", ["$scope", "$state", "khatma", "enums", "ayatData", "$rootScope", "ionicPopup", "settings", function ($scope, $state, khatma, enums, ayatData, $rootScope, ionicPopup, settings) {
    $rootScope.appMode = enums.appModes.memorize;
    var targets = khatma.getAllTargets();
    $rootScope.appMode = enums.appModes.memorize;
    $rootScope.activePage = 'khatma';
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

            khatma.data = curTarget;
            khatma.saveTarget();
          
            khatma.cancelNotification(curTarget.notificationID);

           
            alert(curTarget.id);
        }
        else {
            curTarget.notificationMode = enums.notificationMode.on;
            curTarget.notificationTitle = "ايقاف";
            khatma.data = curTarget;
            khatma.saveTarget();
          
            alert(curTarget.id);
        }
    }
    $scope.memorize = function (curTarget)
    {
        khatma.data = curTarget;
        $state.go("app.page", { target: curTarget.id });
    }
    $scope.editTarget = function (curTarget, $event) {
        $event.stopPropagation();
        $event.preventDefault();
        khatma.data = curTarget;
        $state.go("tab.set-khatma-duration");
    }
    $scope.deleteTarget = function (curTarget, $event) {
        $event.stopPropagation();
        $event.preventDefault();
        var confirm = ionicPopup.confirm("تاكيد", "هل تريد حذف الهدف", "الغاء", "نعم").then(function (confirm) {
            if (confirm) {
                khatma.data = curTarget;
                khatma.deleteTarget();
                var targets = khatma.getAllTargets();
                if (typeof (targets) != "undefined") {
                    $scope.targets = targets.reverse();
                }
            }
        })
  
   
    }

    $scope.toggleOptions = function (curTarget) {
        $scope.selectedTarget = curTarget;
    }
    $scope.init = function () {
        $scope.enums = enums;
        $scope.MoshafId = settings.settingsData.MoshafId.toString();
        $rootScope.hideMem = true;
        var targets = khatma.getAllTargets();
    }
    $scope.init();
}]);

