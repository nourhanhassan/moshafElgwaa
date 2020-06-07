app.controller("namesofallahController", ["$scope", "$rootScope", "$stateParams", "$state", "httpHandler", "ionicPopup", "socialShare", "$ionicModal", "enums", "$ionicPopup", function ($scope, $rootScope, $stateParams, $state, httpHandler, ionicPopup, socialShare, $ionicModal, enums, $ionicPopup) {
    $rootScope.activePage = "namesofallah";
    $scope.toggle = false;
    $scope.closeShareModal = function () {
        $scope.modal.hide();
    }

    $scope.shareName = function (name) {
        $scope.nameTitle = name.NameOfAllah;
        $scope.nameContent = document.getElementById(name.Number).innerText;
        $scope.modal.show();
        //var shareAsText = $ionicPopup.show({
        //    template: 'مشاركة',
        //    title: 'هل تريد المشاركة على هيئة نص ام صورة؟',
        //    scope: $scope,
        //    buttons: [
        //   //{
        //   //    text: 'اغلاق'
        //   //    //close popup and do nothing
        //   //},
        //   {
        //       text: 'نص',
        //       type: 'button button-positive button-outline button-flat',
        //       onTap: function (e) {
        //           socialShare.Share($scope.nameTitle + "\n" + $scope.nameContent,
        //            $scope.nameTitle,
        //            null,
        //            enums.appInfo.shareURL);
        //       }
        //   },
        //   {
        //       text: 'صورة',
        //       type: 'button-positive',
        //       onTap: function (e) {
        //           $scope.modal.show();
        //       }
        //   }]
        //});
        //myPopup.then(function (userinput) {
        //    if (userinput) {
        //        console.log('returned data' + userinput)
        //    }
        //});
    }

    //$scope.shareName = function (name) {
    //    $scope.nameTitle = name.NameOfAllah;
    //    $scope.nameContent = document.getElementById(name.Number).innerText;
    //    var shareAsText = ionicPopup.confirm("مشاركة", "هل تريد المشاركة على هيئة نص ام صورة؟", "صورة", "نص").then(function (shareAsText) {
    //        if (shareAsText) {

    //            socialShare.Share($scope.nameTitle + "\n" + $scope.nameContent,
    //                $scope.nameTitle,
    //                null,
    //                enums.appInfo.shareURL)
    //        }
    //        //else {
    //        //    //sharing as an image

    //        //    $scope.modal.show();


    //        //}
    //    })
    //    //var nameTitle = name.NameOf Allah;
    //    //var nameContent = document.getElementById(name.Number).innerText;
    //    //socialShare.Share(nameTitle + "\n" + nameContent,
    //    //    nameTitle,
    //    //    null,
    //    //    enums.appInfo.shareURL)

    //}
    $scope.shareImage = function (image) {
        $scope.modal.hide();
        document.fonts.load('14px "UthmanicHafs1 Ver12"').then(function () {
            $scope.initCanvasText($scope.nameTitle, $scope.nameContent, image);
            var img = new Image();

            img.onload = function () {

                window.plugins.socialsharing.share(null,
                 null,
                 img.src
                 ,
              null
                 )
            };
            img.src = $scope.Canvas.toDataURL();
        })
    }

    $scope.initCanvasText = function (nameTitle, nameContent, item) {
        $scope.img = new Image();
        $scope.img.src = item.image;
        $scope.CT = new CanvasText;
        $scope.Canvas = document.createElement("CANVAS");
        $scope.Context = $scope.Canvas.getContext("2d");
        var dpr = window.devicePixelRatio || 1,
  bsr = $scope.Context.webkitBackingStorePixelRatio ||
        $scope.Context.mozBackingStorePixelRatio ||
        $scope.Context.msBackingStorePixelRatio ||
        $scope.Context.oBackingStorePixelRatio ||
        $scope.Context.backingStorePixelRatio || 1;
        $scope.PIXEL_RATIO = dpr / bsr;

        $scope.Canvas.width = $scope.img.width * $scope.PIXEL_RATIO;
        $scope.Canvas.height = $scope.img.height * $scope.PIXEL_RATIO;
        $scope.CT.config({
            canvas: $scope.Canvas,
            context: $scope.Context,
            fontFamily: "cairo",
            fontWeight: "normal",
            fontColor: "#EACB92",
            lineHeight: "35",
            textAlign: "justify",
            fontSize: "35px",
            direction: "rtl",
            textBaseline: 'middle'
        });


        var width = $scope.Canvas.width;
        var height = $scope.Canvas.height;
        $scope.CT.context.setTransform($scope.PIXEL_RATIO, 0, 0, $scope.PIXEL_RATIO, 0, 0);
        $scope.CT.context.drawImage($scope.img, 0, 0);
        $scope.CT.context.font = "bold 40px cairo";
        $scope.CT.context.fillStyle = "white";
        $scope.CT.context.textAlign = "center";
        var length = $scope.nameContent.length;
        if (item.id == 3) {
            if (length < 100) {
                $scope.CT.context.fillText($scope.nameTitle, (width / $scope.PIXEL_RATIO) / 2, ((height / $scope.PIXEL_RATIO) / 3) + 50);
                $scope.CT.context.font = "33px cairo";
                $scope.CT.context.fillStyle = "#EACB92";
                $scope.CT.context.textAlign = "justify";
                $scope.CT.context.direction = "rtl";
                $scope.CT.context.textBaseline = 'middle';
                wrapText($scope.CT.context, $scope.nameContent, (width / $scope.PIXEL_RATIO) / 2, ((height / $scope.PIXEL_RATIO) / 3) + 110, (width / $scope.PIXEL_RATIO) - 60, 42);

            }
            else {
                $scope.CT.context.fillText($scope.nameTitle, (width / $scope.PIXEL_RATIO) / 2, ((height / $scope.PIXEL_RATIO) / 3) + 30);
                $scope.CT.context.font = "33px cairo";
                $scope.CT.context.fillStyle = "#EACB92";
                $scope.CT.context.textAlign = "justify";
                $scope.CT.context.direction = "rtl";
                $scope.CT.context.textBaseline = 'middle';
                wrapText($scope.CT.context, $scope.nameContent, (width / $scope.PIXEL_RATIO) / 2, ((height / $scope.PIXEL_RATIO) / 3) + 90, (width / $scope.PIXEL_RATIO) - 60, 42);

            }



        }
        else {
            if (length < 100) {
                $scope.CT.context.fillText($scope.nameTitle, (width / $scope.PIXEL_RATIO) / 2, ((height / $scope.PIXEL_RATIO) / 2) - 70);
                $scope.CT.context.font = "33px cairo";
                $scope.CT.context.fillStyle = "#EACB92";
                $scope.CT.context.textAlign = "justify";
                $scope.CT.context.direction = "rtl";
                $scope.CT.context.textBaseline = 'middle';
                wrapText($scope.CT.context, $scope.nameContent, (width / $scope.PIXEL_RATIO) / 2, ((height / $scope.PIXEL_RATIO) / 2) - 10, (width / $scope.PIXEL_RATIO) - 260, 42);

            }
            else {
                $scope.CT.context.fillText($scope.nameTitle, (width / $scope.PIXEL_RATIO) / 2, ((height / $scope.PIXEL_RATIO) / 3));
                $scope.CT.context.font = "33px cairo";
                $scope.CT.context.fillStyle = "#EACB92";
                $scope.CT.context.textAlign = "justify";
                $scope.CT.context.direction = "rtl";
                $scope.CT.context.textBaseline = 'middle';

                wrapText($scope.CT.context, $scope.nameContent, (width / $scope.PIXEL_RATIO) / 2, ((height / $scope.PIXEL_RATIO) / 3) + 70, (width / $scope.PIXEL_RATIO) - 260, 42);

            }


        }
        //wrapText($scope.CT.context, text, (width / $scope.PIXEL_RATIO), height / 3, width - 40, 50);

    };
    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        var cars = text.split("\n");

        for (var ii = 0; ii < cars.length; ii++) {

            var line = "";
            var words = cars[ii].split(" ");

            for (var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + " ";
                var metrics = context.measureText(testLine);
                var testWidth = metrics.width;

                if (testWidth > maxWidth) {
                    context.fillText(line, x, y);
                    line = words[n] + " ";
                    y += lineHeight;
                }
                else {
                    line = testLine;
                }
            }

            context.fillText(line, x, y);
            y += lineHeight;
        }
    }

    $scope.initCanvasVariables = function () {
        $scope.img = new Image();
        $scope.img.src = '';
        $scope.CT = new CanvasText;
        $scope.Canvas = document.createElement("CANVAS");
        $scope.Context = $scope.Canvas.getContext("2d");

        var dpr = window.devicePixelRatio || 1,
  bsr = $scope.Context.webkitBackingStorePixelRatio ||
        $scope.Context.mozBackingStorePixelRatio ||
        $scope.Context.msBackingStorePixelRatio ||
        $scope.Context.oBackingStorePixelRatio ||
        $scope.Context.backingStorePixelRatio || 1;
        $scope.PIXEL_RATIO = dpr / bsr;

        $scope.Canvas.width = $scope.img.width * $scope.PIXEL_RATIO;
        $scope.Canvas.height = $scope.img.height * $scope.PIXEL_RATIO;
        $scope.CT.config({
            canvas: $scope.Canvas,
            context: $scope.Context,
            fontFamily: "cairo",
            fontWeight: "normal",
            fontColor: "#EACB92",
            lineHeight: "35",
            textAlign: "justify",
            fontSize: "35px",
            direction: "rtl",
            textBaseline: 'middle'
        });
    }

    $scope.init = function () {
        $scope.CPapiDomainLink = httpHandler.CPapiDomainLink;
        $scope.initCanvasVariables();
        $scope.shareImages = [

{ id: 1, image: "img/1.jpeg" },
{ id: 2, image: "img/2.jpeg" },
{ id: 3, image: "img/3.jpeg" },
{ id: 4, image: "img/4.jpeg" }
        ];
        $ionicModal.fromTemplateUrl('app/templates/popovers/select-share-image.html', {
            scope: $scope,
            animation: 'slide-in-up',
        }).then(function (modal) {
            $scope.modal = modal;

        });
    }
    $scope.init();
}]);