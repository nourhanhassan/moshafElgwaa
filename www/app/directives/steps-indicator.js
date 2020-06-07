var IonicModule = angular.module('ionic');

IonicModule.directive('stepsIndicator', function ($compile, $filter, enums, stepRouter) {
    return {

        restrict: 'E',
        scope: {
            ngModel: '=',
            sakType: '@',
            isValid: '@',
           //
           
        },
        template: '<div class="breadcrumb">' +
            '<div class="padding">' +
                '<a ng-repeat="step in steps" ng-click="goToStep(step.number)" step-no="{{$index+1}}" class="button button-small button-clear step-link {{step.number>ngModel.lastStepNo?\'active\':\'not-active\'}}"><span class="badge badge-balanced">{{step.number}}</span> {{step.title}}</a>' +
           '</div>' +
        '</div>'
            ,
        replace: true,
        require: 'ngModel',
        link: function ($scope, elem, attr, ctrl) {
      
            $scope.route = stepRouter;

            var currentObj = $scope.ngModel;
            
            $scope.$watch('isValid', function () {
                
                //class active means disabled (weird I know :/)

                if ($scope.isValid=="false") {
                    $(".step-link.not-active:not([step-no=" + currentObj.currentStepNo + "])").each(function () {
                        $(this).removeClass("not-active").addClass("active").addClass("was-not-active");
                       
                    });
                }
                else if ($scope.isValid=="true") {
                    $(".was-not-active.active").each(function () {
                        $(this).removeClass("was-not-active").removeClass("active").addClass("not-active");
                    })
                }

            });
            
            $scope.goToStep = function (stepNo) {
               
                
                if ($scope.isValid=="true") { //only navigate if the form is valid
                    if (currentObj.lastStepNo >= stepNo) {
                        if ($scope.sakType == enums.entityType.wakf) {
                            stepRouter.wakfGo(stepNo);
                        }
                        else {
                            stepRouter.wasyaGo(stepNo);
                        }
                    }
                }

            }

            ////alert($scope.sakType);


            if ($scope.sakType == enums.entityType.wakf) {
                switch (currentObj.CategoryID) {

                    case enums.WakfCategory.khairy.Id: {
                        $scope.steps = [
                            {
                                number: 1,
                                title: 'بيانات أساسية'
                            },
                            {
                                number: 2,
                                title: 'الأصل الوقفي'
                            },
                            {
                                number: 3,
                                title: 'الناظر على الوقف'

                            },
                            {
                                number: 4,
                                title: 'الشهود على الوقف'
                            }
                        ];
                        break;
                    }

                    case enums.WakfCategory.zory.Id: {
                        $scope.steps = [
                           {
                               number: 1,
                               title: 'بيانات أساسية'
                           },
                           {
                               number: 2,
                               title: 'الأصل الوقفي'
                           },
                           {
                               number: 3,
                               title: 'الناظر على الوقف'

                           },
                           {
                               number: 4,
                               title: 'الشهود على الوقف'
                           }
                        ];
                        break;
                    }


                    case enums.WakfCategory.Moshtarak.Id: {

                        $scope.steps = [
                          {
                              number: 1,
                              title: 'بيانات أساسية'
                          },
                          {
                              number: 2,
                              title: 'الأصل الوقفي'
                          },
                          {
                              number: 3,
                              title: 'أوجه الصرف'

                          },
                          {
                              number: 4,
                              title: 'الناظر على الوقف'
                          },
                          {
                              number: 5,
                              title: 'الشهود على الوقف'
                          }
                        ];

                        break;
                    }

                }
            }
            else { //wasya

                $scope.steps = [
                           {
                               number: 1,
                               title: 'بيانات أساسية'
                           },
                           {
                               number: 2,
                               title: 'الناظر على الوصية'

                           },
                           {
                               number: 3,
                               title: 'الشهود على الوصية'
                           }
                ];

            }
        }
    }
});