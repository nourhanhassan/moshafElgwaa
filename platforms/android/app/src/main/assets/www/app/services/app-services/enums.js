app.factory("enums", [function () {


    var service = {
        responseCode: {

            LoginSuccessful: { code: 1000 },
            LoginWrongCredentials: { code: 1001 },
            LoginUserNotActive: { code: 1002 },
            LoginNeedsVerificationCode: { code: 1003 },
            RegisterSuccessful: { code: 1004 },
            RegisterdNameExist: { code: 1005 },

        },
        appInfo: {
            title: "مصحف الجواء",
            shareTitle: "#مصحف_الجواء",
            shareURL: "https://play.google.com/store/apps/details?id=com.qvsite.MoshafThird",

        },
        appModes: {
            read: 1,
            memorize: 2,
            review: 3
        },
        notificationType: {
            addToGroup: "1",
            removeFromGroup: "2",
            reminderToMemorize: "3"
        },

        weekDays: [

           {
               id: 2,
               name: "الأحد",
               index: 0,
           },
           {
               id: 3,
               name: "الإثنين",
               index: 1,
           },
           {
               id: 4,
               name: "الثلاثاء",
               index: 2,
           },
           {
               id: 5,
               name: "الأربعاء",
               index: 3,
           },
           {
               id: 6,
               name: "الخميس",
               index: 4,
           },
           {
               id: 7,
               name: "الجمعة",
               index: 5,
           },
            {
                id: 1,
                name: "السبت",
                index: 6,
            },

        ],

        targetType: {
            sura: 1,
            juz: 2,
            page: 3,
            aya : 4
        },


        periodType: {
            daily: 1,
            weekly: 2,
        },
        doaaBookmarkType: {
            article: 1,
            doaa: 2,
        },
        memorizeStatus: {
            memorized: 1,
            loadingMemorize: 2
        },
        memorizeMode: {
            individual: 1,
            group: 2
        },
        notificationMode: {
            on: 1,
            off: 2
        },
        targetMode: {
            werd: 1,
            reviewWerd: 2
        },
        khatmaType: {
            start: 1,
            sura: 2,
            juz: 3,
            page: 4
        },
        khatmaSectionsType: {
            quarter: 1,
            part: 2,
            aya: 3,
            page: 4
        },
        MoshafId: {
            hafs: 1,
            hafstext: 2,
            shamrly: 3,
            qalon: 4,
            warsh:5
        },
        appData: {
            nameAr: "مصحف الجواء",
            nameEn: "Moshaf Elgwaa",
            imagesLink: "http://app2aw.qv-site.com/moshaf/quran/",
            targetPath: "Moshaf Elgwaa/quran",
            audioTargetPath: "Moshaf Elgwaa/audio"
        },
        mosahfCopy:{
            hafs: {id:1,namear:"حفص",nameEn:"hafs",pagesCount:604},
            shamrly: { id: 3, namear: "الشمرلى", nameEn: "shamrly", pagesCount: 522 },
            qalon: { id: 4, namear: "قالون", nameEn: "qalon", pagesCount: 604 },
            warsh: { id: 5, namear: "ورش", nameEn: "warsh", pagesCount: 604 }
        },
        validations: {
            nationalID: { pattern: new RegExp("^[1-9][0-9]{9}$"), msg: "برجاء إدخال رقم هوية وطنية صحيح مكون من 10 أرقام" },

            mobile: { pattern: new RegExp("^[0-9]{10,15}$"), msg: "برجاء إدخال أرقام بحد أقصى 15 رقم و حد أدنى 10 رقم" },

            numbers: { pattern: new RegExp("^([1-9])([0-9]){0,9}$"), msg: " برجاء إدخال أرقام فقط أكبر من صفر بحد أقصى 10 أرقام " },
            decimal: { pattern: new RegExp("^[0-9]*(\.\[0-9]+)?$"), msg: "مسموح بإدخال أرقام فقط" },
            stringAr50: { pattern: new RegExp("^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF ]{0,50}$"), msg: "غير مسموح بكتابة غير الحروف العربية وبحد أقصى 50 حرف" },
            stringAr100: { pattern: new RegExp("^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF ]{0,100}$"), msg: "غير مسموح بكتابة غير الحروف العربية وبحد أقصى 100 حرف" },
            stringAr150: { pattern: new RegExp("^[a-zA-Z\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF ,./\s_ -]{0,150}$"), msg: "غير مسموح بكتابة  أرقام أو رموز خاصة وبحد أقصى 150 حرف" },
            stringMixed150: { pattern: new RegExp("^[a-zA-Z0-9\u0600-\u06ff,./\s_ -]{0,150}$"), msg: "غير مسموح بكتابة الرموز الخاصة وبحد أقصى 150 حرف" },
            stringAr300: { pattern: new RegExp("^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FF ]{0,300}$"), msg: "غير مسموح بكتابة غير الحروف العربية وبحد أقصى 300 حرف" },
            stringMixed50: { pattern: new RegExp("^[a-zA-Z0-9\u0600-\u06ff,./\s_ -]{0,50}$"), msg: "غير مسموح بكتابة الرموز الخاصة وبحد أقصى 50 حرف" },

            email: { pattern: new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+[\.]{1}[a-zA-Z]{2,6}$"), msg: "برجاء إدخال بريد إلكتروني صحيح" },
            stringMixed350: { pattern: new RegExp("^[a-zA-Z0-9\u0600-\u06ff,\n,\r,\r\n,./\s_ -]{0,350}$"), msg: "غير مسموح بكتابة الرموز الخاصة وبحد أقصى 350 حرف" },
            CodeNumber: { pattern: new RegExp("^([1-9])([0-9]){0,4}$"), msg: " برجاء إدخال أرقام فقط مكونة من 5 أرقام " },
        },



    }

    return service;

}]);