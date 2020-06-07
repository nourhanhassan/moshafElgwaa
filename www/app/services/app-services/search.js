app.factory("search", ["moshafdata", "$q", "$filter", "$rootScope", function (moshafdata, $q, $filter, $rootScope) {


    function createReplaceRegex(word) {

        var charactersList = word.split("");
        var regStr = "(";
        for (var i = 0; i < charactersList.length; i++) {
            var character = charactersList[i];
            regStr += character + "{1}" + "[^\u0620-\u064A]*"

        }
        regStr += "[\\S]*)"
        console.log(regStr)
        return new RegExp(regStr)
    }

    var service = {
        searchKey: {
            key: "",
            result: []
        },
        removeArabicAccent: function (value) {
            return value
            .replace(/’/g, '').replace(/َ/g, '').replace(/ِ/g, '').replace(/ْ/g, '')
                .replace(/ّ/g, '').replace(/ً/g, '').replace(/ٌ/g, '').replace(/ٍ/g, '')
                .replace(/ٍ/g, '').replace(/~/g, '')
            ;
        },
        searchInQuran: function (searchKey) {
            //debugger;
            var deferred = $q.defer();
            var verseSearchKey = this.removeArabicAccent(searchKey);
            moshafdata.executeQuery("select * from Ayah where verseClean LIKE '%" + verseSearchKey + "%'").then(function (res) {
                //debugger;
                deferred.resolve(res);
                service.searchKey = {key:searchKey,result:res};
            })
            return deferred.promise;
        },
        searchInDoaaBook: function (searchKey) {
            //debugger;
            var deferred = $q.defer();
            // var searchKey = this.removeArabicAccent(searchKey);
            var res = {};
            function searchArticles(article) {
                var searchkey = service.removeArabicAccent(searchKey).replace("أ", "ا").replace("إ", "ا");
                var content = article.ArticleContent != null ? service.removeArabicAccent(article.ArticleContent).replace(/أ/g, "ا").replace(/إ/g, "ا") : null;
                var matched = (content != null ? content.indexOf(searchkey) >= 0 : false);
                return (matched);
            }
            res.articles = $filter('filter')( $rootScope.articles, searchArticles, true);

            function searchDoaas(doaa) {
                var searchkey = service.removeArabicAccent(searchKey).replace("أ", "ا").replace("إ", "ا");
                var content = doaa.DoaaContent != null ? service.removeArabicAccent(doaa.DoaaContent).replace(/أ/g, "ا").replace(/إ/g, "ا") : null;
                var matched = (content != null ? content.indexOf(searchkey) >= 0 : false);
                return (matched);
            }
            var doaas = $rootScope.doaas.flat(1);
            res.doaas = $filter('filter')(doaas, searchDoaas, true);

            //function searchNames(name) {
            //    var searchkey = service.removeArabicAccent(searchKey).replace("أ", "ا").replace("إ", "ا");
            //    var content = name.NameOfAllahMeaning != null ? service.removeArabicAccent(name.NameOfAllahMeaning).replace("أ", "ا").replace("إ", "ا") : null;
            //    var matched = (content != null ? content.indexOf(searchkey) >= 0 : false);
            //    return (matched);
            //}
            //res.names = $filter('filter')($rootScope.namesOfAllah, searchNames, true);

            console.log(res);
            deferred.resolve(res);
                service.searchKey = { key: searchKey, result: res };
          
            return deferred.promise;
        }

    }
    //str.replace(/(ض{1}[^\u0620-\u064A]*ر{1}[^\u0620-\u064A]*ب{1}[\S]*)/gi,"<span>$1</span>")
   
    return service;
    //function filterArticles(article, searchKey) {
    //    var matched = (article.ArticleContent.indexOf(searchKey) >= 0 || article.Name.indexOf(searchKey) >= 0);
    //    return (matched);
    //}
}]);