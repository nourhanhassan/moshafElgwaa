app.factory("vibration", ["$cordovaVibration", function ($cordovaVibration) {
    return {
        vibrate: function (time) { //time in milliseconds 
            $cordovaVibration.vibrate(time);
        }
    }
}]);