app.factory("mapApi", ["$q", "ionicLoading", function ($q, ionicLoading) {
    var errorHandler = function (err) {

        console.log("Error sending request " + JSON.stringify(err));

        //ionicLoading.hide();
        ////ionicLoading.show({ templateText: "حدث خطأ .. برجاء التأكد من اتصالك بالإنترنت" });
        //setTimeout(function () {
        //    ionicLoading.hide();
        //}, 4000);

        return $q.reject(err);
    }
    var mapApiService = {
        isAppended: false,

        appendMapApiUrl: function () {
            //define callback of google api

          //  //alert('mapApiService.isAppended: ' + mapApiService.isAppended);
            var defer = $q.defer();
            ////alert("isAppended" + mapApiService.isAppended);
          
            if (!mapApiService.isAppended) {
               // //alert("BEFOR" + document.head.innerHTML);
                var randomVersion = Math.floor(Math.random() * (100 - 1 + 1)) + 1;

               // //alert('randomVersion: ' + randomVersion);
                //create script elemnt
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.defer = 'defer';
                script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDY0kkJiTPVd2U7aTOAwhc9ySH6oHxOIYM&libraries=geometry&sensor=false&callback=mapCb&v=' + randomVersion;
                //script.onload = function () { Lazy_loader.onload(this); };
                script.onerror = function () { errorHandler(); mapApiService.isAppended = false; defer.resolve(mapApiService.isAppended); };
                document.head.appendChild(script);
                ////alert("head sr" + document.head.innerHTML);
                ////alert('AFTER getScript');
            } else {
                //alert('already appended');
                defer.resolve(mapApiService.isAppended);
                // errorHandler();
            }


            window.mapCb = function () {
          //      //alert("aaaaaaa");
                mapApiService.isAppended = true;
                defer.resolve(mapApiService.isAppended);

            }
            return defer.promise;
        },

        AddMarkerToMap: function (Lat, Lng, mapObj) {
            var bounds = new google.maps.LatLngBounds();
          //debugger;
            // Display multiple markers on a map
            var infoWindow = new google.maps.InfoWindow(), marker, i;
            var position = new google.maps.LatLng(Lat, Lng);
            bounds.extend(position);
            marker = new google.maps.Marker({
                position: position,
                map: mapObj
            });
            // Automatically center the map fitting all markers on the screen
            mapObj.fitBounds(bounds);
        },

        ChangeMapZoom: function (zoomLevel,MapObj) {
            // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
            var boundsListener = google.maps.event.addListener((MapObj), 'bounds_changed', function (event) {
                this.setZoom(zoomLevel);
                google.maps.event.removeListener(boundsListener);
            });
        }
    }

    return mapApiService;
}]);
