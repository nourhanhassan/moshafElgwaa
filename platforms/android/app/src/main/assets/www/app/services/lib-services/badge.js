app.factory("badge", ["$cordovaBadge", function ($cordovaBadge) {
    return {
        hasPermission: function () {
            $cordovaBadge.hasPermission().then(function (result) {
                // You have permission
            }, function (error) {
                // You do not have permission
            });
        },
        set: function (value) {
		$cordovaBadge.set(value);
        },
        get: function () {
            return $cordovaBadge.get();
        },
        clear: function () {
            $cordovaBadge.clear();
        },
        promptForPermission: function () {
            $cordovaBadge.promptForPermission();
        }
        
    }
}]);