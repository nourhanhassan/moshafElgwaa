app.controller("doaaBookmarksController", ["$scope", "$state", "localStorage", "$rootScope", "ionicPopup", "$ionicModal", "mark", "enums", "settings", "$ionicHistory", "doaaBookmarkTypes", "doaaBookmarks", function ($scope, $state, localStorage, $rootScope, ionicPopup, $ionicModal, mark, enums, settings, $ionicHistory, doaaBookmarkTypes, doaaBookmarks) {
    document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    document.getElementsByTagName('ion-nav-bar')[1].style.display = 'block';
    $scope.mgoBack = function () {
        $ionicHistory.goBack();
    };
    $scope.deleteBookmark = function (mark) {
        var confirm = ionicPopup.confirm("تأكيد", "هل تريد حذف العلامة", "إلغاء", "نعم").then(function (confirm) {
            if (confirm) {
                doaaBookmarkTypes.deleteBookmarkType(mark.Id);
                $scope.bookmarks = doaaBookmarkTypes.getBookmarkTypesList();
            }
        })

    }
    $scope.setActiveBookMark = function (mark) {

        doaaBookmarkTypes.setBookmarkTypeActive(mark.Id);
        if (mark.bookmarkTypeId == enums.doaaBookmarkType.article) {
            $state.go("article", { id: mark.Id });
        }else{
            $state.go("doaa", { id: mark.Id });
        }
        
    }
    $scope.changeBookmarkTypeColor = function (bookmarkType) {
        $scope.colorsSet = doaaBookmarkTypes.colorsSet;
        $scope.colorsSet.selectedColor = bookmarkType.color;
        var template = '<div class="color-set">' +
			'<div ng-repeat="color in colorsSet" class="color-{{color.name}} color-icon" ng-class="{\'active\':colorsSet.selectedColor==color.name}" ng-click="selectColor(color)"></div></div>';
        ionicPopup.show(template, 'خيارات الألوان', bookmarkType.title, "إلغاء", "حفظ", $scope).then(function (ret) {
            alert(ret)
            if (ret) {
                bookmarkType.color = $scope.colorsSet.selectedColor;
                doaaBookmarkTypes.changeBookmarkTypeColor(bookmarkType.Id, bookmarkType.color)
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
        $scope.colors = doaaBookmarkTypes.colorsSet;
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

        doaaBookmarkTypes.addNewBookMarkType(1, $scope.newBookMarkTypeModel.title, $scope.newBookMarkTypeModel.color).then(function () {
            $scope.closeAddBookMarkTypeModal();
            $scope.bookmarks = doaaBookmarkTypes.getBookmarkTypesList();
        })


        //   $scope.getCurAyaMarkers();
    }
    $scope.init = function () {

        $rootScope.activePage = "bookmarks";
        $scope.bookmarks = doaaBookmarkTypes.getBookmarkTypesList();
    }

    $scope.init();
}]);