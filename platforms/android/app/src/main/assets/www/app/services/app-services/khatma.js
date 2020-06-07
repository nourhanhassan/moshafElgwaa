app.factory("khatma", ["$state", "localStorage", "enums", "localNotification", "groupAdd", "user", "ionicLoading", "guid", "ayatData", "$filter", "memorizedayat", "$rootScope", "settings", function ($state, localStorage, enums, localNotification, groupAdd, user, ionicLoading, guid, ayatData, $filter, memorizedayat, $rootScope, settings) {

    var storageKey = "khatma";
    var service = {
        storageKey: "khatma",
        allTargets: [],
        data: {
            id: null,
            title: "",
            juzId: 1,
            juzEndId:30,
            targetSectionType: 3,
            daysCount: 30,
            progress: 0,
            targetMode: enums.targetMode.werd,
            dayNo:1,
            /////////////////////
            ayatCount: 0,//الورد
            startAya: 1,
            endAya: 6236,
            totalAyatCount:0,
            nextAya: 1,
            finishedAyat: 0,
            ////////////////////
            pagesCount: 1,//الورد 
            startPage: 1,
            endPage: 604,
            totalPagesCount: 0,
            nextPage: 1,
            finishedPages: 0,
            KatmaFinished:0,
            // notificationTime: new Date(),
            startDate: new Date().getTime(),
            notificationDayIndex: 0,
            notificationID: null,
            notificationMode: enums.notificationMode.on,
            notificationTitle: "ايقاف",
            periodType: 1,
            moshafId: settings.settingsData.MoshafId
            //quarterId: 1,
            //partId:1
        },

        //getTargetTitle: function (targetType, surahId, juzId, pageFrom, pageTo) {
        //    try {
        //        var targetTitle = " حفظ ";
        //        if (targetType == enums.targetType.juz) {
        //            targetTitle += ayatData.juzs[juzId - 1].Name;
        //        }
        //        else if (targetType == enums.targetType.page) {
        //            targetTitle += " من صفحة " + $rootScope.getArabicNumber(pageFrom) + " الى " + $rootScope.getArabicNumber(pageTo);
        //        }
        //        else {
        //            targetTitle += "سورة " + ayatData.surahs[surahId - 1].Name;
        //        }
        //        return targetTitle;
        //    }
        //    catch (ex) {
        //        alert(JSON.stringify(ex));
        //    }
        //},

        getNotificationTime: function (startDate, periodType) {
           // this.data.startDate = startDate;
            this.data.periodType = periodType;
            var daysOfWeek = enums.weekDays;
            var notificationTime = "";
            var serNotificationTime = {
                hour: new Date(startDate).getHours(),
                minute: new Date(startDate).getMinutes(),
                ampm: new Date(startDate).getHours() > 11 ? "pm" : "am",
            }

            if (periodType == enums.periodType.weekly) {
                notificationTime = " يوم " + daysOfWeek[new Date(startDate).getDay()].name + " الساعة " + serNotificationTime.minute + " : " + service.getHour(serNotificationTime) + service.getAmPm(serNotificationTime);
                return notificationTime;
            }
            else {
                notificationTime = " الساعة " + serNotificationTime.minute + " : " + service.getHour(serNotificationTime) + service.getAmPm(serNotificationTime);
                return notificationTime;
            }
        },
        getHour: function (serNotificationTime) {
            var hour = serNotificationTime.hour;
            if (hour > 12) {
                hour -= 12;
            }
            if (hour == 0) { hour = 12 }
            return hour;
        },
        getAmPm: function (serNotificationTime) {
            var hour = serNotificationTime.hour;
            var ampm = "ص";
            if (hour >= 12) {
                ampm = "م";
            }
            return ampm;
        },

        //getProgressDays: function (item) {

        //    var noOfDays;
        //    var noOfAyah;
        //    var noOfMemorizedAyat;
        //    if (typeof (item.noOfAyah) == "undefined") {
        //        noOfAyah = service.getTargetAyat(item).length;

        //        item.noOfAyah = noOfAyah;
        //    }
        //    if (item.targetType == enums.targetType.juz) {

        //        noOfMemorizedAyat = memorizedayat.getJuzMemorizedAyat(item.juzId, item).length;
        //    }
        //    else if (item.targetType == enums.targetType.page) {
        //        noOfMemorizedAyat = memorizedayat.getPagesMemorizedAyat(item.pageFrom, item.pageTo, item).length;

        //    }
        //    else {
        //        noOfMemorizedAyat = memorizedayat.getSurahMemorizedAyat(item.surahId, item).length;
        //    }
        //    item.noOfMemorizedAyat = noOfMemorizedAyat;
        //    //}
        //    if (item.periodType == enums.periodType.daily) {
        //        noOfDays = (item.noOfAyah - item.noOfMemorizedAyat) / item.ayatCount;
        //    }
        //    else {
        //        noOfDays = Math.ceil(((item.noOfAyah - item.noOfMemorizedAyat) / item.ayatCount)) * 7;
        //    }
        //    item.noOfDays = Math.ceil(noOfDays);
        //    //  item.noOfMemorizedAyat = noOfMemorizedAyat;
        //    item.progress = Math.ceil((item.noOfMemorizedAyat / item.noOfAyah) * 100);
        //    return item;
        //},

        resetTargetData: function () {
            this.data = {
                targetMode: enums.targetMode.werd,
                id: null,
                title: "",
                juzId: 1,
                juzEndId: 30,
                targetSectionType: 3,
                daysCount: 30,
                progress: 0,
                dayNo: 1,
                /////////////////////
                ayatCount: 0,//الورد
                startAya: 1,
                endAya: 6236,
                totalAyatCount: 0,
                nextAya: 1,
                finishedAyat: 0,
                ////////////////////
                pagesCount: 1,//الورد 
                startPage: 1,
                endPage: 604,
                totalPagesCount: 0,
                nextPage: 1,
                finishedPages: 0,
                // notificationTime: new Date(),
                startDate: new Date().getTime(),
                notificationDayIndex: 0,
                notificationID: null,
                notificationMode: enums.notificationMode.on,
                notificationTitle: "ايقاف",
                periodType: 1,
                moshafId: settings.settingsData.MoshafId
                //quarterId: 1,
                //partId:1
            }


        },

        saveTarget: function (targetData) {
            if (targetData.id == null) //add mode
                {
                    this.addTarget(targetData);
                }
                else { //update mode
                    this.updateTarget(targetData);
                }
                service.resetTargetData();
                $state.go("tab.khatma-list")
        },

        addTarget: function (targetData) {
            targetData.id = guid.generate(); //generate a unique id for the target          
            if (this.data.notificationMode == enums.notificationMode.on) {
                this.saveTargetNotification(targetData);
            }
            var MoshafId = settings.settingsData.MoshafId.toString();
            if (MoshafId == enums.MoshafId.hafstext)
                MoshafId = enums.MoshafId.hafs.toString();
            targetData.moshafId = MoshafId;
            //var key="";
            //if (MoshafId == enums.MoshafId.shamrly) {
            //    key = storageKey + "Shamrly"
            //}
            //else {
            //    key = storageKey;
            //}
            localStorage.append(storageKey, targetData);
        },

        updateTarget: function (targetData) {
            var targetObj = null;
            var MoshafId = settings.settingsData.MoshafId.toString();
            if (MoshafId == enums.MoshafId.hafstext)
                MoshafId = enums.MoshafId.hafs.toString();
            var key = storageKey;
            //if (MoshafId == enums.MoshafId.shamrly) {
            //    key = storageKey + "Shamrly"
            //}
            //else {
            //    key = storageKey;
            //}
            var storedTargets = localStorage.get(storageKey);
            for (var i = 0; i < storedTargets.length; i++) {
                if (storedTargets[i].id == targetData.id) {
                    targetObj = storedTargets[i];
                    break;
                }
            }
            targetData.moshafId = MoshafId;
            angular.copy(targetData, targetObj);
            localStorage.set(key, storedTargets);
            if (targetData.notificationMode == enums.notificationMode.on) {
                this.saveTargetNotification(targetData);
            }

        },

        saveTargetNotification: function (targetData) {
            var notificationTime = new Date(targetData.startDate);
            notificationTime.setSeconds(0);
            notificationTime.setMilliseconds(0);
            if (typeof (cordova) != "undefined") {
                var frequency = "day";
                if (targetData.periodType == enums.periodType.weekly) {
                    frequency = "week";
                }
                var notification = {
                    smallIcon: 'icon',
                    icon: 'icon',
                    title: "تذكير بموعد ختمة " ,
                    text: "تذكير ختمة " + targetData.title,
                    data: {
                        targetData: targetData
                    },

                }
                //If the target already has notification id, then override it
                if (targetData.notificationID) {
                    notification.id = targetData.notificationID;
                }

                localNotification.scheduleRepeatedNotification(notification, frequency,
                notificationTime
                ).then(function (res) {

                    alert("notification saved " + notification.id);

                });
                targetData.notificationID = notification.id;
            }

        },

        cancelNotification: function (targetData) {

            if (!targetData.notificationId) {
                notificationID = targetData.notificationID;
            }
            return localNotification.cancelNotification(targetData.notificationID);
        },

        clearTargets: function () {
            //var MoshafId = settings.settingsData.MoshafId.toString();
            //var key = "";
            //if (MoshafId == enums.MoshafId.shamrly) {
            //    storageKey = storageKey + "Shamrly"
            //}
            //else {
            //    key = storageKey;
            //}
            localStorage.remove(storageKey);
            alert("canceling notification");
            service.cancelNotification(targetData).then(function (res) {
                alert("notification cancelled" + JSON.stringify(res));
            });

        },

        getAllTargets: function () {
            var MoshafId = settings.settingsData.MoshafId.toString();
            if (MoshafId == enums.MoshafId.hafstext)
                MoshafId = enums.MoshafId.hafs.toString();
            //var key = "";
            //if (MoshafId == enums.MoshafId.shamrly) {
            //    key = storageKey + "Shamrly"
            //}
            //else {
            //    key = storageKey;
            //}
            var test = localStorage.get(storageKey);
            test = $filter('filter')(test, { moshafId: MoshafId }, true);
            return test;
        },

        getTargetByID: function (id) {
            //var MoshafId = settings.settingsData.MoshafId.toString();
            //var key = "";
            //if (MoshafId == enums.MoshafId.shamrly) {
            //    key = storageKey + "Shamrly"
            //}
            //else {
            //    key = storageKey;
            //}
            var storedTargets = localStorage.get(storageKey);
            var res;
            for (var i = 0; i < storedTargets.length; i++) {
                if (storedTargets[i].id == id) {
                    return storedTargets[i];
                    break;
                }
            }
        },

        getTargetAyat: function (targetData) {
            ;
            if (targetData.targetType == enums.targetType.juz) {
                return ayatData.getJuzAyat(targetData.juzId);
            }
            else if (targetData.targetType == enums.targetType.page) {
                return ayatData.getpagesAyat(targetData.pageFrom, targetData.pageTo);

            }
            else {
                return ayatData.getSurahAyat(targetData.surahId);
            }
        },

        setTargetByID: function (id) {
            //var MoshafId = settings.settingsData.MoshafId.toString();
            //var key = "";
            //if (MoshafId == enums.MoshafId.shamrly) {
            //    storageKey = storageKey + "Shamrly"
            //}
            //else {
            //    key = storageKey;
            //}
            var storedTargets = localStorage.get(storageKey);
            var res;
            for (var i = 0; i < storedTargets.length; i++) {
                if (storedTargets[i].id == id) {
                    service.data = storedTargets[i]
                    return storedTargets[i];
                    break;
                }

            }
        },

        cancelFinishedTargetsNotification: function () {
            var allTargets = service.getAllTargets();
            for (var i = 0 ; i < allTargets.length ; i++) {
                if (allTargets[i].isDone == true) {
                    service.cancelNotification(allTargets[i]);
                }
            }
        },

        deleteTarget: function (targetData) {
            //var MoshafId = settings.settingsData.MoshafId.toString();
            var key = storageKey;
            //if (MoshafId == enums.MoshafId.shamrly) {
            //    key = storageKey + "Shamrly"
            //}
            //else {
            //    key = storageKey;
            //}
            var storedTargets = localStorage.get(storageKey);
            for (var i = 0; i < storedTargets.length; i++) {
                if (storedTargets[i].id == targetData.id) {
                    storedTargets.splice(i, 1);
                    break;
                }
            } 
            localStorage.set(key, storedTargets);
            service.cancelNotification(targetData);
        },
    }
    return service;
}]);