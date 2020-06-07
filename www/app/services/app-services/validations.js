app.factory("validations", ["httpHandler", function (httpHandler) {

    return {

        validationExepresions: {
            title: { pattern: new RegExp("^[a-zA-Z0-9 ؟?\u0600-\u06ff._^%$#!~@,&*()+=\'\"\-/{}[\\]\\\\]{0,20}$"), msg: " غير مسموح بكتابة أكثر من 20 حرف و غير مسموح باستخدام < أو >" },

        }
    }
}]);