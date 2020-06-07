app.controller("RegisterController", function ($q, $scope, $state, user, enums, ionicLoading, network, ionicPopup, localStorage, $timeout, $ionicPopup, group, pushNotification, $rootScope) {

    $scope.validations = enums.validations;
    $scope.userInfo = user.data.profile;
    var notificationRegisterDeferred = $q.defer();
    var notificationRegisterPromise = notificationRegisterDeferred.promise;
    var timer = null;

    $scope.saveUserInfo = function () {
        //user.registerUser()
        //    .then(function (resp) {
        //        if (resp > 0) {
        //            $scope.showPopUp();
        //            if (user.data.profile.isActive) {
        //                $state.go("app.group-manage");
        //            } else {
        //                $state.go("app.verify-code");
        //            }

        //        }
        //        else {
        //            //alert('رقم الجوال المُدخل موجود بالفعل ومُسجل ببريد آخر، برجاء إدخال البريد');
        //            $ionicPopup.alert({
        //                title: 'خطأ',
        //                template: 'رقم الجوال المُدخل موجود بالفعل ومُسجل ببريد آخر، برجاء إدخال البريد',
        //                okText: 'تأكيد',
        //            });
        //        }
        //    }).catch(function (err) {

        //    });
        ionicLoading.show({ templateText: "جاري التحميل .. برجاء الانتظار" });
        if (user.data.profile.registerationId == "") {

            ////check if we are on browser or not, if we are not on browser, then login directly
            //if (typeof (cordova) != "undefined") {
            //    alert("hereUndefined");
            //    timer= $timeout(function (err) {
            //            notificationRegisterDeferred.reject(err);
            //            ionicLoading.show({ templateText: "حدث خطأ .. برجاء التأكد من اتصالك بالإنترنت",duration:3000 });
            //        }, 15000);

            //    notificationManager.register().then(function () {
            //        alert("success registering");
            //    },
            //    function (er) {
            //        alert("error in registering" + JSON.stringify(er));

            //    });

            //}
            pushNotification.getRegistrationId().then(function (obj) {
                user.data.profile.registerationId = obj.registerationId;
                user.data.profile.registerationType = obj.registerationType;
                ionicLoading.hide();
                //login.setUserRegisterationID(registeration);

                // checkStoredCredentials();
                user.registerUser()
       .then(function (resp) {
           if (resp > 0) {
               $scope.showPopUp();
               if (user.data.profile.isActive) {
                   $state.go("group");
               } else {
                   $state.go("verify-code");
               }

           }
           else {
               $ionicPopup.alert({
                   title: 'خطأ',
                   template: 'رقم الجوال المُدخل موجود بالفعل ومُسجل ببريد آخر، برجاء إدخال البريد',
                   okText: 'تأكيد',
               });
           }
       }).catch(function (err) {
    
           console.log(err)
       });

            });
        }
        else {

            notificationRegisterDeferred.resolve(user.data.profile.registerationId);
            user.registerUser()
   .then(function (resp) {
       if (resp > 0) {
           $scope.showPopUp();
           if (user.data.profile.isActive) {
               $state.go("group");
           } else {
               $state.go("verify-code");
           }

       }
       else {
           $ionicPopup.alert({
               title: 'خطأ',
               template: 'رقم الجوال المُدخل موجود بالفعل ومُسجل ببريد آخر، برجاء إدخال البريد',
               okText: 'تأكيد',
           });
       }
   }).catch(function (err) {
       console.log(err)
   });
        }

        notificationRegisterPromise.then(function () {
            $timeout.cancel(timer);
            //user.registerUser()
            //.then(function (resp) {
            //    if (resp > 0) {
            //        $scope.showPopUp();
            //        if (user.data.profile.isActive) {
            //            $state.go("app.group-manage");
            //        } else {
            //            $state.go("app.verify-code");
            //        }

            //    }
            //    else {
            //        //alert('رقم الجوال المُدخل موجود بالفعل ومُسجل ببريد آخر، برجاء إدخال البريد');
            //        $ionicPopup.alert({
            //            title: 'خطأ',
            //            template: 'رقم الجوال المُدخل موجود بالفعل ومُسجل ببريد آخر، برجاء إدخال البريد',
            //            okText: 'تأكيد',
            //        });
            //    }
            //}).catch(function (err) {

            //});
        }).catch(function (err) {
            console.log(err)
            ionicLoading.show({ templateText: "حدث خطأ .. برجاء التأكد من اتصالك بالإنترنت", duration: 3000 });
        });
    }


    $scope.showPopUp = function () {
        //alert('تم التسجيل بنجاح');
        $ionicPopup.alert({
            title: 'رسالة',
            template: 'تم التسجيل بنجاح',
            okText: 'تأكيد',
        });
    }

    $scope.init = function () {
        //////////////////////**Handling Redirection conditions**/////////////////////////////////////////

        //if user is logged in and user is not active
        if ($scope.userInfo.id > 0 && $scope.userInfo.isActive != true && user.data.profile.IsEdit != true) {
            $state.go("verify-code");
        }
            //if user is logged in and user is  active
        else if ($scope.userInfo.id > 0 && $scope.userInfo.isActive == true) {
            $state.go("group");
        }
        try {

            //    //check if we're already registered it means that we're logged out, then don't register again and don't bind events again
            //    //otherwise continue as normal
            //    if (user.data.profile.registerationId == "") {
            //        //check if we are on browser or not, if we are not on browser, then login directly
            //        if (typeof (cordova) != "undefined") {

            //        notificationManager.register().then(function () {
            //            alert("success registering");

            //        },
            //        function (er) {

            //            alert("error in registering" + JSON.stringify(er));

            //        });

            //    }              
            //}


            //--------------------Register event handling ------------------------------//
            //notificationManager.on("android", "register", function (id) {
            //    //alert("registered android " + id);
            //    user.data.profile.registerationId = id;
            //    user.data.profile.registerationType = "gcm";               
            //});
        }
        catch (ex) {
            console.log(ex)
        }
    }

});


