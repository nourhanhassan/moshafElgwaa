app.factory("mark", ["localStorage", "$q", "moshafdata", "enums", function (localStorage, $q, moshafdata, enums) {
    var service = {
        markObject: {
            pageNumber:0,
            ayaNumber: 0,
            Date: "",
            surahName: "",
            ayaText: "",
            surahType: ""
        },
        marksList: {
            pageMarksList: [],
            ayatMarksList: [],
            lastPages: {},
            lastMode: enums.appModes.read,//read
            lastTarget:"",
        },
        // save mark for page 
        savePageMark: function (pageNum,surah) {

            //if (localStorage.get("Marks") != undefined) {
                service.marksList = service.getMarksList();
            //}
            //else {
            //    service.marksList = [];
            //}
            var surah = moshafdata.getSurahByPageId(pageNum); // to get surah type 
            var markObject = { pageNumber: pageNum, surahName: surah.Name, surahType: surah.Type }
            //  service.markObject.surahName = moshafdata.getSurahByPageId(service.markObject.pageNumber).Name;
            service.marksList.pageMarksList.push(markObject);
            localStorage.set("Marks", service.marksList);
        },
        saveAyaMark: function (pageNum, ayaId) {
           
            service.marksList = service.getMarksList();
            var aya = moshafdata.getAya(ayaId, pageNum)
            var surah = moshafdata.getSurah(aya.surah);
            var markObject = {
                pageNumber: pageNum,
                ayaId: ayaId,
                ayaNumber:aya.ayahNum,
                surahName: surah.Name,
                ayaText: aya.verse.replace("<br>",""),
                surahType: surah.Type
            }

            //service.markObject.surahName = moshafdata.getSurahByPageId(service.markObject.pageNumber).Name;
            //service.markObject.ayaText = moshafdata.getAya(service.markObject.ayaNumber, service.markObject.pageNumber).verse;
            service.marksList.ayatMarksList.push(markObject);
            localStorage.set("Marks", service.marksList);
            service.marksList = [];
        },
        getMarksList: function () {
           
            var marks = localStorage.get("Marks");
            if (typeof (marks) == "undefined") {
                marks = service.marksList;
            }
            //if (marks.pageMarksList != undefined) {
            //    for (var i = 0; i < marks.pageMarksList.length; i++) {
            //        marks.pageMarksList[i].surahName = moshafdata.getSurahByPageId(marks.pageMarksList[i].pageNumber).Name;
            //    }
            //}
            return marks;
        },
        deleteMarks: function (pageNumber, ayaId) {

            var allMarks = service.getMarksList();
            var marks;
            if (ayaId != null) {
               
                allMarks.ayatMarksList = allMarks.ayatMarksList.filter(function (obj) { return obj.ayaId !== ayaId });
            }
            else {
              
                allMarks.pageMarksList = allMarks.pageMarksList.filter(function (obj) { return obj.pageNumber !== pageNumber });
            }
            localStorage.set("Marks", allMarks);
            return allMarks;
        },
        isAyaMarked:function(ayaId)
        {
            var marks = service.getMarksList();
            var ayaMark = marks.ayatMarksList.filter(function (obj) { return obj.ayaId == ayaId });
            return  ayaMark.length != 0;
        },
        isPageMarked:function(pageNumber)
    {
        var marks = service.getMarksList();
        var pageMark = marks.pageMarksList.filter(function (obj) { return obj.pageNumber == pageNumber });
        return pageMark.length != 0;
        },
        setLastPage :function(pageNumber,mode,targetId)
        {
            var marks = service.getMarksList();
            marks.lastMode = mode;
            marks.lastPages[mode.toString()] = pageNumber;
            if (mode != enums.appModes.read) {
                marks.lastTarget = targetId;
            }
            localStorage.set("Marks", marks);
        },
        getLastPage: function () {
            var marks = service.getMarksList();
            var ret = {mode:enums.appModes.read,pageNumber:1};
            if (marks.lastMode > 0) {
                ret.mode = marks.lastMode;
                ret.pageNumber = marks.lastPages[marks.lastMode.toString()];
              
                ret.target = marks.lastTarget;
            }
            return ret;
        },

        getLastMemorizedPage: function () {
            var marks = service.getMarksList();

            var ret = {target:"" };
            if (marks.lastPages[enums.appModes.memorize] > 0) {
                ret.mode = marks.lastMode;
                ret.pageNumber = marks.lastPages[enums.appModes.memorize.toString()];
                ret.target = marks.lastTarget;
            }
            return ret;
        },
        getLastReadPage: function () {
        var marks = service.getMarksList();

        var ret = { };
        if (marks.lastPages[enums.appModes.read] > 0) {
          //  ret.mode = marks.lastMode;
            ret.pageNumber = marks.lastPages[enums.appModes.read.toString()];
          //  ret.target = marks.lastTarget;
        }
        return ret;
    }


    }
    return service;
}]);
