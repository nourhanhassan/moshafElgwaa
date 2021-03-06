﻿app.controller("articleListController", ["$scope", "$rootScope", "$stateParams", "$state", function ($scope, $rootScope, $stateParams, $state) {
    $rootScope.activePage = "articleList";
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
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
        //document.getElementsByTagName('ion-nav-bar')[1].style.display = 'none';
    }
    $scope.init();
}]);