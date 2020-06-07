app.controller("GroupProgressController", ["$scope", "$state", "$stateParams", "$ionicPopup", "target", "enums", "groupAdd", "user", "$ionicScrollDelegate", "$timeout", function ($scope, $state, $stateParams, $ionicPopup, target, enums, groupAdd, user, $ionicScrollDelegate, $timeout) {

    $scope.init = function () {
        $scope.groupId = groupAdd.data.id;
        $scope.groupData = groupAdd.data;
        $scope.targetData = target.data;
        $scope.groupUsers = [];
        $scope.startWerd = 0;
        $scope.endWerd = 0;
        groupAdd.getGroupWithAllDetails($stateParams.id, user.data.profile.id).then(function (data) {
            $scope.targetData.targetType = data.TargetTypeID;
            if ($scope.targetData.targetType == enums.targetType.sura) {
                $scope.targetData.totalAyatCount = target.getTargetAyat($scope.targetData).length;
            }
            else {
                $scope.targetData.totalPagesCount = data.EndPage - data.StartPage + 1;
            }
        });
        groupAdd.getAllMembersProgress($scope.groupId, $scope.targetData.id).then(function (ret) {
            $scope.groupUsers = ret.ret.GroupUsersProgress;
            $scope.startWerd = ret.StartAya;
            $scope.endWerd = ret.EndAya;
            $scope.startPage = ret.StartPage;
            $scope.endPage = ret.EndPage;
            //$scope.werdStart = ret.
            //var user = $filter('filter')($scope.groupUsers, { UserId: user.data.id }, true)[0];
            //$scope.isAdmin = user.IsAdmin;
            //$scope.groupData.IsAdmin

        })
    }

    $scope.sendLateNotification = function (userId) {
        groupAdd.sendNotificationToLateUser(userId, $scope.groupData.id).then(function () {
            $ionicPopup.alert({
                title: 'رسالة',
                template: 'تم إرسال تنبيه للعضو',
                okText: 'تأكيد',
            });
        });
    }

    $scope.init();

}]);
