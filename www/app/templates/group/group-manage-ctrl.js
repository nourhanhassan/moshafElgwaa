app.controller("GroupManageController", function ($scope, $state, groupAdd, target, httpHandler, $cordovaSocialSharing, enums) {

    $scope.addNewGroup = function () {
        groupAdd.resetData();
        target.resetTargetData();
        $state.go("group-add", { id: 0 });
    };

    $scope.share = function () {
        //alert('share');
        $cordovaSocialSharing.share(enums.appInfo.shareTitle, null, null, enums.appInfo.shareURL);
    };
});
