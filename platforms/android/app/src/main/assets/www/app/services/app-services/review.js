

app.factory("review", ["localStorage", "ayatData", "enums", "reviewTarget", "$filter", "$timeout", "memorizedayat", "httpHandler", "$q", function (localStorage, ayatData, enums, reviewTarget, $filter, $timeout, memorizedayat, httpHandler, $q) {


    var service = {

        //select the ayat scheduled to memorize today
        getTodayWerd: function (targetId) {
            //console.log(target);
            ;
            var targetData = reviewTarget.data;
            var ayat;
            var todayAyat = [];
            ayat = targetData.ayat;
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
                    //oldAyat =targetData.startAya-1+( days * targetData.ayatCount);
                  oldAyat = (days * targetData.ayatCount);

                    if (ayat.length > oldAyat) {
                    }
                }
                else if (targetData.periodType == enums.periodType.weekly) {
                    var weeks = Math.floor(days / 7);
                    oldAyat = (weeks * targetData.ayatCount);
                }
                //$timeout(function () {
                todayAyat = angular.copy(ayat).splice(oldAyat, targetData.ayatCount);
          
                //}, 200)


            }
            //console.log("today")
            //console.log(todayAyat);
            return todayAyat;

        },


        addAyaToReviewed: function (id,targetId) {
            
            reviewTarget.data = reviewTarget.getTargetByID(targetId);
            var curAya = $filter('filter')(reviewTarget.data.ayat, { id: id }, true)[0];
            var ayaIndex = reviewTarget.data.ayat.indexOf(curAya);
            curAya.isReviewed = true;
            reviewTarget.data.ayat[ayaIndex] = curAya;
            reviewTarget.updateTarget();
        },

        removeAyaFromReviewed: function (id,targetId) {
            
            reviewTarget.data = reviewTarget.getTargetByID(targetId);
            var curAya = $filter('filter')(reviewTarget.data.ayat, { id: id }, true)[0];
            var ayaIndex = reviewTarget.data.ayat.indexOf(curAya);
            curAya.isReviewed = false;
            reviewTarget.data.ayat[ayaIndex] = curAya;
            reviewTarget.updateTarget();
        },
        getTargetUserAyat: function (targetId) {
            //debugger;
            var deferred = $q.defer();
            var targetData = reviewTarget.data;
            var werd = service.getTodayWerd();

            var ayat;
            ayat = targetData.ayat;
            var reviewed;
            reviewed = $filter('filter')(ayat, { isReviewed: true }, true);
            var lastReviewedAya = Math.max.apply(Math, reviewed.map(function (a) { return a.id; }))

            var start = werd == 0 ? 0 : werd.length > 0 ? (lastReviewedAya > werd[0].id ? werd[0].id : lastReviewedAya) : lastReviewedAya;


            var ctask = angular.copy(ayat);

            $filter('filter')(ctask, function (item) {
                debugger;
                item.isReviewed = false;
                var reviewedFlag = reviewed.map(function (a) { return a.id; }).indexOf(item.id) > -1;
                if (reviewedFlag) {
                    item.isReviewed = true;
                }
                if (werd != 0) {
                    var WerdFlag = werd.map(function (a) { return a.id; }).indexOf(item.id) > -1;
                    if (WerdFlag) { item.isWerd = true; }
                    var werdFirst = werd.length > 0 ? werd[0].id : ayat[ayat.length - 1].id;
                    if (item.id < werdFirst && item.isReviewed != true) {
                        item.isLate = true;
                    }
                }
                else if (werd.length == 0 && reviewed.length < ctask.length)
                {
                    if (item.isReviewed != true)
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