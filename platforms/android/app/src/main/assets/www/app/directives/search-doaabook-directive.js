
var IonicModule = angular.module('ionic');
//debugger;
IonicModule.directive('searchDoaaBook', [ '$q', '$state', '$sce', '$rootScope', "enums", "settings", "doaaBook", function ( $q, $state, $sce, $rootScope, enums, settings, doaaBook) {
    //define the directive object
    //debugger;
    var searchObject = {};
    //restrict = E, signifies that directive is Element directive
    searchObject.restrict = 'E';
    //template replaces the complete element with this template. 
    searchObject.templateUrl = "app/directives/templates/searchDoaaBookTemplate.html";
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
                $scope.searchInDoaaBook($scope.searchKey);
            }
        });
        $scope.searchKey = "";
        //debugger;
        //if (!$rootScope.searchIcon) {
        //    $scope.searchResult = moshafdata.searchData.searchResult;
        //    $scope.searchKey = moshafdata.searchData.searchKey;
        //}
        //else {
        //    $rootScope.searchIcon = false;
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

        $scope.searchInDoaaBook = function (searchKey) {
            $scope.isSearching = true;
            console.log($state.current.name);
            doaaBook.searchInDoaaBook(searchKey).then(function (res) {
                console.log(res);
                var searchKeyClean = searchKey;//$scope.removeArabicAccent(searchKey);
                var displayRes = [];
                var tempArticles = res.articles;
                var tempDoaas = res.doaas;
                //var tempNames = res.names;
                angular.forEach(tempArticles, function (item, index) {
                    var obj = item;
                    obj.type = "article";
                    obj.typeStr = "فقه الأدعية";
                    obj.refLink = 'article({ id: '+ obj.ID + '})';
                    var displayText = $scope.removeArabicAccent(item.ArticleContent);
                    obj.displayText = displayText.replace(searchKeyClean, "<span style='color:red'>" + searchKeyClean + "</span>")
                        .slice(displayText.indexOf(searchKeyClean), displayText.length)
                    ;
                    displayRes.push(obj)
                })
                angular.forEach(tempDoaas, function (item, index) {
                    var obj = item;
                    obj.type = "doaa";
                    obj.typeStr = "دعاء";
                    obj.refLink = 'doaa({ id: ' + obj.ID + '})';
                    var displayText = $scope.removeArabicAccent(item.DoaaContent);
                    obj.displayText = displayText.replace(searchKeyClean, "<span style='color:red'>" + searchKeyClean + "</span>")
                        .slice(displayText.indexOf(searchKeyClean), displayText.length);
                    displayRes.push(obj)
                })
                //angular.forEach(tempNames, function (item, index) {
                //    var obj = item;
                //    obj.type = "name";
                //    obj.refLink = 'article({ id: ' + obj.ID + '})';
                //    var displayText = $scope.removeArabicAccent(item.NameOfAllahMeaning);
                //    obj.displayText = displayText.replace(searchKeyClean, "<span style='color:red'>" + searchKeyClean + "</span>");
                //    displayRes.push(obj)
                //})
                $scope.searchResult = displayRes;
                $scope.isSearching = false;
            })
        }
        //Load More Handling, note in view <ion-infinite-scroll on-infinite> directive
        $scope.loadMore = 10;
        $scope.removeArabicAccent = function (value) {
            return value
            .replace(/’/g, '').replace(/َ/g, '').replace(/ِ/g, '').replace(/ْ/g, '')
                .replace(/ّ/g, '').replace(/ً/g, '').replace(/ٌ/g, '').replace(/ٍ/g, '')
                .replace(/ٍ/g, '').replace(/~/g, '').replace("أ", "ا").replace("إ", "ا")
            ;
        };
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



    return searchObject;
}])

