
var IonicModule = angular.module('ionic');



IonicModule.directive("googleMap", function (mapApi) {
    var mapController = ['$scope', function ($scope) {

        $scope.initializeMap = function () {
            $scope.markers = angular.copy($scope.DrawnMarkers);
            var mapOptions = {
                mapTypeId: 'roadmap'
            };
            //debugger;
            // Display a map on the page
            $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
            $scope.map.setTilt(45);

            // Display multiple markers on a map
            var infoWindow = new google.maps.InfoWindow(), marker, i;

            // Loop through our array of markers & place each one on the map  
            for (i = 0; i < $scope.markers.length; i++) {
                //debugger;
                $scope.AddMarkerToMap($scope.markers[i]);
            }

            // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
            var boundsListener = google.maps.event.addListener(($scope.map), 'bounds_changed', function (event) {
                this.setZoom(5);
                google.maps.event.removeListener(boundsListener);
            });

        }
        $scope.AddMarkerToMap = function (marekerToAdd) {
            var bounds = new google.maps.LatLngBounds();
            //debugger;
            // Display multiple markers on a map
            var infoWindow = new google.maps.InfoWindow(), marker, i;
            var position = new google.maps.LatLng(marekerToAdd["Lat"], marekerToAdd["Lng"]);
            bounds.extend(position);
            marker = new google.maps.Marker({
                position: position,
                map: $scope.map,
                title: marekerToAdd["DonationCharityName"],
                branchObj: marekerToAdd

            });
            // Allow each marker to have an info window    
            google.maps.event.addListener(marker, 'click', function (marker, i) {
                //$scope.BranchDetail = this.branchObj;
                $scope.BranchDetail_DonationCharityName = this.branchObj.DonationCharityName;
                $scope.BranchDetail_Address = this.branchObj.Address;
                $scope.BranchDetail_WorkingPeriod = this.branchObj.WorkingPeriod;
                $scope.BranchDetail_Phone = this.branchObj.Phone;
                $scope.$apply();
                $scope.showDetails();
                //  document.getElementById('charityDetail').scrollIntoView();
            });

            // Automatically center the map fitting all markers on the screen
            $scope.map.fitBounds(bounds);
        }
        $scope.DrawDirections = function () {

            var currentPos = new google.maps.LatLng($scope.CurrentPosition.Lat, $scope.CurrentPosition.Lng);

            var nearestBranch = $scope.getNearestBranchMarker(currentPos);


            var directionsDisplay = new google.maps.DirectionsRenderer();// also, constructor can get "DirectionsRendererOptions" object
            directionsDisplay.setMap($scope.map); // map should be already initialized.
            directionsDisplay.setOptions({ suppressMarkers: true });

            var request = {
                origin: currentPos,
                destination: nearestBranch,
                travelMode: google.maps.TravelMode.DRIVING
            };
            var directionsService = new google.maps.DirectionsService();
            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                    // handle click on each of origin and destination
                    var myRoute = response.routes[0].legs[0];
                    var arrDist = [];
                    for (var i = 0; i < $scope.markers.length; i++) {
                        //debugger;
                        var markerLatLng = new google.maps.LatLng($scope.markers[i].Lat, $scope.markers[i].Lng);
                        var dist = google.maps.geometry.spherical.computeDistanceBetween(currentPos, markerLatLng);

                        arrDist.push(dist);
                    }


                }
            });


        }

    }];

    return {
        restrict: "E",
        scope: {
            DrawnMarkers: '=',
            CurrentPosition: '='
        },
        controller: mapController,
        templateUrl: "app/directives/templates/mapTemplate.html",
        compile: function () {
            alert('compile');

            return {
                post: function (scope) {
                    $("#NotifyH2").html("<i class='ion-load-a'></i> " + "جار تحميل خريطة أماكن التبرع....");
                    $("#Notify").show();
                    $("#map").hide();
                    alert('link');
                    mapApi.appendMapApiUrl().then(function (response) {
                        alert('response' + response);
                        if (response) {
                            $("#Notify").hide();
                            $("#map").show();
                            scope.initializeMap();
                        } else {
                            $("#NotifyH2").html("<i class='ion-load-a'></i> " + "لقد تعذر الاتصال بالانترنت لتحميل خريطة أماكن التبرع..يرجى المحاولة مرة أخرى!");
                            $("#Notify").show();
                            $("#map").hide();
                        }
                        //watch CurrentPosition to draw direction after set it.
                        scope.$watch('CurrentPosition', function (newVal) {
                            if (newVal)
                                scope.DrawDirections();
                        }, true);

                    });
                }
            }
        },

        link: function ($scope, element, attrs) {  //DOM manipulation
            alert('link');
            //$("#NotifyH2").html("<i class='ion-load-a'></i> " + "جار تحميل خريطة أماكن التبرع....");
            //$("#Notify").show();
            //$("#map").hide();
            //debugger;
            //alert('link');
            //mapApi.appendMapApiUrl().then(function (response) {
            //    alert('response' + response);
            //    if (response) {
            //        $("#Notify").hide();
            //        $("#map").show();
            //        $scope.initializeMap();
            //    } else {
            //        $("#NotifyH2").html("<i class='ion-load-a'></i> " + "لقد تعذر الاتصال بالانترنت لتحميل خريطة أماكن التبرع..يرجى المحاولة مرة أخرى!");
            //        $("#Notify").show();
            //        $("#map").hide();
            //    }
            //    //watch CurrentPosition to draw direction after set it.
            //    scope.$watch('CurrentPosition', function (newVal) {
            //        debugger;
            //        if (newVal)
            //            $scope.DrawDirections();
            //    }, true);

            //});
        }
    }
});