app.factory("toast", ["toaster", function (toaster) {
    return {
        info: function (title, body) {
            return         toaster.pop({
               'type': 'info',
               'title': title,
               'body': body,
               timeout: 2000,
               'position-class': 'toast-bottom-left'
            });

        },
        error: function (title, body) {
        return         toaster.pop({
            'type': 'error',
            'title': title,
            'body': body,
            'timeout': 2000,
            'position-class': 'toast-bottom-left'
        });

    }
    }
}]);