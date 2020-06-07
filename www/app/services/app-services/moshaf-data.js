app.factory("moshafdata", ["$filter", "$q", "moshafdb", "moshafdbShmr", "moshafdbKalon", "settings", "enums", "moshafdbwarsh", function ($filter, $q, moshafdb, moshafdbShmr, moshafdbKalon, settings, enums, moshafdbwarsh) {

    var service = {
        searchData: {
            searchKey: "",
            searchResult:[]
        },
        surahs:[],
        parts:[],
        ayat: [],
        ayatTafseer:[],
        db: moshafdb.db,
        executeQuery:// moshafdb.executeQuery 
            function (q) {
                var MoshafId = settings.settingsData.MoshafId.toString();
                //console.log(MoshafId);
              if(MoshafId == enums.MoshafId.shamrly)
              {
                  return moshafdbShmr.executeQuery(q);

              } else if (MoshafId == enums.MoshafId.qalon) {

                  return moshafdbKalon.executeQuery(q);
              }

              else if (MoshafId == enums.MoshafId.warsh) {

                  return moshafdbwarsh.executeQuery(q);
              }
              else
              {
                  return moshafdb.executeQuery(q);
              }
          }
        ,
        pageAyat: function (pageNum) {
            var deferred = $q.defer();
            service.executeQuery("select Surah.Id , Surah.Name ,Surah.StartTop  from Surah  where " + pageNum + ">=Surah.StartPage and " + pageNum + "<=Surah.EndPage").then(function (surahs) {
     
                for (var i = 0; i < surahs.length ; i++)
                {
                    (function (j) {
                        var juz = service.parts.filter(function (item) {
                            return pageNum >= item.StartPage && pageNum <= item.EndPage;
                        })[0];
                        surahs[j].JuzName = juz.Name;
                        surahs[j].JuzId = juz.Id;
                        service.executeQuery("select * from Ayah where PageNum=" + pageNum + " and surah=" + surahs[j].Id).then(function (ayat) {
                            surahs[j].ayat = ayat;
                            if(j == surahs.length-1)
                            {
                                
                                deferred.resolve(surahs);
                                
                            }
                        })
                    })(i);
                   
                }
       
            })


            return deferred.promise;
        },
        juzAyat:function(juzId){
            var deferred = $q.defer();
            service.executeQuery("select * from Ayah where juz =" + juzId).then(function (res) {
                deferred.resolve(res);
            })
            return deferred.promise;
        },
        surahAyat: function (surahId) {
            var deferred = $q.defer();
            service.executeQuery("select * from Ayah where surah =" + surahId).then(function (res) {
                deferred.resolve(res);
            })
            return deferred.promise;
        },
        //search in database using search key called from search directive 
        searchInQuran: function (searchKey) {
            var verseSearchKey =service.removeArabicAccent(searchKey);
            var deferred = $q.defer();
            
            service.executeQuery("select * from Ayah where verseClean LIKE '%" + verseSearchKey + "%'").then(function (res) {
                service.searchData = { searchKey: searchKey, searchResult: angular.copy(res) };
                // get all surahs 
                service.getSurahs().then(function () {
                   
                    angular.forEach(service.searchData.searchResult, function (value, key) {
                      
                        var surah = service.getSurah(value.surah);
                        service.searchData.searchResult[key].surahName = surah.Name;
                        service.searchData.searchResult[key].surahType = surah.Type;
                    });
                    deferred.resolve(service.searchData);
                } );
            })
            return deferred.promise;
        },
        // function for remove accent from saerch text and remove (الالف)
        removeArabicAccent: function (value) {
            return value.replace(/[\u0610-\u061A]/gi, '').replace(/[\u064B-\u065F]/gi, '').replace(/[\u06D6-\u06ED]/gi, '').replace(/ٱ/g, "ا")
                .replace(/ٰ/g, "")
            //.replace(/’/g, '').replace(/َ/g, '').replace(/ِ/g, '').replace(/ْ/g, '')
            //   .replace(/ّ/g, '').replace(/ً/g, '').replace(/ٌ/g, '').replace(/ٍ/g, '')
            //   .replace(/ٍ/g, '').replace(/~/g, '').replace(/ُ/g, '').replace(/ۡ/g, '')
            ;
        },
        // function for remove accent from saerch text and not remove (الالف)
        removeArabicAccentWith: function (value) {
            return value.replace(/[\u0610-\u061A]/gi, '').replace(/[\u064B-\u065F]/gi, '').replace(/[\u06D6-\u06ED]/gi, '').replace(/ٱ/g, "ا")
                .replace(/ٰ/g, "ا")
            //.replace(/’/g, '').replace(/َ/g, '').replace(/ِ/g, '').replace(/ْ/g, '')
            //   .replace(/ّ/g, '').replace(/ً/g, '').replace(/ٌ/g, '').replace(/ٍ/g, '')
            //   .replace(/ٍ/g, '').replace(/~/g, '').replace(/ُ/g, '').replace(/ۡ/g, '')
            ;
        },
    getSurah: function (id) {
   
    var surah =  $filter('filter')(service.surahs, { Id: id })[0];
    return surah;
    },
    getSurahName: function (id) {
        var deferred = $q.defer();
        service.getSurahs().then(function () {
            var surah = $filter('filter')(service.surahs, { Id: id })[0];
            deferred.resolve(surah.Name);
        });
        return deferred.promise;
    },
    getSurahs: function () {
       
        var deferred = $q.defer();
        //if (service.surahs.length < 1) {
            service.executeQuery("select * from surah").then(function (res) {
               
                service.surahs = res;
                deferred.resolve(res);
            })
            return deferred.promise;
        //}
        //else {
        //    deferred.resolve(service.surahs);
        //    return deferred.promise;
        //}
},
    getParts: function () { // get all Juzs 
    ;
    var deferred = $q.defer();
    service.executeQuery("select * from Juz").then(function (res) {
        ;
        service.parts=res;
        deferred.resolve(res);
    })
    return deferred.promise;
},
    getAyat: function () { // get all ayat 
  
    var deferred = $q.defer();
    service.executeQuery("select * from Ayah").then(function (res) {
        service.ayat=res;
        deferred.resolve(res);
    })
    return deferred.promise;
    },
    getAyaByID: function (id) { // get all ayat 
        service.getAyat();
        var aya = $filter('filter')(service.ayat, { id: id })[0];
        return aya;
    },
    getAya : function (id,pageNumber) { // get all ayat 
     service.getAyat();
    var aya = $filter('filter')(service.ayat, { id: id ,PageNum:pageNumber})[0];
    return aya;
    },
    getPageAyat: function (pageNumber) { // get all ayat 
        service.getAyat();
        var ayat = $filter('filter')(service.ayat, {PageNum: pageNumber });
        return ayat;
    },
    getPart: function (id) { // get juz by id 
    ;
    var part = $filter('filter')(service.parts, { Id: id})[0];
    return part;
},
    getSurahByPageId: function (pageNumber) {
    ;
    for (var i = 0; i < service.surahs.length; i++) {
        var item = service.surahs[i];
        if (item.StartPage == pageNumber ||(pageNumber>item.StartPage&& pageNumber < item.EndPage)) {
            surah = item;
            break;
        }
    };
    return surah;
},
    getAyatTafseer: function () { // get all ayat 
        ;
        var deferred = $q.defer();
        service.executeQuery("select * from Ayah_Tafseer").then(function (res) {
            ;
            service.ayatTafseer = res;
            deferred.resolve(res);
        })
        return deferred.promise;
    },
    }
  
    return service;
}]);