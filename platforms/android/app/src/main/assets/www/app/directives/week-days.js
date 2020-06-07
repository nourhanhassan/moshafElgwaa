var IonicModule = angular.module('ionic');

IonicModule.directive('weekDaysList', function() {
        return {
            template: '<div style="padding:5px">' +
                '<div ng-repeat="option in weekDays">' +
                '<label class="clear">' +
                '<input type="checkbox"' +
                'class="radio-week-day" ng-model="option.value">' +
                '&nbsp;{{option.name}}</label></div>' +
                '</div>',
            restrict: 'A',
            replace: true,
            scope: {
                weekDays: "="
            },
            link: function (scope, element) {
                /**
                 * @ngdoc method
                 * @name destroy
                 * @description
                 * # utterly destroy listeners and anything else
                 */
            }
        };
    
});