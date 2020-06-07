app.controller("MainController", ["$scope", "$rootScope", "$state", "$ionicSlideBoxDelegate", "toast", "audio", "$ionicHistory", "$ionicModal", "localStorage", "settings", "enums", function ($scope, $rootScope, $state, $ionicSlideBoxDelegate, toast, audio, $ionicHistory, $ionicModal, localStorage, settings, enums) {

    $scope.init = function () {
        $scope.enums = enums;
        $rootScope.MoshafId = settings.settingsData.MoshafId.toString();
        $rootScope.isTestMemorizeMode = false;
        $rootScope.hideMem = true;
        $rootScope.hideCancelMem = true;
        $scope.model = {}
        $scope.model.value = $rootScope.zoomingFontSize;
        $scope.doaaBookSettings = localStorage.get("doaaBookSetting");
        console.log("doaaBookSettings", $scope.doaaBookSettings);
        if ($scope.doaaBookSettings == undefined || $scope.doaaBookSettings == null) {
            $rootScope.bgcolor = '#fff';
            $rootScope.fontcolor = '#333';
            $rootScope.fontFamily = "'Amiri', serif";
            $rootScope.activeBgColors = [true, false, false, false];
            $rootScope.activeFontColors = [true, false, false, false];
            $rootScope.activeFont = [false, true, false, false, false];
            $rootScope.fontSize = 16;
            $rootScope.lineHeigh = 2;
            $scope.doaaBookSettings = {};
            $scope.doaaBookSettings.bgcolor = $rootScope.bgcolor;
            $scope.doaaBookSettings.fontcolor = $rootScope.fontcolor;
            $scope.doaaBookSettings.fontFamily = $rootScope.fontFamily;
            $scope.doaaBookSettings.activeBgColors = $rootScope.activeBgColors;
            $scope.doaaBookSettings.activeFontColors = $rootScope.activeFontColors;
            $scope.doaaBookSettings.activeFont = $rootScope.activeFont;
            $scope.doaaBookSettings.fontSize = $rootScope.fontSize;
            $scope.doaaBookSettings.lineHeigh = $rootScope.lineHeigh;
            console.log("doaaBookSettings", $scope.doaaBookSettings);
            localStorage.set("doaaBookSetting", $scope.doaaBookSettings);
        }
        else {
            $rootScope.bgcolor = $scope.doaaBookSettings.bgcolor;
            $rootScope.fontcolor = $scope.doaaBookSettings.fontcolor;
            $rootScope.fontFamily = $scope.doaaBookSettings.fontFamily;
            $rootScope.activeBgColors = $scope.doaaBookSettings.activeBgColors;
            $rootScope.activeFontColors = $scope.doaaBookSettings.activeFontColors;
            $rootScope.activeFont = $scope.doaaBookSettings.activeFont;
            $rootScope.fontSize = $scope.doaaBookSettings.fontSize;
            $rootScope.lineHeigh = $scope.doaaBookSettings.lineHeigh;
        }


        //$rootScope.fontSize = 16;
        //$rootScope.lineHeigh = 2;
        $rootScope.fontFamilies = ["'Cairo', serif", "'Amiri', serif", "'Lateef', cursive", "'Scheherazade', serif", "'Tajawal', sans-serif"]
        $rootScope.minFontSize = 16;
        $rootScope.maxFontSize = 40;

    }
    $scope.switchBgColor = function (backgroundColor, index) {
        $rootScope.bgcolor = backgroundColor;
        $rootScope.activeBgColors = [false, false, false, false];
        $rootScope.activeBgColors[index] = true;
        $scope.doaaBookSettings.bgcolor = $rootScope.bgcolor;
        $scope.doaaBookSettings.activeBgColors = $rootScope.activeBgColors;
        localStorage.set("doaaBookSetting", $scope.doaaBookSettings);
    }
    $scope.switchFontColor = function (fontColor, index) {
        $rootScope.fontcolor = fontColor;
        $rootScope.activeFontColors = [false, false, false, false];
        $rootScope.activeFontColors[index] = true;
        $scope.doaaBookSettings.activeFontColors = $rootScope.activeFontColors;
        $scope.doaaBookSettings.fontcolor = $rootScope.fontcolor;
        localStorage.set("doaaBookSetting", $scope.doaaBookSettings);
    }
    $scope.switchFontFamily = function (fontFamily) {
        $rootScope.fontFamily = $rootScope.fontFamilies[fontFamily];
        $rootScope.activeFont = [false, false, false, false, false];
        $rootScope.activeFont[fontFamily] = true;
        $scope.doaaBookSettings.activeFont = $rootScope.activeFont;
        $scope.doaaBookSettings.fontFamily = $rootScope.fontFamily;
        localStorage.set("doaaBookSetting", $scope.doaaBookSettings);
        if (fontFamily == 0) {
            $rootScope.fontSize = 16;
            $rootScope.minFontSize = 16;
            $rootScope.maxFontSize = 40;
            $rootScope.lineHeigh = 2;

        }
        else if (fontFamily == 1) {
            $rootScope.fontSize = 21;
            $rootScope.minFontSize = 21;
            $rootScope.maxFontSize = 50;
            $rootScope.lineHeigh = 1.8;

        }
        else if (fontFamily == 2) {
            $rootScope.fontSize = 27;
            $rootScope.minFontSize = 27;
            $rootScope.maxFontSize = 57;
            $rootScope.lineHeigh = 1.5;
        }
        else if (fontFamily == 3) {
            $rootScope.fontSize = 27;
            $rootScope.minFontSize = 27;
            $rootScope.maxFontSize = 57;
            $rootScope.lineHeigh = 1.5;
        }
        else if (fontFamily == 4) {
            $rootScope.fontSize = 18;
            $rootScope.minFontSize = 18;
            $rootScope.maxFontSize = 40;
            $rootScope.lineHeigh = 2;
        }
    }

    $scope.toggleTestMemorizeMode = function () {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
        document.getElementsByClassName('tab-nav')[0].style.display = 'none';
        $rootScope.hideCancelMem = false;
        $rootScope.isTestMemorizeMode = true;
        $scope.currentAya = {};
        $scope.removePopovers();
        $scope.isNotesModeEnabled = false;
        if ($rootScope.isTestMemorizeMode == true) {
            //toast.info("", "تغطية الآيات للتسميع")
            var page = $scope.getCurPage();
            if (page.allAyat) {
                $scope.hideFrom = page.allAyat[0].id;
                $scope.pageLastAya = page.allAyat[page.allAyat.length - 1].id;
            }
            // $scope.stopAudio();
        }
    }
    $scope.removePopovers = function () {

        if (typeof ($scope.markPopover) != "undefined") {

            $scope.markPopover.hide();
            $scope.markPopover.remove();
        }
        $scope.popoverShowen = false;

    }

    $scope.getCurPage = function () {
        var index = $ionicSlideBoxDelegate.currentIndex();
        var curSlide = $rootScope.slides[index];
        var page = curSlide.page;
        if (typeof (page) != "undefined") {
        }

        return page;
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

    $scope.hideAudioBar = function () {
        if ($scope.audioBar)
            $scope.audioBar.hide();
        $scope.isAudioBarShown = false;
    }
    $scope.resetAudioSettings = function () {
        $scope.audioSettings.isPlaying = false;
        $scope.audioSettings.curRepeatNumber = 1;
        $scope.audioSettings.currentAya = 0;
        audio.audioSettings.currentAya = 0;
        audio.audioSettings.status = 0;
        $scope.audioSettings.loading = false;
        audio.currentAyaNumber = "";
    }

    $scope.mgoBack = function () {
        //    $ionicHistory.goBack();
        window.history.back();
    };

    $scope.showNavBar = function () {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
        document.getElementsByClassName('tab-nav')[0].style.display = 'flex';
        $rootScope.isTestMemorizeMode = false;
        $rootScope.hideCancelMem = true;
    };

    $scope.openDoaaSetting = function () {
        $scope.doaaSettingModal.show();
    }
    $scope.zoomIn = function () {
        if ($rootScope.fontSize < $rootScope.maxFontSize) {
            $rootScope.fontSize += 2;
            $rootScope.lineHeigh += 0.035;
            $scope.doaaBookSettings.fontSize = $rootScope.fontSize;
            $scope.doaaBookSettings.lineHeigh = $rootScope.lineHeigh;
            localStorage.set("doaaBookSetting", $scope.doaaBookSettings);
        }
    }
    $scope.zoomOut = function () {
        if ($rootScope.fontSize > $rootScope.minFontSize) {
            $rootScope.fontSize -= 2;
            $rootScope.lineHeigh -= 0.035;
            $scope.doaaBookSettings.fontSize = $rootScope.fontSize;
            $scope.doaaBookSettings.lineHeigh = $rootScope.lineHeigh;
            localStorage.set("doaaBookSetting", $scope.doaaBookSettings);
        }
    }

    //$scope.zoomIn = function () {
    //    //$scope.fontsize;
    //    $rootScope.zoomingFontSize=$scope.model.value ;
    //    console.log($scope.model.value);
    //}
    $scope.CloseDoaaSetting = function () {
        $scope.doaaSettingModal.hide();
    }


    $ionicModal.fromTemplateUrl('app/templates/popovers/doaa-setting-modal.html', {
        scope: $scope,
        animation: 'slide-in-up',
    }).then(function (modal) {
        $scope.doaaSettingModal = modal;
        $(".backdrop").addClass("no-backdrop");

    });
    $scope.init();
}]);