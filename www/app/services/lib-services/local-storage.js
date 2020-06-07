app.factory("localStorage", function () {
    return {
        set: function (key, data) {
    
            window.localStorage.setItem(key, JSON.stringify(data));
        },
        get: function (key) {
            var data = window.localStorage.getItem(key);
            //console.log("get")
           // console.log(data)
            if (typeof data != "undefined" && data!=null&& data != "undefined") {

               return JSON.parse(data)
            }
        },
        remove: function (key) {
            window.localStorage.removeItem(key);
        },
        append: function (key, data) {
            var old = this.get(key);
            console.log(old)
            if (typeof old !== "undefined" && old != null) {
                var arr = old;
                arr.push(data)
                this.set(key, arr);
            } else {
                var arr = [];
                arr.push(data);
                this.set(key, arr)
            }
        }
        

    }
});