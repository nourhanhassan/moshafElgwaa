app.factory("settings", ["localStorage", "$q", "enums", "$rootScope", function (localStorage, $q, enums, $rootScope) {

    var service = {
        key: "settings",
        settingsData :{
            markMemorizedAyat: false,
            nightMode: false,
            fullScreen: false,
            recitationId: 1,
            MoshafId: 0,//enums.MoshafId.hafs,
            hafsIsDownloaded: false,
            shamrlyIsDownloaded: false,
            qalonIsDownloaded: false,
            warshIsDownloaded: false,
            namesOfAllahEnabled: false
        },
        setSettingsData: function () {
            
            var settings = localStorage.get(service.key);
            if (typeof (settings) == "undefined") {
                service.setDefaultValues();
            }
            else {
                var mergedData = {};
                angular.extend(mergedData, service.settingsData, settings)
                service.settingsData = mergedData;
            }
       
            return service.settingsData;
        },
        setDefaultValues :function(){
            service.settingsData = {
                markMemorizedAyat: false,
                nightMode: false,
                fullScreen: false,
                recitationId: 1,
                MoshafId: enums.MoshafId.hafs,
                namesOfAllahEnabled: false
            }
            service.saveSettings();
        },
        saveSettings: function () {
            localStorage.set(service.key, service.settingsData);
        },  
        setMarkMemorizedAyatValue:function(value)
        {
            service.settingsData.markMemorizedAyat = value;
            service.saveSettings();
        },
        setRecitationIdValue: function (value) {
            service.settingsData.recitationId = value;
            service.saveSettings();
        },
        setMoshafIdValue: function (value) {
            service.settingsData.MoshafId = value;
            service.saveSettings();
        },
        setNightModeValue: function (value) {
            service.settingsData.nightMode = value;
            $rootScope.nightMode = service.settingsData.nightMode;
            service.saveSettings();
        },
        setNamesOfAllahNotification: function (value) {
            service.settingsData.namesOfAllahEnabled = value;
            $rootScope.namesOfAllahEnabled = service.settingsData.namesOfAllahEnabled;
            service.saveSettings();
        },
        setFullScreenValue: function (value) {
            var devicePlatform = device.platform;

            if (value) {
                if (devicePlatform == "Android")
                    AndroidFullScreen.immersiveMode()
                else
                    StatusBar.hide();
            }
            else {
                if (devicePlatform == "Android")
                    AndroidFullScreen.showSystemUI();
                else
                    StatusBar.show();
                //AndroidFullScreen.showUnderStatusBar();
                //AndroidFullScreen.showUnderSystemUI();
                //AndroidFullScreen.showSystemUI();
            }
            service.settingsData.fullScreen = value;
            service.saveSettings();
        },
        sethafsIsDownloadedValue: function (value) {
            service.settingsData.hafsIsDownloaded = value;
        service.saveSettings();
        },
        setshamrlyIsDownloadedValue: function (value) {
            service.settingsData.hafsIsDownloaded = value;
            service.saveSettings();
        },
        setqalonIsDownloadedValue: function (value) {
            service.settingsData.hafsIsDownloaded = value;
            service.saveSettings();
        },
        setwarshIsDownloadedValue: function (value) {
            service.settingsData.hafsIsDownloaded = value;
            service.saveSettings();
        },
    }
    service.settingsData = service.setSettingsData();
     return service;

}])
