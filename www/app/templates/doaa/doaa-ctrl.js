app.controller("doaaController", ["$scope", "$rootScope", "$stateParams", "$state", function ($scope, $rootScope, $stateParams, $state) {
    $rootScope.activePage = "doaa";
    if ($stateParams.doaaActive) {
        $scope.doaaActive = $stateParams.doaaActive;
    }
    else {
        $scope.doaaActive = 'SimpleDoaa';
    }
    $scope.makeDoaaActive = function (doaaActiveName) {
        //$scope.doaaActive = doaaActiveName;
        $state.go($state.current, { doaaActive: doaaActiveName }, { reload: false, inherit: false });
    }
}]);
