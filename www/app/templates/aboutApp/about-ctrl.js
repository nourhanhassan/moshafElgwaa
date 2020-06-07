app.controller("aboutController", ["$scope", "$rootScope", "enums", "ayatData", function ($scope, $rootScope, enums, ayatData) {
    $scope.init = function () {
        $scope.PageName = 'عن التطبيق';
        $rootScope.activePage = "about";
        $rootScope.hideMem = true;
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';

        ayatData.getJuzData(2);
        debugger;
        //httpHandler.get('http://api.globalquran.com/juz/' +1+ '/quran-uthmani-hafs', true).then(function (res) {
        //    console.log("ayaaaaaaaaaat",res);
        //})
        //var start = 1;
        //var arr = [];
        //function getAyat(i) {
        //    $http({
        //        method: "GET",
        //        url: "http://api.globalquran.com/juz/" +i+ "/quran-uthmani-hafs"
        //    }).then(function mySuccess(res) {
        //        //console.log("juz " + i + " =", res);
        //        angular.forEach(res.data.quran["quran-uthmani-hafs"], function (value, key) {
        //            arr.push(value);
        //            console.log("juz "+i+" =", value);
        //        });

        //        //console.log("ayaaaaaaaaaat", res);
        //    }, function myError(response) {
        //        console.log("error", res);
        //    });
        //}
        //for (var i = start ; i < 31 ; i++) {
        //    //(function(i){
        //    getAyat(i);
        //        //console.log("after push", arr);
        //    //})(i)
        //}
       
    }
    $scope.init();
}]);
