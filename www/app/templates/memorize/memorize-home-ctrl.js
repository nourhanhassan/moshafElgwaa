app.controller("memorizeHomeController", function ($scope, ayatData, memorize, $filter, $ionicPopup, $timeout, $anchorScroll, $location, ionicLoading, target, enums, $state) {


    //accordion
    $scope.groups = [{
        title: "الحفظ المنفرد",
        contents: [
          {
              line: "حفظ سورة البقرة",
              date: "12-12-2012"
          },
          {
              line: "حفظ الجزء 29"
          },
          {
              line: "حفظ جزء عم"
          },
          {
              line: "حفظ سورة الكهف"
          }
        ]
    },
    {
        title: "الحفظ في مجموعة",
        contents: [
          {
              line: "WHY?"
          },
          {
              line: "WHAT IS THE MESSAGE?"
          },
          {
              line: "WHAT IS THE VEHICLE?"
          },
          {
              line: "WHO ARE THE AUDIENCE?"
          }
        ]
    }
    ];

    $scope.toggleGroup = function (group) {
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
    };
    $scope.isGroupShown = function (group) {
        return $scope.shownGroup === group;
    };



});
