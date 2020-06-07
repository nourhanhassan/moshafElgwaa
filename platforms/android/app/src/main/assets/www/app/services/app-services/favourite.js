

app.factory("memorize", ["localStorage", "ayatData", "enums", "target", "$filter", "$timeout", "memorizedayat", "httpHandler","$q" ,function (localStorage, ayatData, enums, target, $filter, $timeout, memorizedayat, httpHandler,$q) {


    var service = {

        //select the ayat scheduled to memorize today
        getTodayWerd: function (targetId, targetType) {
            //console.log(target);
            ;
            var targetData = target.data;
            var ayat;
            var todayAyat = [];
            if (targetData.targetType == enums.targetType.sura)
            {
                ayat = ayatData.getSurahAyat(targetData.surahId);
            }
            else if (targetData.targetType == enums.targetType.page)
            {
                ayat = ayatData.getpagesAyat(targetData.pageFrom, targetData.pageTo);
            }
            else{
                ayat = ayatData.getJuzAyat(targetData.juzId);
            }
            var today = new Date();
            var date1 = new Date(today.setHours(0, 0, 0, 0))
            var start = new Date(targetData.startDate).setHours(0, 0, 0, 0);
            var date2 = new Date(start);  //targetData.startDate;
            //console.log(date2)
            //console.log(date1)
            if (date2 > date1) {
                todayAyat= 0;
            }
            else {
                var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                var days = Math.ceil(timeDiff / (1000 * 3600 * 24))
                var oldAyat;
                if (timeDiff == 0)
                {
                    oldAyat = 0;
                }
              else  if (targetData.periodType == enums.periodType.daily) {
                    oldAyat =targetData.startAya-1+( days * targetData.ayatCount);

                    if (ayat.length > oldAyat) {
                    }
                }
                else if (targetData.periodType == enums.periodType.weekly) {
                    var weeks = Math.floor(days / 7);
                    oldAyat = targetData.startAya - 1 + (weeks * targetData.ayatCount);
                }
                //$timeout(function () {
                todayAyat = angular.copy(ayat).splice(oldAyat, targetData.ayatCount);
          
                //}, 200)


            }
            //console.log("today")
            //console.log(todayAyat);
            return todayAyat;

        },


        addAyaToMemorized: function (id) {
            
            var userAyat = memorizedayat.getMemorizedAyat();
            if(userAyat.indexOf(id)==-1)
            {
               // userAyat.push(id);
                memorizedayat.userAyat.push(id);
                localStorage.append("syncAyat", id);
                service.setMemorizedAyat(memorizedayat.userAyat);

            }
            if (target.data.memorizeMode == enums.memorizeMode.group)
            {
                var deferred = $q.defer();
                httpHandler.post("UserAyat/AddAyaToUser", { Ayaid:id
                }, false).then(
                
                    function (result) {
                        deferred.resolve(result);
                    }
                    );
                return deferred.promise;
            }
           // target.cancelFinishedTargetsNotification();
        },

        removeAyaFromMemorized: function (id) {
            
            var userAyat = memorizedayat.getMemorizedAyat();
            var ayaIndex =userAyat.indexOf(id); 
            if (ayaIndex > -1) {
                userAyat.splice(ayaIndex,1);
            }
            service.setMemorizedAyat(userAyat);
        },
        setMemorizedAyat: function (ayatArray) {
            localStorage.set("Memorized", ayatArray);
        },

        getTargetUserAyat: function (targetId, targetType) {
            //debugger;
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
                debugger;
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
                else if (werd.length == 0 && memorized.length < ctask.length)
                {
                    if(item.isChecked != true)
                    {
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