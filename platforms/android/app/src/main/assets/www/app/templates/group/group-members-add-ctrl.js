app.controller("GroupAddMembersController", ["$scope", "$state", "$cordovaSocialSharing", "groupAdd", "user", "ionicLoading", "enums", function ($scope, $state, $cordovaSocialSharing, groupAdd, user, ionicLoading, enums) {

    $scope.groupData = groupAdd.data;
    $scope.selection = [];
    $scope.Members = [];
    $scope.selectedItems = 0;
    $scope.isHaveMembers = true;
    $scope.groupValid = true;
    var flag = true;


    var groupId = groupAdd.data.id;
    $scope.GroupID = groupId;

    if (groupId != 0 || groupAdd.data.members.length>0) {
        alert("already has members");
        $scope.groupData.members = groupAdd.data.members;
        $scope.selection = $scope.groupData.members;
    }

    $scope.getMembers = function () {
        groupAdd.getAllMembers(groupId).then(function (data) {
            $scope.Members = data;
            var userId = user.data.profile.id;
            for (var i = 0; i < $scope.Members.length; i++) {
                var obj = $scope.Members[i].ID;

                if (obj == userId) {
                    $scope.Members.splice(i, 1);
                }
            }
            $scope.isHaveMembers = false;
        });
    }
    $scope.share = function () {
        $cordovaSocialSharing.share(enums.appInfo.shareTitle, null, null, enums.appInfo.shareURL);
    }
    $scope.getMembers();
  
    $scope.toggleSelection = function toggleSelection(memberID) {
        var idx = $scope.selection.indexOf(memberID);

        // is currently selected
        if (idx > -1) {
            $scope.selection.splice(idx, 1);
            $scope.checkVal = false;
        }

            // is newly selected
        else {
            $scope.selection.push(memberID);
        }

        $scope.groupData.members = $scope.selection;
    };
  
    $scope.setTarget = function () {
        if (groupId == 0) {
            var indexOfUserId = $scope.selection.indexOf(user.data.profile.id);
            if (indexOfUserId == -1)
                $scope.selection.push(user.data.profile.id);
        }
        var mode = enums.memorizeMode.group;
        $scope.groupData.members = $scope.selection;
        if ($scope.groupData.members.length > 1) {

            $scope.groupValid = true;

            if (groupAdd.data.id != 0) {
                $state.go("set-target-duration")
            }
            else {

                $state.go("set-target-details", { mode: mode })
            }
        }
        else {
            $scope.groupValid = false;
        }
    };

    $scope.checkAll = function (selectedAll) {
       
        if (selectedAll) {    
            $scope.selectedAll = true;
        } else {
            $scope.selectedAll = false;
        }
        angular.forEach($scope.Members, function (member) {
            member.Selected = $scope.selectedAll;

            $scope.selection.push(member.ID);
            $scope.groupData.members = $scope.selection; 
        });

    }

    $scope.$watch('Members', function (Members) {
        var selectedItems = 0;

        angular.forEach(Members, function (member) {
            selectedItems += member.Selected ? 1 : (member.Selected == false ? 0 : ($scope.selection.indexOf(member.ID) > -1 ? 1 : 0));
        })

        $scope.selectedItems = selectedItems;

    }, true);

}]);

