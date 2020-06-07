var IonicModule = angular.module('ionic');

IonicModule.directive('calenderHejri', function ($compile, $filter) {
    return {

        restrict: 'E',
        scope: {
            ngModel: '='
        },
        template: '<div > ' +
            '<div class="select-input year-input"><select ng-change="setDate()" ng-model="year"><option value="0">سنة</option><option ng-repeat="y in years" >{{y}}</option></select></div>' +
            ' <br /><div class="select-input month-input"><select ng-change="setDate()" ng-model="month"><option value="">شهر</option><option ng-repeat="m in monthes track by $index">{{m}}</option></select></div>' +
            '<br /><div class="select-input day-input"><select ng-change="setDate()" ng-model="day"><option value="0">يوم</option><option ng-repeat="i in getNumber(30) track by $index">{{$index+1}}</option></select></div> ' +

          '</div> ',
        replace: true,
        require: 'ngModel',
        link: function ($scope, elem, attr, ctrl) {
            console.log(attr)
            $scope.getNumber = function (num) {
                return new Array(num);

            }
            $scope.day = "0";
            $scope.month = "";
            $scope.year = "0";
            $scope.monthes = ['المحرّم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الاول', 'جمادى الآخر', 'رجب', 'شعبان', 'رمضان', 'شوّال', 'ذو القعدة', 'ذو الحجة'];
           // $scope.monthes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

            $scope.range = function (min, max, step) {
                step = step || 1;
                var input = [];
                for (var i = max; i >= min; i -= step) {
                    input.push(i);
                }
                return input;
            };
            $scope.years = $scope.range(1441, 1499, 1);
 
            if ($scope.ngModel.length > 0)
            {
                var date = $scope.ngModel.split(" - ");
                console.log(date)
               $scope.day = date[0];
               $scope.month = date[1];
               $scope.year = date[2];
            }
            $scope.setDate = function () {
                console.log($scope.day + " - " + $scope.month + " - " + $scope.year)
                if ($scope.day > 0 && $scope.month > 0 && $scope.year > 0) {
                    $scope.ngModel = $scope.day + " - " + $scope.month + " - " + $scope.year;
                }
                else {
                    $scope.ngModel = "";
                }
            }

          
            //if (attr.required) {
            //    $scope.$watch($scope.ngModel, function () {
            //        var isValid = ($scope.ngModel.length > 1);
            //        $scope.ngModel.$setValidity($scope.ngModel, isValid);
            //    });
            //}
        }
    };
});