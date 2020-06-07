app.controller("helpController", function ($scope, $state, enums, $cordovaSocialSharing, target, user, httpHandler) {
    //$scope.slideHasChanged = function ($index) {
    //    debugger;
    //    $state.go("app.page");
    //};
    $scope.$on("$ionicSlides.slideChangeStart", function (event, data) {
        //    // note: the indexes are 0-based
            $scope.activeIndex = data.slider.activeIndex;
            if ($scope.activeIndex == 15)
                $state.go("app.page");
    });
});