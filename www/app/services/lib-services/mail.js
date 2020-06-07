app.factory("mail", function (enums, $filter) {

    var mailService = {

        sendMail: function (toMail, subject, body, attachments) {
            //alert(toMail);
       
            cordova.plugins.email.isAvailable(
  function (isAvailable) {
      //alert("res")
         //alert(isAvailable)
         // //alert('Service is not available') unless isAvailable;
     }
 );
            cordova.plugins.email.open({
                to: toMail,
                subject: subject,
                body: body,
                isHtml: true,
                attachments:attachments
            });
            //if (window.plugins && window.plugins.emailComposer) {
            //    window.plugins.emailComposer.showEmailComposerWithCallback(function (result) {
            //        //alert( result);
            //    },
            //    subject, // Subject
            //    body,                      // Body
            //    toMail,    // To
            //    null,                    // CC
            //    null,                    // BCC
            //    true,                   // isHTML
            //    attachments,                    // Attachments
            //    null);                   // Attachment Data
            //}
        }
    }
    return mailService;
});