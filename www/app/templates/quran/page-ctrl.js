app.controller('pageController', function ($scope, $window, $ionicSlideBoxDelegate, moshafdata, ionicPopup, $filter, $q, $state, $stateParams, $timeout, mark, $ionicPopover, enums, target, memorize, $ionicGesture, $rootScope, $ionicScrollDelegate, $ImageCacheFactory, device, $ionicSideMenuDelegate, audio, $ionicModal, localStorage, notes, bookmarkTypes, bookmarks, memorizedayat, toast, settings, ayatTafseer, ayatData, recitations, reviewTarget, review, device, file, fileTransfer, network, $ionicLoading) {

    angular.element(document).ready(function () {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-tabs')) {
                content[i].classList.toggle('has-tabs');
            }
        }
    });
    if (typeof (navigator.splashscreen) != "undefined") {
        navigator.splashscreen.hide();
    }
    var getColor = function (nr) {
        // alert(nr)
        return nr % 2 === 0 ? '#8080c5' : '#80b280';
    };
    // to change ayat numbers from english to arabic
    Number.prototype.toIndiaDigits = function () {
        var id = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        return this.toString().replace(/[0-9]/g, function (w) {
            return id[+w]
        });
    }

    $scope.getArabicNumber = function (num) {
        if (typeof (num) == "number")
            return num.toIndiaDigits();
    }


    var makeSlide = function (nr, data) {
        return angular.extend(data, {
            nr: nr
        });
    };
    /* edited */
    $scope.showlayout = true;
    $scope.pages = {};
    $scope.initStart = 1;
    $scope.end = 0;
    $scope.selectedSlide = 1;
    $scope.enums = enums;
    $scope.start = parseInt($stateParams.page);
    $scope.target = {};
    $scope.minAya = 1;
    $scope.maxAya = 6236;
    $scope.settings = settings.settingsData;
    $scope.continue = true;
    $scope.title = "القرآن الكريم"
    //$scope.fontSize = parseFloat($('.content-read', $(".curSlide")).css("font-size"));
    //alert($scope.fontSize)
    //Set the app mode to memorize if the target was sent as parameter
    $scope.enableSlideLeft = true;
    $scope.enableSlideRight = true;

    //$scope.platform = device.getPlatform();

    // $scope.scrollFlag = device.getPlatform() == "android" ? false : true;
    $scope.setLastBookmarkType = function () {
        $scope.lastBookmark = bookmarkTypes.getActiveBookmarkType();
    }

    $scope.setMomorizeMode = function (targetId) {
        if (target.data.id == targetId || target.data.isGroupMemorize) {
            $scope.target = target.data;
        }
        else {
            $scope.target = target.setTargetByID(targetId);
        }
        $scope.initStart = $scope.target.startPage;
        $scope.title = $scope.target.title;
        //If the page parameter was set along with the target, it means that we come from the "memorize" item in the menu
        //So we need to set the start page to be the same as the sent parameter
        //if ($stateParams.page > 0) {
        //    $scope.start = parseInt($stateParams.page);
        //}
        //    //Otherwise set the start to be the start of the target
        //else {

        // $scope.start = $scope.initStart;


        $timeout(function () {
            memorize.getTargetUserAyat().then(function (task) {
                //   $scope.target.title = target.getTargetTitle($scope.target.targetType, $scope.target.surahId, $scope.target.juzId);
                $scope.ayatTask = task;
                $timeout(function () {
                    var notMemorizedAyat = $filter('filter')($scope.ayatTask, { isChecked: false }, true);
                    var startAya = notMemorizedAyat.length > 0 ? notMemorizedAyat[0] : $scope.ayatTask[$scope.ayatTask.length - 1];
                    //Don't set the start to be startaya's page if the page parameter was set (If the page parameter was set along with the target, it means that we come from the "memorize" item in the menu)
                    if (!$stateParams.page) {
                        $scope.start = startAya.PageNum;
                        // alert($scope.start)
                    }
                })
                $timeout(function () {
                    $scope.loadPages($scope.start, function () { $scope.initSlide(); })

                })
            });

        })



        $scope.end = $scope.target.endPage + 1;
    }
    $scope.setReviewMode = function (targetId) {
        if (reviewTarget.data.id == targetId) {
            $scope.reviewTarget = reviewTarget.data;

        }
        else {
            $scope.reviewTarget = reviewTarget.setTargetByID(targetId);
        }
        $scope.title = $scope.reviewTarget.title;
        $scope.reviewTarget.pages = $scope.reviewTarget.ayat.map(function (obj) { return obj.pageNum; });
        $scope.reviewTarget.pages = $scope.reviewTarget.pages.sort(function (a, b) {
            return a - b;
        });

        $scope.reviewTarget.pages = $scope.reviewTarget.pages.filter(function (v, i) { return $scope.reviewTarget.pages.indexOf(v) == i; });
        $scope.initStart = $scope.reviewTarget.pages[0];
        $scope.reviewTarget.ayat = $scope.reviewTarget.ayat.sort(function (a, b) {

            return a.id - b.id;
        });
        if (!$stateParams.page) {
            var notReviewed = $scope.reviewTarget.ayat.filter(function (a) { return a.isReviewed == false });

            $scope.start = notReviewed.length > 0 ? notReviewed[0].pageNum : $scope.initStart
        }

        $timeout(function () {
            $scope.loadPages($scope.start, function () { $scope.initSlide(); })

        })
        //$timeout(function () {
        //    review.getTargetUserAyat().then(function (task) {
        //        //   $scope.target.title = target.getTargetTitle($scope.target.targetType, $scope.target.surahId, $scope.target.juzId);

        //        $scope.ayatTask = task;
        //        $timeout(function () {
        //            var notReviewedAyat = $filter('filter')($scope.ayatTask, { isReviewed: false }, true);
        //            var startAya = notReviewedAyat.length > 0 ? notReviewedAyat[0] : $scope.ayatTask[$scope.ayatTask.length - 1];
        //            //Don't set the start to be startaya's page if the page parameter was set (If the page parameter was set along with the target, it means that we come from the "memorize" item in the menu)
        //            if (!$stateParams.page) {
        //                $scope.start = startAya.PageNum;
        //                // alert($scope.start)
        //            }
        //        })
        //        $timeout(function () {
        //            $scope.loadPages($scope.start, function () { $scope.initSlide(); })

        //        })
        //    });

        //})

        $scope.end = $scope.reviewTarget.pages[$scope.reviewTarget.pages.length - 1] + 1;
    }
    $scope.setPageAyatMemorize = function (page) {
        //$scope.curPage = $scope.getCurPage();

        page.allAyat.forEach(function (aya) {
            aya.isChecked = memorizedayat.isAyaMemorized(aya.id) > -1;
            aya.isMemorized = aya.isChecked;
        })
    }
    $scope.setPageAyatFavourize = function (page) {
        page.allAyat.forEach(function (aya) {
            aya.isFav = memorizedayat.isAyaFavourized(aya.id) > -1;
        })
    }
    $scope.init = function () {
        $scope.ayaSelected = false;
        $scope.model = { };
        $scope.enums =enums;
        //var start = (mark.getLastReadPage()).pageNumber;
        //var end = start + 2;
        $scope.cutting = false;
        $scope.end = 0;
        $scope.imgPath = "";
        var path = "";
        var targetPath = enums.appData.targetPath;
        if (device.getPlatform() == "ios") {
            directoryName = cordova.file.dataDirectory;
        }
        else directoryName = cordova.file.externalRootDirectory;
        path = directoryName + targetPath;

        var MoshafId = settings.settingsData.MoshafId.toString();
        $rootScope.MoshafId =MoshafId;
        $scope.MoshafId =MoshafId;
        if (MoshafId == enums.MoshafId.hafs) {
            $scope.end = enums.mosahfCopy.hafs.pagesCount+1;
            $scope.imgPath = path + "/" + enums.mosahfCopy.hafs.nameEn + "/";
        }
        else if (MoshafId == enums.MoshafId.shamrly) {
            $scope.end = enums.mosahfCopy.shamrly.pagesCount+1;
            $scope.imgPath = path + "/" + enums.mosahfCopy.shamrly.nameEn + "/";
        }
        else if (MoshafId == enums.MoshafId.qalon) {
            $scope.end = enums.mosahfCopy.qalon.pagesCount+1;
            $scope.imgPath = path + "/" + enums.mosahfCopy.qalon.nameEn + "/";
        }
        else if (MoshafId == enums.MoshafId.warsh) {
            $scope.end = enums.mosahfCopy.warsh.pagesCount+1;
            $scope.imgPath = path + "/" + enums.mosahfCopy.warsh.nameEn + "/";
        }

        //$scope.downloadImages(MoshafId, false, start, end)
        $scope.audioSettings.quality = "";
        $scope.audioSettings.rate = "1.0";
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
        $rootScope.hideMem = false;
        $scope.showlayout = true;
        $scope.popoverShowen = false;
        $scope.setLastBookmarkType();
        if ($stateParams.target.length > 0) {
            $scope.appMode = enums.appModes.memorize;
            $rootScope.appMode = enums.appModes.memorize;
            $scope.setMomorizeMode($stateParams.target);
        }
        else if ($stateParams.reviewTarget.length > 0) {
            $scope.appMode = enums.appModes.review;
            $rootScope.appMode = enums.appModes.review;
            $scope.setReviewMode($stateParams.reviewTarget);
            $scope.reviewAyatTask = review.getTodayWerd($scope.reviewTarget.id);
            $scope.reviewAyatTask = $scope.reviewAyatTask == 0 ? [] : $scope.reviewAyatTask;
            $scope.firstReviewAyaTask = $scope.reviewAyatTask.length == 0 ? 10000 : $scope.reviewAyatTask[0].id;
        }
        else if (target.data.isGroupMemorize) {
            $scope.appMode = enums.appModes.memorize;
            $rootScope.appMode = enums.appModes.memorize;
            $scope.setMomorizeMode($stateParams.target);
        }
        else {
            $scope.appMode = enums.appModes.read
            $rootScope.appMode = enums.appModes.read;
            if (!$scope.start > 0) {
                $scope.start = 1
            }
            if (typeof (navigator.splashscreen) != "undefined") {
                navigator.splashscreen.hide();
            }
            $scope.loadPages($scope.start, function () {
                $scope.initSlide();
            })
        }
        ayatData.getSurahs().then(function (result) {
            $scope.allSurahs = result;
            //$scope.fromAyat =ayatData.getSurahAyat(result[0].id);
            //$scope.ToAyat = $scope.fromAyat;
       
        });
        $scope.repeatStartAyah = 1;//first ayahDB number in Qour2an
        $scope.repeatEndAyah = 6236;//last ayahDB number in qur2an
        $scope.repeatRangeFlag = false;
        $scope.model.formRepeatFlag = false;
        if ($stateParams.repeatMode == "true") {

            var startoAyah = Number($stateParams.aya);
            var endooAyah = Number($stateParams.ayaEnd);
            var repCount = Number($stateParams.repeatCount);
            $scope.audioSettings.repeat = repCount;
            $scope.repeatStartAyah = startoAyah;
            $scope.repeatEndAyah = endooAyah;
            $scope.repeatRangeFlag = true;
            $scope.model.formRepeatFlag = true;
            //$scope.selectAya(startoAyah, false);
            $scope.currentAya=moshafdata.getAyaByID(startoAyah);
            setTimeout(function () {
                ////var currentAya=ayatData.getAya(startoAyah);
                ////$scope.selectAya(currentAya,false);
                $scope.startRepAyah = angular.copy($scope.currentAya);
                ayatData.setStAyRep(angular.copy($scope.currentAya));
                $scope.audioSettings.currentAyaObject = angular.copy($scope.currentAya)
                //$scope.showAudioBar($scope.currentAya)

                //$scope.playAudio(startoAyah, $scope.audioSettings.quality, $scope.audioSettings.rate);
            },2000)
        }
        
    }
    //Notes
    $ionicModal.fromTemplateUrl('app/templates/popovers/aya-tafseer.html', {
        id: '2',
        scope: $scope,
        animation: 'slide-in-up',
        //backdropClickToClose: false,
    }).then(function (modal) {
        $scope.tafseerModal = modal;

    });

    //  $scope.start = 604;


    //   alert($scope.start)
    // initial
    // $scope.curPage = $scope.start;


    //***----------aya Events start----------****/

    $scope.selectAya = function (aya, showOptions) {
        var MoshafId = settings.settingsData.MoshafId.toString();
 
        $scope.ayaSelected = true;
        if ($rootScope.isTestMemorizeMode != true) {
            $scope.removePopovers();
            $scope.isHoldFired = true;

            if (showOptions != false) {
                $scope.showAyaOtions(aya);


            }
            $scope.currentAya = aya;
            if ($scope.appMode != enums.appModes.review) {
                $scope.currentAya.nextId = $scope.currentAya.id + 1;
                $scope.currentAya.prevId = $scope.currentAya.id - 1;
            }
            else {
                var firstAyaInPage = $scope.curPage.allAyat[0].id;
                var lastAyaInPage = $scope.curPage.allAyat[$scope.curPage.allAyat.length - 1].id;
                var curAya = $scope.reviewTarget.ayat.filter(function (a) { return a.id == aya.id })[0];
                var indexOfCurAya = $scope.reviewTarget.ayat.indexOf(curAya);
                if ($scope.currentAya.id < lastAyaInPage) {
                    $scope.currentAya.nextId = $scope.currentAya.id + 1;
                }
                else {
                    //$scope.currentAya.nextId = indexOfCurAya < $scope.reviewTarget.ayat.length - 1 && indexOfCurAya > -1 ? $scope.reviewTarget.ayat[indexOfCurAya + 1].id : 0;
                    var nextAyat = $scope.reviewTarget.ayat.filter(function (a) { return a.id > $scope.currentAya.id });
                    $scope.currentAya.nextId = nextAyat.length > 0 ? nextAyat[0].id : 0;
                }
                if ($scope.currentAya.id > firstAyaInPage) {
                    $scope.currentAya.prevId = $scope.currentAya.id - 1;
                }
                else {
                    var prevAyat = $scope.reviewTarget.ayat.filter(function (a) { return a.id < $scope.currentAya.id });
                    $scope.currentAya.prevId = prevAyat.length > 0 ? prevAyat[prevAyat.length - 1].id : 0;
                    // $scope.currentAya.prevId = indexOfCurAya > 0 && indexOfCurAya > -1 ? $scope.reviewTarget.ayat[indexOfCurAya - 1].id : 0;
                }
            }
            if ($scope.lastBookmark)
                $scope.currentAya.marked = $scope.currentAya.id == $scope.lastBookmark.ayaId ? true : false;
            else
                $scope.currentAya.marked = false;
            $timeout(function () {
                $scope.isHoldFired = false;
            })
        }
    
    }

    $scope.releaseAya = function () {
        $scope.isHoldFired = false;
    }


    $scope.removePopovers = function () {

        if (typeof ($scope.markPopover) != "undefined") {

            $scope.markPopover.hide();
            $scope.markPopover.remove();
        }
        $scope.popoverShowen = false;

    }
    //***----------aya Events end----------****/


    //***----------Marks start----------****/

    $scope.showAyaOtions = function (aya) {

        $scope.getAyaOptionsPopoverPosition(aya);
        aya.isChecked = memorizedayat.isAyaMemorized(aya.id) > -1;

        $ionicPopover.fromTemplateUrl('app/templates/popovers/popover.html', {
            scope: $scope,

            //    html: true
        }).then(function (popover) {
            $scope.markPopover = popover;
            $scope.aya = aya;
            $scope.markPopover.show();
            $(".backdrop").addClass("no-backdrop");
            // $(".popover-backdrop.active").addClass("no-backdrop");
        });;

    }




    //***----------Marks End----------****/

    $scope.gotoNextPage = function () {
        $ionicSlideBoxDelegate.previous();
    }
    $scope.gotoPrevPage = function () {
        $ionicSlideBoxDelegate.next();
    }

    //***----------memorize start----------****/



    $scope.memorizeAya = function (aya, navigate) {
        if (typeof (aya) == "undefined") {
            aya = $scope.currentAya;
        }
        if ($scope.appMode == enums.appModes.memorize) {
            var notMomrizedAyatCount = $filter('filter')($scope.ayatTask, { isChecked: false }).length;
            var ayaTask = $filter('filter')($scope.ayatTask, { id: aya.id })[0];

            if (aya.isChecked != true) {
                memorize.addAyaToMemorized(aya.id);
                notMomrizedAyatCount -= 1;

                aya.isChecked = true;
                ayaTask.isChecked = true;

                var page = $scope.getCurPage();
                // var curAya = $filter('filter')(page.allAyat, { id: aya.id });
                var nextAya = $filter('filter')(page.allAyat, { id: aya.id + 1 });
                if (navigate != false) {
                    if (nextAya.length > 0) {
                        $scope.selectAya(nextAya[0]);

                    }
                    else if (notMomrizedAyatCount != 0) {
                        var nextId = aya.id + 1;
                        var nextAyaTask = $filter('filter')($scope.ayatTask, { id: nextId });
                        if (nextAyaTask.length > 0) {
                            $scope.gotoNextPage();
                            $timeout(function () {
                                var page = $scope.getCurPage();
                                var nextAya = $filter('filter')(page.allAyat, { id: nextId });
                                if (nextAya.length > 0) {
                                    $scope.selectAya(nextAya[0]);

                                }
                            })
                        }
                    }
                }
            }
            else {
                notMomrizedAyatCount = notMomrizedAyatCount < 0 ? 0 : notMomrizedAyatCount;
                memorize.removeAyaFromMemorized(aya.id);
                aya.isChecked = false;
                ayaTask.isChecked = false;
                notMomrizedAyatCount += 1;
            }
            if (notMomrizedAyatCount == 0) {
                $scope.showDoneMemorizeMsg();
                target.cancelNotification();

            }
        }

        else {
            if (aya.isChecked != true) {
                memorize.addAyaToMemorized(aya.id);
                aya.isChecked = true;
            }
            else {
                memorize.removeAyaFromMemorized(aya.id);
                aya.isChecked = false;
            }
            // var nextAya = $filter('filter')(page.allAyat, { id: aya.id + 1 });
        }
        return aya;
    }
    $scope.favoriteAya = function (aya) {
        if (aya.isFav != true) {
            memorize.addAyaToFavourite(aya.id, aya);
            aya.isFav = true;
        }
        else {
            memorize.removeAyaFromFavourized(aya.id);
            aya.isFav = false;
        }
    }
    $scope.reviewAya = function (aya, navigate) {
        if (typeof (aya) == "undefined") {
            aya = $scope.currentAya;
        }
        if ($scope.appMode == enums.appModes.review) {

            //   console.log($scope.reviewTarget)
            if (aya.isReviewed != true) {
                review.addAyaToReviewed(aya.id, $scope.reviewTarget.id);
                aya.isReviewed = true;

            }
            else {
                review.removeAyaFromReviewed(aya.id, $scope.reviewTarget.id);
                aya.isReviewed = false;
            }
            var page = $scope.getCurPage();
            var reviewAya = $scope.reviewTarget.ayat.filter(function (a) { return a.id == aya.id })[0];
            reviewAya.isReviewed = aya.isReviewed;
            var index = $scope.reviewTarget.ayat.indexOf(reviewAya);
            var nextReviewAya = $scope.reviewTarget.ayat[index + 1];
            if (navigate != false) {
                if (nextReviewAya) {
                    var nextId = nextReviewAya.id;
                    // $scope.selectAya(nextAya[0]);
                    var nextAya = $filter('filter')(page.allAyat, { id: nextId });
                    if (nextAya.length > 0) {
                        $scope.selectAya(nextAya[0]);
                    }
                    else {


                        $scope.gotoNextPage();
                        $timeout(function () {
                            var page = $scope.getCurPage();
                            var nextAya = $filter('filter')(page.allAyat, { id: nextId });
                            if (nextAya.length > 0) {
                                $scope.selectAya(nextAya[0]);

                            }
                        })

                    }
                }
            }
            else {
                var remainingAyat = $scope.reviewTarget.ayat.filter(function (a) {
                    return a.isReviewed == false;
                })
                if (remainingAyat.length == 0) {
                    $scope.showDoneReviewMsg();
                    reviewTarget.cancelNotification($scope.reviewTarget.notificationID);
                }
                else {
                    $scope.removePopovers();
                }
            }
        }



    }

    $scope.goToAya = function (curAyaId, showOptions) {
        var page = $scope.getCurPage();
        //if ($scope.end < page.pageNum)
        // var curAya = $filter('filter')(page.allAyat, { id: $scope.currentAya.id });
        var nextAya = $filter('filter')(page.allAyat, { id: curAyaId });
        if (nextAya.length > 0) {
            $scope.selectAya(nextAya[0], showOptions);

        }
        else {
            if (curAyaId > page.allAyat[page.allAyat.length - 1].id) {
                if (page.pageNum < $scope.end - 1) {
                    //if($scope.appMode != enums.appModes.review)
                    $scope.gotoNextPage();
                }
            }
            else {
                if (page.pageNum > $scope.initStart) {
                    $scope.gotoPrevPage();
                }
            }
            var nextId = curAyaId;

            $timeout(function () {
                var page = $scope.getCurPage();
                var nextAya = $filter('filter')(page.allAyat, { id: nextId });
                if (nextAya.length > 0) {
                    $scope.selectAya(nextAya[0], showOptions);

                }
            })
        }


    }

    $scope.showMemorizeMsg = function (msg) {
        //  alert("show msg")
        var template = ' <div class="bookmarkMsg" > ' + msg + '</h4>  </div>';

        $scope.memorizePopover = $ionicPopover.fromTemplate(template, {
            scope: $scope
        });
        $scope.memorizePopover.show();
        setTimeout(function () { $scope.memorizePopover.hide(); $scope.memorizePopover.remove(); }, 2500);
    }

    $scope.showDoneMemorizeMsg = function (msg) {
        //  alert("show msg")
        toast.info("لقد اتممت حفظ الهدف  بنجاح", msg)

        setTimeout(function () {

            $state.go("app.target-list")
        }, 2500);
    }

    $scope.showDoneReviewMsg = function (msg) {
        //  alert("show msg")
        toast.info("لقد اتممت مراجعة الهدف  بنجاح", msg)

        setTimeout(function () {

            $state.go("app.review-target-list")
        }, 2500);
    }
    $ionicModal.fromTemplateUrl('app/templates/popovers/memorizedPageAyatChecklist.html', {
        scope: $scope,
        animation: 'slide-in-up',
        //backdropClickToClose: false,
    }).then(function (modal) {
        $scope.checklistModal = modal;

    });


    $scope.showMemorizePageChecklist = function () {
        $scope.removePopovers();
        var page = $scope.getCurPage();
        $scope.setPageAyatMemorize(page);
        $scope.pageChecklist = {};
        $scope.pageChecklist.allAyatChecked = false;

        $scope.pageChecklist.ayat = page.allAyat;
        $scope.notMomrizedCount = $scope.pageChecklist.ayat.filter(function (obj) { return obj.isMemorized == false }).length;
        if ($scope.notMomrizedCount == 0) {
            $scope.pageChecklist.allAyatChecked = true;
        }
        $scope.checklistModal.show();

    }
    $scope.closMemorizePageChecklist = function () {
        $scope.checklistModal.hide();
    }

    $scope.checkAya = function () {

        $scope.notMomrizedCount = $scope.pageChecklist.ayat.filter(function (obj) { return obj.isMemorized != true }).length;
        $scope.pageChecklist.allAyatChecked = $scope.notMomrizedCount == 0 ? true : false;

    }
    $scope.saveMemorizedAyat = function () {
        //var page = $scope.getCurPage();
        $scope.pageChecklist.ayat.forEach(function (aya) {
            if (aya.isChecked != aya.isMemorized) {
                // aya.isChecked = aya.isMemorized
                $scope.memorizeAya(aya, false)
            }
            $scope.checklistModal.hide();

        })
        $scope.notMomrizedCount = $scope.pageChecklist.ayat.filter(function (obj) { return obj.isMemorized == false }).length;

    }
    $scope.toggleAllAyatCheck = function () {
        //$scope.pageChecklist.allAyatChecked = !$scope.pageChecklist.allAyatChecked;
        $scope.pageChecklist.ayat.forEach(function (aya) {
            aya.isMemorized = $scope.pageChecklist.allAyatChecked;

        })
    }
    //***----------memorize End----------****/

    //***------------review start ----------------***//
    $ionicModal.fromTemplateUrl('app/templates/popovers/reviewPageAyatChecklist.html', {
        scope: $scope,
        animation: 'slide-in-up',
        //backdropClickToClose: false,
    }).then(function (modal) {
        $scope.reviewchecklistModal = modal;

    });
    $scope.isInReviewTarget = function (ayaId) {
        var ids = $scope.reviewTarget.ayat.map(function (a) {
            return a.id;
        });
        return ids.indexOf(ayaId) !== -1;
    }
    $scope.showReviewChecklist = function () {
        $scope.removePopovers();
        var page = $scope.getCurPage();
        $scope.reviewPageChecklist = {};
        $scope.reviewPageChecklist.allAyatChecked = false;

        $scope.reviewPageChecklist.ayat = page.allAyat.map(function (a) {
            a.isChecked = a.isReviewed;
            return a;

        });
        $scope.reviewCheckAya();
        $scope.reviewchecklistModal.show();
    }

    $scope.reviewCheckAya = function () {
        $scope.notReviewedCount = $scope.reviewPageChecklist.ayat.filter(function (obj) { return obj.isChecked != true }).length;
        $scope.reviewPageChecklist.allAyatChecked = $scope.notReviewedCount == 0 ? true : false;
    }

    $scope.closeReviewPageChecklist = function () {
        $scope.reviewchecklistModal.hide();
    }
    $scope.toggleReviewAllAyatCheck = function () {
        //$scope.pageChecklist.allAyatChecked = !$scope.pageChecklist.allAyatChecked;
        $scope.reviewPageChecklist.ayat.forEach(function (aya) {
            if ($scope.isInReviewTarget(aya.id))
                aya.isChecked = $scope.reviewPageChecklist.allAyatChecked;

        })
    }

    $scope.saveReviewedAyat = function () {
        //var page = $scope.getCurPage();
        $scope.reviewPageChecklist.ayat.forEach(function (aya) {
            if (aya.isChecked != aya.isReviewed) {
                //  aya.isChecked = aya.isMemorized
                $scope.reviewAya(aya, false
                    )
            }
            $scope.reviewchecklistModal.hide();

        })
        //    $scope.notMomrizedCount = $scope.pageChecklist.ayat.filter(function (obj) { return obj.isMemorized == false }).length;

    }
    //***------------review End ----------------***//
    $scope.getAyaOptionsPopoverPosition = function (aya) {
        //  var scroll = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
        //  $scope.startScroll = scroll;

        var factor = $scope.getScreenSizeFactor(aya.PageNum);
        $scope.pos = {};
        var dif = 85;
        if ($scope.hideBar) {
            dif = 30;
        }

        var windowCenter = $(window).height() / 2;
        //if (aya.surah == 114) {
        // //   $scope.initLineHeight = 180;
        //    aya.y += 30;
        //}
        var ayaTop = (aya.y * factor);

        if (ayaTop < windowCenter) {
            $scope.pos.top = dif + ayaTop;
        }
        else {
            if ($scope.hideBar) {
                dif = 0;
            }
            else {
                dif = 40;
            }
            var ayaHeight = $scope.getAyaHeight(aya)
            $scope.pos.top = ayaTop - ayaHeight + dif;
        }
        if ($scope.pos.top > ($(window).height() - dif)) {
            $scope.pos.top = $(window).height() - dif;
        }
        $scope.pos.right = aya.x * factor - 45;
        // return pos;
        ////===
        //var scroll = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
        //$scope.startScroll = scroll;
        //var factor = $scope.getScreenSizeFactor();
        //$scope.pos = {};
        //$scope.pos.top = (aya.y * factor) - scroll + 35;
        //$scope.pos.right = aya.x * factor - 45;
    }
    $scope.resetPositions = function () {
        if (typeof ($scope.startScroll) != "undefined") {
            var scroll = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
            if (Math.abs($scope.startScroll - scroll) > 10) {
                $scope.removePopovers();
            }

        }
        ;

    }
    //***----------page  initailization start ----------****/


    $scope.getpage = function (pagenum, index) {
        var page = {};

        var deferred = $q.defer();
        if (typeof ($scope.pages[pagenum]) == "undefined") {


            page.pageNum = pagenum
            page.nr = index;
            deferred.resolve(page);


        }
        else {
            deferred.resolve($scope.pages[pagenum]);
        }
        return deferred.promise;;
    }


    $scope.loadPages = function (pgNum, callback) {
        var start = pgNum == 1 ? 1 : pgNum - 3;
        start = start <= 0 ? 1 : start;
        //$scope.pages = {};
        var promises = [];
        $ImageCacheFactory.Cache([]);
        var pagesArray = [];

        if ($scope.appMode == enums.appModes.review) {

            var indexOfpgNum = $scope.reviewTarget.pages.indexOf(pgNum);
            var loadIndex = indexOfpgNum > 3 ? indexOfpgNum - 3 : 0;
            //   start = pgNum == start ? pgNum : $scope.reviewTarget.pages[loadIndex];
            for (var k = loadIndex; k < start + 10 ; k++) {
                if (typeof ($scope.reviewTarget.pages[k]) != "undefined")
                    pagesArray.push($scope.reviewTarget.pages[k])
            }
        }
        else {
            for (var j = start ; j < start + 10; j++) {
                pagesArray.push(j);
            }
        }
        for (var i = 0 ; i < pagesArray.length; i++) {
            if (i < $scope.end && typeof ($scope.pages[pagesArray[i]]) == "undefined") {
                //if (i == $scope.end) { i = 1;}
                (function (i) {
                    var promise = $scope.getpage(pagesArray[i]);
                    promises.push(promise);

                    promise.then(function (p) {
                        if (typeof ($scope.pages[p.pageNum]) == "undefined") {
                            moshafdata.pageAyat(p.pageNum).then(function (surahs) {
                                p.surahs = surahs;
                                p.juz = p.surahs[0].JuzName;
                                p.surah = p.surahs[0].Name;
                                p.firstSurah = p.surahs[0];
                                p.pageNum = p.pageNum;
                                p.allAyat = [];
                                for (var i = 0 ; i < p.surahs.length ; i++) {
                                    p.allAyat = p.allAyat.concat(p.surahs[i].ayat);
                                }
                                if ($stateParams.repeatMode == "true") {
                                    if($scope.currentAya.PageNum == p.pageNum)
                                    {
                                        $scope.showAudioBar($scope.currentAya)

                                        $scope.playAudio($scope.repeatStartAyah, $scope.audioSettings.quality, $scope.audioSettings.rate);
                                    }
                                }
                                if ($scope.appMode == enums.appModes.memorize) {
                                    //  alert("mem")
                                    for (var i = 0 ; i < p.surahs.length ; i++) {
                                        p.surahs[i].ayat = $scope.ayatTask.filter(function (aya) { return (aya.PageNum == p.pageNum && aya.surah == p.surahs[i].Id) });
                                    }

                                }
                                if ($scope.appMode == enums.appModes.review) {
                                    settings.settingsData.markMemorizedAyat = true;
                                    $scope.settings.markMemorizedAyat = true;
                                    var pageAyatForReview = $scope.reviewTarget.ayat.filter(function (aya) { return (aya.pageNum == p.pageNum) });
                                    p.reviewAyat = pageAyatForReview;
                                    pageAyatForReview.forEach(function (aya) {
                                        var pAya = p.allAyat.filter(function (a) { return a.id == aya.id })[0];
                                        pAya.isReviewed = aya.isReviewed;
                                        var tAya = $scope.reviewAyatTask.filter(function (a) { return a.id == aya.id });
                                        if (tAya.length > 0) {
                                            pAya.isWerd = true;
                                        }

                                    })
                                    // console.log(p.allAyat)
                                }
                                if (settings.settingsData.markMemorizedAyat) {
                                    $scope.setPageAyatMemorize(p);
                                }
                                $scope.pages[p.pageNum] = p;
                                if ($stateParams.page == p.pageNum && $stateParams.aya > 0) {

                                    for (var i = 0; i < p.surahs.length; i++) {
                                        if ($scope.currentAya == null)
                                            var res = p.surahs[i].ayat.filter(function (obj) { return obj.id == $stateParams.aya });
                                        if (res.length > 0) {
                                            res[0].isMarked = true;
                                            var aya = res[0];
                                            $timeout(function () {
                                                $scope.selectAya(aya, false);
                                                if ($scope.repeatRangeFlag) {
                                                    $scope.currentAya = aya;
                                                    $scope.audioSettings.currentAyaObject = angular.copy($scope.currentAya)
                                                }
                                            })
                                            break;
                                        }
                                    }

                                }
                                $scope.setPageAyatFavourize(p);
                            });

                            p.pageName = p.pageNum < 10 ? "page00" + p.pageNum : p.pageNum < 100 ? "page0" + p.pageNum : "page" + p.pageNum;
                            //p.path = "img/quran/" + p.pageName + ".png";
                            //$ImageCacheFactory.Cache([
                            //   "img/quran/" + p.pageName + ".png"
                            //]);
                            p.path = $scope.imgPath + p.pageName + ".png";
                            $ImageCacheFactory.Cache([
                               $scope.imgPath + p.pageName + ".png"
                            ]);
                            $scope.pages[p.pageNum] = p;
                        }


                    })

                })(i);

            }
        }

        $q.all(promises).then(function () {
            if (typeof (callback) == "function")
                //$timeout(function () {
                callback();
            //}, 500);
        })

    }


    /// draw ayat shapes 
    $scope.setInitImageSizes = function () {
        $scope.ayaNumWidth = 130;
        $scope.ayaNumHeight = 130;
        $scope.initImageWidth = 1024;
        $scope.initLineHeight = 100;
        $scope.initTopSpace = 0;
        $scope.initRightSpace = 0;
    }

    $scope.getAyaCoords = function (SurahIndex, AyahIndex, Aya, prevAya, pageNum, SurahStartTop) {

        $scope.setInitImageSizes();
        var settingObject = localStorage.get("settings");

        if (pageNum < 3 || (settingObject.MoshafId == enums.MoshafId.shamrly && pageNum == 3)) {
            //$scope.initRightSpace = 220;
            //$scope.initLineHeight = 100;
            //$scope.initTopSpace = 40;
            $scope.initRightSpace = 170;
            if (settingObject.MoshafId == enums.MoshafId.qalon) {
                $scope.initRightSpace = 40;
            }
        }
        var pos1;
        if (SurahIndex == 0 && AyahIndex == 0 && Aya.ayahNum != 1) {
            pos1 = { x: $scope.initImageWidth - $scope.initRightSpace, y: $scope.initTopSpace }
        }
        else if (AyahIndex > 0) {
            pos1 = { x: prevAya.x, y: prevAya.y };
        }
        else if (Aya.ayahNum == 1) {
            pos1 = { x: $scope.initImageWidth - $scope.initRightSpace, y: SurahStartTop }
        }
        else { return null };
        var pos2 = { x: Aya.x, y: Aya.y };


        return $scope.getPolyCoords(pos1, pos2, pageNum, Aya)

    }

    $scope.getScreenSizeFactor = function (pageNum) {

        var id = "#page" + pageNum;
        var factor = $(id).width() / $scope.initImageWidth;
        return factor;
    }

    $scope.getLastAyaCoords = function (SurahIndex, AyahIndex, Aya, prevAya, pageNum, SurahStartTop, page) {
        $scope.cutting = false;
        var MoshafId = settings.settingsData.MoshafId.toString();
        $scope.setInitImageSizes();
        var length=page.allAyat.length;
        if ((page.allAyat[length - 1].x > 30 || page.allAyat[length - 1].y <14501) &&page.pageNum > 3 && MoshafId==enums.mosahfCopy.shamrly.id)  {
            $scope.cutting = true;
        
            var pos1 = { x: Aya.x, y: Aya.y };
            var pos2 = { x: 0, y: 1509 };
            var factor = $scope.getScreenSizeFactor(pageNum);
            var coords = [];
            $scope.numPoints = {
                x: (pos2.x) * factor,
                y: pos2.y * factor,
                width: $scope.ayaNumWidth * factor,
                height: $scope.ayaNumHeight * factor
            }

            var x1 = pos2.x;
            var y1 = pos2.y;

            coords.push(x1); coords.push(y1);

            var x2 = x1;
            var y2 = y1 + $scope.initLineHeight;
            coords.push(x2); coords.push(y2);
            var x3 = $scope.initImageWidth - $scope.initRightSpace;
            var y3 = y2;
            coords.push(x3); coords.push(y3);
            var x4 = x3;
            var y4 = pos1.y + $scope.initLineHeight;
            coords.push(x4); coords.push(y4);
            var x5 = pos1.x;
            var y5 = y4;
            coords.push(x5); coords.push(y5);
            var x6 = x5;
            var y6 = pos1.y;
            coords.push(x6); coords.push(y6);
            var x7 = $scope.initRightSpace;
            var y7 = y6;
            coords.push(x7); coords.push(y7);
            var x8 = x7;
            var y8 = pos2.y;
            coords.push(x8); coords.push(y8);
            var modCoords = coords.map(function (x) { return x * factor });
            return modCoords.join(",")
        }
    }
    //method takes 2 positions to get the coords between them (pos1=>prevAya , pos2=>required Aya)
    $scope.getPolyCoords = function (pos1, pos2, pageNum, Aya) {
        var factor = $scope.getScreenSizeFactor(pageNum);
        //   pos2.x = pos2.x - 40;
        Aya.numPoints = {
            x: (pos2.x) * factor,
            y: pos2.y * factor,
            width: $scope.ayaNumWidth * factor,
            height: $scope.ayaNumHeight * factor
        }
        var coords = [];
        var ayaNumCoords = [];
        var isSameLine = false;
        if (pos1.y < $scope.initTopSpace) { pos1.y = $scope.initTopSpace };
        if (pos2.y < $scope.initTopSpace) { pos2.y = $scope.initTopSpace };
        if (Math.round(pos2.y / 10) == Math.round(pos1.y / 10) || Math.abs(pos1.y - pos2.y) < 15) {
            // pos2.y = pos1.y;
            pos2.y = pos2.y > pos1.y ? pos2.y : pos1.y;
            pos1.y = pos2.y;
            isSameLine = true;
        }

        //check which mos7af we are using 
        //if : localstorage.setting.MoshafId == enums.MoshafId.shamrly
        //else if : localstorage.setting.MoshafId == enums.MoshafId.hafs
        var settingObject = localStorage.get("settings");
        if (settingObject.MoshafId == enums.MoshafId.shamrly) {
            if (pageNum == 2) {

                if (Aya.ayahNum == 2) {
                    var x1 = pos2.x;
                    var y1 = pos2.y;
                    coords.push(x1); coords.push(y1);

                    var x2 = x1;
                    var y2 = y1 + $scope.initLineHeight;
                    coords.push(x2); coords.push(y2);
                    var x3 = $scope.initImageWidth - $scope.initRightSpace;
                    var y3 = y2;
                    coords.push(x3); coords.push(y3);
                    var x4 = x3;
                    var y4 = pos1.y + $scope.initLineHeight + 50;
                    coords.push(x4); coords.push(y4);
                    var x5 = pos1.x;
                    var y5 = y4;
                    Aya.markPoint = { x: x5 * factor, y: y5 * factor }
                    coords.push(x5); coords.push(y5);
                    var x6 = x5;
                    var y6 = pos1.y;
                    coords.push(x6); coords.push(y6);
                    var x7 = $scope.initRightSpace;
                    var y7 = y6;
                    coords.push(x7); coords.push(y7);
                    var x8 = x7;
                    var y8 = pos2.y;
                    coords.push(x8); coords.push(y8);
                    //aya number position
                    // ayaNumCoords.push(x1); ayaNumCoords.push(y1);
                    var modCoords = coords.map(function (x) { return x * factor });

                    return modCoords.join(",")



                }
                else {

                    var x1 = pos2.x;
                    var y1 = pos2.y;
                    coords.push(x1); coords.push(y1);

                    var x2 = x1;
                    var y2 = y1 + $scope.initLineHeight;
                    coords.push(x2); coords.push(y2);
                    var x3 = $scope.initImageWidth - $scope.initRightSpace;
                    var y3 = y2;
                    coords.push(x3); coords.push(y3);
                    var x4 = x3;
                    var y4 = pos1.y + $scope.initLineHeight;
                    coords.push(x4); coords.push(y4);
                    var x5 = pos1.x;
                    var y5 = y4;
                    Aya.markPoint = { x: x5 * factor, y: y5 * factor }
                    coords.push(x5); coords.push(y5);
                    var x6 = x5;
                    var y6 = pos1.y;
                    coords.push(x6); coords.push(y6);
                    var x7 = $scope.initRightSpace;
                    var y7 = y6;
                    coords.push(x7); coords.push(y7);
                    var x8 = x7;
                    var y8 = pos2.y;
                    coords.push(x8); coords.push(y8);
                    //aya number position
                    // ayaNumCoords.push(x1); ayaNumCoords.push(y1);
                    var modCoords = coords.map(function (x) { return x * factor });
                    return modCoords.join(",")
                }
            }
            else if (pageNum == 3) {
                var x1 = pos2.x;
                var y1 = pos2.y + 20;
                coords.push(x1); coords.push(y1);

                var x2 = x1;
                var y2 = y1 + $scope.initLineHeight;
                coords.push(x2); coords.push(y2);
                var x3 = $scope.initImageWidth - 145;
                var y3 = y2;
                coords.push(x3); coords.push(y3);
                var x4 = x3;
                var y4 = pos1.y + $scope.initLineHeight;
                coords.push(x4); coords.push(y4);


























                var x5 = pos1.x;
                var y5 = y4;
                Aya.markPoint = { x: x5 * factor, y: y5 * factor }
                coords.push(x5); coords.push(y5);
                var x6 = x5;
                var y6 = pos1.y;
                coords.push(x6); coords.push(y6);
                var x7 = 145;
                var y7 = y6;
                coords.push(x7); coords.push(y7);



                var x8 = x7;
                var y8 = pos2.y;


                coords.push(x8); coords.push(y8);





                var modCoords = coords.map(function (x) { return x * factor });
                return modCoords.join(",")

            }
            else {
                var x1 = pos2.x;
                var y1 = pos2.y;
                coords.push(x1); coords.push(y1);

                var x2 = x1;
                var y2 = y1 + $scope.initLineHeight;
                coords.push(x2); coords.push(y2);
                var x3 = $scope.initImageWidth - $scope.initRightSpace;
                var y3 = y2;
                coords.push(x3); coords.push(y3);
                var x4 = x3;
                var y4 = pos1.y + $scope.initLineHeight;
                coords.push(x4); coords.push(y4);
                var x5 = pos1.x;
                var y5 = y4;
                Aya.markPoint = { x: x5 * factor, y: y5 * factor }
                coords.push(x5); coords.push(y5);
                var x6 = x5;
                var y6 = pos1.y;
                coords.push(x6); coords.push(y6);
                var x7 = $scope.initRightSpace;
                var y7 = y6;
                coords.push(x7); coords.push(y7);
                var x8 = x7;
                var y8 = pos2.y;
                coords.push(x8); coords.push(y8);
                //aya number position
                // ayaNumCoords.push(x1); ayaNumCoords.push(y1);
                var modCoords = coords.map(function (x) { return x * factor });
                return modCoords.join(",")
            }
        }
        else if (settingObject.MoshafId == enums.MoshafId.qalon){
            var x1 = pos2.x;
            var y1 = pos2.y;
            coords.push(x1); coords.push(y1);

            var x2 = x1;
            var y2 = y1 + $scope.initLineHeight;
            coords.push(x2); coords.push(y2);
            var x3 = $scope.initImageWidth - $scope.initRightSpace;
            var y3 = y2;
            coords.push(x3); coords.push(y3);
            var x4 = x3;
            var y4 = pos1.y + $scope.initLineHeight;
            coords.push(x4); coords.push(y4);
            var x5 = pos1.x;
            var y5 = y4;
            Aya.markPoint = { x: x5 * factor, y: y5 * factor }
            coords.push(x5); coords.push(y5);
            var x6 = x5;
            var y6 = pos1.y;
            coords.push(x6); coords.push(y6);
            var x7 = $scope.initRightSpace;
            var y7 = y6;
            coords.push(x7); coords.push(y7);
            var x8 = x7;
            var y8 = pos2.y;
            coords.push(x8); coords.push(y8);
            //aya number position
            // ayaNumCoords.push(x1); ayaNumCoords.push(y1);
            var modCoords = coords.map(function (x) { return x * factor });
            return modCoords.join(",")
        }
        else {
            if (pageNum == 1) {

                if (Aya.ayahNum == 2 || Aya.ayahNum == 3) {
                    var x1 = pos2.x;
                    var y1 = pos2.y;
                    coords.push(x1); coords.push(y1);
                    var x2 = x1;
                    var y2 = y1 + $scope.initLineHeight;
                    coords.push(x2); coords.push(y2);
                    var x3 = Aya.ayahNum == 3 ? $scope.initImageWidth - $scope.initRightSpace : $scope.initImageWidth - $scope.initRightSpace - (1 * 80);
                    var y3 = y2;
                    coords.push(x3); coords.push(y3);
                    var x4 = x3;
                    var y4 = pos1.y + $scope.initLineHeight;
                    coords.push(x4); coords.push(y4);
                    var modCoords = coords.map(function (x) { return x * factor });
                    return modCoords.join(",")
                }
                else if (Aya.ayahNum == 7) {
                    var x1 = pos2.x;
                    var y1 = pos2.y;
                    coords.push(x1); coords.push(y1);
                    var x2 = x1;
                    var y2 = y1 + $scope.initLineHeight;
                    coords.push(x2); coords.push(y2);
                    var x3 = $scope.initImageWidth - $scope.initRightSpace;
                    var y3 = y2;
                    var x31 = x3 - (2 * 80);
                    var y31 = y3;
                    coords.push(x31); coords.push(y31);
                    var x32 = x31;
                    var y32 = y1;
                    coords.push(x32); coords.push(y32);
                    var x33 = x3 - (1 * 80);
                    var y33 = y1;
                    coords.push(x33); coords.push(y33);
                    var x4 = x3;
                    var y4 = pos1.y + $scope.initLineHeight;
                    var x41 = x4 - (1 * 80);
                    var y41 = y4;
                    coords.push(x41); coords.push(y41);
                    var x5 = pos1.x;
                    var y5 = y4;
                    Aya.markPoint = { x: x5 * factor, y: y5 * factor }
                    coords.push(x5); coords.push(y5);
                    var x6 = x5;
                    var y6 = pos1.y;
                    coords.push(x6); coords.push(y6);
                    var x7 = $scope.initRightSpace;
                    var y7 = y6;
                    coords.push(x7); coords.push(y7);
                    var x71 = x7;
                    var y71 = y5;
                    coords.push(x71); coords.push(y71);
                    var x8 = x7;
                    var y8 = pos2.y;
                    var x81 = x1 - (1 * 100);
                    var y81 = y5;
                    coords.push(x81); coords.push(y81);
                    var x82 = x1 - (1 * 100);
                    var y82 = y1;
                    coords.push(x82); coords.push(y82);
                    //aya number position
                    // ayaNumCoords.push(x1); ayaNumCoords.push(y1);
                    var modCoords = coords.map(function (x) { return x * factor });
                    return modCoords.join(",")
                }
                else {
                    var x1 = pos2.x;
                    var y1 = pos2.y;
                    coords.push(x1); coords.push(y1);

                    var x2 = x1;
                    var y2 = y1 + $scope.initLineHeight;
                    coords.push(x2); coords.push(y2);
                    var x3 = $scope.initImageWidth - $scope.initRightSpace;
                    var y3 = y2;
                    coords.push(x3); coords.push(y3);
                    var x4 = x3;
                    var y4 = pos1.y + $scope.initLineHeight;
                    coords.push(x4); coords.push(y4);
                    var x5 = pos1.x;
                    var y5 = y4;
                    Aya.markPoint = { x: x5 * factor, y: y5 * factor }
                    coords.push(x5); coords.push(y5);
                    var x6 = x5;
                    var y6 = pos1.y;
                    coords.push(x6); coords.push(y6);
                    var x7 = $scope.initRightSpace;
                    var y7 = y6;
                    coords.push(x7); coords.push(y7);
                    var x8 = x7;
                    var y8 = pos2.y;
                    coords.push(x8); coords.push(y8);
                    //aya number position
                    // ayaNumCoords.push(x1); ayaNumCoords.push(y1);
                    var modCoords = coords.map(function (x) { return x * factor });
                    return modCoords.join(",")
                }
            }
            else if (pageNum == 2) {
                if (Aya.ayahNum == 5) {
                    var x1 = pos2.x;
                    var y1 = pos2.y - 30;
                    coords.push(x1); coords.push(y1);
                    var x2 = x1;
                    var y2 = y1 + $scope.initLineHeight - 30;
                    coords.push(x2); coords.push(y2);
                    var x3 = $scope.initImageWidth - $scope.initRightSpace;
                    var y3 = y2;
                    var x31 = x3 - (2 * 80);
                    var y31 = y3;
                    coords.push(x31); coords.push(y31);
                    var x32 = x31;
                    var y32 = y1;
                    coords.push(x32); coords.push(y32);
                    var x33 = x3 - (1 * 80);
                    var y33 = y1;
                    coords.push(x33); coords.push(y33);
                    var x4 = x3;
                    var y4 = pos1.y + $scope.initLineHeight - 30;
                    var x41 = x4 - (1 * 80);
                    var y41 = y4;
                    coords.push(x41); coords.push(y41);
                    var x5 = pos1.x;
                    var y5 = y4;
                    Aya.markPoint = { x: x5 * factor, y: y5 * factor }
                    //coords.push(x5); coords.push(y5);



                    var x51 = pos1.x + (1 * 80);
                    var y51 = y4;
                    coords.push(x51); coords.push(y51);


                    var x6 = x51;
                    var y6 = y1;
                    coords.push(x6); coords.push(y6);
                    //aya number position
                    // ayaNumCoords.push(x1); ayaNumCoords.push(y1);
                    var modCoords = coords.map(function (x) { return x * factor });
                    return modCoords.join(",")
                }
                else {
                    var x1 = pos2.x;
                    var y1 = pos2.y - 30;
                    coords.push(x1); coords.push(y1);

                    var x2 = x1;
                    var y2 = y1 + $scope.initLineHeight - 30;
                    coords.push(x2); coords.push(y2);
                    var x3 = $scope.initImageWidth - $scope.initRightSpace;
                    var y3 = y2;
                    coords.push(x3); coords.push(y3);
                    var x4 = x3;
                    var y4 = pos1.y + $scope.initLineHeight - 30;
                    coords.push(x4); coords.push(y4);
                    var x5 = pos1.x;
                    var y5 = y4;
                    Aya.markPoint = { x: x5 * factor, y: y5 * factor }
                    coords.push(x5); coords.push(y5);
                    var x6 = x5;
                    var y6 = pos1.y - 30;
                    coords.push(x6); coords.push(y6);
                    var x7 = Aya.ayahNum == 2 ? $scope.initRightSpace + (1 * 80) : $scope.initRightSpace;
                    var y7 = y6;
                    coords.push(x7); coords.push(y7);
                    var x8 = x7;
                    var y8 = pos2.y - 30;
                    coords.push(x8); coords.push(y8);
                    //aya number position
                    // ayaNumCoords.push(x1); ayaNumCoords.push(y1);
                    var modCoords = coords.map(function (x) { return x * factor });
                    return modCoords.join(",")
                }

            }
            else {
                var x1 = pos2.x;
                var y1 = pos2.y;
                coords.push(x1); coords.push(y1);

                var x2 = x1;
                var y2 = y1 + $scope.initLineHeight;
                coords.push(x2); coords.push(y2);
                var x3 = $scope.initImageWidth - $scope.initRightSpace;
                var y3 = y2;
                coords.push(x3); coords.push(y3);
                var x4 = x3;
                var y4 = pos1.y + $scope.initLineHeight;
                coords.push(x4); coords.push(y4);
                var x5 = pos1.x;
                var y5 = y4;
                Aya.markPoint = { x: x5 * factor, y: y5 * factor }
                coords.push(x5); coords.push(y5);
                var x6 = x5;
                var y6 = pos1.y;
                coords.push(x6); coords.push(y6);
                var x7 = $scope.initRightSpace;
                var y7 = y6;
                coords.push(x7); coords.push(y7);
                var x8 = x7;
                var y8 = pos2.y;
                coords.push(x8); coords.push(y8);
                //aya number position
                // ayaNumCoords.push(x1); ayaNumCoords.push(y1);
                var modCoords = coords.map(function (x) { return x * factor });
                return modCoords.join(",")
            }

        }

    }



    //page slider 
    var default_slides_indexes = [-1, 0, 1];
    var default_slides = [];
    var direction = 0;
    var head;
    var tail;
    $rootScope.slides = [];


    $scope.initSlide = function () {
        var prevNum = $scope.start == 1 ? 1 : $scope.start - 1;
        var nexNum = $scope.start == $scope.end - 1 ? $scope.start : $scope.start + 1
        if ($scope.appMode == enums.appModes.review) {
            var indexOfStart = $scope.reviewTarget.pages.indexOf($scope.start);
            prevNum = $scope.start == $scope.reviewTarget.pages[0] ? $scope.start : $scope.reviewTarget.pages[indexOfStart - 1];

            nexNum = typeof ($scope.reviewTarget.pages[indexOfStart + 1]) != "undefined" ? $scope.reviewTarget.pages[indexOfStart + 1] : prevNum;
        }
        default_slides = [
          makeSlide(default_slides_indexes[0], {
              title: 'default slide', page: $scope.pages[nexNum], get color() { return getColor(this.nr) }
          }),
          makeSlide(default_slides_indexes[1], {
              title: 'default slide', page: $scope.pages[$scope.start], get color() { return getColor(this.nr) }
          }),
          makeSlide(default_slides_indexes[2], {
              title: 'default slide', page: $scope.pages[prevNum], get color() { return getColor(this.nr) }
          })
        ];
        //if ($scope.slides.length==0)
        $rootScope.slides = angular.copy(default_slides);
        $rootScope.slides.forEach(function (p) {
            p.page = $scope.pages[p.page.pageNum]
        })
        head = $rootScope.slides[0].nr;
        tail = $rootScope.slides[$rootScope.slides.length - 1].nr;
        $timeout(function () {
            if ($scope.start == $scope.initStart) {

                $scope.enableSlideLeft = false;
            }
            if ($scope.start == $scope.end - 1) {
                $scope.enableSlideRight = false;
            }


        });

        var page = $scope.pages[$scope.start];
        $scope.setCurPage(page);

    }


    var createSlideData = function (new_direction, old_direction) {
        var nr;
        //  $scope.curPage = $scope.start + (nr * -1);
        if (new_direction === 1) {
            tail = old_direction < 0 ? head + 3 : tail + 1;
        }
        else {
            head = old_direction > 0 ? tail - 3 : head - 1;
        }

        nr = new_direction === 1 ? tail : head;
        if (default_slides_indexes.indexOf(nr) !== -1) {
            return default_slides[default_slides_indexes.indexOf(nr)];
        };

        var pgNum = $scope.start + (nr * -1);
        if ($scope.appMode == enums.appModes.review) {
            //  var startPage = $scope.reviewTarget.pages.filter(function(p){return p==})
            var startIndex = $scope.reviewTarget.pages.indexOf($scope.start);
            pgNum = startIndex + (nr * -1);
            pgNum = $scope.reviewTarget.pages[pgNum]
        }
        //   if($scope.appMode==)

        $scope.loadPages(pgNum, function () {
        })

        var s = makeSlide(nr, {
            title: 'generated slide', page: $scope.pages[pgNum], get color() { return getColor(this.nr) }
        });



        return s;
    };

    //***----------page  initailization end ----------****/


    //***----------page  events start ----------****/

    // $scope.PageTitle = {};
    $scope.dragLeft = function (slide, $event) {
        if (typeof (slide.page) != "undefined") {

            //if (slide.page.pageNum - 1 == $scope.initStart) {
            //    $scope.enableSlideLeft = true;
            //}

            if (slide.page.pageNum <= $scope.initStart) {
                //   $scope.enableSlideLeft = true;
                //$timeout(function () {
                $scope.enableSlideLeft = false;
                //});
            }
            else {

                $scope.enableSlideLeft = true;
            }
            $scope.removePopovers();
        }

    }
    $scope.dragRight = function (slide, $event) {
        //var slideIndex = $scope.slides.indexOf(slide);
        //var prevIndex = slideIndex < 2 ? slideIndex + 1 : 0;
        //var prevSlide = $scope.slides[prevIndex];

        if (typeof (slide.page) != "undefined") {
            //if (slide.page.pageNum + 1 == $scope.end - 1)
            //{
            //    $scope.enableSlideRight = true;
            //}
            if (slide.page.pageNum >= $scope.end - 1) {
                // $scope.enableSlideRight = true;
                //$timeout(function () {


                $scope.enableSlideRight = false;
                //})
            }
            else {
                $scope.enableSlideRight = true;
            }
            $scope.removePopovers();
        }
    }

    $scope.hideBar = false;
    $scope.hideMark = false;
    //layout-methods
    $scope.hideNavBar = function () {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
        document.getElementsByClassName('tab-nav')[0].style.display = 'none';
    };

    $scope.showNavBar = function () {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
        document.getElementsByClassName('tab-nav')[0].style.display = 'flex';
    };

    $scope.toggleBars = function ($event, aya) {

        if ($scope.isNotesModeEnabled == true) {
            if (typeof (aya) != "undefined")
                $scope.selectAya(aya, false);
            $scope.AddEditNote(aya);
        }
        else if ($rootScope.isTestMemorizeMode == true) {

            if ($scope.hideFrom <= $scope.pageLastAya && aya.id >= $scope.hideFrom) {
                if ($scope.isClicked == true) {
                    $scope.hideFrom = aya.id + 1;
                    $scope.isClicked = false;
                }
                else {
                    $scope.hideFrom += 1;
                    $scope.isClicked = true;
                }

            }
            else if ($scope.hideFrom == aya.id + 1 && ( aya.x > 30 || aya.y <14501))
            {
              
                $scope.hideFrom += 1;
                $scope.isClicked = true;
       
            }
            else if ($scope.hideFrom > aya.id) {
                $scope.hideFrom = aya.id;
            }
        }
        else {
            $scope.toggleAudioBar();
            if (!$scope.inAudioMode) {
                if (!$scope.isHoldFired) {
                    if (typeof ($scope.currentAya) != "undefined" && $scope.currentAya.id > 0) {
                        $scope.currentAya = {};
                        $scope.removePopovers();
                    }
                    else {
                        $scope.hideMark = !$scope.hideMark;
                        if ($scope.showlayout == true) {
                            $scope.showlayout = false;
                            $scope.hideNavBar();
                        }
                        else {
                            $scope.showlayout = true;
                            $scope.showNavBar();
                        }
                    }
                }
            }
        }
        setTimeout(function () {
            $scope.isClicked = false;
        }, 200);
    }
    $scope.toggleAudioBar = function () {
        if ($scope.inAudioMode && $scope.currentAya.id > 0) {
            if ($scope.isAudioBarShown == true) {
                $scope.audioBar.hide();
            }
            else {

                $scope.audioBar.show();
            }
        }
    }


    $scope.getCurPage = function () {
        var index = $ionicSlideBoxDelegate.currentIndex();
        var curSlide = $rootScope.slides[index];
        for (var i = 0 ; i < 3; i++) {
            if ($rootScope.slides[i].page.pageNum == $rootScope.slides[index].page.pageNum + 1) {
                $rootScope.nextSlide = $rootScope.slides[i];
            }
        }
        if (settings.settingsData.markMemorizedAyat) {
            $scope.setPageAyatMemorize($rootScope.nextSlide.page);
        }
        var page = curSlide.page;
        if (typeof (page) != "undefined") {
        }

        return page;
    }
    $scope.curPage = {};
    $scope.setCurPage = function (page) {
        if (typeof (page) != "undefined") {

            $scope.curPage = page;
            //if ($scope.appMode == enums.appModes.memorize) {
            //    $scope.curPage.title = $scope.target.title;
            //    $scope.title = $scope.target.title;
            //}
            //else if( $scope.appMode == enums.appModes.review)
            //{
            //    $scope.title = $scope.target.title;
            //}
            //else {
            //    $scope.curPage.title = $scope.curPage.surah;

            //}
            var targetId = $scope.target.id;
            if ($scope.appMode == enums.appModes.review) {
                targetId = $scope.reviewTarget.id;
            }
            mark.setLastPage(page.pageNum, $scope.appMode, targetId);
        }

    }

    $scope.slideChanged = function (i) {
        //var MoshafId = settings.settingsData.MoshafId;
        //var pageNum = $scope.getCurPage().pageNum;
        //$scope.downloadImages(MoshafId, false, pageNum + 1, pageNum+3);
        $scope.slideIndex=i;
        $ionicScrollDelegate.scrollTop(true);
        $scope.currentAya = {};
        $scope.removePopovers();
        $scope.isNotesModeEnabled = false;
        if (!isNaN(i)) {
            var
              previous_index = i === 0 ? 2 : i - 1,
              next_index = i === 2 ? 0 : i + 1,
              new_direction = $rootScope.slides[i].nr > $rootScope.slides[previous_index].nr ? 1 : -1;
            angular.copy(
              createSlideData(new_direction, direction),
              $scope.slides[new_direction > 0 ? next_index : previous_index]
            );
            direction = new_direction;
        }
        $timeout(function () {
            var page = $scope.getCurPage();
            if (page.pageNum >= $scope.end - 1) {
                $scope.enableSlideRight = false;
            }
            else {
                $scope.enableSlideRight = true;
            }
            if (page.pageNum <= $scope.initStart) {
                $scope.enableSlideLeft = false;
            }
            else {
                $scope.enableSlideLeft = true;
            }
            if (page.allAyat) {
                $scope.hideFrom = page.allAyat[0].id;
                $scope.pageLastAya = page.allAyat[page.allAyat.length - 1].id
            }
            $scope.setCurPage(page);
            if (settings.settingsData.markMemorizedAyat) {
                $scope.setPageAyatMemorize(page);
            }
            $scope.setPageAyatFavourize(page);
        }, 200);
    };

    $scope.setFontSize = function () {
        //  alert("set font")
        $timeout(function () {


            var scrollHeight = $(".curSlide .scroll").height();
            var contHeight = $(".curSlide .content-read").height();
            var fontSize = parseInt($(".curSlide .content-read").css("font-size"));
            var ratio = scrollHeight / contHeight;
            var newFontSize = ((ratio * fontSize) + 1).toString() + "px";
            $(".curSlide .content-read").css("font-size", newFontSize)
        });
    }
    //***----------page  events end ----------****/

    window.addEventListener("orientationchange", function () {
        $scope.removePopovers();
        $ionicScrollDelegate.scrollTop();
        $ionicScrollDelegate.$getByHandle('mainScroll').resize();

    }, false);
    //$scope.$watch($ionicSideMenuDelegate.isOpen, function (value) {
    //    //do something
    //    $scope.removePopovers();
    //});
    $scope.$watch(function () {
        return $ionicSideMenuDelegate.getOpenRatio();
    }, function (value) {
        $scope.removePopovers();
    });
    $scope.$on('$destroy', function () {
        $scope.removePopovers();
    });

    //Audio --------------------------------------------------------------------------------------------------------------------Audio//

    $scope.audioSettings = {
        repeat: 1,
        maxRepeat: 10,
        currentAya: 0,
        isPlaying: false,
        isPaused: false,
        stoppedByUser: false,
        curRepeatNumber: 1
    }

    $scope.resetAudioSettings = function () {
        $scope.audioSettings.isPlaying = false;
        $scope.audioSettings.curRepeatNumber = 1;
        $scope.audioSettings.currentAya = 0;
        audio.audioSettings.currentAya = 0;
        audio.audioSettings.status = 0;
        //  $scope.audioSettings.stoppedByUser = false;
        $scope.audioSettings.loading = false;
        audio.currentAyaNumber = "";
    }
    $scope.playAudio = function (ayaNumber, quality = $scope.audioSettings.quality, rate = $scope.audioSettings.rate) {
        $scope.ayaNumber = ayaNumber;
        //check ayahNum is between the min and max ayat AND check we are not in test memorize mode
        if (ayaNumber >= $scope.minAya && ayaNumber <= $scope.maxAya && $rootScope.isTestMemorizeMode != true) {
            //////////////////////////////////////////////////part 1 detecting automatic player behaviour
            //ayaNumber = aya.id;
            //keep player setting for the same ayah AND keep ayah marker on the same ayah in case of repitition
            if ($scope.audioSettings.curRepeatNumber < $scope.audioSettings.repeat && audio.audioSettings.currentAya == ayaNumber && $scope.repeatRangeFlag == false) {
                $scope.audioSettings.currentAya = ayaNumber;
                audio.audioSettings.currentAya = ayaNumber;
                $scope.audioSettings.loading = false;
                $scope.audioSettings.isPlaying = true;
                //$scope.audioSettings.stoppedByUser = true;
                $scope.goToAya(ayaNumber, false)
            }
                //sound stopped by user
                //go to the new ayah and set the player setting if different ayah number is selected
            else if (audio.audioSettings.currentAya != ayaNumber) {
                audio.stop();
                // $scope.audioSettings.currentAya = ayaNumber;
                $scope.audioSettings.curRepeatNumber = 1;
                // $scope.audioSettings.repeat = 1;
                $scope.audioSettings.stoppedByUser = true;
                audio.audioSettings.stoppedByUser = true;
                var CurAya=moshafdata.getAyaByID(ayaNumber);
                var CurAyaPage=$scope.pages[CurAya.PageNum];
                var PrevPage = $scope.getCurPage();
                if(CurAyaPage.pageNum<PrevPage.pageNum){
                    //var index = $ionicSlideBoxDelegate.currentIndex();
                    //setTimeout(function(){
                    // do stuff here
                    //$scope.slideChanged($scope.slideIndex-1);
                    //$ionicSlideBoxDelegate.update();
                    //}, 3000)
                    
                }
                $scope.goToAya(ayaNumber, false);
                //var nextAya = $filter('filter')(CurAyaPage.allAyat, { id: ayaNumber });
                //if (nextAya.length > 0) {
                //    $scope.selectAya(nextAya[0], false);
                //    //$scope.goToPage(CurAyaPage.pageNum, CurAya.id, 6236, true, 1);
                //    var index = $ionicSlideBoxDelegate.currentIndex();

                //}
                //else {
                //    if (ayaNumber > CurAyaPage.allAyat[CurAyaPage.allAyat.length - 1].id) {
                //        if (CurAyaPage.pageNum < $scope.end - 1) {
                //            //if($scope.appMode != enums.appModes.review)
                //            $scope.gotoNextPage();
                //        }
                //    }
                //    else {
                //        if (CurAyaPage.pageNum > $scope.initStart) {
                //            $scope.gotoPrevPage();
                //        }
                //    }
                //    var nextId = ayaNumber;

                //    $timeout(function () {
                //        var page = $scope.getCurPage();
                //        var nextAya = $filter('filter')(page.allAyat, { id: nextId });
                //        if (nextAya.length > 0) {
                //            $scope.selectAya(nextAya[0], false);

                //        }
                //    })
                //}
            }
            ///////////////////////////////////////////////////////////////////////////////////end part 1

            //////////////////////////////////////////////////part 2 Getting ayah from API and Playing it then returning Status
            if (audio.mediaStatus == audio.statusEnum.running && audio.audioSettings.currentAya == ayaNumber) {
                audio.pause();

            }

            else {
                $scope.audioSettings.loading = true;
                $scope.audioSettings.isPlaying = false;
                audio.play(ayaNumber, quality, $scope.audioSettings.rate).then(function (duration) {

                }, function (err) {
                    //alert(err)
                    if (err == "networkError") {
                        $scope.stopAudio();
                    }
                }
                , function (status) {//
                    if (status == audio.statusEnum.paused) {
                        $scope.audioSettings.isPlaying = false;
                        $scope.audioSettings.loading = false;


                    }
                    if (status == audio.statusEnum.running) {
                        $scope.audioSettings.currentAyaObject = angular.copy($scope.currentAya);
                        $scope.audioSettings.loading = false;
                        $scope.audioSettings.stoppedByUser = false;
                        audio.audioSettings.stoppedByUser = false;
                        $scope.audioSettings.currentAya = ayaNumber;
                        audio.audioSettings.currentAya = ayaNumber;
                        $scope.audioSettings.isPlaying = true;
                    }
                    // ayah finished: code logic to determine what is next ayah to be played
                    if (status == audio.statusEnum.stopped && audio.audioSettings.stoppedByUser == false) {

                        audio.stop();
                        //repitition single ayah mode(True)
                        if ($scope.audioSettings.curRepeatNumber < $scope.audioSettings.repeat && $scope.repeatRangeFlag == false) {
                            $scope.audioSettings.curRepeatNumber += 1;
                            $scope.playAudio(ayaNumber, $scope.audioSettings.quality, $scope.audioSettings.rate);

                        }
                        else {
                            if (ayaNumber < $scope.maxAya) {

                                var curPlayedAya;
                                //setting ayah to be played
                                if (ayaNumber == audio.audioSettings.currentAya || audio.audioSettings.currentAya == 0) {
                                    curPlayedAya = $scope.audioSettings.currentAyaObject.nextId;//next ayah is setted
                                    var page = $scope.getCurPage();//detect ayah's page
                                    var lastAyaInPage = page.allAyat[page.allAyat.length - 1].id;
                                    if (curPlayedAya > lastAyaInPage && page.pageNum >= $scope.end - 1) {
                                        //  $scope.currentAya.nextId = 0;
                                        curPlayedAya = 0;
                                    }

                                }
                                else {
                                    curPlayedAya = $scope.audioSettings.currentAyaObject;
                                }

                                //play setted ayah
                                if (curPlayedAya > 0) {
                                    $scope.goToAya(curPlayedAya, false)
                                    if ($scope.repeatRangeFlag == false) {
                                        $scope.audioSettings.curRepeatNumber = 1;
                                    }
                                    if ($state.current.name == "tab.page" && ($scope.repeatRangeFlag == false || (curPlayedAya >= $scope.repeatStartAyah && curPlayedAya <= $scope.repeatEndAyah))) {
                                        $scope.audioSettings.currentAya = curPlayedAya;
                                        audio.audioSettings.currentAya = curPlayedAya;
                                        $scope.playAudio(curPlayedAya, $scope.audioSettings.quality, $scope.audioSettings.rate);
                                    }
                                    else if ($scope.repeatRangeFlag == true /*no need for the next condition */ && curPlayedAya > $scope.repeatEndAyah) {
                                        if ($scope.audioSettings.curRepeatNumber < $scope.audioSettings.repeat) {
                                            //increment repeatition
                                            $scope.audioSettings.curRepeatNumber += 1;
                                            //$state.go("tab.page", { page: pageNum, aya: ayaNumStart, repeatMode: repeatMode, ayaEnd: ayaNumEnd, repeatCount: repeatCount });
                                            var cnt = Number($stateParams.repeatCount);
                                            cnt--;
                                            $scope.stopAudio();
                                            setTimeout(function () {
                                                $scope.goToPage($stateParams.page, $stateParams.aya, $stateParams.ayaEnd, $stateParams.repeatMode, cnt);
                                            })
                                            //gotoAyaStart
                                            //console.log("Will Repeat Repeatition Part")
                                            
                                            //$scope.currentAya = angular.copy(ayatData.getStAyRep());

                                            //$scope.goToAya($scope.currentAya.id, false)
                                            //$scope.audioSettings.currentAya = $scope.currentAya.id;
                                            //audio.audioSettings.currentAya = $scope.currentAya.id;
                                            //$scope.playAudio($scope.currentAya.id, $scope.audioSettings.quality);

                                        }
                                        else {//sylabol repetition limit reached
                                            console.log("will Terminate Repeatition")
                                            //stop audio
                                            audio.stop();
                                            //repitition flag disable
                                            $scope.repeatRangeFlag = false
                                            $scope.model.formRepeatFlag = false;

                                            //reset repeatition count
                                            $scope.audioSettings.curRepeatNumber = 1;
                                            //start end repitition ayah redefault
                                            $scope.repeatStartAyah = 1;
                                            $scope.repeatEndAyah = 6236;
                                            $scope.stopAudio();
                                        }
                                    }
                                    else
                                        audio.stop();
                                    //$scope.playAudio(ayaNumber + 1);
                                }
                                else {
                                    //    $scope.audioSettings.loading = false;
                                    $scope.audioSettings.isPlaying = false;
                                }
                            }
                        }
                    }
                    //alert(status)
                })
                ;
            }
            ///////////////////////////////////////////////////////////////////////////////////end part 2
        }


    }
        $scope.getPlayingAyaSurahName = function () {
            //if ($scope.audioSettings.currentAya > 0) {

            //var page = $scope.getCurPage();
            //var aya = page.allAyat.filter(function (i) { return i.id == $scope.audioSettings.currentAya })[0];
            if (typeof ($scope.currentAya) != "undefined")
                return moshafdata.getSurah($scope.currentAya.surah).Name;
            //}
        }
        $scope.increaseRepeat = function () {

            if ($scope.audioSettings.repeat < $scope.audioSettings.maxRepeat) {
                $scope.audioSettings.repeat += 1;
            }
            else {
                $scope.audioSettings.repeat = 10;
            }
        }
        $scope.decreaseRepeat = function () {

            if ($scope.audioSettings.repeat > 1 ) {
                $scope.audioSettings.repeat -= 1;
            }
            else {
                $scope.audioSettings.repeat = 1;
            }
        }

        $ionicModal.fromTemplateUrl('app/templates/popovers/play-audio.html', {
            id: '2',
            scope: $scope,
            animation: 'slide-in-up',
            //backdropClickToClose: false,
        }).then(function (modal) {
            $scope.audioBar = modal;

        });
        $scope.$on('modal.hidden', function (event, modal) {
            // do something
            //  alert('Modal ' + modal.id + ' is hidden!');
            $scope.isAudioBarShown = false;
        });
        $scope.showAudioBar = function (aya) {

            $scope.currentRecitation = recitations.currentRecitation;
            $scope.inAudioMode = true;
            $scope.isAudioBarShown = true;
            $scope.removePopovers();
            $scope.resetAudioSettings();
            $scope.audioSettings.currentAya = aya.id;
            // audio.audioSettings.currentAya = aya.id;
            $scope.aya = aya;
            $scope.audioSettings = $scope.audioSettings;
            $scope.audioBar.show();
            //$scope.playAudio(aya.id, $scope.audioSettings.quality);
            //$scope.playAudio(aya.id, $scope.audioSettings.quality);

        }


        $scope.hideAudioBar = function () {
            if ($scope.audioBar)
                $scope.audioBar.hide();
            $scope.isAudioBarShown = false;
            // $scope.audioBar.remove();
            //   $scope.audioSettings.stopedByUser = true;
        }



        $scope.stopAudio = function () {

            $scope.inAudioMode = false;
            $scope.audioSettings.stoppedByUser = true;
            audio.audioSettings.stoppedByUser = true;
            $scope.hideAudioBar();
            $scope.audioSettings.loading = false;

            $scope.resetAudioSettings();
            audio.stop();
        }
        $scope.stopAudio();
        //Sharing 
        $scope.initCanvasVariables = function () {


            $scope.corner2 = new Image();
            $scope.corner2.src = 'img/corner2.png';
            $scope.corner1 = new Image();
            $scope.corner1.src = 'img/corner.png';
            $scope.CT = new CanvasText;
            $scope.Canvas = document.getElementById("canvas");
            $scope.Context = $scope.Canvas.getContext("2d");


            /**
             * It's not necessary to define the configuration & classes
             * every execution time, so we do this outside the interval.
             */
            $scope.CT.config({
                canvas: $scope.Canvas,
                context: $scope.Context,
                fontFamily: "Verdana",
                fontSize: "14px",
                fontWeight: "normal",
                fontColor: "#000",
                lineHeight: "24"
            });


        }
        $scope.getAyaHeight = function (aya) {
            var height = $('#aya' + aya.id)[0].getBoundingClientRect().height;
            return height;
        }
        $scope.PIXEL_RATIO = (function () {
            var ctx = document.createElement("canvas").getContext("2d"),
                dpr = window.devicePixelRatio || 1,
                bsr = ctx.webkitBackingStorePixelRatio ||
                      ctx.mozBackingStorePixelRatio ||
                      ctx.msBackingStorePixelRatio ||
                      ctx.oBackingStorePixelRatio ||
                      ctx.backingStorePixelRatio || 1;

            return dpr / bsr;
        })();



        $scope.initCanvasText = function (aya) {
            aya = $scope.currentAya;

            $('#canvas').remove(); // this is my <canvas> element
            $('#canvasBody').append('<canvas id="canvas" style="padding-left: 10px; padding-right: 0; margin-left: auto; margin-right: auto; display: none; width: 100%; height :100%;    background: white;"></canvas>');
            $scope.Canvas = document.getElementById("canvas");

            //$scope.Canvas = $scope.createHiDPICanvas($scope.Canvas.width, $scope.Canvas.height)
            $scope.Context = $scope.Canvas.getContext("2d");

            var height = $scope.getAyaHeight(aya) * $scope.PIXEL_RATIO;

            $scope.Canvas.width = $scope.Canvas.width * $scope.PIXEL_RATIO;
            $scope.Canvas.height = $scope.Canvas.height * $scope.PIXEL_RATIO;
            //     can.height = h * ratio;
            $scope.Canvas.height = $scope.Canvas.height > height ? $scope.Canvas.height : height;

            // $scope.Canvas.height = $scope.Canvas.height > height ? $scope.Canvas.height : (height+30* $scope.PIXEL_RATIO);
            //$scope.Canvas.height=$scope.Canvas.height+10* $scope.PIXEL_RATIO;
            $scope.Canvas.height += 50*$scope.PIXEL_RATIO;
            var MoshafId = settings.settingsData.MoshafId.toString();
            if (MoshafId == enums.MoshafId.warsh)    
            {
                $scope.CT.config({
                    canvas: $scope.Canvas,
                    context: $scope.Context,
                    fontFamily: "14px UthmanicWarsh1 Ver05",
                    fontWeight: "normal",
                    fontColor: "#b7b28b",
                    lineHeight: "25",
                    textAlign: "center"

                });
            }
            else if (MoshafId == enums.MoshafId.qalon)    
            {
                $scope.CT.config({
                    canvas: $scope.Canvas,
                    context: $scope.Context,
                    fontFamily: "14px UthmanicQaloon1 Ver05",
                    fontWeight: "normal",
                    fontColor: "#b7b28b",
                    lineHeight: "25",
                    textAlign: "center"

                });
            }
            else
            {
                $scope.CT.config({
                    canvas: $scope.Canvas,
                    context: $scope.Context,
                    fontFamily: "14px UthmanicHafs1 Ver12",
                    fontWeight: "normal",
                    fontColor: "#b7b28b",
                    lineHeight: "25",
                    textAlign: "center"

                });
            }

            var text = aya.verse;

            var width = $scope.Canvas.width;
            var height = $scope.Canvas.height;
            $scope.CT.context.setTransform($scope.PIXEL_RATIO, 0, 0, $scope.PIXEL_RATIO, 0, 0);
            $scope.CT.context.drawImage($scope.corner2, 0, 0);

            $scope.CT.context.drawImage($scope.corner1, width - $scope.corner1.width * $scope.PIXEL_RATIO, 0);

            $scope.CT.context.strokeStyle = "#b7b28b";
            $scope.CT.context.strokeRect(0, 0, width, height);
            $scope.CT.context.strokeRect(4, 4, width - 8, height - 8);

            aya.surahName = moshafdata.getSurah(aya.surah).Name;

            $scope.CT.context.fillStyle = "white";
            $scope.CT.context.fillRect(0, 0, width, height);
            $scope.CT.context.fill();
            if (MoshafId == enums.MoshafId.warsh)    
            {
                $scope.CT.context.font = "14px UthmanicWarsh1 Ver05";
            }
            else if (MoshafId == enums.MoshafId.qalon)    
            {
                $scope.CT.context.font = "14px UthmanicQaloon1 Ver05";
            }
            else
            {
                $scope.CT.context.font = "14px UthmanicHafs1 Ver12";
            }
            $scope.CT.context.fillStyle = "black";
            $scope.CT.context.drawImage($scope.corner2, 0, 0);
            $scope.CT.context.drawImage($scope.corner1, (width / $scope.PIXEL_RATIO) - $scope.corner1.width, 0);
            $scope.CT.context.textAlign = "center";
            wrapText($scope.CT.context, text, (width / $scope.PIXEL_RATIO) / 2, 40, (width / $scope.PIXEL_RATIO) - 50, 30);
            $scope.CT.context.textAlign = "center";
            $scope.CT.context.font = "12px UthmanicHafs1 Ver12";
            if (MoshafId == enums.MoshafId.warsh)    
            {
                $scope.CT.context.font = "12px UthmanicWarsh1 Ver05";
            }
            else if (MoshafId == enums.MoshafId.qalon)    
            {
                $scope.CT.context.font = "12px UthmanicQaloon1 Ver05";
            }
            else
            {
                $scope.CT.context.font = "12px UthmanicHafs1 Ver12";
            }
            var ayaNumber = $scope.getArabicNumber(aya.ayahNum).replace(/\s/g, '');
            ayaNumber=reverseNumber(ayaNumber);
            $scope.CT.context.fillText("سورة " + aya.surahName + " - " + "آية رقم" + ayaNumber, (width / $scope.PIXEL_RATIO) / 2, (height / $scope.PIXEL_RATIO)-(10*$scope.PIXEL_RATIO));

        };

        function reverseNumber(num){
            return String(num).split("").reverse().join("")
        }


        $scope.shareAya = function (aya) {

            var MoshafId = settings.settingsData.MoshafId.toString();
            if (MoshafId == enums.MoshafId.warsh)    
            {
              document.fonts.load('14px "UthmanicWarsh1 Ver05"').then(function () {
                aya.surahName = moshafdata.getSurah(aya.surah).Name;
                $scope.initCanvasText(aya);


                var width = $scope.CT.context.canvas.width;
                var height = $scope.CT.context.canvas.height;

                var can = document.getElementById('canvas');
                var ctx = can.getContext('2d');

                //ctx.fillRect(50,50,50,50);
                var img = new Image();

                img.onload = function () {

                    window.plugins.socialsharing.share(null,
                     null,
                     img.src
                     ,
                  null
                     )
            };
                img.src = can.toDataURL();;
            })
            
            }
            else         if (MoshafId == enums.MoshafId.qalon)    
            {
                document.fonts.load('14px "UthmanicQaloon1 Ver05"').then(function () {
                    aya.surahName = moshafdata.getSurah(aya.surah).Name;
                    $scope.initCanvasText(aya);


                    var width = $scope.CT.context.canvas.width;
                    var height = $scope.CT.context.canvas.height;

                    var can = document.getElementById('canvas');
                    var ctx = can.getContext('2d');

                    //ctx.fillRect(50,50,50,50);
                    var img = new Image();

                    img.onload = function () {

                        window.plugins.socialsharing.share(null,
                         null,
                         img.src
                         ,
                      null
                         )
                    };
                    img.src = can.toDataURL();;
                })
            
            }
    else{

            document.fonts.load('14px "UthmanicHafs1 Ver12"').then(function () {
                aya.surahName = moshafdata.getSurah(aya.surah).Name;
                $scope.initCanvasText(aya);


                var width = $scope.CT.context.canvas.width;
                var height = $scope.CT.context.canvas.height;

                var can = document.getElementById('canvas');
                var ctx = can.getContext('2d');

                //ctx.fillRect(50,50,50,50);
                var img = new Image();

                img.onload = function () {

                    window.plugins.socialsharing.share(null,
                     null,
                     img.src
                     ,
                  null
                     )
                };
                img.src = can.toDataURL();;
            })

    }
        }

        $scope.initCanvasVariables();
        function wrapText(context, text, x, y, maxWidth, lineHeight) {
            var cars = text.split("\n");

            for (var ii = 0; ii < cars.length; ii++) {

                var line = "";
                var words = cars[ii].split(" ");

                for (var n = 0; n < words.length; n++) {
                    var testLine = line + words[n] + " ";
                    var metrics = context.measureText(testLine);
                    var testWidth = metrics.width;

                    if (testWidth > maxWidth) {
                        context.fillText(line, x, y);
                        line = words[n] + " ";
                        y += lineHeight;
                    }
                    else {
                        line = testLine;
                    }
                }

                context.fillText(line, x, y);
                y += lineHeight;
            }
        }




        //Notes
        $ionicModal.fromTemplateUrl('app/templates/popovers/add-note.html', {
            id: '2',
            scope: $scope,
            animation: 'slide-in-up',
            //backdropClickToClose: false,
        }).then(function (modal) {
            $scope.noteModal = modal;

        });

        $scope.AddEditNote = function (aya) {

            $scope.noteModel = notes.getNote(aya.id);
            $scope.noteModel.aya = aya;
            $scope.noteModel.ayaId = aya.id;
            $scope.noteModal.pageNumber = aya.PageNum;
            $scope.noteModel.ayaNumber = aya.ayahNum;
            $scope.noteModel.surahName = moshafdata.getSurah(aya.surah).Name;
            $scope.removePopovers();
            $scope.noteModal.show();
        }
        $scope.saveNote = function () {
            notes.saveNote($scope.noteModel.ayaId, $scope.noteModel.text, $scope.noteModal.pageNumber);
            $scope.noteModel.aya.hasNote = true;
            var msg = "تم حفظ خاطرة   " + " " + " آية" + " " + $scope.getArabicNumber($scope.noteModel.aya.ayahNum) + " " + "صفحة  " + " " + $scope.getArabicNumber($scope.currentAya.PageNum);
            toast.info("", msg)
            $scope.noteModal.hide();
        }
        $scope.cancelNote = function () {
            $scope.noteModal.hide();
        }
        $scope.isNotesModeEnabled = false;
        $scope.markAyatWithNotes = function () {
            var page = $scope.getCurPage();
            $scope.PageNotes = notes.getNotesForPage(page.pageNum)
            if ($scope.PageNotes.length > 0) {
                $scope.PageNotes = $scope.PageNotes.map(function (i) { return i.ayaId })
                page.allAyat.map(function (aya) {
                    aya.hasNote = $scope.PageNotes.indexOf(aya.id) > -1;
                    return aya;
                })
            }
        }
        $scope.switchNotesMode = function () {
            $scope.PageNotes = [];
            $scope.isNotesModeEnabled = !$scope.isNotesModeEnabled;
            $rootScope.isTestMemorizeMode = false;
            if ($scope.isNotesModeEnabled == true) {
                $scope.markAyatWithNotes();
                if ($scope.PageNotes.length == 0) {
                    toast.info("", "لا يوجد خواطر بهذه الصفحة")
                    $scope.isNotesModeEnabled = !$scope.isNotesModeEnabled;
                }
                else {
                    toast.info("", "استعراض الخواطر")
                }

            }
        }


        //book mark 


        $scope.moveBookMark = function (aya) {
            $scope.removePopovers();
            if ($scope.lastBookmark != null) {
                $scope.curAya = aya;
                bookmarkTypes.moveBookmarkType($scope.lastBookmark.id, aya.id, $scope.currentAya.PageNum)
                $scope.setLastBookmarkType();
                var msg = "تم نقل العلامة المرجعية   " + " " + $scope.lastBookmark.title + " " + "الى آية" + " " + $scope.getArabicNumber(aya.ayahNum) + " " + "صفحة  " + " " + $scope.getArabicNumber($scope.currentAya.PageNum);
                toast.info("", msg)
            }
            else {
                var msg = "لا يوجد علامات مرجعية لنقلها"
                toast.error("", msg)
            }


        }
        $scope.markAya = function (aya) {

            $scope.curAya = aya;
            $scope.isEditingBookmarks = false;
            $scope.getCurAyaMarkers();

            $scope.bookMarkModal.show();
        }
        $ionicModal.fromTemplateUrl('app/templates/popovers/add-bookmark-type.html', {
            id: '2',
            scope: $scope,
            animation: 'slide-in-up',
            //backdropClickToClose: false,
        }).then(function (modal) {
            $scope.addbBookMarkTypeModal = modal;

        });
        $scope.getCurAyaMarkers = function () {
            $scope.bookMarkTypes = bookmarkTypes.getBookmarkTypesList();
            $scope.curAya.markers = bookmarks.getAyaBookmarks($scope.curAya.id);
            $scope.bookMarkTypes.forEach(function (b) {
                var mark = $scope.curAya.markers.filter(function (obj) { return obj.bookmarkTypeId == b.id });
                if (mark.length > 0) {
                    b.checked = true;
                    b.markId = mark[0].id;
                }
                else
                    b.checked = false;
            });
        }

        $scope.bookmarkAya = function (aya, bookmarkTypeId, isChecked, markId, bookmark) {

            if (isChecked) {
                bookmark.markId = bookmarks.saveBookmark(0, aya.id, $scope.currentAya.PageNum, bookmarkTypeId);
            }
            else {
                bookmarks.deleteBookmark(markId);
            }
            $timeout(function () {


                $scope.lastBookmark = bookmarks.getLastBookmark();
            });

        }

        $scope.goToLastBookmark = function () {
            var MoshafId = settings.settingsData.MoshafId.toString();

            if (MoshafId == enums.MoshafId.hafstext) {
                $state.go("tab.quranText", { page: $scope.lastBookmark.pageNumber, aya: $scope.lastBookmark.ayaId, date: new Date(), target: "", reviewTarget: "" });
            }
            else {
                $state.go("tab.page", { page: $scope.lastBookmark.pageNumber, aya: $scope.lastBookmark.ayaId, date: new Date(), target: "", reviewTarget: "" });
            }
        }

        //Taafseer
        $scope.showTafseerModal = function (ayaId) {
            if (ayaId >= $scope.minAya && ayaId <= $scope.maxAya) {

                //$scope.goToAya(ayaId, false)
                //if ($scope.currentAya.verseClean == undefined) {
                //    var page = $scope.getCurPage();
                //    $scope.currentAya = $filter('filter')(page.allAyat, { id: ayaId })[0];
                //}
                var currentAya = ayatData.getAya(ayaId);
                $scope.surahAyat = ayatData.getSurahAyat(currentAya.surah);

                $scope.TafseerAyaModel = {
                    id: ayaId,
                    ayaText: currentAya.verse,
                    ayahNumber: currentAya.ayahNum,
                    surahName: $filter('filter')($scope.allSurahs, { Id: currentAya.surah })[0].Name,
                    surahId: currentAya.surah
                };
                $scope.TafseerAyaModel.tafseer = ayatTafseer.getAyaTafseer(ayaId);
                //moshafdata.getSurahName(currentAya.surah).then(function (result) {
                //    $scope.TafseerAyaModel.surahName = result;
                //})
                $scope.removePopovers();
                $scope.tafseerModal.show();
            }
        }
        $scope.getSurahAyat = function (surahId) {
            $scope.surahAyat = ayatData.getSurahAyat(surahId);
            $scope.showTafseerModal($scope.surahAyat[0].id);
        }
        $scope.closeTafseerModal = function () {
            $scope.TafseerAyaModel = {};
            $scope.tafseerModal.hide();
        }

        //Tasme3 
        $rootScope.isTestMemorizeMode = false;
        $scope.toggleTestMemorizeMode = function () {
            $rootScope.isTestMemorizeMode = !$rootScope.isTestMemorizeMode;
            $scope.currentAya = {};
            $scope.removePopovers();
            $scope.isNotesModeEnabled = false;
            if ($rootScope.isTestMemorizeMode == true) {
                toast.info("", "تغطية الآيات للتسميع")
                var page = $scope.getCurPage();
                if (page.allAyat) {
                    $scope.hideFrom = page.allAyat[0].id;
                    $scope.pageLastAya = page.allAyat[page.allAyat.length - 1].id;
                }
                $scope.stopAudio();
            }
        }
        $scope.showPopOver = function () {
            if ($scope.popoverShowen)
                $scope.popoverShowen = false;
            else
                $scope.popoverShowen = true;
        }

        $scope.clickOnPopOverItem = function () {
            $scope.popoverShowen = false;
        }

        $scope.readMode = function () {

            var lastPage = mark.getLastReadPage();
            if (lastPage.pageNumber > 0) {
                $state.go("tab.page", { page: lastPage.pageNumber, target: "", reviewTarget: "" })
            }
            //else {
            //    $state.go("app.target-list")

            //}
        }
        //$scope.search = function () {
        //    $rootScope.searchIcon = true;
        //    $state.go("search");
        //}

        //$scope.dbClick=function()
        //{
        //    $rootScope.activePage = 'read';
        //    var lastPage = mark.getLastReadPage();
        //    $state.go("tab.quranText", { page: lastPage.pageNumber });
        //}
        $scope.changeQuality = function () {
            audio.stop();
            $scope.playAudio($scope.ayaNumber, $scope.audioSettings.quality, $scope.audioSettings.rate);
        }
        $scope.changeRate = function () {
            audio.stop();
            $scope.playAudio($scope.ayaNumber, $scope.audioSettings.quality, $scope.audioSettings.rate);
        }
        ///Repeat Range Section --------------------------------------------------------- Start
        $ionicModal.fromTemplateUrl('app/templates/popovers/repeat-audio.html', {
            id: '2',
            scope: $scope,
            animation: 'slide-in-up',
            //backdropClickToClose: false,
        }).then(function (modal) {
            $scope.repeatAudio = modal;

        });
    
        $scope.activateRepeatRange = function () {//show repeat range Partial View
            var temp1 = $filter('filter')($scope.allSurahs, { Id: $scope.currentAya.surah })[0];
            $scope.model.selectedSurahStart = temp1;

            $scope.surahAyatStart = ayatData.getSurahAyat(Number($scope.model.selectedSurahStart.Id));
            var temp2 = $filter('filter')($scope.surahAyatStart, { id: $scope.currentAya.id })[0];
            $scope.model.selectedAyahStart = temp2

            $scope.repeatAudio.show();
        }
        $scope.changeRepeatFlag = function () {
            $scope.repeatRangeFlag = !$scope.repeatRangeFlag;
        
            //if ($scope.repeatRangeFlag) {
            //$scope.currentAya.surah
            
            //}
        
        }

        $scope.goToPage = function (pageNum, ayaNumStart, ayaNumEnd, repeatMode, repeatCount) {
            var MoshafId = settings.settingsData.MoshafId;

            if (MoshafId == enums.MoshafId.hafstext) {
                $state.go("tab.quranText", { page: pageNum });
            }
            else {
                $state.go("tab.page", { page: pageNum, aya: ayaNumStart, repeatMode: repeatMode, ayaEnd: ayaNumEnd, repeatCount: repeatCount});
            }
        }
        $scope.saveRange = function () {//Submit Repeatition range form
            if ($scope.model.selectedAyahEnd.id > $scope.model.selectedAyahStart.id) {
                if ($scope.repeatRangeFlag && (!$scope.model.selectedAyahStart || !$scope.model.selectedAyahEnd)) {

                }
                else if ($scope.repeatRangeFlag) {
                    setTimeout(function () {
                        $scope.repeatAudio.hide();
                        $scope.stopAudio();
                        $scope.goToPage($scope.model.selectedAyahStart.PageNum, $scope.model.selectedAyahStart.id, $scope.model.selectedAyahEnd.id, true, $scope.audioSettings.repeat);

                    })
                }
                else {
                    $scope.repeatAudio.hide();
                    audio.pause();
                    $scope.playAudio($scope.currentAya.id, $scope.audioSettings.quality, $scope.audioSettings.rate)
                    //audio.play($scope.currentAya.id, $scope.audioSettings.quality);
                }
            }
        }

        $scope.listen= function () {
                    $scope.repeatAudio.hide();
                    audio.pause();
                    $scope.playAudio($scope.currentAya.id, $scope.audioSettings.quality, $scope.audioSettings.rate)

        }
        $scope.closeRepeatModal = function () {
            $scope.repeatAudio.hide();
        }

        $scope.changeToSurahStart = function () {
            $scope.surahAyatStart = ayatData.getSurahAyat(Number($scope.model.selectedSurahStart.Id));
        }
        $scope.changeToAyahStart = function () {
        }
        $scope.changeToSurahEnd = function () {
            $scope.surahAyatEnd = ayatData.getSurahAyat(Number($scope.model.selectedSurahEnd.Id));
        }
        $scope.changeToAyahEnd = function () {
        }

    
        ///Repeat Range Section --------------------------------------------------------- End

        $scope.downloadImages = function (MoshafId, all, start, end) {
            var settingsData = settings.settingsData;
            var AppName = enums.appData.nameEn;
            var targetPath = enums.appData.targetPath;
            var directoryName = "";
            var path = "";
            if (device.getPlatform() == "ios") {
                directoryName = cordova.file.dataDirectory;
            }
            else directoryName = cordova.file.externalRootDirectory;
            path = directoryName + targetPath;
            if (device.getPlatform() == "ios") {
                path = path.replace("file:///", "/");
                path = decodeURI(path);
            }
            var source = "";
            var pagesCount = 0;
            var filePath = "";
            if (MoshafId == enums.MoshafId.hafs) {
                source = enums.appData.imagesLink + enums.mosahfCopy.hafs.nameEn + "/";
                if (all == true) {
                    pagesCount = enums.mosahfCopy.hafs.pagesCount;
                    start = 1;
                    end = pagesCount;
                }
                path = path + "/" + enums.mosahfCopy.hafs.nameEn;
                filePath = targetPath + "/" + enums.mosahfCopy.hafs.nameEn;
            }
            else if (MoshafId == enums.MoshafId.shamrly) {
                source = enums.appData.imagesLink + enums.mosahfCopy.shamrly.nameEn + "/";
                if (all == true) {
                    pagesCount = enums.mosahfCopy.shamrly.pagesCount;
                    start = 1;
                    end = pagesCount;
                }
                path = path + "/" + enums.mosahfCopy.shamrly.nameEn;
                filePath = targetPath + "/" + enums.mosahfCopy.shamrly.nameEn;
            }
            else if (MoshafId == enums.MoshafId.qalon) {
                source = enums.appData.imagesLink + enums.mosahfCopy.qalon.nameEn + "/";
                if (all == true) {
                    pagesCount = enums.mosahfCopy.qalon.pagesCount;
                    start = 1;
                    end = pagesCount;
                }
                path = path + "/" + enums.mosahfCopy.qalon.nameEn;
                filePath = targetPath + "/" + enums.mosahfCopy.qalon.nameEn;
            }
            else if (MoshafId == enums.MoshafId.warsh) {
                source = enums.appData.imagesLink + enums.mosahfCopy.warsh.nameEn + "/";
                if (all == true) {
                    pagesCount = enums.mosahfCopy.warsh.pagesCount;
                    start = 1;
                    end = pagesCount;
                }
                path = path + "/" + enums.mosahfCopy.warsh.nameEn;
                filePath = targetPath + "/" + enums.mosahfCopy.warsh.nameEn;
            }

            if (all == false) {
                pagesCount = end - start + 1;
            }

            var sourceUrl = "";
            var dest = "";
            file.checkDir(AppName).then(function (res) {
                if (device.getPlatform() == "android") {

                    window.resolveLocalFileSystemURL(
                        cordova.file.externalRootDirectory,
                        function (dir) {
                            dir.getFile(
                                AppName + '/.nomedia',
                                { create: true },
                                function (file) {
                                    console.log('got the file ', file);
                                }
                            );
                        }
                    );
                }
                file.checkDir(targetPath).then(function (res1) {
                    downloadeImage(start);
                }, function (error) { // create  folder if not exist
                    file.createDir(targetPath).then(function (result) {
                        console.log(targetPath + " created");
                        downloadeImage(start);
                    })
                })
            }, function (error) {
                file.createDir(AppName).then(function (res) {
                    console.log(AppName + " created");
                    if (device.getPlatform() == "android") {
                        window.resolveLocalFileSystemURL(
                            cordova.file.externalRootDirectory,
                            function (dir) {
                                dir.getFile(
                                    AppName + '/.nomedia',
                                    { create: true },
                                    function (file) {
                                        console.log('got the file ', file);
                                    }
                                );
                            }
                        );
                    }
                    file.createDir(targetPath).then(function (result) {
                        console.log(targetPath + " created");
                        downloadeImage(start);
                    })
                })
            })

            function downloadeImage(pageNumber) {
  
                $rootScope.downloadingPercentage = pageNumber * (100 / pagesCount);
                var pageName = pageNumber < 10 ? "page00" + pageNumber : pageNumber < 100 ? "page0" + pageNumber : "page" + pageNumber;
                var sourceUrl = source + pageName + ".png";
                var dest = path + "/" + pageName + ".png";
                var imagePath = filePath + "/" + pageName + ".png";

                file.checkFile(imagePath).then(function (success) {
                    console.log(imagePath + " exist");
                    pageNumber++;
                    if (pageNumber <= end) {
                        downloadeImage(pageNumber)
                    }
                    if (pageNumber == end + 1) {
       
                        initMoshafDB(MoshafId);
                    }
                }, function (error) {
                    console.log(imagePath + " not found");
                    if (network.isOnline()) {
                        fileTransfer.download(sourceUrl, dest, "").then(function (ret) {
                            console.log(sourceUrl + " " + dest + " downloaded");
                            pageNumber++;
                            if (pageNumber <= end) {
                                downloadeImage(pageNumber)
                            }
                            if (pageNumber == end + 1) {
                   
                                initMoshafDB(MoshafId);
                            }
                        }).then(function (err) {
                            console.log(err);
                        });
                    }
                    else {
                        network.showNetworkOfflineMsg();
                    }

                });

            }

        }

        $scope.init();


    });


