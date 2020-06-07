app.controller("ReviewTargetListController", ["$scope", "$state", "reviewTarget", "enums", "ayatData", "$rootScope", "ionicPopup", function ($scope, $state, reviewTarget, enums, ayatData, $rootScope, ionicPopup) {
    $rootScope.appMode = enums.appModes.memorize;
    var targets = reviewTarget.getAllTargets();
    $rootScope.appMode = enums.appModes.memorize;
    $rootScope.activePage = 'target';
    if (typeof (targets) != "undefined") {
        $scope.targets=targets.reverse();
    }
        console.log($scope.targets)
    $scope.targetModes = enums.memorizeMode;
    $scope.notificationModes = enums.notificationMode;
    $scope.notification = function (curTarget)
    {
        if (curTarget.notificationMode == enums.notificationMode.on) {

            alert(curTarget.notificationID);
            curTarget.notificationMode = enums.notificationMode.off;

           
            curTarget.notificationTitle = "تشغيل";

            reviewTarget.data = curTarget;
            reviewTarget.saveTarget();
          
            reviewTarget.cancelNotification(curTarget.notificationID);

           
            alert(curTarget.id);
        }
        else {
            curTarget.notificationMode = enums.notificationMode.on;
            curTarget.notificationTitle = "ايقاف";
            reviewTarget.data = curTarget;
            reviewTarget.saveTarget();
          
            alert(curTarget.id);
        }
    }
    $scope.review = function (curTarget)
    {
        reviewTarget.data = curTarget;
        console.log(curTarget)
        $state.go("app.page", { reviewTarget: curTarget.id });
    }
    $scope.editTarget = function (curTarget, $event) {
        $event.stopPropagation();
        $event.preventDefault();
        reviewTarget.data = curTarget;
        $state.go("app.set-review-target-duration");
    }
    $scope.deleteTarget = function (curTarget, $event) {
        $event.stopPropagation();
        $event.preventDefault();
        var confirm = ionicPopup.confirm("تاكيد", "هل تريد حذف الهدف", "الغاء", "نعم").then(function (confirm) {
            if (confirm) {
                reviewTarget.data = curTarget;
                reviewTarget.deleteReviewTarget();
                var reviewTargets = reviewTarget.getAllTargets();
                if (typeof (reviewTargets) != "undefined") {
                    $scope.targets = reviewTargets.reverse();
                }
            }
        })


    }
    $scope.toggleOptions = function (curTarget) {
        $scope.selectedTarget = curTarget;
    }
}]);

