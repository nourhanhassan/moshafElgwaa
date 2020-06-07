app.factory("ayatData", ["$filter","$q" ,"moshafdata", function ($filter,$q, moshafdata) {


    var service = {

        ayat:[] ,
        //_ayat.sort(function (a, b) {
        //    return a.id - b.id;
        //})
//{"id":1,"juzId":1,"surahId":1,"verse":"﻿بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ","surahIndex":1}
        surahs: [], //"id":1,"name":"الفاتحة","startAyah":1,"endAyah":7
        juzs: [], //{"id":1,"name":"الجزء الأول","startAyah":1,"endAyah":148,"surahs":[1,2]}
        ayatTafseer: [],//{"id":1,"muyassar":"﻿بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"}
        //getSurah: function (surahId) {
        //    var surah = $filter('filter')(service.surahs, { id: parseInt(surahId) }, true)[0];
        //    return surah;
        //},
        firstAyahRept: {},
        getSurah: function (surahId) {
           
            var surah = moshafdata.getSurah(surahId);
            return surah;
        },
        //getjuz: function (juzId) {
        //    var juz = $filter('filter')(service.juzs, { id: parseInt(juzId) }, true)[0];
        //    return juz;
        //},
        getjuz: function (juzId) {
            return moshafdata.getPart(juzId);
        },
        getAya: function (ayaId) {
            var aya = $filter('filter')(service.ayat, { id: ayaId }, true)[0];
            return aya;
        },
        getStAyRep: function () {
            var aya = service.firstAyahRept;
            return aya;
        },
        setStAyRep: function (firstAyahRept) {
            service.firstAyahRept = firstAyahRept;
        },
        //getSurahAyat:function(surahId)
        //{

        //    var surah = service.getSurah(surahId);
        //    console.log(surah);
        //    var surahAyat = service.ayat.slice(surah.startAyah - 1, surah.endAyah );
        //    return surahAyat;
        //},
        getSurahAyat: function (surahId) {
            var surah = service.getSurah(surahId);
            var surahAyat = service.ayat.slice(surah.StartAyah - 1, surah.EndAyah);
            return surahAyat;
        },
        //getJuzAyat:function(juzId)
        //{
        //    var juz = service.getjuz(juzId);
        //    var juzAyat = service.ayat.slice(juz.star   tAyah - 1, juz.endAyah);
        //    return juzAyat;
        //},
        getJuzAyat: function (juzId) {
            var juz = service.getjuz(juzId);
         //   var juzAyat = service.ayat.slice(juz.StartAyah - 1, juz.EndAyah);
            var juzAyat = $filter('filter')(service.ayat, { Juz: juzId },true);

            return juzAyat;
        },
        getJuzData: function (juzId) {
            var juz = service.getjuz(juzId);
            return juz;
        },
        getAyatByIndex: function (start, count) {
            var temp = [];
            for (var i = start ; i < start + count ; i++) {
                temp.push(service.ayat[i]);
            }
            return temp;
            //return angular.copy(service.ayat).splice(start, count);
        }
        ,
        getAyat: function () {
            var deferred = $q.defer();
            moshafdata.getAyat().then(function (result) {
                service.ayat = result.sort(function (a, b) {
                    return a.id - b.id;
                });
                deferred.resolve(service.ayat);
            });
            return deferred.promise;
        },
        getSurahs: function () {
            var deferred = $q.defer();
            moshafdata.getSurahs().then(function (result) {
                
                service.surahs = result;
                deferred.resolve(service.surahs);
            });
            return deferred.promise;
        }
        ,
        getParts: function () {
            var deferred = $q.defer();
            moshafdata.getParts().then(function (result) {
               
                service.juzs = result;
                deferred.resolve(service.juzs);

            });
            return deferred.promise;
        },
        getpagesAyat: function (from, to) {
            service.getAyat();
            //   var juzAyat = service.ayat.slice(juz.StartAyah - 1, juz.EndAyah);
            var pagesAyat = $filter('filter')(service.ayat, { PageNum: from }, true);
            for (i = from + 1; i <= to;i++)
            {
              pagesAyat = pagesAyat.concat($filter('filter')(service.ayat, { PageNum: i }, true));

            }
            //angular.extend(pagesAyat, $filter('filter')(service.ayat, { PageNum: to }, true));
            //pagesAyat.concat($filter('filter')(service.ayat,{ PageNum: to}, true))
            return pagesAyat;
        },
        getSurahByPageId:function(pageNum)
        {
            var page = moshafdata.getSurahByPageId(pageNum);
            return page;
        },
        getPageAyat: function (pageNum) {

            service.getAyat();
            //   var juzAyat = service.ayat.slice(juz.StartAyah - 1, juz.EndAyah);
            var pageAyat = $filter('filter')(service.ayat, { PageNum: pageNum }, true);
            return pageAyat;
        }

    }
    // get quran ayat 
    moshafdata.getAyat().then(function (result) {
        service.ayat = result.sort(function (a, b) {
                return a.id - b.id;
            });
    });

        moshafdata.getSurahs().then(function (result) {
            
            service.surahs = result;

        });
    moshafdata.getParts().then(function (result) {
        
        service.juzs = result;
    });

    return service;

}]);