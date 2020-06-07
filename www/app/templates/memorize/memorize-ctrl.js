app.controller("memorizeController", function ($scope, ayatData, memorize, $filter, $ionicPopup, $timeout, $anchorScroll, $location, ionicLoading, target, enums,$state) {
    //console.log(ayatData.ayat)
    //var all = ayatData.getSurahAyat(1);
    //console.log(all)
    //var werd = memorize.getTodayWerd();
    //var memAyat = memorize.getSurahMemorizedAyat(2);

    $scope.init = function () {
        ionicLoading.ShowLoading();
        $scope.target = target.data;
        $scope.target.name = target.getTargetTitle($scope.target.targetType, $scope.target.surahId, $scope.target.juzId);
        $scope.target.totalAyatCount = target.getTargetAyat($scope.target).length;
        $scope.target.periodTypeName = $scope.target.periodType == enums.periodType.daily ? "يومي" : "أسبوعي";
        $timeout(function () {
            memorize.getTargetUserAyat().then(function (task) {
                $scope.ayatTask = task;
                var notMemorizedAyat = $filter('filter')($scope.ayatTask, { isChecked: false }, true);

                $scope.start = notMemorizedAyat.length > 0 ? notMemorizedAyat[0] : $scope.ayatTask[$scope.ayatTask.length - 1];
                $scope.gotoAnchor($scope.start.id);

                ionicLoading.hide();
            });
          //  $scope.ayatTask = memorize.getTargetUserAyat();

            //alert("start");


            //alert($scope.start.surahIndex);
        //if (typeof ($scope.memorized) == "undefined") { $scope.memorized = []; }
        //if ($scope.memorized.length > 0) {
        //    //$scope.start = $scope.memorized[$scope.memorized.length - 1].id;
        //    //start from the first not memorized aya
        //    for (var i = 1; i < $scope.memorized.length; i++) {
        //        $scope.start = $scope.memorized[i].id;
        //        if ($scope.memorized[i].id - $scope.memorized[i - 1].id > 1) {
        //            $scope.start = $scope.memorized[i-1].id;
        //            break;
        //        }
        //    }
        //}

 

        }, 200)
    }

    $scope.canCheck=function(aya)
    {
        var notMemorizedAyat = $filter('filter')($scope.ayatTask, { isChecked: false }, true);

        $scope.lastUnchecked = notMemorizedAyat.length > 0 ? notMemorizedAyat[0] : $scope.ayatTask[$scope.ayatTask.length - 1];
        if (aya.id - $scope.lastUnchecked.id > 0) {
            return false;
        }
        else { return true };
    }
    $scope.gotoAnchor = function (x) {
        var newHash = x;
        //alert(newHash);
        //alert($location.hash())
        if ($location.hash() !== newHash) {

            // set the $location.hash to `newHash` and
            // $anchorScroll will automatically scroll to it
            $location.hash(x);
            //$timeout(function () {
            //    $("ion-content")[0].scrollTop = ($("ion-content")[0].scrollTop -$(".bar-subheader").height() - $("ion-header-bar").height() - 1);

            //},1000)
        } else {
            // call $anchorScroll() explicitly,
            // since $location.hash hasn't changed
            $anchorScroll();
        }
 

    }

    $scope.getSurah=function(surahId)
    {
       return ayatData.getSurah(surahId);
    }
    $scope.getItemWidth = function () {
        return $(".list-ayat").width();
    }
    $scope.getItemHeight = function (aya, $index)
    {
        var elem = document.createElement("div");
        $(elem).addClass("aya");
        $(elem).append("<div>" + aya.verse + "<span class='badge badge-stable'>" + aya.surahIndex + "</span></div>");
        $("#temp").html(elem);
        //var windowWidth = $(".list-ayat").width()*0.94;
        //var canvas = document.createElement("canvas");
        //var ctx = canvas.getContext("2d");
        //ctx.font = "normal normal normal normal  20px 'Droid Arabic Kufi', Arial";  // This can be set programmaticly from the element's font-style if desired
        //var textWidth = ctx.measureText(aya.verse+"             ").width;
        //var ratio = Math.ceil(textWidth / windowWidth);
        var height = 0;
        if ($index == 0 || aya.surahIndex == 1) {
            height += 34;
        }
        //height += 32;
        //height += ((ratio) * 30) + 45;
        height += $(elem).height();
        height += 45;
        //console.log("rat");
        //console.log(aya.surahIndex)
        //console.log(ratio);
    
        return { height: height};
        //$timeout(function () {
        //    var h = $("#" + id).height();
        //    console.log(h);
        //    return h;
        //},500)
   
    }
    $scope.addRemoveAya = function (checked, aya, last) {
        console.log(last)
        if (checked) {
            memorize.addAyaToMemorized(aya.id);
        }
        else {
            aya.isChecked = true;

            //var nextAya = $filter('filter')($scope.ayatTask, { id: parseInt(aya.id + 1) }, true)[0];
            //console.log(nextAya)
            //if(typeof(nextAya) != undefined && nextAya.isChecked)
            //{
            //    aya.isChecked = true;
            //    $scope.showConfirm(aya)
            //    //alert("confirm");
            //}
            //else {
            //    memorize.removeAyaFromMemorized(aya.id);
            //}

        }

        if (last) {
            $ionicPopup.alert({
                title: 'أحسنت',
                template: 'مبروك .. لقد أتممت حفظ الهدف',
                okText: 'تأكيد',
            }).then(function () {
                target.cancelNotification();
                alert("done");
                //$state.go to targets
            });
        }
    }
    $scope.checkedCount = function () {
        var filtered = $filter('filter')($scope.ayatTask, { isChecked: true }, true);
        var len = 0;
        if (typeof (filtered) != "undefined") { len = filtered.length}
        return len;
    }
    $scope.showConfirm = function (aya) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'حذف آية من الايات المحفوظه',
            template: 'عند حذف هذه الآية سيتم حذف الايات التاليه لها فى نفس السورة هل انت متاكد؟',
            cancelText: "الغاء",
            okText: 'تأكيد',
        });

        confirmPopup.then(function (res) {
            //console.log(aya)
            if (res) {
                var surahWerdAyat = $filter('filter')($scope.ayatTask, { surahId: parseInt(aya.surahId) }, true);
                
                for(var i = surahWerdAyat.indexOf(aya);i<surahWerdAyat.length ; i++)
                {
                    surahWerdAyat[i].isChecked = false;
                    memorize.removeAyaFromMemorized(surahWerdAyat[i].id);

                }
                //console.log('You are sure');
            } else {
                console.log('You are not sure');
            }
        });
    };


    $scope.goBack = function () {
        if (target.data.memorizeMode == enums.memorizeMode.group) {
            $state.go("group");
        }
        else {
            $state.go("target-list");
        }

    }

    //console.log(task);
});
