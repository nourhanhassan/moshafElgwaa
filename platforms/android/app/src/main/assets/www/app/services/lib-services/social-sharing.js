
app.factory("socialShare", ["$q", "$cordovaSocialSharing", function ($q, $cordovaSocialSharing) {

    var shareServ = {
        Share: function (message, subject, file, link) {
            ////alert('message' + message);
            ////alert('subject' + subject);
            ////alert('file' + file);
            ////alert('link' + link);
            $cordovaSocialSharing
                  .share(message, subject, file, link) // Share via native share sheet
                  .then(function (result) {
                      // Success!
                      if (result) {
                          //alert('تم النشر بنجاح!');
                      } else {
                          //alert('لم تقم بالنشر');

                      }
                  }, function (err) {
                      // An error occured. Show a message to the user
                      //alert("err" + err);
                  });
        },

        TwitterShare: function () {
            $cordovaSocialSharing
              .shareViaTwitter(message, image, link)
              .then(function (result) {
                  // Success!
              }, function (err) {
                  // An error occurred. Show a message to the user
              });
        },
        EmailShare: function () {
            $cordovaSocialSharing
              .shareViaWhatsApp(message, image, link)
              .then(function (result) {
                  // Success!
              }, function (err) {
                  // An error occurred. Show a message to the user
              });
        },
        FBShare: function (message, image, link) {
            $cordovaSocialSharing
              .shareViaFacebook(message, image, link)
              .then(function (result) {
                  // Success!
              }, function (err) {
                  // An error occurred. Show a message to the user
              });
        },
        ShareVia: function (socialType, message, image, link) {
            $cordovaSocialSharing
              .canShareVia(socialType, message, image, link)
              .then(function (result) {
                  // Success!
              }, function (err) {
                  // An error occurred. Show a message to the user
              });
        },
        EmailShare: function () {
            $cordovaSocialSharing
              .canShareViaEmail()
              .then(function (result) {
                  // Yes we can
              }, function (err) {
                  // Nope
              });
        },
        shareViaFacebookWithPasteMessageHint: function (message, image, desc, i) {
            $cordovaSocialSharing
.shareViaFacebookWithPasteMessageHint(message, image, null, 'Message pasted to clip board ,press on the area to paste it in the feed')

        }
    }
    return shareServ;
}]);