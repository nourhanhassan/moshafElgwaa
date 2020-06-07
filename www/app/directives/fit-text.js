
var IonicModule = angular.module('ionic');
var initFont = 0;
IonicModule.directive('fitText', function ($timeout) {
    return {
        restrict: 'A',
        scope: {
            slide:"=slide",
            curpage: '@curpage',
            iszoomed: '=iszoomed',
            page:"@page"
        },
        link: function ($scope, $elm, $attrs) {

           function changeFont() {
               var ourText = $('.content-read', $elm);
               var fontSize = parseFloat(ourText.find(".content").css("font-size"));
               if (initFont == 0) {
                   initFont = fontSize;
                   fontSize = fontSize - 2;

               }
             //   console.log($attrs)
               if (parseInt($attrs.page) > 2 && $scope.iszoomed!=true) {
                   // alert(parseInt($attrs.page));

                $timeout(function () {
                    //  alert("change")
                    var page = parseInt($attrs.page);
                        var ourText = $('.content-read', $elm);
                        var fontSize = parseFloat(ourText.find(".content").css("font-size"));
                        //if (initFont == 0) {
                        //    initFont = fontSize;
                        //}
             //       alert(fontSize)
                       //  alert(fontSize);
                        var maxHeight = $($elm).closest(".slider").height() - 40;
                        var maxWidth = $($elm).width();
                        var textHeight = ourText[0].scrollHeight;
                        //if (page == 3 && page != $scope.curpage)
                        //{ textHeight = 1.5 * textHeight };
                        var textWidth = ourText.width();
                        var ratio = (maxHeight / textHeight)+0.2;
                        if (ratio > 1) ratio = 1;
                        //    alert(ratio)
                        fontSize = fontSize * ratio;
                        //    alert(fontSize);
                        //alert(maxHeight)
                        //alert(textHeight)
                        //alert(ratio)
                     
                  
                    //    alert(textHeight + "," + maxHeight + "," + maxWidth)
             
                           if (textHeight > maxHeight && maxHeight > maxWidth) {
                            do {
                                ourText.find(".content").css('font-size', fontSize, 'important');
                                var textHeight = ourText[0].scrollHeight;
                      
                                textWidth = ourText.width();
                                fontSize = fontSize - 0.2;
                                alert(fontSize)
                            } while ((textHeight > maxHeight) && fontSize > 3);
                           }
       
                           if (maxHeight - textHeight > 10) {
                               ourText.find(".content").css('font-size', initFont, 'important');

                               var count = 1;
                               do {
                                   ourText.find(".content").css('font-size', fontSize, 'important');
                                   textHeight = ourText[0].scrollHeight;
                            
                                   textWidth = ourText.width();
                                   fontSize = fontSize + 0.15;
                                   count++;
                                   //  alert(fontSize)
                               } while ((maxHeight - textHeight) > 30 && count < 6);
                           }
                    })
                }
                else {
                    var ourText = $('.content-read', $elm);
                //    alert(initFont);
                    ourText.find(".content").css('font-size', initFont, 'important');

                }
           }

           $scope.$watch('curpage', function (oldValue, newValue) {
                alert(newValue)
               if (newValue) {
                   //if (newValue > 2) {
                   changeFont();
                   //}
               }
           });
            if ($scope.slide.page.pageNum > 2) {
             //   alert($scope.slide.page.pageNum)
                changeFont();

            }
            //   return this;
   
  
            //$scope.$watch('slide.page', function (oldValue, newValue) {
            //    //alert(newValue.pageNum)
            //    if (newValue) {
            //        //if (newValue.pageNum > 2) {
            //            changeFont();
            //        //}
            //    }
            //});

        }
    };
})