app.controller("indexController", ["$scope", "httpHandler", "doaaBook", "$rootScope", "ionicPopup", "$stateParams", "$state", "socialShare", "enums", "localStorage", "$ionicModal", function ($scope, httpHandler, doaaBook, $rootScope, ionicPopup, $stateParams, $state, socialShare, enums, localStorage, $ionicModal) {


    $scope.openDoaa = function (id) {
        $state.go("doaa", { id: id });
    }
    $scope.shareName = function (name) {
        $scope.nameTitle = name.NameOfAllah;
        $scope.nameContent = document.getElementById(name.Number).innerText;
        var shareAsText = ionicPopup.confirm("مشاركة", "هل تريد المشاركة على هيئة نص ام صورة؟", "صورة", "نص").then(function (shareAsText) {
            if (shareAsText) {

                socialShare.Share($scope.nameTitle + "\n" + $scope.nameContent,
                    $scope.nameTitle,
                    null,
                    enums.appInfo.shareURL)
            }
            else {
                //sharing as an image

                $scope.modal.show();


            }
        })
        //var nameTitle = name.NameOfAllah;
        //var nameContent = document.getElementById(name.Number).innerText;
        //socialShare.Share(nameTitle + "\n" + nameContent,
        //    nameTitle,
        //    null,
        //    enums.appInfo.shareURL)

    }
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

    $ionicModal.fromTemplateUrl('app/templates/popovers/select-share-image.html', {
        scope: $scope,
        animation: 'slide-in-up',
    }).then(function (modal) {
        $scope.modal = modal;

    });
    $scope.closeShareModal = function () {
        $scope.modal.hide();
    }

    $scope.items = [

        { id: 1, active: false, image: "img/link1.png" },
        { id: 2, active: false, image: "img/link2.png" },
        { id: 3, active: false, image: "img/link3.png" }
    ];

    $scope.toggle = false;
    $scope.submenu = false;
    $scope.setMaster = function (mainCateg) {
        $scope.selected = mainCateg;
    }

    $scope.isSelected = function (mainCateg) {
        return $scope.selected === mainCateg;
    }
    $scope.setMaster = function (name) {
        $scope.selected = name;
    }

    $scope.isSelected = function (name) {
        return $scope.selected === name;
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
            textAlign: "center",
            fontSize: "35px",
        });

        var width = $scope.img.width;
        var height = $scope.img.height;
        $scope.CT.context.setTransform($scope.PIXEL_RATIO, 0, 0, $scope.PIXEL_RATIO, 0, 0);
        $scope.CT.context.drawImage($scope.img, 0, 0);
        $scope.CT.context.font = "40px cairo";
        $scope.CT.context.fillStyle = "white";
        $scope.CT.context.textAlign = "center";

        if (item.id == 3) {
            $scope.CT.context.fillText($scope.nameTitle, width / 2, (height / 3) + 10);
            $scope.CT.context.font = "33px cairo";
            $scope.CT.context.fillStyle = "#EACB92";
            wrapText($scope.CT.context, $scope.nameContent, (width / $scope.PIXEL_RATIO), (height / 3) + 60, width - 60, 42);

        }
        else {
            $scope.CT.context.fillText($scope.nameTitle, width / 2, (height / 3) - 50 + 10);
            $scope.CT.context.font = "33px cairo";
            $scope.CT.context.fillStyle = "#EACB92";
            wrapText($scope.CT.context, $scope.nameContent, (width / $scope.PIXEL_RATIO) - 15, (height / 3), 550, 42);

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
            textAlign: "center",
            fontSize: "35px",
        });
    }


    $scope.init = function () {
        $rootScope.activePage = "index";
        $scope.CPapiDomainLink = httpHandler.CPapiDomainLink;
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
        //document.getElementsByTagName('ion-nav-bar')[1].style.display = 'none';
        $rootScope.doaaBookContents = localStorage.get("doaaBookContents");
        if ($rootScope.doaaBookContents == undefined || $rootScope.doaaBookContents == null) {
            doaaBook.getAllDoaaBookContents().then(function (result) {
                $rootScope.doaaBookContents = result;
                localStorage.set("doaaBookContents", result)
                console.log($rootScope.doaaBookContents);
                $rootScope.doaas = result.doaas;
                $rootScope.namesOfAllah = result.namesOfAllah;
                $rootScope.articles = result.articles;
            })
        }
        else {
            $rootScope.doaas = $rootScope.doaaBookContents.doaas;
            $rootScope.namesOfAllah = $rootScope.doaaBookContents.namesOfAllah;
            $rootScope.articles = $rootScope.doaaBookContents.articles;
        }
        $scope.initCanvasVariables();
        $scope.shareImages = [

{ id: 1, image: "img/1.jpeg" },
{ id: 2, image: "img/2.jpeg" },
{ id: 3, image: "img/3.jpeg" },
{ id: 4, image: "img/4.jpeg" }
        ];
    }


    $scope.init();
}]);