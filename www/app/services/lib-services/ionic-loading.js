app.factory("ionicLoading", function ($ionicLoading, $timeout,$q) {
    return {
        show: function (options) {
            $ionicLoading.show({
                duration: options.duration,
                noBackdrop: options.noBackdrop,
                template: '<ion-spinner name="bubbles"></ion-spinner>'
            });
        },
        showMessage:function(msg)
        {
            $ionicLoading.show({
                duration:50000,
                template: '<ion-spinner name="bubbles"></ion-spinner>'
            });
        },
        hide: function () {
            $ionicLoading.hide();
        },
        ShowLoading: function () {
            $ionicLoading.show({
                //template: '<ion-spinner icon="android" class="spinner spinner-android"/>'
                template: '<ion-spinner name="bubbles"></ion-spinner>'

            });

        },
 
        //Show a message for a specific time and returns a promise that is resolved when the dialog is closed
        //message: the message to be displayed
        //duration : optional - the duration that the dialog will show (in milliseconds) . it has a default value 2000
        
        showMessage: function (message, duration) {
            var self = this;
            if(typeof(duration)=="undefined"){
                duration = 2000;
            }
            var deferred = $q.defer();
            self.show({
                templateText:message,
            });

            $timeout(function () {
                self.hide();
                deferred.resolve();
            },duration)


            return deferred.promise;


        },
    }
});