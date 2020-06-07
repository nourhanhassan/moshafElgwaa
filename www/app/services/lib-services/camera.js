app.factory("camera", ["$cordovaCamera", "appData", function ($cordovaCamera, appData) {
    return {
        //  Select video from your library  and return URL
        selectVideo: function (e) {
            ////alert('Selectvideo');

            var options = {
                quality: appData.config.CameraQuality,
                sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,


                //Camera.PictureSourceType.PHOTOLIBRARY,
                mediaType: Camera.MediaType.VIDEO
            }
            // Camera.PictureSourceType.PHOTOLIBRARY or
            return $cordovaCamera.getPicture(options).then(function (videoData) {
                //alert(videoData);
                return videoData;
            });
        },

        // Take one image from your mobile cam
        takeOneImage: function (e, isCamera) {
            var options = {};
            //alert('isCamera' + isCamera);
            if (isCamera) {
                options = {
                    // quality: appData.config.CameraQuality,
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.CAMERA,//camera
                    encodingType: Camera.EncodingType.JPEG,
                    //targetWidth: appData.config.CameraImageWidth,
                    //targetHeight: appData.config.CameraImageHeight,
                    allowEdit: false,
                };
            } else {
                options = {
                    // quality: appData.config.CameraQuality,
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,//gallery
                    encodingType: Camera.EncodingType.JPEG,
                    //targetWidth: appData.config.CameraImageWidth,
                    //targetHeight: appData.config.CameraImageHeight,
                    allowEdit: false,
                };
            }

            //alert(options);
            return $cordovaCamera.getPicture(options).then(function (imageData) {
                //alert(imageData);
                return imageData;
                //  path = imageData;  
            });

        },
    }
}]);