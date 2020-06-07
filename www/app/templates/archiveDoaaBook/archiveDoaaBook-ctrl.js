app.controller("archiveDoaaBookController", ["$scope", "$rootScope", "$state", "$ionicHistory", function ($scope, $rootScope, $state, $ionicHistory) {
    $scope.mgoBack = function () {
        $ionicHistory.goBack();
    };
    $scope.init = function () {
        $rootScope.hideMem = true;
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    }
    $scope.init();
}]);