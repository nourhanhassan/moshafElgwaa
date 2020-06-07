app.factory("bookmarks", ["localStorage", "$q", "moshafdata", "enums", "bookmarkTypes", function (localStorage, $q, moshafdata, enums, bookmarkTypes) {

    var service = {
        key: "Bookmarks",
        bookmarkObject: {
            id:0,
            ayaId: 0,
            bookmarkTypeId: 0,
            pageNumber:0

        },

        bookmarksList: [],
        resetbookmarkObject: function () {
            service.bookmarkObject = {
                ayaId: 0,
                bookmarkTypeId: 0,
                pageNumber:0
            }

        },
        getBookmarksList: function () {
            var bookmarks = localStorage.get(service.key);
            if (typeof (bookmarks) == "undefined") {
                service.bookmarksList = [];
            }
            else {
                service.bookmarksList = bookmarks;
            }
            service.bookmarksList.forEach(function (mark) {
                mark.aya = moshafdata.getAya(mark.ayaId, mark.pageNumber);
                mark.surahName = moshafdata.getSurah(mark.aya.surah).Name;
                mark.bookmarkType = bookmarkTypes.getBookmarkType(mark.bookmarkTypeId);
            })
            return service.bookmarksList;
        },
        getBookmark: function (id) {
            service.resetbookmarkObject();
            service.bookmarksList = service.getBookmarksList();
            var bookmark = service.bookmarksList.filter(function (obj) { return obj.id == id });
            if (bookmark.length > 0)
            {
                bookmark[0].bookmarkType = bookmarkTypes.getBookmarkType(bookmark.bookmarkTypeId);
            }
            var ret = bookmark.length > 0 ? bookmark[0] : service.bookmarkObject;
            return ret;
        },
        getLastBookmark:function(){
            var bookmarks = localStorage.get(service.key);
            var lastBookmark = null;
            if (typeof (bookmarks) != "undefined") {
                if (bookmarks.length > 0) {
                    lastBookmark = bookmarks[bookmarks.length - 1];
                    lastBookmark.bookmarkType = bookmarkTypes.getBookmarkType(lastBookmark.bookmarkTypeId);
                }
            }
            return lastBookmark;
        },
        getAyaBookmarks: function (ayaId) {
            service.resetbookmarkObject();
            service.bookmarksList = service.getBookmarksList();
            var bookmarks = service.bookmarksList.filter(function (obj) { return obj.ayaId == ayaId });
            var ret = bookmarks.length > 0 ? bookmarks : [];
            return ret;
        },
        saveBookmark: function (id, ayaId,pageNumber, bookmarkTypeId) {
            service.getBookmarksList();
            var updatedbookmark = service.getBookmark(id);
            if (updatedbookmark.id > 0) {
                updatedbookmark.ayaId = ayaId;
                updatedbookmark.bookmarkTypeId = bookmarkTypeId;
                //oldbookmark.Date= 
            }
            else {
                var lastBookmarkType = service.bookmarksList.filter(function (obj) { return obj.bookmarkTypeId == bookmarkTypeId });
                if (lastBookmarkType.length > 0)
                {
                    service.deleteBookmark(lastBookmarkType[0].id);
                }
                var lastOne =service.bookmarksList.length > 0? service.bookmarksList[service.bookmarksList.length - 1]:null;
                var id = lastOne!=null ? lastOne.id + 1 : 1;
                var updatedbookmark = {
                    id:id,
                    ayaId: ayaId,
                    bookmarkTypeId: bookmarkTypeId,
                    pageNumber: pageNumber
                 
                }
                service.bookmarksList.push(updatedbookmark);
            }
            localStorage.set(service.key, service.bookmarksList);
            return id;
        },
        deleteBookmark: function (id) {
            //if(ayaId)
            //{
            service.bookmarksList = service.getBookmarksList();
            service.bookmarksList = service.bookmarksList.filter(function (obj) { return obj.id != id });
            localStorage.set(service.key, service.bookmarksList);
            //}
        },
        deleteBookmarkByType: function (typeId) {
            //if(ayaId)
            //{
        service.bookmarksList = service.getBookmarksList();
        service.bookmarksList = service.bookmarksList.filter(function (obj) { return obj.bookmarkTypeId != typeId });
        localStorage.set(service.key, service.bookmarksList);
            //}
    }
    }

    return service;
}])