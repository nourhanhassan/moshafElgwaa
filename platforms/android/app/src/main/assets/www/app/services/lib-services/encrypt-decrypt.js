app.factory("crypto", function () {
    var key = "y0u c@nt kn0w my key, 1'm a g0*d!";
    return {
        encrypt: function (string) {
           return CryptoJS.TripleDES.encrypt(string, key);
        },
        decrypt: function (encrypted) {
            return (CryptoJS.TripleDES.decrypt(encrypted, key)).toString(CryptoJS.enc.Utf8);
        }
    }
});