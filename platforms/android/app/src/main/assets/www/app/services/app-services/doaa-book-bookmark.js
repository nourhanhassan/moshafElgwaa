app.factory("doaaBookmarks", ["localStorage","$q","enums", function (localStorage,$q, enums) {

    var service = {
        key: "doaaBookmarks",
        bookmarkObject: {
            Id: 0,
            index:0,
            bookmarkTypeId: 0 // enums.doaaBookmarkType
        },

        bookmarksList: [],
        resetbookmarkObject: function () {
            service.bookmarkObject = {
                Id: 0,
                index: 0,
                bookmarkTypeId: 0
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
            //service.bookmarksList.forEach(function (mark) {
            //    mark.aya = moshafdata.getAya(mark.ayaId, mark.pageNumber);
            //    mark.surahName = moshafdata.getSurah(mark.aya.surah).Name;
            //    mark.bookmarkType = bookmarkTypes.getBookmarkType(mark.bookmarkTypeId);
            //})
            return service.bookmarksList;
        },
        getBookmark: function (id) {
            service.resetbookmarkObject();
            service.bookmarksList = service.getBookmarksList();
            var bookmark = service.bookmarksList.filter(function (obj) { return obj.Id == id });
            //if (bookmark.length > 0) {
            //    bookmark[0].bookmarkType = bookmarkTypes.getBookmarkType(bookmark.bookmarkTypeId);
            //}
            var ret = bookmark.length > 0 ? bookmark[0] : service.bookmarkObject;
            return ret;
        },
        getLastBookmark: function () {
            var bookmarks = localStorage.get(service.key);
            var lastBookmark = null;
            if (typeof (bookmarks) != "undefined") {
                if (bookmarks.length > 0) {
                    lastBookmark = bookmarks[bookmarks.length - 1];
                    //lastBookmark.bookmarkType = bookmarkTypes.getBookmarkType(lastBookmark.bookmarkTypeId);
                }
            }
            return lastBookmark;
        },
        //getAyaBookmarks: function (ayaId) {
        //    service.resetbookmarkObject();
        //    service.bookmarksList = service.getBookmarksList();
        //    var bookmarks = service.bookmarksList.filter(function (obj) { return obj.ayaId == ayaId });
        //    var ret = bookmarks.length > 0 ? bookmarks : [];
        //    return ret;
        //},
        saveBookmark: function (id, index, bookmarkTypeId) {
            service.getBookmarksList();
            var updatedbookmark = service.getBookmark(id);
            if (updatedbookmark.id > 0) {
                updatedbookmark.Id = id;
                updatedbookmark.bookmarkTypeId = bookmarkTypeId;
                //oldbookmark.Date= 
            }
            else {
                var lastBookmarkType = service.bookmarksList.filter(function (obj) { return obj.bookmarkTypeId == bookmarkTypeId });
                if (lastBookmarkType.length > 0) {
                    service.deleteBookmark(lastBookmarkType[0].Id);
                }
                //var lastOne = service.bookmarksList.length > 0 ? service.bookmarksList[service.bookmarksList.length - 1] : null;
                //var id = lastOne != null ? lastOne.id + 1 : 1;
                var updatedbookmark = {
                    Id: id,
                    bookmarkTypeId: bookmarkTypeId,
                    index: index

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
            service.bookmarksList = service.bookmarksList.filter(function (obj) { return obj.Id != id });
            localStorage.set(service.key, service.bookmarksList);
            //}
        },
        //deleteBookmarkByType: function (typeId) {
        //    //if(ayaId)
        //    //{
        //    service.bookmarksList = service.getBookmarksList();
        //    service.bookmarksList = service.bookmarksList.filter(function (obj) { return obj.bookmarkTypeId != typeId });
        //    localStorage.set(service.key, service.bookmarksList);
        //    //}
        //}
    }

    return service;
}])