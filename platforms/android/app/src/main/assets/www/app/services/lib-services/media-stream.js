
app.factory('mediaStream', ['ionicLoading',function (ionicLoading) {

    var mediaStream = {

         options : {
            successCallback: function () {
               // //alert("Video was closed without error.");
            },
            errorCallback: function (errMsg) {
                ionicLoading.showMessage({ templateText: "لقد حدث خطأ ما" });
                console.log(JSON.stringify(errMsg));
            }
        },
         playAudio: function (audioSrc, imagePreview, successCallback, errorCallBack) {
           //  //alert("play audio")
             if (imagePreview != null) {
                 this.options.bgImage = imagePreview;
                 this.options.bgImageScale = "fit"
             }
             if (typeof (successCallback) == "function")
             {
                 this.options.successCallback = successCallback;
             }
             if (typeof (errorCallBack) == "function") {
                 this.options.errorCallback = errorCallBack;
             }
            console.log(typeof (window.plugins.streamingMedia));
             window.plugins.streamingMedia.playAudio(audioSrc, this.options);

        },
         playVideo: function (videoSrc, successCallback, errorCallBack)
        {
             if (typeof (successCallback) == "function") {
                 this.options.successCallback = successCallback;
             }
             if (typeof (errorCallBack) == "function") {
                 this.options.errorCallback = errorCallBack;
             }
             window.plugins.streamingMedia.playVideo(videoSrc, this.options);
        }
    };

    return mediaStream;
}])