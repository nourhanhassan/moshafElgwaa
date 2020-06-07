app.controller("pagesController", ["$scope", "moshafdata", "$state", "$ionicSideMenuDelegate", "$rootScope", "enums", "settings", function ($scope, moshafdata, $state, $ionicSideMenuDelegate, $rootScope, enums, settings) {
    //$ionicSideMenuDelegate.canDragContent(false);
    $rootScope.appMode = enums.appModes.read;
    $rootScope.activePage = "suar";
    $rootScope.activeTab = "pages";
    $scope.model = { pageNumber: 1 };
    $scope.pages = 604;

    $scope.addValue = function (value) {
        //if (num > 604 || num < 1) {
        //    $scope.pageNumber = num;
        //}
        if (!($scope.model.pageNumber > 0)) {
            $scope.model.pageNumber = 0;
        }
        //num = $("#num").val();
        if (parseInt($scope.model.pageNumber) + value > $scope.pages)
        { $scope.model.pageNumber = $scope.pages }
            else {
            $scope.model.pageNumber = parseInt($scope.model.pageNumber) + value;
            }
        //goto.pageNumber.value = $scope.pageNumber;
        //if ($scope.pageNumber)
        //var t = goto.pageNumber.validity.valid;
    }
    $scope.subtractValue = function (value)
    {
        //if (num > 604 || num < 1) {
        //    $scope.pageNumber = num;
        //}

        //num = $("#num").val();
        if (parseInt($scope.model.pageNumber) - value < 1) {
            $scope.model.pageNumber = 1
        }
        else {
            $scope.model.pageNumber = parseInt($scope.model.pageNumber) - value;
        }
        //goto.pageNumber.value = $scope.pageNumber;
    }
    $scope.changeText = function (value)
    {
        $scope.model.pageNumber = $("#num").val();
    }
    $scope.submit = function () {
        if ($scope.model.pageNumber >= 1 && $scope.model.pageNumber <= $scope.pages) {
                        var MoshafId = settings.settingsData.MoshafId;
                       
                        if (MoshafId == enums.MoshafId.hafstext) {
                            $state.go("tab.quranText", { page: $scope.model.pageNumber });
                        }
                        else {
                                $state.go("tab.page", { page: $scope.model.pageNumber });
                            }
        }
    }
    $scope.init = function () {
        $scope.model.pageNumber = 1;
        $rootScope.hideMem = true;
        $scope.pages = 604;
        var MoshafId = settings.settingsData.MoshafId.toString();
        if (MoshafId == enums.MoshafId.shamrly) {
            $scope.pages = 522;
        }
    }
    $scope.init();
}]);