app.factory("memorizedayat", ["localStorage", "ayatData", "$filter", "$timeout", "httpHandler", "$q", "moshafdata", "user", "settings", function (localStorage, ayatData, $filter, $timeout, httpHandler, $q, moshafdata, user, settings) {
    var service = {
        userAyat: null,
        userAyatFavourite: null,
        userAyatFavouriteTemo: [],
        storagekey: "Memorized_" + settings.settingsData.MoshafId,
        getMemorizedAyat: function () {
            service.storagekey= "Memorized_" + settings.settingsData.MoshafId;
            //if (service.userAyat == null) {
                service.userAyat = localStorage.get(service.storagekey);
            //}
            if (service.userAyat == null) {
                service.userAyat = [];
            }
            //console.log(userAyat);
            return service.userAyat;
        },
        getFavourizedAyat: function () {

            //if (service.userAyatFavourite == null || service.userAyatFavourite.length == 0) {
            //    service.userAyatFavourite = [];
            //    service.userAyatFavouriteTemo = [];
            //}
            //else {
                service.userAyatFavourite = localStorage.get("Favourized");
                service.userAyatFavouriteTemo = localStorage.get("FavourizedTempo");
                if (typeof (service.userAyatFavourite) == "undefined" || typeof(service.userAyatFavouriteTemo) == "undefined") {
                service.userAyatFavourite = [];
                service.userAyatFavouriteTemo = [];
            }
            //}
            //console.log(userAyat);
            return service.userAyatFavourite;
        },
        getFavourizedAyatTempo: function () {

            if (service.userAyatFavourite == null || service.userAyatFavourite.length == 0) {

                service.userAyatFavouriteTemo = [];
            }
            else {

                service.userAyatFavouriteTemo = localStorage.get("FavourizedTempo");
            }

            return service.userAyatFavouriteTemo;
        },

        //getMemorizedAyatid: function () {

        //    var userAyat = this.getMemorizedAyat();
        //    ayatIndex = [];
        //    angular.forEach(userAyat, function (item, key) {
        //        ayatIndex.push(item.id);
        //    });
        //    ////console.log(userAyat);
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
                if (ayat.length > 0) {
                    if (memorizedAyat.indexOf(ayat[0].id) > -1 && memorizedAyat.indexOf(ayat[ayat.length - 1].id) > -1) {
                        pages.push(i);
                    }
                    else {
                        break;
                    }
                }
            }
            return pages;
        },
        syncMemorizedAyatLocalToServer: function (id) {
            ;
            var syncAyat = localStorage.get("syncAyat");
            if (syncAyat != undefined) {
                var deferred = $q.defer();
                httpHandler.post("UserAyat/SyncMemorizedAyatLocalToServer", { iUserID: user.data.profile.id, Ayatid: syncAyat }, true).then(function (results) {
                    deferred.resolve(results);
                });

                return deferred.promise;
            }
        },
        syncMemorizedAyatServerToLocal: function () {
            var deferred = $q.defer();
            httpHandler.post("UserAyat/SyncMemorizedAyatServerToLocal", { Ayatid: this.getMemorizedAyat() }, true).then(function (results) {
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
                var ayat = ayatData.getPageAyat(i);
                if(ayat.length>0)
                if (memorizedAyat.indexOf(ayat[0].id) > -1 && memorizedAyat.indexOf(ayat[ayat.length - 1].id) > -1) {
                    pages.push(i);
                }
            }
            return pages;
        },
        reinitialize: function () {
            service.userAyat = localStorage.get("Memorized");
            service.userAyatFavourite = localStorage.get("Favourized");
            service.userAyatFavourite = localStorage.get("FavourizedTempo");
        }
    }
    return service;
}]);