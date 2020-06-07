app.factory("ionicActionSheet", ["$ionicActionSheet", function ($ionicActionSheet) {
    return {
        show: function (title,buttonsArrayJson, destructive, cancel) {
            $ionicActionSheet.show({
                buttons: buttonsArrayJson,
                destructiveText: destructive.text,
                titleText: title,
                cancelText: cancel.text,
                cancel: function () {
                    cancel.action();
                },
                buttonClicked: function (index) {
                    buttonsArrayJson[index].action();
                    return true;
                },
                destructiveButtonClicked: function () {
                    destructive.action();
                }
            });
        }
    }
}]);

// **************buttonsArrayJson******************
//[{
//    text: '<b>Action 1</b>',
//  action: function () {
//
//    }
//}, {
//    text: '<b>Action 2</b>', 
//  action: function () {
//
//    }
//}]


// **************destructive/cancel******************
//{
//    text: '<b>Delete</b>', 
//  action: function () {
// 
//    }
//}