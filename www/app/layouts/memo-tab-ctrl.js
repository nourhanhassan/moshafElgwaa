app.controller("memotabController", ["$scope", "$rootScope", "$state", "$ionicModal", "mark", "settings", "enums", function ($scope, $rootScope, $state, $ionicModal, mark, settings, enums) {
  
  //////  $rootScope.appMode = enums.appModes.review;
  ////  $rootScope.activePage = 'memorize'
    ////  //  $rootScope.activePage = 'target';
    $scope.init = function () {
        $scope.enums = enums;
        $scope.MoshafId = settings.settingsData.MoshafId.toString();
        $rootScope.hideMem = true;
    }
   
    $scope.memorized = function () {
     
        $state.go('memorized');

    }
    $scope.init();
}]);