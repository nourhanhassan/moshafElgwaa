app.factory("reviewTarget", ["$state", "localStorage", "enums", "localNotification", "groupAdd", "user", "ionicLoading", "guid", "ayatData", "$filter", "memorizedayat", "$rootScope", function ($state, localStorage, enums, localNotification, groupAdd, user, ionicLoading, guid, ayatData, $filter, memorizedayat, $rootScope) {

    var storageKey = "reviewTargets";

    
    var service = {
        storageKey: "reviewTargets",
        allReviewTargets: [],
        data: {
            id: null,
            ayatCount: 5,
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
            ayat: [],
            targetMode: 1
        },
        getNotificationTime: function (startDate,periodType) {

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
            if (hour>12 ) {
                hour -= 12;
            }
            if(hour==0){hour=12}
            return hour;
        },
        getAmPm: function (serNotificationTime) {
            var hour = serNotificationTime.hour;
            var ampm="ص";
            if (hour >= 12) {
                ampm ="م";
            }
            return ampm;
        },
        getProgressDays: function (item) {
            //debugger;
            var noOfDays;
            var noOfAyah;
            var noOfMemorizedAyat;
            if (typeof (item.noOfAyah) == "undefined") {
                item.noOfAyah = item.ayat.length;
            }
            item.noOfMemorizedAyat = $filter('filter')(item.ayat, { isReviewed: true }, true).length;
            //}
            if (item.periodType == enums.periodType.daily) {
                noOfDays = (item.noOfAyah - item.noOfMemorizedAyat) / item.ayatCount;
            }
            else {
                noOfDays = Math.ceil(((item.noOfAyah - item.noOfMemorizedAyat) / item.ayatCount)) * 7;
            }
            item.noOfDays = Math.ceil(noOfDays);
            item.progress = Math.ceil((item.noOfMemorizedAyat / item.noOfAyah) * 100);
            return item;
        },
        resetTargetData: function () {
            this.data = {

                id: null,
                ayatCount: 5,
                notificationMode: enums.notificationMode.on,
                periodType: 1,
                notificationDayIndex: 0,
                notificationTitle: "ايقاف",
                startDate: new Date().getTime(),
                notificationID: null,
                startPage: 1,
                endPage: 1,
                startAya: 1,
                ayat: []
            }


        },


        saveTarget: function () {
                if (this.data.id == null) //add mode
                {
                  this.data.startAya = this.data.ayat[0].id;
                    this.addTarget();
                }
                else { //update mode
                    this.updateTarget();
                }
                service.resetTargetData();
                $state.go("app.review-target-list")
        },

        addTarget: function () {
           // alert(this.data.notificationMode);
            this.data.id = guid.generate(); //generate a unique id for the target
            this.data.startPage = this.data.ayat[0].pageNum;
            if (this.data.notificationMode == enums.notificationMode.on) {
                this.saveTargetNotification();
            }
            localStorage.append(storageKey, this.data);

        },

        updateTarget: function () {
            var targetObj = null;

            var storedTargets = localStorage.get(storageKey);

            for (var i = 0; i < storedTargets.length; i++) {
                if (storedTargets[i].id == this.data.id) {
                    targetObj = storedTargets[i];
                    break;
                }

            }
            angular.copy(this.data, targetObj);
            localStorage.set(storageKey, storedTargets);
            //alert("notification mode"+ this.data.notificationMode)
            if (this.data.notificationMode == enums.notificationMode.on) {
                this.saveTargetNotification();
            }

        },
        deleteReviewTarget: function () {
            var storedTargets = localStorage.get(service.storageKey);

            for (var i = 0; i < storedTargets.length; i++) {
                if (storedTargets[i].id == this.data.id) {
                    //alert(this.data.notificationMode)
                    storedTargets.splice(i, 1);
                    break;
                }

            }
            localStorage.set(service.storageKey, storedTargets);
            service.cancelNotification(this.data.notificationID);

        },
        saveTargetNotification: function () {      
            var notificationTime = new Date(this.data.startDate);
            notificationTime.setSeconds(0);
            notificationTime.setMilliseconds(0);
            if (typeof (cordova) != "undefined") {
                var frequency = "day";
                if (this.data.periodType == enums.periodType.weekly) {
                    frequency = "week";
                }
                var notification = {
                    smallIcon: 'res://icon.png',
                    icon: 'res://icon.png',
                    title: "تذكير بموعد مراجعة ورد " + this.data.title,
                    //text: "يوم" + new Date(this.data.startDate).getDate() + " الساعة " + new Date(this.data.startDate).getHours() + " : " + new Date(this.data.startDate).getMinutes(),
                    text: "تذكير بمراجعة ورد عدد " + service.data.ayatCount + "ايات",
                    data: {
                        isReview:true,
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
            localStorage.remove(storageKey);
            service.cancelNotification(this.data.notificationID).then(function (res) {
                alert("notification cancelled" + JSON.stringify(res));
            });

        },

        getAllTargets: function () {
            var test = localStorage.get(storageKey);
            angular.forEach(test, function (item, key) {
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
        },


        getTargetByID: function (id) {
            var storedTargets = localStorage.get(storageKey);
            var res;
            for (var i = 0; i < storedTargets.length; i++) {
                if (storedTargets[i].id == this.data.id) {
                    return storedTargets[i];
                    break;
                }

            }

        },
        setTargetByID: function (id) {
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
                if (allTargets[i].isDone==true) {
                    service.cancelNotification(allTargets[i].notificationID);
                }
            }
        },
        checkTargetNameDuplicate:function(tragetId,name)
        {
            var nameDuplicated = false;
            var targets = service.getAllTargets();
            if (targets == undefined || targets.length == 0) {
                nameDuplicated = false;
            }
            else
            {
                targetDuplicated = $filter('filter')(targets, { title: name }, true);
                if (targetDuplicated.length > 0) {
                    nameDuplicated = $filter('filter')(targetDuplicated, { id: '!' + tragetId }, true).length > 0 ? true : false;
                }
                else
                    nameDuplicated = false;
            }
            return nameDuplicated;
        }
    }

    return service;

}]);