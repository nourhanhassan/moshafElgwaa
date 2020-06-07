

app.factory("memorize", ["localStorage", "ayatData", "enums", "target", "$filter", "$timeout", "memorizedayat", "httpHandler", "$q", "moshafdata","settings", function (localStorage, ayatData, enums, target, $filter, $timeout, memorizedayat, httpHandler, $q, moshafdata,settings) {


    var service = {
        getUserId: function () {
            var Profile = localStorage.get("User");
            console.log(Profile)
            if (typeof (Profile) != "undefined" && Profile.iId > 0) { return Profile.iId }
            else { return 0; }
        },

        //select the ayat scheduled to memorize today
        getTodayWerd: function (targetId, targetType) {
            //console.log(target);
            ;
            var targetData = target.data;
            var ayat;
            var todayAyat = [];
            if (targetData.targetType == enums.targetType.sura) {
                ayat = ayatData.getSurahAyat(targetData.surahId);
            }
            else if (targetData.targetType == enums.targetType.page) {
                ayat = ayatData.getpagesAyat(targetData.pageFrom, targetData.pageTo);
            }
            else if (targetData.targetType == enums.targetType.aya) {
                ayat = targetData.allAyat;
            }
            else {
                ayat = ayatData.getJuzAyat(targetData.juzId);
            }
            var today = new Date();
            var date1 = new Date(today.setHours(0, 0, 0, 0))
            var start = new Date(targetData.startDate).setHours(0, 0, 0, 0);
            var date2 = new Date(start);  //targetData.startDate;
            //console.log(date2)
            //console.log(date1)
            if (date2 > date1) {
                todayAyat = 0;
            }
            else {
                var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                var days = Math.ceil(timeDiff / (1000 * 3600 * 24))
                var oldAyat;
                if (timeDiff == 0) {
                    oldAyat = 0;
                    if (targetData.targetType == enums.targetType.sura || targetData.targetType == enums.targetType.aya) {
                        todayAyat = angular.copy(ayat).splice(oldAyat, targetData.ayatCount);
                    }
                    else {
                        var pageFrom = targetData.startPage;
                        var pageTo = targetData.startPage + (days * targetData.PagesCount) - 1;
                        var today_pageFrom = targetData.startPage + (days * targetData.PagesCount);
                        var today_pageTo = today_pageFrom + (days * targetData.PagesCount) - 1;
                        todayAyat = ayatData.getpagesAyat(today_pageFrom, today_pageTo, targetData);
                    }
                }
                else if (targetData.periodType == enums.periodType.daily) {
                    if (targetData.targetType == enums.targetType.sura) {
                        oldAyat = targetData.startAya - 1 + (days * targetData.ayatCount);
                        todayAyat = angular.copy(ayat).splice(oldAyat, targetData.ayatCount);
                    }
                    else if (targetData.targetType == enums.targetType.aya) {
                        oldAyat = targetData.startAyaNum - 1 + (days * targetData.ayatCount);
                        todayAyat = angular.copy(ayat).splice(oldAyat, targetData.ayatCount);
                    }
                    else {
                        var pageFrom = targetData.pageFrom;
                        var pageTo = targetData.pageFrom + (days * targetData.PagesCount) - 1;
                        oldAyat = ayatData.getpagesAyat(pageFrom, pageTo, targetData);
                        var today_pageFrom = targetData.pageFrom + (days * targetData.PagesCount);
                        var today_pageTo = today_pageFrom + (days * targetData.PagesCount) - 1;
                        todayAyat = ayatData.getpagesAyat(today_pageFrom, today_pageTo, targetData);
                    }

                }
                else if (targetData.periodType == enums.periodType.weekly) {
                    var weeks = Math.floor(days / 7);

                    if (targetData.targetType == enums.targetType.sura) {
                        oldAyat = targetData.startAya - 1 + (weeks * targetData.ayatCount);
                        todayAyat = angular.copy(ayat).splice(oldAyat, targetData.ayatCount);
                    }
                    else if (targetData.targetType == enums.targetType.aya) {
                        oldAyat = targetData.startAyaNum - 1 + (weeks * targetData.ayatCount);
                        todayAyat = angular.copy(ayat).splice(oldAyat, targetData.ayatCount);
                    }
                    else {
                        var pageFrom = targetData.pageFrom;
                        var pageTo = targetData.pageFrom + (weeks * targetData.PagesCount) - 1;
                        oldAyat = ayatData.getpagesAyat(pageFrom, pageTo, targetData);
                        var today_pageFrom = targetData.pageFrom + (weeks * targetData.PagesCount);
                        var today_pageTo = today_pageFrom + (weeks * targetData.PagesCount) - 1;
                        todayAyat = ayatData.getpagesAyat(today_pageFrom, today_pageTo, targetData);
                    }
                }
            }
            //console.log("today")
            //console.log(todayAyat);
            return todayAyat;

        },


        addAyaToMemorized: function (id) {

            var userAyat = memorizedayat.getMemorizedAyat();
            if (userAyat.indexOf(id) == -1) {
                // userAyat.push(id);
                memorizedayat.userAyat.push(id);
                localStorage.append("syncAyat", id);
                service.setMemorizedAyat(memorizedayat.userAyat);

            }
            //if (target.data.memorizeMode == enums.memorizeMode.group)
            //{
            var deferred = $q.defer();
            var iid = this.getUserId();
            if (iid != 0) {
                httpHandler.post("UserAyat/AddAyaToUser", { iUserID: this.getUserId(), AyaQuranIndex: id }, false).then(
                function (result) {
                    deferred.resolve(result);
                }
                );
            }
            return deferred.promise;
            //}
            // target.cancelFinishedTargetsNotification();
        },
        addAyaToFavourite: function (id, aya) {////////////////////////////////////////////////////////////////////////////////favourite
            var userAyatFavourized = memorizedayat.getFavourizedAyat();
            if (userAyatFavourized.indexOf(id) == -1) {
                memorizedayat.userAyatFavourite.push(id);
                aya.SurahName = moshafdata.getSurah(aya.surah).Name;
                memorizedayat.userAyatFavouriteTemo.push(aya);
                localStorage.append("syncAyatFav", id);
                service.setMemorizedAyatFavourite(memorizedayat.userAyatFavourite, memorizedayat.userAyatFavouriteTemo);

            }
        },

        removeAyaFromMemorized: function (id) {

            var userAyat = memorizedayat.getMemorizedAyat();
            var ayaIndex = userAyat.indexOf(id);
            if (ayaIndex > -1) {
                userAyat.splice(ayaIndex, 1);
            }
            service.setMemorizedAyat(userAyat);
        },
        removeAyaFromFavourized: function (id) {

            var userAyatFavourized = memorizedayat.getFavourizedAyat();
            var userAyatFavourizedTempo = memorizedayat.getFavourizedAyatTempo();

            var ayaIndex = userAyatFavourized.indexOf(id);
            var ayaTemoIndex = userAyatFavourizedTempo.findIndex(x => x.id ===id);
        
            if (ayaIndex > -1) {
                userAyatFavourized.splice(ayaIndex, 1);
            }
            if (ayaTemoIndex > -1) {
                userAyatFavourizedTempo.splice(ayaTemoIndex, 1);
            }
            service.setMemorizedAyatFavourite(userAyatFavourized, userAyatFavourizedTempo);
        },
        setMemorizedAyat: function (ayatArray) {
            var memorizeAyatStoregeKey = "Memorized_"+settings.settingsData.MoshafId;

            localStorage.set(memorizeAyatStoregeKey, ayatArray);
        },
        setMemorizedAyatFavourite: function (ayatArray, ayatArrayTempo) {
            localStorage.set("Favourized", ayatArray);
            if (ayatArrayTempo != undefined) {
                localStorage.set("FavourizedTempo", ayatArrayTempo);
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
            else if (targetData.targetType == enums.targetType.aya) {
                ayat = targetData.allAyat;
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
            else if (targetData.targetType == enums.targetType.aya) {
                memorized = memorizedayat.getSurahMemorizedAyat(targetData.surahId, targetData);
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