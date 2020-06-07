app.factory("ayatTafseer", ["$filter","$q" ,"moshafdata", function ($filter,$q, moshafdata) {


    var service = {
        ayatTafseer: [],//{"id":1,"muyassar":"﻿بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"}
        tafseerType : 'muyassar',
        getAyaTafseer: function (ayaId) {
            return $filter('filter')(service.ayatTafseer, { Id: ayaId }, true)[0][service.tafseerType];
        }
    }
    // get quran ayat 
    moshafdata.getAyatTafseer().then(function (result) { /// why and there is function in app.js 
        service.ayatTafseer = result.sort(function (a, b) {
                return a.id - b.id;
            });
    });
    return service;

}]);