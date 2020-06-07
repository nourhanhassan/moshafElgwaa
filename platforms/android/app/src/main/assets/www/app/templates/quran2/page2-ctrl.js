app.controller('page2Controller', function ($scope, $window, $ionicSlideBoxDelegate, moshafdata, ionicPopup, $filter, $q, $state, $stateParams, $timeout, mark, $ionicPopover, enums, target, memorize, $ionicGesture, $rootScope, $ionicScrollDelegate, $ImageCacheFactory, device, $ionicSideMenuDelegate, audio, $ionicModal, localStorage, notes, bookmarkTypes, bookmarks, memorizedayat, toast, settings, ayatTafseer, ayatData, recitations, reviewTarget, review) {

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
 
    $scope.pages = {};
    $scope.initStart = 1;
    $scope.end = 605;
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
        if (target.data.id == targetId) {
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
       // console.log($scope.reviewTarget.pages)
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


      //  console.log($scope.reviewTarget.pages);
        $scope.end = $scope.reviewTarget.pages[$scope.reviewTarget.pages.length - 1]+1;
    }
    $scope.setPageAyatMemorize = function (page) {
        //$scope.curPage = $scope.getCurPage();

        page.allAyat.forEach(function (aya) {
            aya.isChecked = memorizedayat.isAyaMemorized(aya.id) > -1;
            aya.isMemorized = aya.isChecked;
        })
    }

    $scope.init = function () {

        $scope.popoverShowen = false;
        $scope.setLastBookmarkType();
    if ($stateParams.target.length > 0) {
        ////   alert($stateParams.target);
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
        $scope.firstReviewAyaTask = $scope.reviewAyatTask.length == 0 ?10000: $scope.reviewAyatTask[0].id;
  
    }
    else {
        $scope.appMode = enums.appModes.read
        $rootScope.appMode = enums.appModes.read;
        if (!$scope.start > 0) {
            $scope.start = 1 
        }
        //$timeout(function () {
            if (typeof (navigator.splashscreen) != "undefined") {
                navigator.splashscreen.hide();
            }
            $scope.loadPages($scope.start, function () {
                $scope.initSlide();
                $timeout(function () {
                    //if (settings.settingsData.markMemorizedAyat) {
                    //    var page = $scope.getCurPage();
                    //    $scope.setPageAyatMemorize(page);
                    //}
                    //if ($scope.isNotesModeEnabled == true) {
                    //    $scope.markAyatWithNotes();
                    //}
                })
            })
          
        //})
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
        ayatData.getSurahs().then(function (result) {
            $scope.allSurahs = result;
        });

        $timeout(function () {
            if (settings.settingsData.fullScreen) {
        
                //if (typeof (AndroidFullScreen) != "undefined") {
                //    AndroidFullScreen.immersiveMode()
                   
                //}
            }
        },5000)

    }

 
    //  $scope.start = 604;


    //   alert($scope.start)
    // initial
    // $scope.curPage = $scope.start;


    //***----------aya Events start----------****/

    $scope.selectAya = function (aya, showOptions) {
        debugger
        if ($scope.isTestMemorizeMode != true) {
            $scope.removePopovers();
            $scope.isHoldFired = true;

            if (showOptions != false) {
                $scope.showAyaOtions(aya);


            }
            $scope.currentAya = aya;
            console.log($scope.curPage);
            if ($scope.appMode != enums.appModes.review)
            {
                $scope.currentAya.nextId = $scope.currentAya.id + 1;
                $scope.currentAya.prevId = $scope.currentAya.id - 1;
            }
            else {
                var firstAyaInPage = $scope.curPage.allAyat[0].id;
                var lastAyaInPage = $scope.curPage.allAyat[$scope.curPage.allAyat.length - 1].id;
                var curAya = $scope.reviewTarget.ayat.filter(function (a) { return a.id == aya.id })[0];
                var indexOfCurAya = $scope.reviewTarget.ayat.indexOf(curAya);
                if ($scope.currentAya.id < lastAyaInPage)
                {
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



    $scope.memorizeAya = function (aya,navigate) {
        if (typeof (aya) == "undefined")
        {
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
                if (navigate != false)
                {
                if (nextAya.length > 0 ) {
                    $scope.selectAya(nextAya[0]);

                }
                else if (notMomrizedAyatCount != 0) {
                    var nextId = aya.id + 1;
                    var nextAyaTask = $filter('filter')($scope.ayatTask, { id: nextId });
                    if (nextAyaTask.length>0) {
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
           if (aya.isChecked != true)
            {
                memorize.addAyaToMemorized(aya.id);
                aya.isChecked = true;
            }
        else{
               memorize.removeAyaFromMemorized(aya.id);
               aya.isChecked = false;
           }
          // var nextAya = $filter('filter')(page.allAyat, { id: aya.id + 1 });
        }
        return aya;
    }
    $scope.reviewAya = function (aya, navigate) {
        if (typeof (aya) == "undefined") {
            aya = $scope.currentAya;
        }
        if ($scope.appMode == enums.appModes.review) {

         //   console.log($scope.reviewTarget)
            if(aya.isReviewed != true)
            {
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
            if (navigate != false)
            {
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
                if(remainingAyat.length==0)
                {
                    $scope.showDoneReviewMsg();
                    reviewTarget.cancelNotification($scope.reviewTarget.notificationID);
                }
                else {
                    $scope.removePopovers();
                }
            }
        }



    }

    $scope.goToAya = function (curAyaId,showOptions) {
        var page = $scope.getCurPage();
        //if ($scope.end < page.pageNum)
        // var curAya = $filter('filter')(page.allAyat, { id: $scope.currentAya.id });
        var nextAya = $filter('filter')(page.allAyat, { id: curAyaId  });
        if (nextAya.length > 0) {
            $scope.selectAya(nextAya[0], showOptions);

        }
        else {
            if (curAyaId > page.allAyat[page.allAyat.length - 1].id) {
                if (page.pageNum < $scope.end-1) {
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
        if ($scope.notMomrizedCount == 0)
        {
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
            if(  aya.isChecked != aya.isMemorized)
            {
               // aya.isChecked = aya.isMemorized
                $scope.memorizeAya(aya,false)
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
    $scope.isInReviewTarget = function(ayaId)
    {
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
                $scope.reviewAya(aya,false
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
   
        if (ayaTop < windowCenter)
        {
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
            $scope.pos.top = ayaTop - ayaHeight+dif ;
        }
        if ($scope.pos.top > ($(window).height() - dif)) {
            $scope.pos.top = $(window).height() - dif;
        }
        $scope.pos.right = aya.x * factor-45;
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
      
        if ($scope.appMode == enums.appModes.review)
        {

            var indexOfpgNum = $scope.reviewTarget.pages.indexOf(pgNum);
            var loadIndex = indexOfpgNum > 3 ? indexOfpgNum - 3 : 0;
         //   start = pgNum == start ? pgNum : $scope.reviewTarget.pages[loadIndex];
            for (var k = loadIndex; k < start + 10 ; k++)
            {
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
                                        if (tAya.length > 0)
                                        {
                                            pAya.isWerd = true;
                                        }

                                    })
                                   // console.log(p.allAyat)
                                }
                                if (settings.settingsData.markMemorizedAyat) {
                                    $scope.setPageAyatMemorize(p);
                                }
                                $scope.pages[p.pageNum] = p;
                                if ($stateParams.page==p.pageNum && $stateParams.aya > 0) {
             
                                            for (var i = 0; i < p.surahs.length; i++) {
                                                if ($scope.currentAya == null)
                                                    var res = p.surahs[i].ayat.filter(function (obj) { return obj.id == $stateParams.aya });
                                                if (res.length > 0) {
                                                      res[0].isMarked = true;
                                                    var aya = res[0];
                                                    $timeout(function () {
                                                     $scope.selectAya(aya, false);

                                                    })
                                                    break;
                                                }
                                            }
             
            }
                            });
                         
                            p.pageName = p.pageNum < 10 ? "page00" + p.pageNum : p.pageNum < 100 ? "page0" + p.pageNum : "page" + p.pageNum;
                            p.path = "img/quran/" + p.pageName + ".png";
                            $ImageCacheFactory.Cache([
                                "img/quran/" + p.pageName + ".png"
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
        $scope.ayaNumWidth=130;
        $scope.ayaNumHeight = 130;
        $scope.initImageWidth = 622;
        $scope.initLineHeight = 40;
        $scope.initTopSpace = 65;
        $scope.initRightSpace = 60;
    }

    $scope.getAyaCoords = function (SurahIndex, AyahIndex, Aya, prevAya, pageNum, SurahStartTop) {

        $scope.setInitImageSizes();
        if (pageNum < 3) {
            //$scope.initRightSpace = 220;
            //$scope.initLineHeight = 100;
            //$scope.initTopSpace = 40;
            $scope.initRightSpace = 170;
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

        
        return $scope.getPolyCoords(pos1, pos2, pageNum,Aya)

    }

    $scope.getScreenSizeFactor = function (pageNum) {
  
        var id = "#page" + pageNum;
        var factor = $(id).width() / $scope.initImageWidth;
        return factor;
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



    //page slider 
    var default_slides_indexes = [-1, 0, 1];
    var default_slides = [];
    var direction = 0;
    var head;
    var tail;
    $scope.slides = [];


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
        $scope.slides = angular.copy(default_slides);
        $scope.slides.forEach(function (p) {
            p.page = $scope.pages[p.page.pageNum]
        })
        head = $scope.slides[0].nr;
        tail = $scope.slides[$scope.slides.length - 1].nr;
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
        if ($scope.appMode == enums.appModes.review)
        {
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
      //  console.log($scope.slides)
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
        //console.log(prevSlide)

        if (typeof (slide.page) != "undefined") {
            //if (slide.page.pageNum + 1 == $scope.end - 1)
            //{
            //    $scope.enableSlideRight = true;
            //}
            if (slide.page.pageNum  >= $scope.end - 1) {
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
    $scope.toggleBars = function ($event, aya) {
 
        if ($scope.isNotesModeEnabled==true) {
            if (typeof (aya) != "undefined")
                $scope.selectAya(aya, false);
            $scope.AddEditNote(aya);
        }
        else if ($scope.isTestMemorizeMode == true) {
         
            if ($scope.hideFrom <= $scope.pageLastAya && aya.id >= $scope.hideFrom)
            {
                if ($scope.isClicked == true) {
                    $scope.hideFrom = aya.id + 1;
                    $scope.isClicked = false;
                }
                else {
                    $scope.hideFrom += 1;
                    $scope.isClicked = true;
                }
                
            }
            else if($scope.hideFrom > aya.id)
            {
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
                    //else {
                    //    $scope.hideBar = !$scope.hideBar;
                    //}
                }
            }
        }
        setTimeout(function () {
            $scope.isClicked = false;
        },200)
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
        var curSlide = $scope.slides[index];
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
            if ($scope.appMode == enums.appModes.review)
            {
                targetId = $scope.reviewTarget.id;
            }
            mark.setLastPage(page.pageNum, $scope.appMode, targetId);
        }

    }
   
    $scope.slideChanged = function (i) {
        //$scope.PageTitle = { juz: page.surahs[0].JuzName, surah: page.surahs[0].Name,pageNum:page.pageNum };
        $scope.currentAya = {};
        $scope.removePopovers();
        $scope.isNotesModeEnabled = false;
        if (!isNaN(i)) {
            var
              previous_index = i === 0 ? 2 : i - 1,
              next_index = i === 2 ? 0 : i + 1,
              new_direction = $scope.slides[i].nr > $scope.slides[previous_index].nr ? 1 : -1;

            angular.copy(
              createSlideData(new_direction, direction),
              $scope.slides[new_direction > 0 ? next_index : previous_index]
            );

          //  console.log($scope.slides)
            direction = new_direction;
            // $scope.setFontSize();
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

            //if ($scope.isNotesModeEnabled == true) {
            //    $scope.markAyatWithNotes();
            //}
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
    $scope.$watch(function() { 
        return $ionicSideMenuDelegate.getOpenRatio(); 
    }, function(value) { 
        $scope.removePopovers();
    });
    $scope.$on('$destroy', function () {
        $scope.removePopovers();
    });

    //Audio

    $scope.audioSettings = {
        repeat: 1,
        maxRepeat:5,
        currentAya: 0,
        isPlaying: false,
        isPaused: false,
        stoppedByUser: false,
        curRepeatNumber:1
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
    $scope.playAudio = function (ayaNumber) {
        if (ayaNumber >= $scope.minAya && ayaNumber <= $scope.maxAya && $scope.isTestMemorizeMode != true)
        {
       
            //ayaNumber = aya.id;
            if ($scope.audioSettings.curRepeatNumber < $scope.audioSettings.repeat && audio.audioSettings.currentAya == ayaNumber)
            {
                $scope.audioSettings.currentAya = ayaNumber;
                audio.audioSettings.currentAya = ayaNumber;
                $scope.audioSettings.loading = false;
                $scope.audioSettings.isPlaying = true;
                //$scope.audioSettings.stoppedByUser = true;
                $scope.goToAya(ayaNumber, false)
            }
            else if (audio.audioSettings.currentAya != ayaNumber) {
                audio.stop();
               // $scope.audioSettings.currentAya = ayaNumber;
                $scope.audioSettings.curRepeatNumber = 1;
               // $scope.audioSettings.repeat = 1;
                $scope.audioSettings.stoppedByUser = true;
                audio.audioSettings.stoppedByUser = true;
               $scope.goToAya(ayaNumber, false)
            }

            if (audio.mediaStatus == audio.statusEnum.running && audio.audioSettings.currentAya == ayaNumber) {
                audio.pause();
        
            }
     
            else {
                $scope.audioSettings.loading = true;
                $scope.audioSettings.isPlaying = false;
                audio.play(ayaNumber).then(function (duration) {

                }, function (err) {
                    //alert(err)
                    if (err == "networkError") {
                         $scope.stopAudio();
                    }
                }
                , function (status) {
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
                    if (status == audio.statusEnum.stopped && audio.audioSettings.stoppedByUser  == false) {
         
                        audio.stop();
                        if ($scope.audioSettings.curRepeatNumber < $scope.audioSettings.repeat) {
                            $scope.audioSettings.curRepeatNumber += 1;
                            
                            $scope.playAudio(ayaNumber);

                        } else {
                          //  var page = $scope.getCurPage();
                            if (ayaNumber < $scope.maxAya) {
        
                                var curPlayedAya;
                                
                                if (ayaNumber == audio.audioSettings.currentAya || audio.audioSettings.currentAya == 0) {
                                    curPlayedAya = $scope.audioSettings.currentAyaObject.nextId;
                                    var page = $scope.getCurPage();
                                    var lastAyaInPage = page.allAyat[page.allAyat.length - 1].id;
                                    if (curPlayedAya > lastAyaInPage && page.pageNum >= $scope.end - 1)
                                    {
                                      //  $scope.currentAya.nextId = 0;
                                        curPlayedAya = 0;
                                    }

                                }
                                else {
                                    curPlayedAya = $scope.audioSettings.currentAyaObject;
                                }
                                if (curPlayedAya > 0) {
                                    $scope.goToAya(curPlayedAya, false)
                                    $scope.audioSettings.curRepeatNumber = 1;
                                    if ($state.current.name == "app.page") {
                                        $scope.audioSettings.currentAya = curPlayedAya;
                                        audio.audioSettings.currentAya = curPlayedAya;
                                        $scope.playAudio(curPlayedAya);
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
      //  console.log(aya);
        $scope.inAudioMode = true;
        $scope.isAudioBarShown =true;
        $scope.removePopovers();
        $scope.resetAudioSettings();
        $scope.audioSettings.currentAya = aya.id;
       // audio.audioSettings.currentAya = aya.id;
        $scope.aya = aya;
        $scope.audioSettings = $scope.audioSettings;
        $scope.audioBar.show();
        $scope.playAudio(aya.id);

    }


    $scope.hideAudioBar = function () {
        if ($scope.audioBar)
        $scope.audioBar.hide();
        $scope.isAudioBarShown =false;
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
        $scope.Canvas.height += 25;
        $scope.CT.config({
            canvas: $scope.Canvas,
            context: $scope.Context,
            fontFamily: "14px UthmanicHafs",
            fontWeight: "normal",
            fontColor: "#b7b28b",
            lineHeight: "25",
           textAlign : "center"
    
        });

        
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
        $scope.CT.context.font = "14px UthmanicHafs";
        $scope.CT.context.fillStyle = "black";
        $scope.CT.context.drawImage($scope.corner2, 0, 0);
        $scope.CT.context.drawImage($scope.corner1, (width / $scope.PIXEL_RATIO) - $scope.corner1.width , 0);
        $scope.CT.context.textAlign = "center";
        wrapText($scope.CT.context, text , (width / $scope.PIXEL_RATIO) / 2, 40, (width / $scope.PIXEL_RATIO) - 50, 30);
        $scope.CT.context.textAlign = "center";
        $scope.CT.context.font = "12px sans-serif";
        var ayaNumber = $scope.getArabicNumber(aya.ayahNum).replace(/\s/g,'');

        $scope.CT.context.fillText("سورة" + aya.surahName + " - " + "آية رقم" + ayaNumber, (width / $scope.PIXEL_RATIO) / 2, (height / $scope.PIXEL_RATIO) - 15);

    };
 

    $scope.shareAya = function (aya) {

        document.fonts.load('14px "UthmanicHafs"').then(function () {
            aya.surahName = moshafdata.getSurah(aya.surah).Name;
            $scope.initCanvasText(aya);


            var width = $scope.CT.context.canvas.width;
            var height = $scope.CT.context.canvas.height;

            var can = document.getElementById('canvas');
            var ctx = can.getContext('2d');

            //ctx.fillRect(50,50,50,50);
            var img = new Image();

            img.onload = function () {

                window.plugins.socialsharing.share('القرآن الكريم ',
                 null,
                 img.src
                 ,
                 "http://almoshafalsharef.qvtest.com/"
                 )
            };
            img.src = can.toDataURL();;
        })
    
    
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

    $scope.AddEditNote= function(aya)
    {
      
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
        if ($scope.PageNotes.length > 0)
        {
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
        $scope.isTestMemorizeMode = false;
        if($scope.isNotesModeEnabled == true)
        {
            $scope.markAyatWithNotes();
            if($scope.PageNotes.length == 0) {
                toast.info("", "لا يوجد خواطر بهذه الصفحة")
               $scope.isNotesModeEnabled = !$scope.isNotesModeEnabled;
            }
            else {
                toast.info("", "استعراض الخواطر")
            }
         
        }
    }


    //book mark 


    $scope.moveBookMark =function(aya)
    {
        $scope.removePopovers();
        if ($scope.lastBookmark != null) {
            $scope.curAya = aya;
            bookmarkTypes.moveBookmarkType($scope.lastBookmark.id, aya.id, $scope.currentAya.PageNum)
            $scope.setLastBookmarkType();
            var msg = "تم نقل العلامة المرجعية   " + " " + $scope.lastBookmark.title + " " + "الى آية" + " " + $scope.getArabicNumber(aya.ayahNum) + " " + "صفحة  " + " " +$scope.getArabicNumber( $scope.currentAya.PageNum);
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

    $scope.bookmarkAya = function (aya, bookmarkTypeId,isChecked,markId,bookmark) {
 
        if (isChecked)
        {
            bookmark.markId= bookmarks.saveBookmark(0, aya.id,$scope.currentAya.PageNum, bookmarkTypeId);
        }
        else {
            bookmarks.deleteBookmark(markId);
        }
        $timeout(function () {


            $scope.lastBookmark = bookmarks.getLastBookmark();
        });
        
    }

    $scope.goToLastBookmark = function () {

        $state.go("app.page", { page: $scope.lastBookmark.pageNumber, aya: $scope.lastBookmark.ayaId, date: new Date(), target: "", reviewTarget: "" })

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
                ayaText: currentAya.verseClean,
                ayahNumber: currentAya.ayahNum,
                surahName: $filter('filter')($scope.allSurahs, { Id: currentAya.surah })[0].Name,
                surahId : currentAya.surah
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
    $scope.isTestMemorizeMode = false;
    $scope.toggleTestMemorizeMode = function () {
        $scope.isTestMemorizeMode = !$scope.isTestMemorizeMode;
        $scope.currentAya = {};
        $scope.removePopovers();
        $scope.isNotesModeEnabled = false;
        if($scope.isTestMemorizeMode==true)
        {
            toast.info("", "تغطية الآيات للتسميع")
            var page = $scope.getCurPage();
            if (page.allAyat) {
                $scope.hideFrom = page.allAyat[0].id;
                $scope.pageLastAya = page.allAyat[page.allAyat.length - 1].id;
            }
            $scope.stopAudio();
           // console.log($scope.hideFrom)
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
            $state.go("app.page", { page: lastPage.pageNumber, target: "", reviewTarget: "" })
        }
        //else {
        //    $state.go("app.target-list")

        //}
    }
    $scope.search = function () {
        $rootScope.searchIcon = true;
        $state.go("search");
    }
    $scope.init();


});


