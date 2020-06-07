//memorizedArticles
app.factory("memorizedArticles", ["localStorage", "ayatData", "$filter", "$timeout", "httpHandler", "$q", "moshafdata", function (localStorage, ayatData, $filter, $timeout, httpHandler, $q, moshafdata) {
    var service = {
        userArticles: null,
        userArticlesFavourite: null,
        userArticlesFavouriteTemo: [],
        storagekey: "MemorizedArticles",
        getMemorizedAyat: function () {
            if (service.userArticles == null) {
                service.userArticles = localStorage.get("MemorizedArticles");
            }
            if (service.userArticles == null) {
                service.userArticles = [];
            }
            //console.log(userArticles);
            return service.userArticles;
        },
        getFavourizedArticles: function () {
            //if (service.userArticlesFavourite == null || service.userArticlesFavourite.length == 0) {
            //    service.userArticlesFavourite = [];
            //    service.userArticlesFavouriteTemo = [];
            //}
            //else {
                service.userArticlesFavourite = localStorage.get("FavourizedArticles");
                service.userArticlesFavouriteTemo = localStorage.get("FavourizedArticlesTempo");
                if (typeof (service.userArticlesFavourite) == "undefined" || typeof (service.userArticlesFavouriteTemo) == "undefined") {
                    service.userArticlesFavourite = [];
                    service.userArticlesFavouriteTemo = [];
                }
            //}
            //console.log(userArticles);
            return service.userArticlesFavourite;
        },
        getFavourizedArticlesTempo: function () {

            if (service.userArticlesFavourite == null || service.userArticlesFavourite.length == 0) {

                service.userArticlesFavouriteTemo = [];
            }
            else {

                service.userArticlesFavouriteTemo = localStorage.get("FavourizedArticlesTempo");
            }

            return service.userArticlesFavouriteTemo;
        },

        //getMemorizedAyatid: function () {

        //    var userArticles = this.getMemorizedAyat();
        //    ayatIndex = [];
        //    angular.forEach(userArticles, function (item, key) {
        //        ayatIndex.push(item.id);
        //    });
        //    ////console.log(userArticles);
        //    return ayatIndex;
        //},
        getSurahMemorizedAyat: function (surahId, item) {
            var allAyat;
            if (typeof (item) == "undefined" || typeof (item.allAyat) == "undefined") {
                allAyat = ayatData.getSurahAyat(surahId);
                if (typeof (item) != "undefined") { item.allAyat = allAyat }
            }
            else {
                allAyat = item.allAyat;
            }
            var memorizedAyat = service.getMemorizedAyat();
            var data = $filter('filter')(allAyat, function (item) {
                return memorizedAyat.indexOf(item.id) > -1
            }, true)
            return data;

        },
        getSurahNotMemorizedAyat: function (surahId, item) {
            var surahAyat = ayatData.getSurahAyat(surahId);
            var memorizedAyat = service.getMemorizedAyat();
            var data = $filter('filter')(surahAyat, function (item) {
                return memorizedAyat.indexOf(item.id) == -1
            }, true)
            return data;

        },
        getJuzMemorizedAyat: function (juzId, item) {

            var allAyat;
            if (typeof (item) == "undefined" || typeof (item.allAyat) == "undefined") {
                allAyat = ayatData.getJuzAyat(juzId);
                if (typeof (item) != "undefined") { item.allAyat = allAyat }
            }
            else {
                allAyat = item.allAyat;
            }

            var memorizedAyat = service.getMemorizedAyat();
            var data = $filter('filter')(allAyat, function (item) {
                return memorizedAyat.indexOf(item.id) > -1
            }, true)
            return data;

        },

        getJuzMemorizedPages: function (juzId, item) {
            var pages = [];
            var allAyat;
            if (typeof (item) == "undefined" || typeof (item.allAyat) == "undefined") {
                allAyat = ayatData.getJuzAyat(juzId);
                if (typeof (item) != "undefined") { item.allAyat = allAyat }
            }
            else {
                allAyat = item.allAyat;
            }
            var juz = ayatData.getJuzData(juzId)
            var memorizedAyat = service.getMemorizedAyat();
            for (var i = juz.StartPage; i <= juz.EndPage; i++) {
                var ayat = ayatData.getpagesAyat(i, i);
                if (memorizedAyat.indexOf(ayat[0].id) > -1 && memorizedAyat.indexOf(ayat[ayat.length - 1].id) > -1) {
                    pages.push(i);
                }
                else {
                    break;
                }
            }
            return pages;
        },
        syncMemorizedAyatLocalToServer: function (id) {
            ;
            var syncAyat = localStorage.get("syncAyat");
            if (syncAyat != undefined) {
                var deferred = $q.defer();
                httpHandler.post("userArticles/SyncMemorizedAyatLocalToServer", { iUserID: id, Ayatid: syncAyat }, true).then(function (results) {
                    deferred.resolve(results);
                });

                return deferred.promise;
            }
        },
        syncMemorizedAyatServerToLocal: function () {
            var deferred = $q.defer();
            httpHandler.post("userArticles/SyncMemorizedAyatServerToLocal", { Ayatid: this.getMemorizedAyat() }, true).then(function (results) {
                deferred.resolve(results);
            });

            return deferred.promise;
        },
        isAyaMemorized: function (ayaId) {

            var memorizedAyat = this.getMemorizedAyat();
            return memorizedAyat.indexOf(ayaId);
        },
        isAyaFavourized: function (ayaId) {

            var favourizedAyat = this.getFavourizedAyat();
            return favourizedAyat.indexOf(ayaId);
        },
        getPagesMemorizedAyat: function (pageFrom, pageTo, item) {
            var allAyat;
            if (typeof (item) == "undefined" || typeof (item.allAyat) == "undefined") {
                allAyat = ayatData.getpagesAyat(pageFrom, pageTo);
                if (typeof (item) != "undefined") { item.allAyat = allAyat }
            }
            else {
                allAyat = item.allAyat;
            }

            var memorizedAyat = service.getMemorizedAyat();
            var data = $filter('filter')(allAyat, function (item) {
                return memorizedAyat.indexOf(item.id) > -1
            }, true)
            return data;

        },
        getPagesMemorized: function (pageFrom, pageTo, item) {
            var pages = [];
            var allAyat;
            if (typeof (item) == "undefined" || typeof (item.allAyat) == "undefined") {
                allAyat = ayatData.getpagesAyat(pageFrom, pageTo);
                if (typeof (item) != "undefined") { item.allAyat = allAyat }
            }
            else {
                allAyat = item.allAyat;
            }
            var memorizedAyat = service.getMemorizedAyat();
            for (var i = pageFrom; i <= pageTo; i++) {
                //  var ayat = ayatData.getpagesAyat(i, i);
                var ayat = moshafdata.getPageAyat(i);
                if (memorizedAyat.indexOf(ayat[0].id) > -1 && memorizedAyat.indexOf(ayat[ayat.length - 1].id) > -1) {
                    pages.push(i);
                }
            }
            return pages;
        },
        reinitialize: function () {
            service.userArticles = localStorage.get("MemorizedArticles");
            service.userArticlesFavourite = localStorage.get("FavourizedArticles");
            service.userArticlesFavourite = localStorage.get("FavourizedArticlesTempo");
        }
    }
    return service;
}]);