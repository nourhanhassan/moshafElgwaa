app.factory("target", ["$state", "localStorage", "enums", "localNotification", "groupAdd", "user", "ionicLoading", "guid", "ayatData", "$filter", "memorizedayat", "$rootScope", "settings", function ($state, localStorage, enums, localNotification, groupAdd, user, ionicLoading, guid, ayatData, $filter, memorizedayat, $rootScope, settings) {

    var storagekey = "targets";


    var service = {
        storagekey: "targets",
        allTargets: [],
        data: {
            id: null,
            memorizeMode: "",
            targetType: 1,
            ayatCount: 5,
            surahId: 1,
            juzId: 1,
            title: "",
            memorizeStatus: enums.memorizeStatus.loadingMemorize,
            periodType: 1,
            // notificationTime: new Date(),
            notificationDayIndex: 0,
            startDate: new Date().getTime(),
            notificationID: null,
            notificationMode: enums.notificationMode.on,
            notificationTitle: "ايقاف",
            progress: 0,
            startPage: 1,
            endPage: 1,
            startAya: 1,
            targetMode: 1,
            PagesCount: 1,
            selectedAyahStart: {},
            selectedAyahEnd: {},
            startAyaNum: 1,
            endAyaNum: 1,
            moshafId: settings.settingsData.MoshafId.toString() == enums.MoshafId.hafstext ? enums.MoshafId.hafs.toString() : settings.settingsData.MoshafId.toString(),
        },

        getTargetTitle: function (targetType, surahId, juzId, pageFrom, pageTo, surahFrom, ayaFrom, surahTo, ayaTo) {
            try {
                var targetTitle = " حفظ ";
                if (targetType == enums.targetType.juz) {
                    targetTitle += ayatData.juzs[juzId - 1].Name;
                    //targetTitle += " من صفحة " + $rootScope.getArabicNumber(pageFrom) + " الى " + $rootScope.getArabicNumber(pageTo);
                }
                else if (targetType == enums.targetType.page) {
                    targetTitle += " من صفحة " + $rootScope.getArabicNumber(pageFrom) + " الى " + $rootScope.getArabicNumber(pageTo);
                }
                else if (targetType == enums.targetType.aya) {
                    targetTitle += "سورة " + ayatData.surahs[surahFrom - 1].Name + " من آية " + $rootScope.getArabicNumber(ayaFrom)
                        + " الى سورة " + ayatData.surahs[surahTo - 1].Name + "  آية " + $rootScope.getArabicNumber(ayaTo);
                }
                else {
                    targetTitle += "سورة " + ayatData.surahs[surahId - 1].Name;
                }
                return targetTitle;
            }
            catch (ex) {
                alert(JSON.stringify(ex));
            }
        },

        getNotificationTime: function (startDate, periodType) {

            var daysOfWeek = enums.weekDays;
            var notificationTime = "";
            var serNotificationTime = {
                hour: new Date(this.data.startDate).getHours(),
                minute: new Date(this.data.startDate).getMinutes(),
                ampm: new Date(this.data.startDate).getHours() > 11 ? "pm" : "am",
            }

            if (periodType == enums.periodType.weekly) {
                notificationTime = " يوم " + daysOfWeek[new Date(this.data.startDate).getDay()].name + " الساعة " + serNotificationTime.minute + " : " + service.getHour(serNotificationTime) + service.getAmPm(serNotificationTime);
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
        getProgressDays: function (item) {
            var noOfDays;
            var noOfAyah;
            var noOfMemorizedAyat;
            var noOfPage;
            var noOfMemorizedPages;
            if (item.targetType == enums.targetType.sura) {
                if (typeof (item.noOfAyah) == "undefined") {
                    noOfAyah = service.getTargetAyat(item).length;

                    item.noOfAyah = noOfAyah;
                }
            }
            else {
                if (typeof (item.noOfPage) == "undefined") {
                    noOfPage = service.getTargetPages(item);
                    item.noOfPage = noOfPage;
                }
            }
            if (item.targetType == enums.targetType.juz) {
                noOfMemorizedPages = memorizedayat.getJuzMemorizedPages(item.juzId, item).length;
                item.noOfMemorizedPages = noOfMemorizedPages;
                if (item.periodType == enums.periodType.daily) {
                    noOfDays = (item.noOfPage - item.noOfMemorizedPages) / item.PagesCount;
                    item.noOfDays = Math.ceil(noOfDays);
                }
                else {
                    noOfDays = Math.ceil(((item.noOfPage - item.noOfMemorizedPages) / item.PagesCount)) * 7;
                    item.noOfDays = Math.ceil(noOfDays);
                }
                item.progress = Math.ceil((item.noOfMemorizedPages / item.noOfPage) * 100);
            }
            else if (item.targetType == enums.targetType.page) {
                noOfMemorizedPages = memorizedayat.getPagesMemorized(item.pageFrom, item.pageTo, item).length;
                item.noOfMemorizedPages = noOfMemorizedPages;
                if (item.periodType == enums.periodType.daily) {
                    noOfDays = (item.noOfPage - item.noOfMemorizedPages) / item.PagesCount;
                    item.noOfDays = Math.ceil(noOfDays);
                }
                else {
                    noOfDays = Math.ceil(((item.noOfPage - item.noOfMemorizedPages) / item.PagesCount)) * 7;
                    item.noOfDays = Math.ceil(noOfDays);
                }
                item.progress = Math.ceil((item.noOfMemorizedPages / item.noOfPage) * 100);
            }
            else {
                if (item.targetType == enums.targetType.aya)
                    item.surahId = item.startSoura;
                noOfMemorizedAyat = memorizedayat.getSurahMemorizedAyat(item.surahId, item).length;
                item.noOfMemorizedAyat = noOfMemorizedAyat;
                if (item.periodType == enums.periodType.daily) {
                    noOfDays = (item.noOfAyah - item.noOfMemorizedAyat) / item.ayatCount;
                    item.noOfDays = Math.ceil(noOfDays);
                }
                else {
                    noOfDays = Math.ceil(((item.noOfAyah - item.noOfMemorizedAyat) / item.ayatCount)) * 7;
                    item.noOfDays = Math.ceil(noOfDays);
                }
                item.progress = Math.ceil((item.noOfMemorizedAyat / item.noOfAyah) * 100);
            }
            item.noOfMemorizedAyat = noOfMemorizedAyat;
            item.noOfMemorizedPages = noOfMemorizedPages;
            item.noOfDays = Math.ceil(noOfDays);
            return item;
        },
        resetTargetData: function () {
            this.data = {

                id: null,
                memorizeMode: "",
                targetType: 1,
                ayatCount: 5,
                surahId: 1,
                juzId: 1,
                notificationMode: enums.notificationMode.on,
                periodType: 1,
                // notificationTime: new Date(),
                notificationDayIndex: 0,
                notificationTitle: "ايقاف",
                startDate: new Date().getTime(),
                notificationID: null,
                startPage: 1,
                endPage: 1,
                startAya: 1,
                targetMode: 1,
                PagesCount: 1,
                selectedAyahStart: {},
                selectedAyahEnd: {},
                startAyaNum: 1,
                endAyaNum: 1,
                title: "",
                moshafId: settings.settingsData.MoshafId.toString() == enums.MoshafId.hafstext ? enums.MoshafId.hafs.toString() : settings.settingsData.MoshafId.toString(),
            }


        },


        saveTarget: function () {


            // alert("saving");

            if (this.data.memorizeMode == enums.memorizeMode.individual) {
                alert("individual");
                if (this.data.id == null) //add mode
                {
                    //var memorized= 0;
                    //if (this.data.targetType == enums.targetType.juz)
                    //{
                    //    memorized = memorizedayat.getJuzMemorizedAyat(this.data.juzId,this.data);

                    //}
                    //else {
                    //    memorized = memorizedayat.getSurahMemorizedAyat(this.data.surahId,this.data);

                    //}
                    //if (memorized.length > 0) {
                    //    this.data.startAya = memorized[memorized.length - 1].id + 1;
                    //}
                    //else {
                    this.data.startAya = 1;
                    //}
                    this.addTarget();
                }
                else { //update mode
                    this.updateTarget();
                }
                service.resetTargetData();
                $state.go("target-list")
            }


            else {
                alert("save group");
               
                alert(groupAdd.data.members);
                if (this.data.targetType == enums.targetType.juz) {
                    var juz = ayatData.getjuz(this.data.juzId);
                    this.data.startPage = juz.StartPage;
                    this.data.endPage = juz.EndPage;
                    this.data.startAya = juz.StartAyah;
                    this.data.endAya = juz.EndAyah;

                }
                else if (this.data.targetType == enums.targetType.page) {
                    juz = ayatData.getjuz(this.data.juzId);
                    var targetStartAya= ayatData.getPageAyat(this.data.pageFrom)[0].id;
                    var lastIndex = ayatData.getPageAyat(this.data.pageTo).length -1;
                    var targetEndAya = ayatData.getPageAyat(this.data.pageTo)[lastIndex].id;
                    this.data.startPage = this.data.pageFrom;
                    this.data.endPage = this.data.pageTo;
                    this.data.startAya = targetStartAya;//juz.StartAyah;
                    this.data.endAya = targetEndAya;//juz.EndAyah;
                }
                else if (this.data.targetType == enums.targetType.aya) {
                    this.data.startAya = this.data.selectedAyahStart.id;
                    this.data.endAya = this.data.selectedAyahEnd.id;
                    this.data.startPage = this.data.selectedAyahStart.PageNum;
                    this.data.endPage = this.data.selectedAyahEnd.PageNum;
                    this.data.endSurah = this.data.selectedAyahEnd.surah;
                    this.data.ayatCount = this.data.noOfAyah;
                }
            else {
                var surah = ayatData.getSurah(this.data.surahId);
                this.data.startPage = surah.StartPage;
                this.data.endPage = surah.EndPage
                this.data.startAya = surah.StartAyah;
                this.data.endAya = surah.EndAyah;
                }
                this.data.title = service.getTargetTitle(this.data.targetType,
          this.data.surahId,
          this.data.juzId,
          this.data.startPage,
          this.data.endPage,
          this.data.startSoura, this.data.startAyaNum, this.data.endSoura, this.data.endAyaNum
          )
                this.saveTargetNotification();
                groupAdd.addGroup(groupAdd.data.id, user.data.profile.id, groupAdd.data.name, groupAdd.data.members, this.data.targetType, this.data.periodType, this.data.juzId, this.data.surahId
                    , this.data.ayatCount, this.data.startDate, this.data.notificationID, this.data.startPage, this.data.endPage, this.data.PagesCount, this.data.startAya, this.data.endAya, this.data.endSurah).then(function (result) {
                        if (result != 0) {
                            ionicLoading.showMessage("تم حفظ بيانات المجموعة بنجاح").then(function () {
                                $state.go("group")
                            });
                        }
                        else {
                            alert("error");
                        }

                    });
                groupAdd.resetData();
                service.resetTargetData();
            }




        },

        addTarget: function () {
            // alert(this.data.notificationMode);
            this.data.id = guid.generate(); //generate a unique id for the target
            if (this.data.targetType == enums.targetType.juz) {
                var juz = ayatData.getjuz(this.data.juzId);
                this.data.startPage = juz.StartPage;
                this.data.endPage = juz.EndPage
            }
            else if (this.data.targetType == enums.targetType.page) {
                this.data.startPage = this.data.pageFrom;
                this.data.endPage = this.data.pageTo;
            }
            else if(this.data.targetType == enums.targetType.aya) {
                this.data.startAya = this.data.selectedAyahStart.ayahNum;
                this.data.startPage = this.data.selectedAyahStart.PageNum;
                this.data.endPage = this.data.selectedAyahEnd.PageNum;
            }
            else {
                var surah = ayatData.getSurah(this.data.surahId);
                this.data.startPage = surah.StartPage;
                this.data.endPage = surah.EndPage
            }
            if (this.data.notificationMode == enums.notificationMode.on) {
                this.saveTargetNotification();
            }
            this.data.title = service.getTargetTitle(this.data.targetType,
                this.data.surahId,
                this.data.juzId,
                this.data.startPage,
                this.data.endPage,
                this.data.startSoura, this.data.startAyaNum, this.data.endSoura, this.data.endAyaNum
                )
            var MoshafId = settings.settingsData.MoshafId.toString();
            var key = "";
           
            //var key = storagekey + "_" + MoshafId;
            if (MoshafId == enums.MoshafId.hafstext) {
                key = storagekey + "_" + enums.MoshafId.hafs.toString();
            }
            else {
                key = storagekey + "_" + MoshafId;
            }
            localStorage.append(key, this.data);

        },

        updateTarget: function () {
            var targetObj = null;
            var MoshafId = settings.settingsData.MoshafId.toString();
            var key = "";
            //if (MoshafId == enums.MoshafId.shamrly) {
            //    key = storagekey + "Shamrly"
            //}
            //else {
           //var key= storagekey + "_" + MoshafId;
            //}
            if (MoshafId == enums.MoshafId.hafstext) {
                key = storagekey + "_" + enums.MoshafId.hafs.toString();
            }
            else {
                key = storagekey + "_" + MoshafId;
            }
            var storedTargets = localStorage.get(key);

            for (var i = 0; i < storedTargets.length; i++) {
                if (storedTargets[i].id == this.data.id) {
                    //alert(this.data.notificationMode)
                    targetObj = storedTargets[i];
                    break;
                }

            }
            if (this.data.notificationMode == enums.notificationMode.on) {
                this.saveTargetNotification();
            }
            angular.copy(this.data, targetObj);
            localStorage.set(key, storedTargets);
            //alert("notification mode"+ this.data.notificationMode)
   

        },

        saveTargetNotification: function () {
            var targetText = ""
            if (service.data.targetType == enums.targetType.page || service.data.targetType == enums.targetType.juz)
            {
                targetText = "تذكير بحفظ ورد عدد " + service.data.PagesCount + " صفحات "
            }
            else
                targetText = "تذكير بحفظ ورد عدد " + service.data.ayatCount + "ايات" ;
            var targetTitle = this.getTargetTitle(service.data.targetType,
                service.data.surahId,
                service.data.juzId,
                service.data.startPage,
                service.data.endPage,
                service.data.startSoura, service.data.startAyaNum, service.data.endSoura, service.data.endAyaNum
                );
            var notificationTime = new Date(this.data.startDate);
            notificationTime.setSeconds(0);
            notificationTime.setMilliseconds(0);
                var frequency = "day";
                if (this.data.periodType == enums.periodType.weekly) {
                    frequency = "week";
                }
            if (typeof (cordova) != "undefined") {
                var notification = {
                    smallIcon: 'icon',
                    icon: 'icon',
                    title: "تذكير بموعد حفظ ورد " + targetTitle,
                    //text: "يوم" + new Date(this.data.startDate).getDate() + " الساعة " + new Date(this.data.startDate).getHours() + " : " + new Date(this.data.startDate).getMinutes(),
                    text: targetText,
                    data: {
                        targetData: service.data
                    },

                }
                //If the target already has notification id, then override it
                if (this.data.notificationID) {
                    notification.id = this.data.notificationID;
                }

                localNotification.scheduleRepeatedNotification(notification, frequency,
                notificationTime
                ).then(function (res) {

                    alert("notification saved " + notification.id);

                });
                service.data.notificationID = notification.id;
            }

        },

        cancelNotification: function (notificationId) {

            if (!notificationId) {
                notificationId = this.data.notificationID;
            }
            //   alert(notificationId);
            return localNotification.cancelNotification(notificationId);
        },

        clearTargets: function () {
            var MoshafId = settings.settingsData.MoshafId.toString();
            var key = "";
            //if (MoshafId == enums.MoshafId.shamrly) {
            //    key = storagekey + "Shamrly"
            //}
            //else {
            //var key = storagekey + "_" + MoshafId;
            //}
            if (MoshafId == enums.MoshafId.hafstext) {
                key = storagekey + "_" + enums.MoshafId.hafs.toString();
            }
            else {
                key = storagekey + "_" + MoshafId;
            }
            localStorage.remove(key);
            alert("canceling notification");
            service.cancelNotification(this.data.notificationID).then(function (res) {
                alert("notification cancelled" + JSON.stringify(res));
            });

        },

        getAllTargets: function () {
            var MoshafId = settings.settingsData.MoshafId.toString();
            var key = "";
            //if (MoshafId == enums.MoshafId.shamrly) {
            //    key = storagekey + "Shamrly"
            //}
            //else {
            if (MoshafId == enums.MoshafId.hafstext) {
                key = storagekey + "_" + enums.MoshafId.hafs.toString();
            }
            else
            {
                 key = storagekey + "_" + MoshafId;
            }
            //}
            var test = localStorage.get(key);
            //if (MoshafId == enums.MoshafId.hafs)
            //{
            //    key = storagekey + "_" + enums.MoshafId.hafstext.toString();
            //    test.append(localStorage.get(key));
            //}
            //else if (MoshafId == enums.MoshafId.hafstext)
            //{
            //    key = storagekey + "_" + enums.MoshafId.hafstext.toString();
            //    test.append(localStorage.get(key));
            //}
            angular.forEach(test, function (item, key) {
                item.title = service.getTargetTitle(item.targetType,
                    item.surahId,
                    item.juzId,
                    item.startPage,
                    item.endPage,
                     item.startSoura, item.startAyaNum, item.endSoura, item.endAyaNum
                    );
                item = service.getProgressDays(item);
                if (item.progress == 100) {
                    item.isDone = true;
                    item.memorizeStatusName = "تم الحفظ";
                }
                else {
                    item.isDone = false;
                    item.memorizeStatusName = "جاري الحفظ";
                }
                if (item.notificationMode == enums.notificationMode.on)
                    item.notificationTitle = "ايقاف";
                else
                    item.notificationTitle = "تشغيل";
                test[key] = item;
            });
            //this.data.title = this.getTargetTitle(t.targetType,t.surahId,t.juzId);
            //localStorage.append(storagekey, this.data);
            //;
            return test;
        },


        getTargetByID: function (id) {
            var MoshafId = settings.settingsData.MoshafId.toString();
            var key = "";
            //if (MoshafId == enums.MoshafId.shamrly) {
            //    key = storagekey + "Shamrly"
            //}
            //else {
            //    key = storagekey;
            //}
            if (MoshafId == enums.MoshafId.hafstext) {
                key = storagekey + "_" + enums.MoshafId.hafs.toString();
            }
            else {
                key = storagekey + "_" + MoshafId;
            }
            var storedTargets = localStorage.get(key);
            var res;
            for (var i = 0; i < storedTargets.length; i++) {
                if (storedTargets[i].id == this.data.id) {
                    storedTargets[i].title = service.getTargetTitle(storedTargets[i].targetType,
                        storedTargets[i].surahId, storedTargets[i].juzId, storedTargets[i].pageFrom,
                        storedTargets[i].pageTo,
                        storedTargets[i].startSoura, storedTargets[i].startAyaNum, storedTargets[i].endSoura, storedTargets[i].endAyaNum);

                    return storedTargets[i];
                    break;
                }

            }

        },


        getTargetAyat: function (targetData) {

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

        getTargetPages: function (targetData) {

            if (targetData.targetType == enums.targetType.juz) {
                var juz = ayatData.getJuzData(targetData.juzId)
                return juz.EndPage - juz.StartPage + 1;
            }
            else if (targetData.targetType == enums.targetType.page) {
                return targetData.pageTo - targetData.pageFrom + 1;

            }

            return 1;

        },
        setTargetByID: function (id) {
            var MoshafId = settings.settingsData.MoshafId.toString();
            var key = "";
            //if (MoshafId == enums.MoshafId.shamrly) {
            //    key = storagekey + "Shamrly"
            //}
            //else {
            //    key = storagekey;
            //}
            if (MoshafId == enums.MoshafId.hafstext) {
                key = storagekey + "_" + enums.MoshafId.hafs.toString();
            }
            else {
                key = storagekey + "_" + MoshafId;
            }
            var storedTargets = localStorage.get(key);
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
                    service.cancelNotification(allTargets[i].notificationID);
                }
            }
        },
        deleteTarget: function () {
            var MoshafId = settings.settingsData.MoshafId.toString();
            var key = "";
            //if (MoshafId == enums.MoshafId.shamrly) {
            //    key = storagekey + "Shamrly"
            //}
            //else {
            //    key = storagekey;
            //}
            if (MoshafId == enums.MoshafId.hafstext) {
                key = storagekey + "_" + enums.MoshafId.hafs.toString();
            }
            else {
                key = storagekey + "_" + MoshafId;
            }
            var storedTargets = localStorage.get(key);

            for (var i = 0; i < storedTargets.length; i++) {
                if (storedTargets[i].id == this.data.id) {
                    //alert(this.data.notificationMode)
                    storedTargets.splice(i, 1);
                    break;
                }

            }
            localStorage.set(key, storedTargets);
            service.cancelNotification(this.data.notificationID);

        },
        //setTargetPages: function (targetData) {

        //}
        getTargetsByMoshafId: function () {
            var MoshafId = settings.settingsData.MoshafId.toString();
            if (MoshafId == enums.MoshafId.hafstext)
                MoshafId = enums.MoshafId.hafs.toString();
            var key = "";
            //if (MoshafId == enums.MoshafId.shamrly) {
            //    key = storagekey + "Shamrly"
            //}
            //else {
            //    key = storagekey;
            //}
            if (MoshafId == enums.MoshafId.hafstext) {
                key = storagekey + "_" + enums.MoshafId.hafs.toString();
            }
            else {
                key = storagekey + "_" + MoshafId;
            }
            var test = localStorage.get(key);
            test = $filter('filter')(test, { moshafId: MoshafId }, true);

            angular.forEach(test, function (item, key) {
                item.title = service.getTargetTitle(item.targetType,
                    item.surahId,
                    item.juzId,
                    item.startPage,
                    item.endPage,
                     item.startSoura, item.startAyaNum, item.endSoura, item.endAyaNum
                    );
                item = service.getProgressDays(item);
                if (item.progress == 100) {
                    item.isDone = true;
                    item.memorizeStatusName = "تم الحفظ";
                }
                else {
                    item.isDone = false;
                    item.memorizeStatusName = "جاري الحفظ";
                }
                if (item.notificationMode == enums.notificationMode.on)
                    item.notificationTitle = "ايقاف";
                else
                    item.notificationTitle = "تشغيل";
                test[key] = item;
            });
            return test;
        }
    }

    return service;

}]);