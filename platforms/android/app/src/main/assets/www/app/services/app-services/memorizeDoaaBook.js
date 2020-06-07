//memorizeDoaaBook




app.factory("memorizeDoaaBook", ["localStorage", "enums", "$filter", "$timeout", "memorizedArticles", "httpHandler", "$q", function (localStorage, enums, $filter, $timeout, memorizedArticles, httpHandler, $q) {


    var service = {
        getUserId: function () {
            var Profile = localStorage.get("User");
            console.log(Profile)
            if (typeof (Profile) != "undefined" && Profile.iId > 0) { return Profile.iId }
            else { return 0; }
        },

        //addAyaToMemorized: function (id) {

        //    var userArticles = memorizedArticles.getMemorizedAyat();
        //    if (userAyat.indexOf(id) == -1) {
        //        memorizedayat.userAyat.push(id);
        //        localStorage.append("syncAyat", id);
        //        service.setMemorizedAyat(memorizedayat.userAyat);

        //    }
        //    //if (target.data.memorizeMode == enums.memorizeMode.group)
        //    //{
        //    var deferred = $q.defer();
        //    var iid = this.getUserId();
        //    if (iid != 0) {
        //        httpHandler.post("UserAyat/AddAyaToUser", { iUserID: this.getUserId(), AyaQuranIndex: id }, false).then(
        //        function (result) {
        //            deferred.resolve(result);
        //        }
        //        );
        //    }
        //    return deferred.promise;
        //    //}
        //    // target.cancelFinishedTargetsNotification();
        //},
        addArticleToFavourite: function (article, type, subItemId) {////////////////////////////////////////////////////////////////////////////////favourite
            
            
            var userArticleFavourized = memorizedArticles.getFavourizedArticles();
            var index = userArticleFavourized.indexOf($filter('filter')(userArticleFavourized, { 'ID': article.ID, 'type': type, 'subItemId': subItemId })[0]);

            if (index == -1) {
                if(type==enums.doaaBookmarkType.article){
                    article.type=enums.doaaBookmarkType.article;
                } else if (type == enums.doaaBookmarkType.doaa) {
                    article.type=enums.doaaBookmarkType.doaa;
                }
                article.isFav = true;
                article.subItemId = subItemId;
                memorizedArticles.userArticlesFavourite.push(article);
                //aya.SurahName = moshafdata.getSurah(aya.surah).Name;
                memorizedArticles.userArticlesFavouriteTemo.push(article);
                //localStorage.append("syncAyatFav", id);
                service.setMemorizedArticlesFavourite(memorizedArticles.userArticlesFavourite, memorizedArticles.userArticlesFavouriteTemo);
            }
        },

        //removeAyaFromMemorized: function (id) {

        //    var userAyat = memorizedayat.getMemorizedAyat();
        //    var ayaIndex = userAyat.indexOf(id);
        //    if (ayaIndex > -1) {
        //        userAyat.splice(ayaIndex, 1);
        //    }
        //    service.setMemorizedAyat(userAyat);
        //},
        removeArticleFromFavourized: function (article) {

            var userArticlesFavourized = memorizedArticles.getFavourizedArticles();
            var userArticlesFavourizedTempo = memorizedArticles.getFavourizedArticlesTempo();
            var articleIndex = userArticlesFavourized.indexOf($filter('filter')(userArticlesFavourized, { 'ID': article.ID, 'type': article.type })[0]);
            var articleTemoIndex = userArticlesFavourizedTempo.indexOf($filter('filter')(userArticlesFavourizedTempo, { 'ID': article.ID, 'type': article.type })[0]);
        
            if (articleIndex > -1) {
                userArticlesFavourized.splice(articleIndex, 1);
            }
            if (articleTemoIndex > -1) {
                userArticlesFavourizedTempo.splice(articleTemoIndex, 1);
            }
            service.setMemorizedArticlesFavourite(userArticlesFavourized, userArticlesFavourizedTempo);
        },
        setMemorizedAyat: function (ayatArray) {
            localStorage.set("Memorized", ayatArray);
        },
        setMemorizedArticlesFavourite: function (ayatArray, ayatArrayTempo) {
            localStorage.set("FavourizedArticles", ayatArray);
            if (ayatArrayTempo != undefined) {
                localStorage.set("FavourizedArticlesTempo", ayatArrayTempo);
            }
            
            //else {
            //    localStorage.set("FavourizedTempo", []);
            //}
        },

        getTargetUserAyat: function (targetId, targetType) {
            var deferred = $q.defer();
            var targetData = target.data;
            var werd = service.getTodayWerd();

            var ayat;
            if (targetData.targetType == enums.targetType.sura) {
                ayat = ayatData.getSurahAyat(targetData.surahId);
            }
            else if (targetData.targetType == enums.targetType.page) {
                ayat = ayatData.getpagesAyat(targetData.pageFrom, targetData.pageTo, targetData);
            }
            else {
                ayat = ayatData.getJuzAyat(targetData.juzId);
            }
            var memorized;
            if (targetData.targetType == enums.targetType.sura) {
                memorized = memorizedayat.getSurahMemorizedAyat(targetData.surahId, targetData);
            }
            else if (targetData.targetType == enums.targetType.page) {
                memorized = memorizedayat.getPagesMemorizedAyat(targetData.pageFrom, targetData.pageTo);
            }
            else {
                memorized = memorizedayat.getJuzMemorizedAyat(targetData.juzId, targetData);

            }
            var lastMemorizedAya = Math.max.apply(Math, memorized.map(function (a) { return a.id; }))

            var start = werd == 0 ? 0 : werd.length > 0 ? (lastMemorizedAya > werd[0].id ? werd[0].id : lastMemorizedAya) : lastMemorizedAya;


            var ctask = angular.copy(ayat);

            $filter('filter')(ctask, function (item) {
                item.isChecked = false;
                var memorizedFlag = memorized.map(function (a) { return a.id; }).indexOf(item.id) > -1;
                if (memorizedFlag) {
                    item.isChecked = true;
                }
                if (werd != 0) {
                    var WerdFlag = werd.map(function (a) { return a.id; }).indexOf(item.id) > -1;
                    if (WerdFlag) { item.isWerd = true; }
                    var werdFirst = werd.length > 0 ? werd[0].id : ayat[ayat.length - 1].id;
                    if (item.id < werdFirst && item.isChecked != true) {
                        item.isLate = true;
                    }
                }
                else if (werd.length == 0 && memorized.length < ctask.length) {
                    if (item.isChecked != true) {
                        item.isLate = true;
                    }
                }
                if (item.id == ctask[ctask.length - 1].id) {
                    deferred.resolve(ctask);

                }
                return true;
            }, true)

            return deferred.promise;

        },



    }

    return service;

}]);