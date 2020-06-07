app.factory("dialogs", ["$cordovaDialogs","$q", function ($cordovaDialogs, $q) {
    return {
        //alert: function (message, title, button) {
            return $cordovaDialogs.alert(message, title, button);
                
        },
        confirm: function (message, title, buttonsArrayStr) {
            var deferred = $q.defer();

            $cordovaDialogs.confirm(message, title, buttonsArrayStr)
             .then(function (buttonIndex) {
                 // no button = 0, 'OK' = 2, 'Cancel' = 1  //arabic
                 switch (buttonIndex) {
                     case 2:
                         deferred.resolve();
                         break;
                     case 1:
                         deferred.reject()
                         break;
                 }
             });

            return deferred.promise;
        },
        prompt: function (message, title, buttonsArrayStr, defaultText) {
            var deferred = $q.defer();

            $cordovaDialogs.prompt(message, title, buttonsArrayStr, defaultText)
               .then(function (result) {
                   var input = result.input1;
                   // no button = 0, 'OK' = 1, 'Cancel' = 2
                   switch (result.buttonIndex) {
                       case 1:
                           deferred.resolve(input);
                           break;
                       case 2:
                           deferred.reject()
                           break;
                   }
               });
            return deferred.promise;
        },
        beeb: function (repeat) {
            $cordovaDialogs.beep(repeat);
        }
    }
}]);