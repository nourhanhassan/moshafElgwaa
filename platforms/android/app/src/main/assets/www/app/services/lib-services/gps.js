app.factory("gps", ["$cordovaGeolocation", "$q", "appData","ionicLoading", function ($cordovaGeolocation, $q, appData, ionicLoading) {

    var defaultOptions = {
        timeout: parseInt(appData.config.GPSTimeout),
        //maximumAge:3000,
        enableHighAccuracy: (appData.config.GPSEnableHighAccuracy == "true")
    };


    return {

        //returns a promise
        //when resolved: receives an object with {longitude, latitude}
        //when rejected: receives an error object
        getCurrentPosition: function (options) {
            if (typeof (options) == "undefined") {
                options = defaultOptions;
            }

            return $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
                ionicLoading.show({ templateText: "جارى تحديد موقعك حاليا" });
                setTimeout(function () {
                    ionicLoading.hide();
                }, 4000);

                return {

                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                }
                
            }
              ,
              function (error) {
                  //ionicLoading.hide();
                  ionicLoading.show({ templateText: "حدث خطأ .. برجاء التأكد من تفعيل خدمة تحديد الموقع" });
                  setTimeout(function () {
                      ionicLoading.hide();
                  }, 4000);
                  //alert("Error in retreiving GPS location");
                  console.log("Error in retreiving GPS location" + JSON.stringify(error));
                  return $q.reject(error);
              })
        },



    }


}]);

//cordova plugin add org.apache.cordova.geolocation