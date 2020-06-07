app.factory("audio", ["$q", "$cordovaCapture", function ($q, $cordovaCapture, ionicLoading) {
    
    return {

        startRecord: function () {
   
            var options = { limit: 1, duration: 10 };
            var deferred = $q.defer();

            $cordovaCapture.captureAudio(options).then(function (audioData) {
                deferred.resolve(audioData[0].fullPath);
            }, function (err) {
                ionicLoading.show({ templateText: "عفوا جوالك لا يدعم خاصية تسجيل الصوت " });
                setTimeout(function () {
                    ionicLoading.hide();
                }, 2000);
                // An error occurred. Show a message to the user
            });
            return deferred.promise;

        }
        //currentMedia :null,
        //filePath: "",

        //startRecord: function (filename) {





















































































































































        //    if (typeof (this.filePath+filename) == "undefined") {

        //        filename = new Date().getTime() +"-" + int.parse(Math.random()*100000);
        //    }
        //    filename = this.filePath + filename;
           
        //    console.log("recordng path = " + filename);
        //    var media = new Media(filename, function () {

        //        console.log("success opening file " + filename)
                
        //        media.startRecord();
                
        //        console.log("started recording");

        //    }, function (err) { console.log("error opening file " + filename + JSON.stringify(err)); });
          
        //    this.currentMedia = media;

        //    return media;
        //},

        //stopRecord: function (mediaHandler) {
        //    if (typeof (mediaHandler) == "undefined") {

        //        mediaHandler = this.currentMedia;
        //    }
        //    mediaHandler.stopRecord();
        //    console.log("stopped recording");

        //},

        //play: function (fileName) {

        //    fileName = this.filePath + fileName;
        //    var myMedia = this.currentMedia;
        //        // Create Media object from src
        //    myMedia = new Media(fileName, function () {
               
        //        console.log("success running file" + fileName)
        //    }, function (err) { console.log("error playing file " + fileName + JSON.stringify(err)) });

        //    myMedia.play();
            
        //},

        //stop: function () {
        //    if (this.currentMedia) {
        //        currentMedia.stop();
        //    }

        //},

    }

}]);