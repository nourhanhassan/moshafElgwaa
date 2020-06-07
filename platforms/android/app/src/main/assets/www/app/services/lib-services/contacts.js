app.factory("contacts", ["$q",  function ($q) {
    
    return {
        getContacts: function () {
            var deferred = $q.defer();

            navigator.contacts.find(
              [navigator.contacts.fieldType.displayName],

              function(c){
                var contact = {name:'',number:[]}
                var contacts = [];
                var contactsNumbers = [];
                  try {
                      for (var i = 0, len = c.length; i < len; i++) {
                          if (c[i].phoneNumbers) {
                              for (var j = 0; j < c[i].phoneNumbers.length; j++) {
                                  var contact = { name: c[i].displayName, number: c[i].phoneNumbers[j].value.replace(/\s/g, '') }
                                  contacts.push(contact);
                                  contactsNumbers.push(c[i].phoneNumbers[j].value.replace(/\s/g, ''));
                              }
                          }
                      }
                      deferred.resolve([contacts,contactsNumbers]);
                  }
                  catch (ex) {
                      alert(JSON.stringify(ex));
                      deferred.reject(ex);
                  }

                 
              },
              function(err){
                  deferred.reject(err);
              
              });
        
            return deferred.promise;
         }
    }
}]);