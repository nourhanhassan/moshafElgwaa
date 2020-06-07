app.controller("UpdateAppCtrl", ["$scope", "$state", "$timeout", "device", "$rootScope", function ($scope, $state, $timeout, device, $rootScope) {
   
    $scope.init = function () {
        $scope.platform = device.getPlatform();
        $scope.storeLink = "";
        if ($scope.platform == "ios")
            $scope.storeLink = "https://apps.apple.com/us/app/%D9%85%D8%B5%D8%AD%D9%81-%D8%A7%D9%84%D8%AC%D9%88%D8%A7%D8%A1/id1461142764?ls=1";
        else
            $scope.storeLink = "https://play.google.com/store/apps/details?id=com.qvsite.MoshafThird";
    };
    $scope.init();

    $scope.goToStore = function () {
        window.open($scope.storeLink, '_system');
        return false;
    }
}])