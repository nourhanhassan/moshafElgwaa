app.factory("network", ["$cordovaNetwork", "ionicPopup", function ($cordovaNetwork, ionicPopup) {
    var service = {
        
        isOnline: function () {
            return $cordovaNetwork.isOnline();
        },
        isOffline: function () {
            return $cordovaNetwork.isOffline();
        },
        getNetwork: function () {
            return $cordovaNetwork.getNetwork();
        },
        showNetworkOfflineMsg: function () {
            ionicPopup.alert("خطأ فى الاتصال", "تأكد من اتصالك بالإنترنت  ", "تم");
            console.log("خطأ فى الاتصالتأكد من اتصالك بالإنترنت");
        },
        checkNetwork:function(){
            if($cordovaNetwork)
            {
                if($cordovaNetwork.isOffline())
                {
                    service.showNetworkOfflineMsg();
                }
            }
    }
    }
    return service;
}]);

//plugin command
//cordova plugin add org.apache.cordova.network-information
