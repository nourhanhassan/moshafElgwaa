app.factory("downloadSoarImage", ["$cordovaFileTransfer", "$timeout", "$cordovaFile", "$q", "ionicLoading", "$cordovaToast", "$ionicPopup", "$rootScope", function ($cordovaFileTransfer, $timeout, $cordovaFile, $q, ionicLoading, $cordovaToast, $ionicPopup, $rootScope) {
    var service = {
        url: "http://nahfaz.tawfier.com/hafs/",
        targetPath: "file:///storage/emulated/0/Moshaf/images/hafs/",
        downloadImage: function (pageNum) {
            var deferred = $q.defer();
            debugger;
            var url = "http://nahfaz.tawfier.com/hafs/" + pageNum + ".png";
            var targetPath = "file:///storage/emulated/0/Moshaf/images/hafs/" + pageNum + ".png";
            //if($scope.curPage.pageNum == fileDownload.pageNum)
            $cordovaFileTransfer.download(url, targetPath, {}, true)
            .then(function (result) {
                debugger;
                $rootScope.tryDownloadImage = {};
       

                console.log(result);
                deferred.resolve(result);
            }, function () {
                debugger;
                ionicLoading.hide();
                if ($rootScope.tryDownloadImage.pageNum == undefined) {
                    $rootScope.tryDownloadImage = pageToDownload;
                    $rootScope.alertPopup = $ionicPopup.show({
                        title: 'لا يوجد إتصال بالإنترنت',
                        template: ''
                    });
                    deferred.resolve(false);
                }
            }, function (progress) {

            });
            return deferred.promise;
        }
    }
    return service;
}]);
