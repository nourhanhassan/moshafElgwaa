app.controller("GroupAddController", ["$scope", "$state", "$stateParams", "groupAdd", "enums", "$rootScope", "group", "user", "$filter", function ($scope, $state, $stateParams, groupAdd, enums, $rootScope, group, user, $filter) {
    $scope.groupNameExist = false;
    $scope.groups = [];
    group.getGroups(user.data.profile.id).then(function (data) {
        $scope.groups = data;
    });
    $scope.validations = enums.validations;
    $rootScope.addgroup = true;
    if ($stateParams.id == 0) {
        $scope.title = 'إنشاء مجموعة جديدة';
        //groupAdd.resetData();
    }
    $rootScope.hideMem = true;
    $scope.groupData = groupAdd.data;

    if ($stateParams.id != 0) {
        $scope.title = 'تعديل مجموعة';
        $scope.groupData.name = groupAdd.data.name;
    }

    $scope.setGroupMembers = function () {12
        if (!$scope.groupNameExist)
        $state.go("group-members-add");
    }
    $scope.checkIfGroupNameExist = function () {
        if ($scope.groups.length > 0) {
            var result = $filter('filter')($scope.groups, { Name: $scope.groupData.name }, true);
            if (result.length > 0) {
                $scope.groupNameExist = true;
                return true;
            }
            else {
                $scope.groupNameExist = false;
                return false;
            }
        }
        else
            return false;

    }

}]);

