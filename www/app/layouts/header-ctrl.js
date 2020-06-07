app.controller("headerController", ["$scope", "$rootScope","$state", function ($scope, $rootScope,$state) {
    $scope.search = function () {
        $rootScope.searchIcon = true;
        $state.go("search");
    }
}]);