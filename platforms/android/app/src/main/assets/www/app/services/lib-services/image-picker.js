app.factory("imagePicker", ["$cordovaImagePicker","appData", function ($cordovaImagePicker,appData) {
    return {
        //Select multiple images from Gallery and return Array of URLs
        selectPictures: function (e) {
            //alert('selectPictures');
            var ImagesGal = [];
            var options = {
                quality: appData.config.CameraQuality,
                maximumImagesCount: appData.config.ImagePickermaximumImagesCount,
                width: appData.config.CameraImageWidth,
               height: appData.config.CameraImageHeight,
            };
            try{
                return $cordovaImagePicker.getPictures(options)
                    .then(function (results) {
                        alert(' $cordovaImagePicker.getPictures results ' + results);
                        for (var i = 0; i < results.length; i++) {
                             //alert('Image URI: ' + results[i]);
                            ImagesGal.push(results[i]);
                        }
                        return ImagesGal;

                    }, function (error) {
                        //alert('err');
                    });
            } catch (ex) {
                //alert('ex' + ex);
            }
        }
    }
}]);

//cordova plugin add https://github.com/wymsee/cordova-imagePicker.git