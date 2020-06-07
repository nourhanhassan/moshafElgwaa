app.factory("ionicModal", ["$ionicModal", "$q", function ($ionicModal,  $q) {
    var ionicModal = {
        currentModal : null,
        showTemplateUrl: function (templateUrl,scope, allowBackdropClose, allowBackButtonClose) {
            var deferred = $q.defer();
            if (ionicModal.currentModal) {
                ionicModal.currentModal.remove();
            }
            $ionicModal.fromTemplateUrl(templateUrl, {
                scope: scope,
                animation: 'slide-in-up',
                backdropClickToClose: allowBackdropClose,
                hardwareBackButtonClose: allowBackButtonClose,
            }).then(function (modal) {
                ionicModal.currentModal = modal;
                ionicModal.currentModal.show();
                deferred.resolve(modal);
            });
            return deferred.promise;
        },
        hide: function (modal) {
            if (modal) { modal.remove(); }
            else if(ionicModal.currentModal)
            {
                ionicModal.currentModal.remove();
            }
            $("body").removeClass("modal-open");
        }

        
        
    }
    return ionicModal;
}]);