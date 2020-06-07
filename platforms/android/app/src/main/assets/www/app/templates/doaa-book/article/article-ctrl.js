﻿/// <reference path="../../popovers/doaa-book-popover.html" />
//app.controller("articleController", ["$scope", "$rootScope", "$stateParams", "$state", "$ionicModal", "$filter", "$ionicSlideBoxDelegate", "$ionicPopup", "doaaBookmarkTypes", "doaaBookmarks", "toast", "enums", "memorizeDoaaBook", function ($scope, $rootScope, $stateParams, $state, $ionicModal, $filter, $ionicSlideBoxDelegate, $ionicPopup, doaaBookmarkTypes, doaaBookmarks, toast, enums, memorizeDoaaBook) {
//    $rootScope.activePage = "article";
//    console.log($state.current.name);
//    document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
//    document.getElementsByTagName('ion-nav-bar')[1].style.display = 'block';
//    $rootScope.inDoaaBook = true;
//    var explanationToShow = {};
//    var currentArticleExplanations = [];
//    $scope.Articles = $rootScope.articles;
//    $scope.currentArticleIndex = $scope.Articles.indexOf($filter('filter')($scope.Articles, { 'ID': $stateParams.id })[0]);
//    $scope.lastBookmark = doaaBookmarkTypes.getActiveBookmarkType();// doaaBookmarks.getLastBookmark();

//    $scope.getArticles = function () {
//                $scope.changeSlide(parseInt($scope.currentArticleIndex));
//        $scope.currentArticleName = $scope.Articles[$scope.currentArticleIndex].Name;
//        currentArticleExplanations = $scope.Articles[$scope.currentArticleIndex].ArticleItemExplanations;

//            }
//    $scope.init = function () {
//        $rootScope.activePage = "article";
//        $scope.getArticles();
//        //zooming
//        $rootScope.zoomingFontSize = 6;
//        $rootScope.zoomingNameFontSize = 5.7;
//        $rootScope.zoomingNumFontSize = 3;
//        $rootScope.paddingSize = 2;
//        $rootScope.lineHeigh = 1.5;
//    }


//    $scope.zoomIn = function () {
//        if ($rootScope.zoomingFontSize < 20) {
//            $rootScope.zoomingFontSize += 1;
//            $rootScope.zoomingNameFontSize += 1;
//            $rootScope.zoomingNumFontSize += 1;
//            $rootScope.paddingSize += 1;
//            $rootScope.lineHeigh += 0.035;
//        }
//    }
//    $scope.zoomOut = function () {
//        if ($rootScope.zoomingFontSize > 6) {
//            $rootScope.zoomingFontSize -= 1;
//            $rootScope.zoomingNameFontSize -= 1;
//            $rootScope.zoomingNumFontSize -= 1;
//            $rootScope.paddingSize -= 1;
//            $rootScope.lineHeigh -= 0.035;
//        }
//    }



//    $scope.changeSlide = function (index) {
//        setTimeout(function () {
//            $ionicSlideBoxDelegate.slide(index);
//            $ionicSlideBoxDelegate.update();
//            $scope.$apply();
//        });
//    }
//    $scope.openArticleModal = function (id) {
//        //$scope.currentExplanation = $filter('filter')(currentArticleExplanations, { 'ExplanationNumber': id })[0];
//        var index=currentArticleExplanations.findIndex(x => x.ExplanationNumber === id);
//        $scope.currentExplanation = currentArticleExplanations[index];
//        $ionicModal.fromTemplateUrl('app/templates/popovers/article-modal.html', {
//            scope: $scope,
//            animation: 'slide-in-up',
//        }).then(function (modal) {
//            $scope.articleModal = modal;
//            $scope.articleModal.show();
//        });
//    }
//    $scope.closeArticleModal = function () {
//        $scope.articleModal.hide();
//    }
//    $scope.openNamesOfAllahModal = function (id) {
//        $scope.nameOfAllah = $filter('filter')($rootScope.namesOfAllah, { 'Number': id })[0];
//        console.log($scope.nameOfAllah);
//        $ionicModal.fromTemplateUrl('app/templates/popovers/names-of-allah-modal.html', {
//            scope: $scope,
//            animation: 'slide-in-up',
//        }).then(function (modal) {
//            $scope.namesOfAllahModal = modal;
//            $scope.namesOfAllahModal.show();
//        });
//    }
//    $scope.closeNamesOfAllahModal = function () {
//        $scope.namesOfAllahModal.hide();
//    }
//    $scope.slideHasChanged = function (index) {
//        console.log(index);
//        $scope.currentArticleIndex = index;
//        $scope.currentArticleName = $scope.Articles[index].Name;
//        currentArticleExplanations = $scope.Articles[index].ArticleItemExplanations;
//        console.log($scope.Articles[index]);
//    }

