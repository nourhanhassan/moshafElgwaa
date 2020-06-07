app.controller("loginController", ["$scope", "$rootScope", "enums", "backup", "ionicPopup", "$state", "mark", function ($scope, $rootScope, enums, backup, ionicPopup, $state, mark) {
    $scope.loginData = {};
    $scope.enums = enums;

    $scope.loginUser = function () {
       // backup.uploadUserData();
        backup.login($scope.loginData.name, $scope.loginData.password).then(function (ret) {
            console.log(ret);
            if (ret.code == enums.responseCode.LoginWrongCredentials.code)
            {
                $scope.loginData.wrongCredentials = true;
            }
            else {

                //  backup.uploadUserData(ret.data.Id);
                
                backup.setUserData(ret.data.Id, $scope.loginData.name,$scope.loginData.email, $scope.loginData.password, ret.data.hasBackup);
                if(ret.data.hasBackup == true)
                {
                    ionicPopup.confirm("تم  تسجيل دخولك بنجاح", "لديك نسخة  احتياطية  بتاريخ   " + ret.data.lastBackup.HejriDate + "هل تريد استعادة بياناتها ", "الغاء", "نعم").then(function (confirm) {
                        if (confirm) {
                            backup.setBackupData(ret.data.lastBackup)
                            $state.go("app.backup")
                        }
                        else { $state.go("app.backup") }
                    })
                }
                else {
                    $state.go("app.backup")
                }
            }
        })
    }
    $scope.cancel = function () {
        //var lastPage = mark.getLastReadPage();
        //console.log(lastPage)
        //if (lastPage.pageNumber > 0) {
            $state.go("app.settings")
       // }
    }
    $scope.init = function () {
        var user = backup.getUserData();
        console.log(user);
    }
    $scope.init();
}]);
