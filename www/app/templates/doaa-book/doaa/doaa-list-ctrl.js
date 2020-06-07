app.controller("doaaListController", ["$scope", "$rootScope", "$stateParams", "$state", function ($scope, $rootScope, $stateParams, $state) {
    $rootScope.activePage = "doaaList";
    $scope.toggle = false;
    $scope.openDoaa = function (id) {
        $state.go("doaa", { id: id });
    }
    $scope.toggle = false;
    $scope.submenu = false;
    $scope.setMaster = function (mainCateg) {
        $scope.selected = mainCateg;
    }

    $scope.isSelected = function (mainCateg) {
        return $scope.selected === mainCateg;
    }
    $scope.setMaster = function (name) {
        $scope.selected = name;
    }

    $scope.isSelected = function (name) {
        return $scope.selected === name;
    }
    $scope.init = function () {
        $rootScope.activePage = "doaaList";
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
        //document.getElementsByTagName('ion-nav-bar')[1].style.display = 'none';
    }
    $scope.init();
}]);