//    $scope.moveBookMark = function () {
//        //Id, index, bookmarkTypeId
        
//        if ($scope.lastBookmark != null) {
//            //$scope.curAya = aya;
//            doaaBookmarkTypes.moveBookmarkType($scope.lastBookmark.Id, $scope.Articles[$scope.currentArticleIndex].ID, $scope.currentArticleIndex, enums.doaaBookmarkType.article, $scope.Articles[$scope.currentArticleIndex].Name)
//            $scope.setLastBookmarkType();
//            var msg = "تم نقل العلامة المرجعية";
//            toast.info("", msg)
//        }
//        else {
//            var msg = "لا يوجد علامات مرجعية لنقلها"
//            toast.error("", msg)
//        }


//    }
//    $scope.setLastBookmarkType = function () {
//        $scope.lastBookmark = doaaBookmarkTypes.getActiveBookmarkType();
//    }
//    $scope.addToFavourite = function () {
//        memorizeDoaaBook.addArticleToFavourite($scope.Articles[$scope.currentArticleIndex], enums.doaaBookmarkType.article);
//        var msg = "تم الاضافة الي المفضلة";
//        toast.info("", msg)
//    }
//    $scope.init();
//}]);



app.controller("articleController", ["$scope", "$rootScope", "$stateParams", "$state", "$ionicModal", "$ionicPopover", "$filter", "$ionicSlideBoxDelegate", "$ionicPopup", "doaaBookmarkTypes", "doaaBookmarks", "toast", "enums", "memorizeDoaaBook", "$timeout", "$ionicScrollDelegate","$location","$document", function ($scope, $rootScope, $stateParams, $state, $ionicModal, $ionicPopover, $filter, $ionicSlideBoxDelegate, $ionicPopup, doaaBookmarkTypes, doaaBookmarks, toast, enums, memorizeDoaaBook,$timeout,$ionicScrollDelegate,$location,$document) {
    $rootScope.activePage = "article";
    console.log($state.current.name);
    document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    //document.getElementsByTagName('ion-nav-bar')[1].style.display = 'block';
    $rootScope.inDoaaBook = true;
    var explanationToShow = {};
    var currentArticleExplanations = [];
    $scope.Articles = $rootScope.articles;
    $scope.currentArticleIndex = $scope.Articles.indexOf($filter('filter')($scope.Articles, { 'ID': $stateParams.id })[0]);
    $scope.lastBookmark = doaaBookmarkTypes.getActiveBookmarkType();// doaaBookmarks.getLastBookmark();

    $scope.getArticles = function () {
        $scope.changeSlide(parseInt($scope.currentArticleIndex));
        $scope.currentArticleName = $scope.Articles[$scope.currentArticleIndex].Name;
        currentArticleExplanations = $scope.Articles[$scope.currentArticleIndex].ArticleItemExplanations;

    }
    

    $scope.shareImage = function (image) {
        $scope.modal.hide();
        document.fonts.load('14px "UthmanicHafs1 Ver12"').then(function () {
            $scope.initCanvasText("من كتاب الأدعية 'مصحف الجواء'", $scope.sharedContent, image);
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

    $scope.initCanvasText = function (nameTitle, sharedContent,item) {
        $scope.img = new Image();
        $scope.img.src = item.image;
        $scope.CT = new CanvasText;
        $scope.Canvas = document.createElement("CANVAS");
        $scope.Context = $scope.Canvas.getContext("2d");
        var  dpr = window.devicePixelRatio || 1,
  bsr = $scope.Context.webkitBackingStorePixelRatio ||
        $scope.Context.mozBackingStorePixelRatio ||
        $scope.Context.msBackingStorePixelRatio ||
        $scope.Context.oBackingStorePixelRatio ||
        $scope.Context.backingStorePixelRatio || 1;
        $scope.PIXEL_RATIO = dpr / bsr;

        $scope.Canvas.width = $scope.img.width * $scope.PIXEL_RATIO;
        $scope.Canvas.height = ($scope.img.height * $scope.PIXEL_RATIO) + ($scope.height* $scope.PIXEL_RATIO*2+250* $scope.PIXEL_RATIO) ; ;
        $scope.CT.config({
            canvas: $scope.Canvas,
            context: $scope.Context,
            fontFamily: $rootScope.fontFamily,
            fontWeight: "bold",
            fillText:'#000000',
            lineHeight: "35",
            textAlign: "justify",
            direction: "rtl",
            textBaseline: 'middle',
            
        });


        var width = $scope.Canvas.width;
        var height = $scope.Canvas.height;
        var fontSize = 38;
        $scope.CT.context.beginPath();
        $scope.CT.context.rect(0, $scope.img.height, width, height);
        $scope.CT.context.fillStyle = "#ffffff";
        $scope.CT.context.fill();
        $scope.CT.context.setTransform($scope.PIXEL_RATIO, 0, 0, $scope.PIXEL_RATIO, 0, 0);
        $scope.CT.context.drawImage($scope.img, 0, 0);
        $scope.CT.context.fillStyle = "#000000";
        $scope.CT.context.textAlign = "center";
        $scope.CT.context.fontFamily = $rootScope.fontFamily;
        $scope.CT.context.font = getFont();

        $scope.CT.context.fontWeight = "bold";
        $scope.CT.context.direction = "rtl";
        var length = $scope.sharedContent.length;
        
       
        $scope.CT.context.fillText(nameTitle, (width / $scope.PIXEL_RATIO) / 2, ($scope.img.height) + 70);
        var fontSize = 33;
        $scope.CT.context.fillStyle = "#000000";
        $scope.CT.context.textAlign = "justify";
        $scope.CT.context.direction = "rtl";
        $scope.CT.context.fontFamily = $rootScope.fontFamily;
        $scope.CT.context.textBaseline = 'top';
        function getFont() {
            var ratio = fontSize / width;   // calc ratio
            var size = width * ratio;   // get font size based on current width
            return (size | 0) + 'px '+$rootScope.fontFamily; // set font
        }

        $scope.CT.context.font = getFont();

        $scope.CT.context.fontWeight = "normal";
        wrapText($scope.CT.context, $scope.sharedContent, (width / $scope.PIXEL_RATIO) / 2, ($scope.img.height) + 120, (width / $scope.PIXEL_RATIO), 60);
       
       

        
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
            $scope.textHeight=y;
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
        $scope.Canvas.height = ($scope.img.height * $scope.PIXEL_RATIO) + 2500* $scope.PIXEL_RATIO;
        $scope.CT.config({
            canvas: $scope.Canvas,
            context: $scope.Context,
            fontFamily: "cairo",
            fontWeight: "normal",
            fontColor: "#000000",
            lineHeight: "35",
            textAlign: "justify",
            fontSize: "35px",
            direction: "rtl",
            textBaseline: 'middle',
            fillStyle : "white"
        });
    }

    $scope.sharePart=function(){
        $scope.doaaModal.hide();
        $scope.modal.show();
    }
   
    $scope.init = function () {
        //$scope.subItemId=0;
        var subItemId= $stateParams.subItemId;
        if(subItemId!=0&& subItemId)
        {
            var y=document.getElementById(subItemId).offsetTop;
            $ionicScrollDelegate.scrollBy(0, y);
        }
        $scope.initCanvasVariables();
        $scope.shareImages = [

{ id: 1, image: "img/01.png" },
{ id: 2, image: "img/02.png" },
{ id: 3, image: "img/03.png" },
{ id: 4, image: "img/04.jpeg" },
{ id: 5, image: "img/05.jpeg" },
{ id: 6, image: "img/06.jpeg" },
//{ id: 7, image: "img/07.jpeg" },
{ id: 8, image: "img/08.jpeg" },
{ id: 9, image: "img/09.jpeg" },
{ id: 10, image:"img/10.jpeg" },
{ id: 11, image: "img/11.jpeg" },
{ id: 12, image: "img/12.jpeg" },
{ id: 13, image: "img/13.jpeg" },
{ id: 14, image: "img/14.jpeg" },
{ id: 15, image: "img/15.jpeg" },
{ id: 16, image: "img/16.jpeg" },
{ id: 17, image:"img/17.jpeg" },
{ id: 18, image:"img/18.jpeg" },
//{ id: 19, image: "img/19.jpeg" },
//{ id: 20, image: "img/20.jpeg" },
//{ id: 21, image: "img/21.jpeg" },
{ id: 22, image: "img/22.jpeg" },
//{ id: 23, image: "img/23.jpeg" },
//{ id: 24, image: "img/24.jpeg" }

        ];
        $ionicModal.fromTemplateUrl('app/templates/popovers/select-share-image.html', {
            scope: $scope,
            animation: 'slide-in-up',
        }).then(function (modal) {
            $scope.modal = modal;

        });
  

        $scope.openPopover = function ($event) {
            $scope.doaaModal.show($event);
        };

        $scope.closePopover = function () {
            $scope.doaaModal.hide();
        };
        //Cleanup the popover when we're done with it!
        //$scope.$on('$destroy', function () {
        //    $scope.doaaModal.remove();
        //});
        
        $scope.getArticles();
        $timeout(function () {
            var allParagraphs = document.querySelectorAll("p");
            $scope.allParagraphs=allParagraphs;
            allParagraphs.forEach(function(item, index, array){

                item.setAttribute("id",index);
                item.setAttribute("on-hold","addFavourite("+index+")");
                // Get a reference to an element
                ////var square = document.querySelector('.square');

                // Create a manager to manager the element
                var manager = new Hammer.Manager(item);

                // Create a recognizer
                var Press = new Hammer.Press({
                    time: 500
                });

                // Add the recognizer to the manager
                //manager.add(Press);

                //// Subscribe to desired event
                //manager.on('press', function (e) {
                //    $ionicPopover.fromTemplateUrl('app/templates/popovers/doaa-book-popover.html', {
                //        scope: $scope
                //    }).then(function (popover) {
                //        $scope.doaaModal = popover;
                //        if(e.target=="p")
                //        {
                //            $scope.id = e.target.id;
                //        }
                //        else
                //        {

                //        }

                      
                //        $scope.doaaModal.show();
                //    });
           
                //    $scope.subItemId=e.target.id;
                //    $scope.sharedContent=e.target.innerText;
                //    $scope.height = e.target.getBoundingClientRect().height;
                //    console.log("subItemId",$scope.subItemId);
                //});
            });
            //$location.hash(20);
            //$ionicScrollDelegate.anchorScroll(true);
            //var chartHelp = angular.element(document.getElementById(10));
            //$document.scrollToElement(chartHelp, 30, 500).then(function() {
            //    console.log('You just scrolled to chart-help!');
            //});
            //document.getElementById(10).scrollIntoView();
            $scope.y=document.getElementById("myDIV").offsetHeight;
            $scope.myVar = setInterval(myTimer, 1000);//6
            $scope.stratY=10;
        }, 1000);

    }

   
    function myTimer() {
        if($scope.stratY<$scope.y)
        {
            $ionicScrollDelegate.scrollBy(0,  $scope.stratY);
            $scope.stratY=$scope.stratY+10;
    }
else
        {
            $scope.stratY=10;
            $scope.slideHasChanged($scope.currentArticleIndex++);

        //clearInterval( $scope.myVar);
}
    }

    $scope.changeSlide = function (index) {
        setTimeout(function () {
            $ionicSlideBoxDelegate.slide(index);
            $ionicSlideBoxDelegate.update();
            $scope.$apply();
        });
    }
    $scope.openArticleModal = function (id) {
        //$scope.currentExplanation = $filter('filter')(currentArticleExplanations, { 'ExplanationNumber': id })[0];
        var index=currentArticleExplanations.findIndex(x => x.ExplanationNumber === id);
        $scope.currentExplanation = currentArticleExplanations[index];
        $ionicModal.fromTemplateUrl('app/templates/popovers/article-modal.html', {
            scope: $scope,
            animation: 'slide-in-up',
        }).then(function (modal) {
            $scope.articleModal = modal;
            $scope.articleModal.show();
        });
    }
    $scope.closeArticleModal = function () {
        $scope.articleModal.hide();
    }
    $scope.closeShareModal = function () {
        $scope.modal.hide();
    }
    $scope.openNamesOfAllahModal = function (id) {
        $scope.nameOfAllah = $filter('filter')($rootScope.namesOfAllah, { 'Number': id })[0];
        console.log($scope.nameOfAllah);
        $ionicModal.fromTemplateUrl('app/templates/popovers/names-of-allah-modal.html', {
            scope: $scope,
            animation: 'slide-in-up',
        }).then(function (modal) {
            $scope.namesOfAllahModal = modal;
            $scope.namesOfAllahModal.show();
        });
    }
    $scope.closeNamesOfAllahModal = function () {
        $scope.namesOfAllahModal.hide();
    }
    $scope.slideHasChanged = function (index) {
        //$scope.subItemId=0;
        $scope.currentArticleIndex = index;
        $scope.currentArticleName = $scope.Articles[index].Name;
        currentArticleExplanations = $scope.Articles[index].ArticleItemExplanations;
        $ionicScrollDelegate.scrollTop();

    }

    $scope.moveBookMark = function () {
        //Id, index, bookmarkTypeId
        $scope.doaaModal.hide();
        if ($scope.lastBookmark != null) {
            //$scope.curAya = aya;
            doaaBookmarkTypes.moveBookmarkType($scope.lastBookmark.Id, $scope.Articles[$scope.currentArticleIndex].ID, $scope.currentArticleIndex, enums.doaaBookmarkType.article, $scope.Articles[$scope.currentArticleIndex].Name,$scope.subItemId)
            $scope.setLastBookmarkType();
            var msg = "تم نقل العلامة المرجعية";
            toast.info("", msg);
            $scope.doaaModal.hide();
        }
        else {
            var msg = "لا يوجد علامات مرجعية لنقلها"
            toast.error("", msg);
            $scope.doaaModal.hide();

        }



    }
    $scope.setLastBookmarkType = function () {
        $scope.lastBookmark = doaaBookmarkTypes.getActiveBookmarkType();
    }
    $scope.addToFavourite = function () {
        $scope.doaaModal.hide();
        memorizeDoaaBook.addArticleToFavourite($scope.Articles[$scope.currentArticleIndex], enums.doaaBookmarkType.article,$scope.subItemId);
        var msg = "تم الاضافة الي المفضلة";
        toast.info("", msg);
        $scope.doaaModal.hide();
    }

    $scope.addFavourite = function (id) {
        $scope.doaaModal.hide();
        memorizeDoaaBook.addArticleToFavourite($scope.Articles[$scope.currentArticleIndex], enums.doaaBookmarkType.article,id);
        var msg = "تم الاضافة الي المفضلة";
        toast.info("", msg);
        $scope.doaaModal.hide();
    }

    $scope.scrollTop = function(id) {
        ////$ionicScrollDelegate.scrollTop();
        //console.log($ionicScrollDelegate.getScrollView())
        //var maxTop = $ionicScrollDelegate.getScrollView().__maxScrollTop;
        //var current = $ionicScrollDelegate.getScrollPosition();
        //console.log(current)
        //console.log(maxTop)
        //$location.hash(id);
        //$ionicScrollDelegate.anchorScroll(true);
        var y=document.getElementById("6").offsetTop;
        $ionicScrollDelegate.scrollBy(0, y);
    };
    $scope.init();
}]);



