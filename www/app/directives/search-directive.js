
var IonicModule = angular.module('ionic');
//debugger;
IonicModule.directive('search', ['moshafdata', '$q', '$state', '$sce', '$rootScope', "enums", "settings", function (moshafdata, $q, $state, $sce, $rootScope, enums, settings) {
    //define the directive object
    //debugger;
    var searchObject = {};
    //restrict = E, signifies that directive is Element directive
    searchObject.restrict = 'E';
    //template replaces the complete element with this template. 
    searchObject.templateUrl = "app/directives/templates/searchTemplate.html";
    searchObject.scope = false;
    //    {
    //    ngModel: '='
    //}
    //debugger;
    searchObject.link = function ($scope, elem, attr, ctrl) {

        elem.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                $scope.$apply(function () {
                    $scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
                cordova.plugins.Keyboard.close();
                $scope.search($scope.searchKey);
            }
        });
        $scope.searchKey = "";
        //debugger;
        if (!$rootScope.searchIcon) {
            $scope.searchResult = moshafdata.searchData.searchResult;
            $scope.searchKey = moshafdata.searchData.searchKey;
        }
        else {
            $rootScope.searchIcon = false;
        }
        //$scope.goToPage = function (pageNum) {
        //    var MoshafId = settings.settingsData.MoshafId.toString();
        //    if (MoshafId == enums.MoshafId.hafs) {
        //        $state.go("tab.page", { page: pageNum });
        //    }
        //    if (MoshafId == enums.MoshafId.hafstext) {
        //        $state.go("tab.quranText", { page: pageNum });
        //    }
        //}
        $scope.goToPage = function (PageNum, ayaId) {
            var MoshafId = settings.settingsData.MoshafId.toString();
         
            if (MoshafId == enums.MoshafId.hafstext) {
                $state.go("tab.quranText", { page: PageNum, aya: ayaId });
            }
            else  {
                $state.go("tab.page", { page: PageNum, aya: ayaId });
            }
        }
        $scope.search = function (searchKey) {
            //debugger; // function to get all matched data from quran
            $scope.isSearching = true;

            moshafdata.searchInQuran(searchKey).then(function (result) {
                $scope.searchKeyArray = searchKey.split(" ") // searched key words
                $scope.searchResult = result.searchResult; // result 
                if ($scope.searchResult.length == 0) {
                    $scope.isSearching = false;
                }
                // for each function on result to colored matched word
                angular.forEach($scope.searchResult, function (obj, searchResultindex) {
                    var aya = moshafdata.getAyaByID(obj.id);
                    obj.PageNum = aya.PageNum;
                    //debugger;
                    // array of words in aya with الالف
                    var tempverseWithClean = moshafdata.removeArabicAccentWith(obj.verse).split(" ");
                    // array of words without replace الالف
                    var tempverseClean = moshafdata.removeArabicAccent(obj.verse).split(" ");
                    // array of words in aya verse
                    var tempverse = obj.verse.replace("<br>", "").split(" ");
                    // for each on aya verse clean to check if this word matched key word or not 
                    angular.forEach(tempverseClean, function (item, index) {
                        //debugger;
                        var indexOf = -2;
                        // for loop for searched key if more than one with spaces 
                        for (var i = 0; i < $scope.searchKeyArray.length; i++) {
                            //debugger;

                            if (tempverseClean.length > index + i) {
                                if ($scope.searchKeyArray.length > i + 1) {
                                    var matchend = moshafdata.removeArabicAccent($scope.searchKeyArray[i]) + "$" // key word after remove any accent 
                                    // check if current word match keyword or not in two cases (بالالف او من غير الالف )
                                    if (tempverseClean[index + i].match(matchend) != null || tempverseWithClean[index + i].match(matchend) != null) indexOf = 0;
                                    else indexOf = -1
                                }

                                else {
                                    var matchend = moshafdata.removeArabicAccent($scope.searchKeyArray[i]);
                                    // check if current word match keyword or not in two cases (بالالف او من غير الالف )
                                    if (tempverseClean[index + i].match(matchend) != null || tempverseWithClean[index + i].match(matchend) != null) indexOf = 0;
                                    else indexOf = -1
                                    //indexOf = tempverseClean[index + i].indexOf(moshafdata.removeArabicAccent($scope.searchKeyArray[i]))
                                }
                            }
                            if (indexOf == -1) i = $scope.searchKeyArray.length + 1

                        }
                        if (indexOf > -1) { // if current word matched will be colored 
                            //debugger;
                            for (var i = 0; i < $scope.searchKeyArray.length; i++) {
                                if (tempverseClean.length > index + i)
                                    tempverse[index + i] = "<span style='color:red'>" + tempverse[index + i] + "</span>"

                            }
                        }

                    })
                    //debugger;
                    obj = tempverse.join(" ");
                    $scope.searchResult[searchResultindex].verse = obj;
                    $scope.isSearching = false;

                });

            })
        };
        //Load More Handling, note in view <ion-infinite-scroll on-infinite> directive
        $scope.loadMore = 10;

        $scope.loadMoreData = function () {
            //debugger;
            $scope.loadMore += 10;
            $scope.$broadcast('scroll.infiniteScrollComplete');
        };

        $scope.moreDataCanBeLoaded = function () {
            if ($scope.searchResult.length > $scope.loadMore)
                return true;
            else
                return false;
        };
        $("#divSearch textarea").autogrow({ vertical: true, horizontal: false });
        //$("#divSearch textarea").css('overflow', 'hidden').autogrow()

    }
    //autosize($("input[name='searchKey']"));
    //autosize($("input[type='search']"));
    //autosize(document.querySelectorAll('textarea'));



    return searchObject;
}])

//app.directive('ngEnter', function () {
//    return function (scope, element, attrs) {
//        element.bind("keydown keypress", function (event) {
//            debugger;
//            if (event.which === 13) {
//                scope.$apply(function () {
//                    scope.$eval(attrs.ngEnter);
//                });

//                event.preventDefault();
//            }
//        });
//    };
//});