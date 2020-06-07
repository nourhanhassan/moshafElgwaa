app.factory("capture", ["$cordovaCapture","appData", function ($cordovaCapture,appData) {
    return {  
        //Take multiple Pictures (limit option) from Mobile Cam and return Array of URLs
        takePictures: function (e) {
            var ImagesCam = [];
            var options = {
                limit: appData.config.CaptureLimit
            };
            $cordovaCapture.captureImage(options).then(function (results) {
                for (var i = 0; i < results.length; i++) {
                    ImagesCam.push(results[i]);
                }             
            }, function (err) {
                //alert('err');
              
                // error
            });
            return ImagesCam;
        },


       //Record multiple Sounds with (limit option and duration) and return Array of URLs
        startRecord: function () {
   
            var options = {
                duration: appData.config.CaptureDuration
            };

        return   $cordovaCapture.captureAudio(options).then(function (audioData) {
            
              return  audioData[0].fullPath;
        },
            function (err) {
                // An error occurred. Show a message to the user
                ////alert("error occured in recording audio");
                //alert(JSON.stringify(err));
                if(err.toString(). toLowerCase().indexOf("intent"))
                {
                    ionicLoading.showMessage("عفوا جوالك لا يدعم خاصية تسجيل الصوت ");
                }
                ////alert(err.message);
            });        
        },

       //take one Video limit option by default = 1  and this return an array of URLs we want one video only 
        takeVideo: function (e) {
            ////alert('Takevideo');         
            var options = {               
                duration: appData.config.CaptureDuration,
            };

            return $cordovaCapture.captureVideo(options).then(function (videoData) {
                //alert(typeof (videoData[0].fullPath));
                return videoData[0].fullPath;
                
         
            }, function (err) {
                console.log(err);
            });           
        },


    }
}]);
