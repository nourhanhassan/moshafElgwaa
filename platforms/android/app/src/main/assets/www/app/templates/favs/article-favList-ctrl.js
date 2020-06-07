app.controller("faveListController", ["$scope", "$state", "localStorage", "notes", "$rootScope", "ionicPopup", "toast", "memorizedArticles", "enums", "settings", "memorizeDoaaBook", function ($scope, $state, localStorage, notes, $rootScope, ionicPopup, toast, memorizedArticles, enums, settings, memorizeDoaaBook) {

    $scope.deleteFav = function (fav) {
        var confirm = ionicPopup.confirm("تأكيد", "هل تريد حذف  المفضلة", "إلغاء", "نعم").then(function (confirm) {
            if (confirm) {
                memorizeDoaaBook.removeArticleFromFavourized(fav);
                $scope.favsList = memorizedArticles.getFavourizedArticles();
                var msg = "تم حذف المقالة من المفضلة";
                toast.info("", msg)
            }
        })

    }
    $scope.goToPage = function (fav) {
        
        if (fav.type == enums.doaaBookmarkType.article) {
            $state.go("article", { id: fav.ID, subItemId: fav.subItemId });
        }
        else if (fav.type == enums.doaaBookmarkType.doaa) {
            $state.go("doaa", { id: fav.ID });
        }

    }
    $scope.init = function () {
        $rootScope.activePage = "favList";
        $scope.favsList = memorizedArticles.getFavourizedArticles();

    }

    $scope.breakLines = function (text) {
        return text.replace(new RegExp('\n', 'g'), "<br />")
    }
    $scope.init();
}]);