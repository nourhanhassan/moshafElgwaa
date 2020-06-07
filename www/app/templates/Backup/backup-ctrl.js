app.controller("backupController", ["$scope", "$rootScope", "enums", "backup", "ionicPopup", "toast", "$state", function ($scope, $rootScope, enums, backup, ionicPopup, toast, $state) {
 //   $scope.loginData = {};
    $scope.enums = enums;

    $scope.uploadUserData = function () {
        ionicPopup.confirm("تاكيد", "هل تريد حفظ بياناتك الحالية كنسخة احتياطية", "الغاء", "نعم").then(function (confirm) {
            if (confirm) {
                backup.uploadUserData($scope.user.id).then(function () {
                    backup.setUserData($scope.user.id, $scope.user.name, $scope.user.email, $scope.user.password, true)

                    $state.go("app.page")
                })

            }
          //  else { $state.go("app.backup") }
        })
    }
    $scope.getUserLastBackup = function () {
        ionicPopup.confirm("تاكيد ", "هل تريد استعادة اخر  بيانات ", "الغاء", "نعم").then(function (confirm) {
            if (confirm) {
                backup.getUserBackData($scope.user.id)
                $state.go("app.page")
            }
            else { $state.go("app.settings") }
        })
    }
    $scope.init = function () {
        $scope.user = backup.getUserData();
    
        if (typeof ($scope.user) == "undefined") {
            $state.go("app.register")
        }
    }
    $scope.init();
}]);
