app.factory("notes", ["localStorage", "$q", "moshafdata", "enums", "$filter", "memorize", function (localStorage, $q, moshafdata, enums, $filter, memorize) {

    var service = {
        key:"Notes",
        noteObject: {
            ayaId: 0,
            text: "",
            surahName: "",
            ayaNumber: 0,
            pageNumber:0
        },

        notesList: [],
        favList: [],

        resetNoteObject :function(){
            service.noteObject= {
                    ayaId: 0,
                    text: "",
                    surahName: "",
                    ayaNumber: 0,
                    pageNumber:0
            }

        },
        getNotesList :function(){
            var notes = localStorage.get(service.key);
            if (typeof (notes) == "undefined") {
                service.notesList = [];
            }
            else {
                service.notesList = notes;
                service.notesList.forEach(function (note) {
                        var aya = moshafdata.getAyaByID(note.ayaId);
                        note.pageNumber = aya.PageNum;

                })
            }
            var orderedList = $filter('orderBy')(service.notesList, 'ayaId')
            return orderedList;
        },
        getfavsList: function () {
            var favs = localStorage.get("FavourizedTempo");
            if (typeof (favs) == "undefined") {
                service.favList = [];
            }
            else {
                service.favList = favs;
                service.favList.forEach(function (item) {
                    var aya = moshafdata.getAyaByID(item.id);
                    item.PageNum = aya.PageNum;

                })
            }
            var orderedList = $filter('orderBy')(service.favList, 'id')
            return orderedList;
        },
        getNote: function (ayaId) {
            service.resetNoteObject();
            service.notesList = service.getNotesList();
            var note = service.notesList.filter(function (obj) { return obj.ayaId == ayaId });
            var ret = note.length > 0 ? note[0] : service.noteObject;
            return ret;
        },
        saveNote: function (ayaId, text, pageNum)
        {
            var updatedNote = service.getNote(ayaId);
            if (updatedNote.ayaId > 0)
            {
                updatedNote.text = text;
                //oldNote.Date= 
            }
            else {
                var aya = moshafdata.getAya(ayaId, pageNum)
                var surah = moshafdata.getSurah(aya.surah);
                var updatedNote = {
                    pageNumber: pageNum,
                    ayaId: ayaId,
                    ayaNumber: aya.ayahNum,
                    surahName: surah.Name,
                    text:text,
                    surahType: surah.Type
                }
                service.notesList.push(updatedNote);
            }
            localStorage.set(service.key, service.notesList);
        },
        deleteNote :function (ayaId)
        {
            //if(ayaId)
            //{
                service.notesList = service.getNotesList();
                service.notesList = service.notesList.filter(function (obj) { return obj.ayaId !== ayaId });
                localStorage.set(service.key, service.notesList);
            //}
        },
        deleteFav: function (ayaId) {

            service.favList = service.getfavsList();
            service.favList = service.favList.filter(function (obj) { return obj.id !== ayaId });
            localStorage.set("FavourizedTempo", service.favList);
            memorize.removeAyaFromFavourized(ayaId);
        },
        getNotesForPage: function (pageNum) {
            var notes = service.getNotesList();
            var PageNotes = notes.filter(function (note) { return note.pageNumber == pageNum });
            return PageNotes;
        }
    }

    return service;
}])