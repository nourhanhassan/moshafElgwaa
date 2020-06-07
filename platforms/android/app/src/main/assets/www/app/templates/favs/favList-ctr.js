app.controller("favesController", ["$scope", "$state", "localStorage", "notes", "$rootScope", "ionicPopup", "toast", "mark", "enums", "settings", function ($scope, $state, localStorage, notes, $rootScope, ionicPopup, toast, mark, enums, settings) {

    $scope.deleteFav = function (fav) {
        var confirm = ionicPopup.confirm("تأكيد", "هل تريد حذف  المفضلة", "إلغاء", "نعم").then(function (confirm) {
            if (confirm) {
                notes.deleteFav(fav.id);
                $scope.favsList = notes.getfavsList();
                var msg = "تم حذف مفضلة   " + " " + " آية" + " " + $scope.getArabicNumber(fav.ayahNum) + " " + "صفحة  " + " " + $scope.getArabicNumber(fav.PageNum);
                toast.info("", msg)
            }
        })

    }
    $scope.goToPage = function (PageNum, ayaId) {
        var MoshafId = settings.settingsData.MoshafId.toString();
    
        if (MoshafId == enums.MoshafId.hafstext) {
            $state.go("tab.quranText", { page: PageNum, aya: ayaId });
        }
        else  {
            $state.go("tab.page", { page: PageNum, aya: ayaId });
        }
    }
    $scope.init = function () {
        $rootScope.activePage = "favs";
        $scope.favsList = notes.getfavsList();

    }

    $scope.breakLines = function (text) {
        return text.replace(new RegExp('\n', 'g'), "<br />")
    }
    $scope.init();
}]);