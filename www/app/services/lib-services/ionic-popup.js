app.factory("ionicPopup",["$ionicPopup", function ($ionicPopup) {
    return {
        alert: function (title, template, okText) {
          return $ionicPopup.alert({
                title: title,
                template: template,
                okText: okText
            });
         
        },
        show: function (template, title, subTitle, cancelBtnText, saveBtnText, $scope) {
            return $ionicPopup.show({
                template: template,
                title: title,
                subTitle: subTitle,
                scope: $scope,
                buttons: [
                  {
                      text: cancelBtnText,//'Cancel'
                      type: "button button-positive button-outline button-flat",
                      onTap: function (e) { return false; }
                  },
                  {
                      text: saveBtnText,//'<b>Save</b>',
                      type: 'button button-positive button-flat',
                      onTap: function (e) {
                          return true;
                      }
                  }
                ]
            });
        }
        ,
        confirm: function (title, template,cancelBtnText,confirmBtnText) {
            return $ionicPopup.confirm({
                title: title,
                template: template,
                buttons: [
                      {
                          text: cancelBtnText,
                          onTap: function (e) { return false; },
                          type: "button button-positive button-outline button-flat"
                      },
                      {
                          text: confirmBtnText, type: 'button-positive',
                          onTap: function (e) { return true; },
                          type: 'button button-positive button-flat',
                      }]
            });
         //   return confirmPopup;
        }
    }
}]);