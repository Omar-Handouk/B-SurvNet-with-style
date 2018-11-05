'use strict';

var map;
var marker = false;

function initMap() {


    var centerOfMap = new google.maps.LatLng(52.357971, -6.516758);


    var options = {
        center: centerOfMap,
        zoom: 2
    };


    map = new google.maps.Map(document.getElementById('report-map'), options);


    google.maps.event.addListener(map, 'click', function (event) {

        var clickedLocation = event.latLng;

        if (marker === false) {

            marker = new google.maps.Marker({
                position: clickedLocation,
                map: map,
                draggable: true
            });

            google.maps.event.addListener(marker, 'dragend', function (event) {
                markerLocation();
            });
        } else {

            marker.setPosition(clickedLocation);
        }

        markerLocation();
    });
}


function markerLocation() {

    var currentLocation = marker.getPosition();

    document.getElementById('markerLocation').value = currentLocation.lat() + ',' + currentLocation.lng(); //latitude
}