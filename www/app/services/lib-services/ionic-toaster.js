app.factory("ionicToaster", ["toaster", function (toaster) {
    return {
        info: function (title, body) {
            return         toaster.pop({
               'type': 'info',
               'title': title,
               'body': body,
                'timeout': 30000,
                'position-class':  'toast-bottom-right'
            });

        }

    }
}]);