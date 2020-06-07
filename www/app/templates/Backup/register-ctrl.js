app.controller("registerController", ["$scope", "$rootScope", "enums", "backup", "ionicPopup", "$state", "mark", function ($scope, $rootScope, enums, backup, ionicPopup, $state, mark) {
    $scope.registerData = {};
    $scope.enums = enums;
    $scope.registerUser = function () {
       // backup.uploadUserData();
        backup.register($scope.registerData.name, $scope.registerData.email, $scope.registerData.password).then(function (ret) {
            console.log(ret);
            if(ret.code==enums.responseCode.RegisterdNameExist.code)
            {
                $scope.registerData.isNameExist = true;
            }
            else {
                $scope.registerData.isNameExist = false;
              //  backup.uploadUserData(ret.data.Id);
                backup.setUserData(ret.data.Id, $scope.registerData.name, $scope.registerData.email, $scope.registerData.password,false);
                ionicPopup.confirm("تم  تسجيل بياناتك بنجاح", "هل تريد رفع نسخة احتياطية الان ", "الغاء", "نعم").then(function (confirm) {
                    if (confirm) {
                        backup.uploadUserData(ret.data.Id).then(function () {
                            backup.setUserData(ret.data.Id, $scope.registerData.name, $scope.registerData.email, $scope.registerData.password, true);
                          //  toast.info("", "تم رفع بياناتك بنجاح")
                            $state.go("app.settings")
                        })

                        ;
                    }
                    else { $state.go("app.settings") }
                })
            }
        })
    }

    $scope.cancel = function () {
        //var lastPage = mark.getLastReadPage();
        //console.log(lastPage)
        //if (lastPage.pageNumber > 0) {
            $state.go("app.settings")
     //   }
    }
    $scope.init = function () {
 
    }
    $scope.init();
}]);
