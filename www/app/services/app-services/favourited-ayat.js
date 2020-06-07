app.factory("favouritedayat", ["localStorage", "ayatData", "$filter", "$timeout", "httpHandler", "$q", function (localStorage, ayatData, $filter, $timeout, httpHandler, $q) {
    var service = {
       userAyat:null,
        storagekey: "Memorized",
            getMemorizedAyat: function () {
                if (service.userAyat == null) {
                    service.userAyat = localStorage.get("Memorized");
                }
                if (service.userAyat == null) {
                    service.userAyat = [];
                }
                //console.log(userAyat);
                return service.userAyat;
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
                        allAyat= ayatData.getSurahAyat(surahId);
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
            getSurahNotMemorizedAyat: function (surahId,item) {
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
                    allAyat  = ayatData.getJuzAyat(juzId);
                    if (typeof (item) != "undefined") { item.allAyat=allAyat }
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
            syncMemorizedAyatLocalToServer: function (id) {
                ;
                var syncAyat = localStorage.get("syncAyat");
                if (syncAyat != undefined) {
                    var deferred = $q.defer();
                    httpHandler.post("UserAyat/SyncMemorizedAyatLocalToServer", { iUserID: id, Ayatid: syncAyat }, true).then(function (results) {
                        deferred.resolve(results);
                    });

                    return deferred.promise;
                }
            },
            syncMemorizedAyatServerToLocal: function () {
                //debugger;
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
            reinitialize: function () {
                service.userAyat = localStorage.get("Memorized");
            }
    }
    return service;
}]);