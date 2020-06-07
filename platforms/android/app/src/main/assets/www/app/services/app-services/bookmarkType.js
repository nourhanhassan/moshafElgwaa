app.factory("bookmarkTypes", ["localStorage", "$q", "moshafdata", "enums", "$filter", "mark", function (localStorage, $q, moshafdata, enums, $filter, mark) {

    var service = {
        colorsSet: [{ name: "red", hex: "#900" }
            , { name: "green", hex: "#345b2f" }
            , { name: "blue", hex: "#1a5298" }
            , { name: "olive", hex: "#716535" }
            , { name: "purple", hex: "86319c" }
            , { name: "yellow", hex: "#c79d3e" }
           

        ],
        key: "BookmarkTypes",
        bookmarkTypeObject: {
            id: 0,
            title: "",
            color: "",
            isActive: true,
            ayaId: 0,
            pageNumber:0
    
        },

        bookmarkTypesList: [],
        resetbookmarkTypeObject: function () {
            service.bookmarkTypeObject = {
                id: 0,
                title: "",
                color: "",
                isActive: true,
                ayaId: 0,
                pageNumber:0
            }

        },
        getBookmarkTypesList: function () {
            var bookmarkTypes = localStorage.get(service.key);
            if (typeof (bookmarkTypes) == "undefined") {
                //var lastPage = mark.getLastReadPage().pageNumber;
                //console.log("laaaaaaaaast   " + lastPage)
                service.bookmarkTypesList = [
                    {
                        id: 1,
                        title: "قراءة",
                        color: "red",
                        isActive: true,
                        pageNumber: 1,
                        ayaId:1
                    }
          

                ];
                localStorage.set(service.key, service.bookmarkTypesList);
            }
            else {
                service.bookmarkTypesList = bookmarkTypes;
            }
            service.bookmarkTypesList.forEach(function (markType) {
                if (markType.ayaId > 0 && markType.pageNumber > 0) {
                    markType.aya = moshafdata.getAyaByID(markType.ayaId);
                  var aya = moshafdata.getAyaByID(markType.ayaId);
                  markType.pageNumber = aya.PageNum;
                    if(typeof(markType.aya) != "undefined")
                    markType.surahName = moshafdata.getSurah(markType.aya.surah).Name;
                }
                //  mark.bookmarkType = bookmarkTypes.getBookmarkType(mark.bookmarkTypeId);
            })
            var orderedList = $filter('orderBy')(service.bookmarkTypesList, '-id')
            return orderedList;
        },
        getBookmarkType: function (id) {
            service.resetbookmarkTypeObject();
            service.bookmarkTypesList = service.getBookmarkTypesList();
            var bookmarkType = service.bookmarkTypesList.filter(function (obj) { return obj.id == id });
            var ret = bookmarkType.length > 0 ? bookmarkType[0] : service.bookmarkTypeObject;
            return ret;
        },
        changeBookmarkTypeColor: function (id, color) {
            service.getBookmarkTypesList();
            var updatedbookmarkType = service.getBookmarkType(id);
            if (updatedbookmarkType.id > 0) {
        
                updatedbookmarkType.color = color;
                localStorage.set(service.key, service.bookmarkTypesList);
                //oldbookmarkType.Date= 
            }
        },
        updateBookmarkType: function (id, title, color,ayaId,pageNumber) {
            service.getBookmarkTypesList();
            var updatedbookmarkType = service.getBookmarkType(id);
            if (updatedbookmarkType.id > 0) {
                updatedbookmarkType.title = title;
                updatedbookmarkType.color = color;
                updatedbookmarkType.ayaId=ayaId,
                updatedbookmarkType.pageNumber=pageNumber
                //oldbookmarkType.Date= 
            }

            localStorage.set(service.key, service.bookmarkTypesList);
            service.setBookmarkTypeActive(id);
        },
        addNewBookMarkType: function (id, title, color) {
            var deferred = $q.defer();
            var lastOne = service.bookmarkTypesList.length > 0 ? service.bookmarkTypesList[0] : null;
            var id = lastOne != null ? lastOne.id + 1 : 1;
            pageNumber = mark.getLastReadPage().pageNumber;
            moshafdata.pageAyat(pageNumber).then(function (surahs) {
                ayaId = surahs[0].ayat[0].id;
                var newBookmarkType = {
                    id: id,
                    title: title,
                    color: color,
                    ayaId: ayaId,
                    pageNumber: pageNumber
                }
                service.bookmarkTypesList.push(newBookmarkType);

                localStorage.set(service.key, service.bookmarkTypesList);
                service.setBookmarkTypeActive(id);
                deferred.resolve(newBookmarkType);
            })
            return deferred.promise;
        },
        deleteBookmarkType: function (id) {
            //if(ayaId)
            //{
            service.bookmarkTypesList = service.getBookmarkTypesList();
            service.bookmarkTypesList = service.bookmarkTypesList.filter(function (obj) { return obj.id != id });
            localStorage.set(service.key, service.bookmarkTypesList);
            //}
        },
        setBookmarkTypeActive :function(id){
            service.bookmarkTypesList = service.getBookmarkTypesList();
            service.bookmarkTypesList = service.bookmarkTypesList.filter(function (obj) {
                obj.isActive = false
                if(obj.id==id)
                {
                    obj.isActive = true;
                }
                return true;
            });
            localStorage.set(service.key, service.bookmarkTypesList);
          //  service.bookmarkTypesList = service.bookmarkTypesList.filter(function (obj) { return obj.id == id });
        },

        getActiveBookmarkType :function(){
            service.resetbookmarkTypeObject();
            service.bookmarkTypesList = service.getBookmarkTypesList();
            var bookmarkType = service.bookmarkTypesList.filter(function (obj) { return obj.isActive == true });
            var ret=null;
            if (bookmarkType.length > 0)
            {
                ret = bookmarkType[0];
            }
            else if (service.bookmarkTypesList.length>0) {
                ret = service.bookmarkTypesList[0];
                service.setBookmarkTypeActive(ret.id)
            }
          //  var ret = bookmarkType.length > 0 ? bookmarkType[0] : service.bookmarkTypeObject;
            return ret;
        },
        moveBookmarkType: function (id, ayaId, pageNumber) {
            var updatedbookmarkType = service.getBookmarkType(id);
            if (updatedbookmarkType.id > 0) {
          
                updatedbookmarkType.ayaId = ayaId,
                updatedbookmarkType.pageNumber = pageNumber
                //oldbookmarkType.Date= 
            }

            localStorage.set(service.key, service.bookmarkTypesList);
            service.setBookmarkTypeActive(id);
    }
    }

    return service;
}])