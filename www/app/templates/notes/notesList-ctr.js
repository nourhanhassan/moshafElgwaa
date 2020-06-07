app.controller("notesController", ["$scope", "$state", "localStorage", "notes", "$rootScope", "ionicPopup", "toast", "mark", "enums", "settings", function ($scope, $state, localStorage, notes, $rootScope, ionicPopup, toast, mark, enums, settings) {

    $scope.deleteNote = function (note) {
        var confirm = ionicPopup.confirm("تأكيد ", "هل تريد حذف  الخاطرة", "إلغاء ", "نعم").then(function (confirm) {
            if (confirm) {
                notes.deleteNote(note.ayaId);
                $scope.notesList = notes.getNotesList();
                //var msg = "تم حذف خاطرة   " + " " + " آية" + " " + $scope.getArabicNumber(note.ayaNumber) + " " + "صفحة  " + " " + $scope.getArabicNumber(note.pageNumber);
                //toast.info("", msg)
            }
        })   
    }
    $scope.init = function () {
        $rootScope.activePage = "notes";
        $scope.notesList = notes.getNotesList();

    }

    $scope.breakLines = function (text) {
      return  text.replace(new RegExp('\n', 'g'), "<br />")
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
    $scope.init();
}]);