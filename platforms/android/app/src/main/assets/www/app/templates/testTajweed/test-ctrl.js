



app.controller('testController', function ($scope, $window, $ionicSlideBoxDelegate, moshafdata, ionicPopup, $filter, $q, $state, $stateParams, $timeout, mark, $ionicPopover, enums, target, memorize, $ionicGesture, $rootScope, $ionicScrollDelegate, $ImageCacheFactory, device, $ionicSideMenuDelegate, audio, $ionicModal, localStorage, notes, bookmarkTypes, bookmarks, memorizedayat, toast, settings, ayatTafseer, ayatData, recitations, reviewTarget, review) {
    //debugger;
    //window.onload = function () {
        debugger;
        //var c = document.getElementById("canvas");
        //var ctx = c.getContext("2d");
        //var img = document.getElementById("page1");
    //ctx.drawImage(img, 100, 100);
   
    //};
        $timeout(function () {
            debugger;
            var ImageFactory = function (ctx) {
                debugger;
                this.ctx = ctx;
                ctx.canvas.width = window.innerWidth;
                ctx.canvas.height = window.innerHeight;
                this.drawImage = function (image_arg, image_x, image_y, image_w, image_h) {
                    var _this = this;
                    var image = new Image();
                    image.src = image_arg;
                    image.onload = function () {
                        _this.ctx.drawImage(image, image_x, image_y, image_w, image_h);
                        var imgData = _this.ctx.getImageData(0, 0, image_w, image_h);
                        // invert colors
                        for (var i = 0; i < imgData.data.length; i += 4) {
                            if (0<imgData.data[i+1]  <=255) {
                                imgData.data[i] = 255;
                                imgData.data[i + 1] = 0;
                                imgData.data[i + 2] = 0;
                                imgData.data[i + 3] = 1;
                            }
                        }
                        _this.ctx.putImageData(imgData, 0, 0);
                    };
                };
            };
           start();

           function start() {
               debugger;
               var image = 'img/quran/page001.png';
                //var image = 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_white_background_color_272x92dp.png';
                var ctx = $('#canvas').get(0).getContext('2d');
                var imageFactory = new ImageFactory(ctx);
                imageFactory.drawImage(image, 0, 0, 1000, window.innerHeight);
            }
            //var canvas = document.getElementById('myCanvas');
            //var context = canvas.getContext('2d');
            //var img = document.getElementById("page1");
            //document.getElementById("page1").onload(function () {
            //    context.drawImage(img, 100, 100);
            //})
            //context.font = '40pt Calibri';
            //context.fillStyle = 'blue';
            //context.fillText('Hello World!', 150, 100);
        }, 5000)
});
