app.controller("marksController", ["$scope", "$state", "localStorage", "bookmarks", "$rootScope", "ionicPopup", "bookmarkTypes", "$ionicModal", "mark", "enums", "settings", "$ionicHistory", function ($scope, $state, localStorage, bookmarks, $rootScope, ionicPopup, bookmarkTypes, $ionicModal, mark, enums, settings, $ionicHistory) {

    $scope.mgoBack = function () {
        $ionicHistory.goBack();
    };
    $scope.deleteBookmark = function (mark) {
        var confirm = ionicPopup.confirm("تأكيد", "هل تريد حذف العلامة", "إلغاء", "نعم").then(function (confirm) {
            if (confirm) {
                bookmarkTypes.deleteBookmarkType(mark.id);
                $scope.bookmarks = bookmarkTypes.getBookmarkTypesList();
            }
        })

    }
    $scope.setActiveBookMark = function (mark) {
        debugger
        bookmarkTypes.setBookmarkTypeActive(mark.id);
        var MoshafId = settings.settingsData.MoshafId.toString();
      
        if (MoshafId == enums.MoshafId.hafstext) {
            $state.go("tab.quranText", { page: mark.pageNumber, aya: mark.ayaId });
        }
        else  {
            $state.go("tab.page", { page: mark.pageNumber, aya: mark.ayaId });
        }
    }
    $scope.changeBookmarkTypeColor = function (bookmarkType) {
        $scope.colorsSet = bookmarkTypes.colorsSet;
        $scope.colorsSet.selectedColor = bookmarkType.color;
        var template = '<div class="color-set">' +
			'<div ng-repeat="color in colorsSet" class="color-{{color.name}} color-icon" ng-class="{\'active\':colorsSet.selectedColor==color.name}" ng-click="selectColor(color)"></div></div>';
        ionicPopup.show(template, 'خيارات الألوان', bookmarkType.title, "إلغاء", "حفظ", $scope).then(function (ret) {
            alert(ret)
            if(ret)
            {
                bookmarkType.color = $scope.colorsSet.selectedColor;
                bookmarkTypes.changeBookmarkTypeColor(bookmarkType.id,  bookmarkType.color)
            }
        });
    }
    $scope.selectColor = function (color) {
        $scope.colorsSet.selectedColor = color.name;
    }
    $ionicModal.fromTemplateUrl('app/templates/popovers/add-bookmark-type.html', {
        id: '2',
        scope: $scope,
        animation: 'slide-in-up',
        //backdropClickToClose: false,
    }).then(function (modal) {
        $scope.addbBookMarkTypeModal = modal;

    });
    $scope.showAddBookMarkTypeModal = function () {
        //$scope.removePopovers();
        $scope.activeColor = null;
        $scope.colors = bookmarkTypes.colorsSet;
        $scope.newBookMarkTypeModel = {};
        $scope.addbBookMarkTypeModal.show();
    }
    $scope.setBookMarkColor = function (color) {
        $scope.activeColor = color;
        $scope.newBookMarkTypeModel.color = color;
    }
    $scope.closeAddBookMarkTypeModal = function () {
        $scope.newBookMarkTypeModel = {};
        $scope.addbBookMarkTypeModal.hide();
    }

    $scope.saveNewBookMarkType = function () {

        bookmarkTypes.addNewBookMarkType($scope.newBookMarkTypeModel.id, $scope.newBookMarkTypeModel.title, $scope.newBookMarkTypeModel.color).then(function () {
            $scope.closeAddBookMarkTypeModal();
            $scope.bookmarks = bookmarkTypes.getBookmarkTypesList();
        })


     //   $scope.getCurAyaMarkers();
    }
    $scope.init = function () {

        $rootScope.activePage = "bookmarks";
        $scope.bookmarks = bookmarkTypes.getBookmarkTypesList();

    }

    $scope.init();
}]);