var IonicModule = angular.module('ionic');

IonicModule.directive('menuCloseQv', ['$ionicHistory', function($ionicHistory) {
  return {
    restrict: 'AC',
    link: function($scope, $element) {
      $element.bind('click', function() {
        var sideMenuCtrl = $element.inheritedData('$ionSideMenusController');
        if (sideMenuCtrl) {
          $ionicHistory.nextViewOptions({
            historyRoot: false,
            disableAnimate: true,
            disableBack: false
              ,
            expire: 300
          });
          sideMenuCtrl.close();
        }
      });
    }
  };
}]);