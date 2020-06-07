app.factory("backup", ["httpHandler", "$q", "memorizedayat", "localStorage", "bookmarkTypes", "bookmarks", "target", "network", "notes", "toast", "reviewTarget", function (httpHandler, $q, memorizedayat, localStorage, bookmarkTypes, bookmarks, target, network, notes, toast, reviewTarget) {
    var service = {
        storageKey: "userData",
        getUserData: function () {
            var user = localStorage.get(service.storageKey);
            return user;
        },
        register: function (name, email, password) {
            //if (network.isOffline())
            //{
            //    network.showNetworkOfflineMsg();
            //}
            var deferred = $q.defer();
            httpHandler.get("mobileuser/Register", { Name: name,Email:email,Password:password }, true).then(function (results) {
                deferred.resolve(results);
            });

            return deferred.promise;
        },
        login: function (name, password) {
            //if (network.isOffline()) {
            //    network.showNetworkOfflineMsg();
            //}
            var deferred = $q.defer();
            httpHandler.get("mobileuser/Login", { Name: name,  Password: password }, true).then(function (results) {
                deferred.resolve(results);
            });

            return deferred.promise;
        },
        setUserData: function (id,name, email, password,hasBackup) {

            localStorage.set(service.storageKey, { id: id, name: name, email: email, password: password, hasBackup: hasBackup });
        },
        uploadUserData: function (userId) {
            //if (network.isOffline()) {
            //    network.showNetworkOfflineMsg();
            //}
            var deferred = $q.defer();
            //  var BackupDataList = [];
            var bookmarkTypesList = window.localStorage[bookmarkTypes.key]
            var bookmarksList = window.localStorage[bookmarks.key]
            var memorizedayatList = window.localStorage[memorizedayat.storagekey]
            var targetsList = window.localStorage["targets"]
            var notesList = window.localStorage[notes.key]
            var reviewTargetsList = window.localStorage[reviewTarget.storageKey]
            reviewTargetsList = typeof (reviewTargetsList) == "undefined" ? "" : reviewTargetsList;
            bookmarkTypesList = typeof (bookmarkTypesList) == "undefined" ? "" : bookmarkTypesList;
            bookmarksList = typeof (bookmarksList) == "undefined" ? "" : bookmarksList;
            memorizedayatList = typeof (memorizedayatList) == "undefined" ? "" : memorizedayatList;
            targetsList = typeof (targetsList) == "undefined" ? "" : targetsList;
            var backupDataList = {};
            backupDataList[bookmarkTypes.key] = bookmarkTypesList;
            backupDataList[bookmarks.key] = bookmarksList;
            backupDataList[memorizedayat.storagekey] = memorizedayatList;
            backupDataList["targets"] = targetsList;
            backupDataList[notes.key] = notesList;
            backupDataList[reviewTarget.storageKey] = reviewTargetsList;
            console.log(backupDataList)

            httpHandler.post("Backup/UploadUserData", { UserId: userId, UserData: backupDataList }, true).then(function (results) {
                toast.info("", "تم رفع  بياناتك  بنجاح")
                deferred.resolve(results);
            });
            return deferred.promise;
        },
        getUserBackData: function (userId) {
            //if (network.isOffline()) {
            //    network.showNetworkOfflineMsg();
            //}
            httpHandler.post("Backup/GetUserLastBackupData", { UserId: userId }, true).then(function (results) {
                service.setBackupData(results)
              
                deferred.resolve(results);
            });
        },
        setBackupData: function (lastBackup) {

            lastBackup.BackupData.forEach(function (item) {
                if (item.DataJsonValue.length > 0) {
                    localStorage.set(item.DataKey, JSON.parse(item.DataJsonValue))
                }
            })
            memorizedayat.reinitialize();
            toast.info("", "تم استعادة  بياناتك  بنجاح")
        }

        
    }

    return service;
}]);