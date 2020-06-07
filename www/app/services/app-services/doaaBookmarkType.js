app.factory("doaaBookmarkTypes", ["localStorage", "$q", "moshafdata", "enums", "$filter", "mark", "$rootScope", function (localStorage, $q, moshafdata, enums, $filter, mark, $rootScope) {

    var service = {
        colorsSet: [{ name: "red", hex: "#900" }
            , { name: "green", hex: "#345b2f" }
            , { name: "blue", hex: "#1a5298" }
            , { name: "olive", hex: "#716535" }
            , { name: "purple", hex: "86319c" }
            , { name: "yellow", hex: "#c79d3e" }


        ],
        key: "doaaBookmarkTypes",
        bookmarkTypeObject: {
            title: "",
            color: "",
            isActive: true,
            Id: 0,
            index: 0,
            bookmarkTypeId: 0, // enums.doaaBookmarkType
            subItemId:0
        },

        bookmarkTypesList: [],
        resetbookmarkTypeObject: function () {
            service.bookmarkTypeObject = {
                title: "",
                color: "",
                isActive: true,
                Id: 0,
                index: 0,
                bookmarkTypeId: 0 ,// enums.doaaBookmarkType
                subItemId:0
            }

        },
        getBookmarkTypesList: function () {
            var bookmarkTypes = localStorage.get(service.key);
            if (typeof (bookmarkTypes) == "undefined") {
                //var lastPage = mark.getLastReadPage().pageNumber;
                //console.log("laaaaaaaaast   " + lastPage)
                //service.bookmarkTypesList = [
                //    {
                //        title: "قراءة",
                //        color: "red",
                //        isActive: true,
                //        Id: 0,
                //        index: 0,
                //        bookmarkTypeId: 0 // enums.doaaBookmarkType

                //    }


                //];
                localStorage.set(service.key, service.bookmarkTypesList);
            }
            else {
                service.bookmarkTypesList = bookmarkTypes;
            }
            service.bookmarkTypesList.forEach(function (markType) {
                //if (markType.ayaId > 0 && markType.pageNumber > 0) {
                    //markType.aya = moshafdata.getAyaByID(markType.ayaId);
                    //var aya = moshafdata.getAyaByID(markType.ayaId);
                    //markType.pageNumber = aya.PageNum;
                    //if (typeof (markType.aya) != "undefined")
                    //    markType.surahName = moshafdata.getSurah(markType.aya.surah).Name;
                //}
                //  mark.bookmarkType = bookmarkTypes.getBookmarkType(mark.bookmarkTypeId);
            })
            var orderedList = $filter('orderBy')(service.bookmarkTypesList, '-Id')
            return orderedList;
        },
        getBookmarkType: function (Id) {
            service.resetbookmarkTypeObject();
            service.bookmarkTypesList = service.getBookmarkTypesList();
            var bookmarkType = service.bookmarkTypesList.filter(function (obj) { return obj.Id == Id });
            var ret = bookmarkType.length > 0 ? bookmarkType[0] : service.bookmarkTypeObject;
            return ret;
        },
        changeBookmarkTypeColor: function (Id, color) {
            service.getBookmarkTypesList();
            var updatedbookmarkType = service.getBookmarkType(Id);
            if (updatedbookmarkType.id > 0) {

                updatedbookmarkType.color = color;
                localStorage.set(service.key, service.bookmarkTypesList);
                //oldbookmarkType.Date= 
            }
        },
        updateBookmarkType: function (title, color, Id, index, bookmarkTypeId) {
            service.getBookmarkTypesList();
            var updatedbookmarkType = service.getBookmarkType(Id);
            if (updatedbookmarkType.id > 0) {
                updatedbookmarkType.title = title;
                updatedbookmarkType.color = color;
                updatedbookmarkType.Id = Id;
                updatedbookmarkType.index = index;
                updatedbookmarkType.bookmarkTypeId = bookmarkTypeId;
            }

            localStorage.set(service.key, service.bookmarkTypesList);
            service.setBookmarkTypeActive(id);
        },
        addNewBookMarkType: function (id, title, color, subItemId) {
            debugger;
            var deferred = $q.defer();
            var lastOne = service.bookmarkTypesList.length > 0 ? service.bookmarkTypesList[0] : null;
            var id = lastOne != null ? lastOne.Id + 1 : 1;
            //pageNumber = mark.getLastReadPage().pageNumber;
            //moshafdata.pageAyat(pageNumber).then(function (surahs) {
            //    ayaId = surahs[0].ayat[0].id;
            //Id: 0,
            //index: 0,
            //bookmarkTypeId: 0
                var newBookmarkType = {
                    Id: 1,
                    title: title,
                    color: color,
                    index: 0,
                    bookmarkTypeId: 1,
                    name: $rootScope.articles[0].Name,
                    subItemId: subItemId
                }
                service.bookmarkTypesList.push(newBookmarkType);

                localStorage.set(service.key, service.bookmarkTypesList);
                service.setBookmarkTypeActive(1);
                deferred.resolve(newBookmarkType);
            //})
            return deferred.promise;
        },
        deleteBookmarkType: function (id) {
            //if(ayaId)
            //{
            service.bookmarkTypesList = service.getBookmarkTypesList();
            service.bookmarkTypesList = service.bookmarkTypesList.filter(function (obj) { return obj.Id != id });
            localStorage.set(service.key, service.bookmarkTypesList);
            //}
        },
        setBookmarkTypeActive: function (Id) {
            service.bookmarkTypesList = service.getBookmarkTypesList();
            service.bookmarkTypesList = service.bookmarkTypesList.filter(function (obj) {
                obj.isActive = false
                if (obj.Id == Id) {
                    obj.isActive = true;
                }
                return true;
            });
            localStorage.set(service.key, service.bookmarkTypesList);
            //  service.bookmarkTypesList = service.bookmarkTypesList.filter(function (obj) { return obj.id == id });
        },

        getActiveBookmarkType: function () {
            service.resetbookmarkTypeObject();
            service.bookmarkTypesList = service.getBookmarkTypesList();
            var bookmarkType = service.bookmarkTypesList.filter(function (obj) { return obj.isActive == true });
            var ret = null;
            if (bookmarkType.length > 0) {
                ret = bookmarkType[0];
            }
            else if (service.bookmarkTypesList.length > 0) {
                ret = service.bookmarkTypesList[0];
                service.setBookmarkTypeActive(ret.Id)
            }
            //  var ret = bookmarkType.length > 0 ? bookmarkType[0] : service.bookmarkTypeObject;
            return ret;
        },
        moveBookmarkType: function (Id, currentID, index, bookmarkTypeId, name, subItemId) {
            var updatedbookmarkType = service.getBookmarkType(Id);
            if (updatedbookmarkType.Id > 0) {
                updatedbookmarkType.Id = currentID;
                updatedbookmarkType.index = index;
                updatedbookmarkType.bookmarkTypeId = bookmarkTypeId;
                updatedbookmarkType.name = name;
                updatedbookmarkType.subItemId = subItemId;
            }

            localStorage.set(service.key, service.bookmarkTypesList);
            service.setBookmarkTypeActive(Id);
        }
    }

    return service;
}])