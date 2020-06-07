app.controller("VerificationCodeController", ["$q", "$scope", "$state", "user", "enums", "$ionicHistory", "memorizedayat", "localStorage", "$ionicPopup", "$rootScope", function ($q, $scope, $state, user, enums, $ionicHistory, memorizedayat, localStorage, $ionicPopup, $rootScope) {

    $scope.validations = enums.validations;
    $scope.userInfo = user.data.profile;

    $scope.verifyCode = function () {
        console.log($scope.userInfo);
        user.verifyUserCode($scope.userInfo.Code)
       .then(function (isActive) {
           debugger;
           if (isActive == true) {
               $scope.showPopUp();
               memorizedayat.syncMemorizedAyatServerToLocal($scope.userInfo.id).then(function (data) {
                   //alert(localStorage.get("Memorized"));
                   debugger;
                   if (localStorage.get("Memorized") === undefined) {
                       localStorage.set("Memorized", data);
                   }
                   else {
                       localStorage.set("Memorized", $.merge(localStorage.get("Memorized"), data));
                   }
                   //alert(localStorage.get("Memorized"));
               }); 
               //$state.go("dashboard");
               $state.go($rootScope.fromState);
           } else {
               //alert('فشل التفعيل ،برجاء التأكد من الكود بشكل صحيح');

               $ionicPopup.alert({
                   title: 'خطأ',
                   template: 'فشل التفعيل ،برجاء التأكد من الكود بشكل صحيح',
                   okText: 'تأكيد',
               });
           }
       }).catch(function (err) {

       });

    }
    $scope.showPopUp = function () {
        //alert('تم التفعيل بنجاح');
        $ionicPopup.alert({
            title: 'رسالة',
            template: 'تم التفعيل بنجاح',
            okText: 'تأكيد',
        });
    }

    $scope.backState = function () {
        debugger;
        user.data.profile.IsEdit = true;
        $state.go("register");
    }


}]);


