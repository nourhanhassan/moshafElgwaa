app.factory("device", ["$cordovaDevice", function ($cordovaDevice) {

    //alert(typeof ($cordovaDevice));
    return {
        getDevice: function () { 
           return $cordovaDevice.getDevice();
        },
        getCordova: function () {
            return $cordovaDevice.getCordova();
        },
        getModel: function () {
            return $cordovaDevice.getModel();
        },
        getPlatform: function () {
            //console.log(device.platform);
            return device.platform.toLowerCase();// $cordovaDevice.getPlatform().toLowerCase();
        },
        getUUID: function () {
            return $cordovaDevice.getUUID();
        },
        getVersion: function () {
            return $cordovaDevice.getVersion();
        }
    }
}]);