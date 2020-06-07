app.factory("alarmStorage", ["localStorage", "$filter", function (localStorage, $filter) {

    var storageKey = "alarmStorage";
    var service = {
        storageKey: "alarmStorage",
        addTarget: function (alarmNumber) {
            var key = storageKey;
            var obj = {};
            obj.ID = alarmNumber;
            localStorage.append(key, obj);
        },

        clearAllTargets: function () {
            var key = storageKey;
            localStorage.remove(key);
        },

        getAllTargets: function () {
            var key = storageKey;
            var test = localStorage.get(key);
            return test;
        },

        checkIfTargetIsStored: function (id) {
            var targets = this.getAllTargets();
            if (targets) {
                var getAlarm = $filter('filter')(targets, { 'ID': id }).length;
                console.log(id,getAlarm);
                if (getAlarm > 0)
                    return true
                else
                    return false
            }
            else
                return false;
        },

    }

    return service;
}]);