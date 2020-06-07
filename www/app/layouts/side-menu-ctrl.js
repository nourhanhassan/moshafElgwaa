app.controller("sideMenuController", function ($scope, socialShare, $cordovaSocialSharing, httpHandler, target, $state, mark, $stateParams, $rootScope, enums, $rootScope, $ionicPopup, backup, settings) {
    //$scope.share = function () {
    //    debugger;
    //    alert('share');
    //    //socialShare.share('test');
    //    ////$cordovaSocialSharing.share('This is my message', 'Subject string', null, 'http://www.mylink.com');

    //    //window.plugins.socialsharing.share('Optional message', 'Optional title', 'https://www.google.nl/images/srpr/logo4w.png', null)
    //}
    $scope.goToBackup = function () {
        $scope.user = backup.getUserData();

        if (typeof ($scope.user) == "undefined") {
            $state.go("app.register")
        }
        else {
            $state.go("app.backup")
        }
    }
    $scope.getAppMode = function () {
        return $rootScope.appMode;
    }
    //   $scope.appMode = $rootScope.appMode;
    $scope.memorizeMode = function () {
        $rootScope.activePage = 'memorize';

        var lastPage = mark.getLastMemorizedPage();

        if (lastPage.target.length > 0) {
            $state.go("app.page", { page: lastPage.pageNumber, target: lastPage.target })
        }
        else {
            $state.go("app.target-list")

        }
    }
    $scope.readMode = function () {
        $rootScope.activePage = 'read';

        var lastPage = mark.getLastReadPage();
        if (lastPage.pageNumber > 0) {
            $state.go("app.page", { page: lastPage.pageNumber, target: "",reviewTarget:"" })
        }
        //else {
        //    $state.go("app.target-list")

        //}
    }
    $scope.showSave = function () {
        return $rootScope.appMode == enums.appModes.read;

    }
    $scope.showTargets = function () {

        return $rootScope.appMode == enums.appModes.memorize;
    }
    $scope.showRead = function () {
        return $rootScope.appMode == enums.appModes.memorize;


    }
    $scope.exit = function () {
        ionic.Platform.exitApp();
        //debugger;
        //    var confirmPopup = $ionicPopup.confirm({
        //        title: '<strong>تأكيد الخروج </strong>',
        //        template: 'هل تريد الخروج من مصحف القرآن الكريم ؟ ',
        //        buttons: [
        //                 {
        //                     text: '<b>تأكيد</b>',
        //                     type: 'button-positive',
        //                     onTap: function (e) {
        //}
        //                  },
        //{ text: 'إلغاء' }]
        //     });

        //     confirmPopup.then(function (res) {
        //         if (res) {
        //             ionic.Platform.exitApp();
        //         } else {
        //             // Don't close
        //         }
        //     });
    }

    $scope.setActive = function (pageName) {
        $scope.activePage = pageName;
    }
    $scope.shareApp = function () {
        window.plugins.socialsharing.share('القرآن الكريم ',
     null,
 null,
     "http://almoshafalsharef.qvtest.com/")
        if (settings.settingsData.fullScreen) {
            debugger;
            //if (typeof (AndroidFullScreen) != "undefined") {
            //    AndroidFullScreen.immersiveMode()
            //    //var autoHideNavigationBar = true;
            //    //window.navigationbar.setUp(autoHideNavigationBar);
            //}
        }
 
    }
  //  $scope.isMemorizeMode
    $scope.getActivePage = function () {
        var pageName = $state.current.name;
        //   console.log($stateParams.target)
        if (pageName == 'app.page') {
            $scope.isMemorizeMode = $stateParams.target.length > 0;
        }
        if (pageName == 'app.page') {
            $scope.isReviewMode = $stateParams.reviewTarget.length > 0;
        }
        if (typeof (window.plugins.insomnia) != "undefined") {
            if (pageName == 'app.page') {
                window.plugins.insomnia.keepAwake();
              
            }
            else {
                window.plugins.insomnia.allowSleepAgain()
            }
        }
        return $state.current.name
    }
    if (settings.settingsData.fullScreen) {
        //debugger;
        //if (typeof (AndroidFullScreen) != "undefined") {
        //    AndroidFullScreen.immersiveMode()
        //    //var autoHideNavigationBar = true;
        //    //window.navigationbar.setUp(autoHideNavigationBar);
        //}
    }
    //$scope.searchButton = function () {
    //    debugger;
    //    $rootScope.searchIcon = true;
    //    $state.go("search");
    //}
});
  