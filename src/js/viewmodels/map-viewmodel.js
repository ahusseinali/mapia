var app = app || {};
app.viewModels = app.viewModels || {};
app.mapObjects = app.mapObjects || {};

(function() {
    'use strict';

    // Add custom binding handler for google maps
    ko.bindingHandlers.googlemap = {
        init: function(elem, valueAccessor) {
            var val = valueAccessor(),
            mapOptions = {
                zoom: val.zoom(),
                center: val.center(),
                styles: val.styles()
            };

            // Initialize map and info window and markers
            app.mapObjects.map = new google.maps.Map(elem, mapOptions);
            app.mapObjects.infowindow = new google.maps.InfoWindow(
            {
                content: ''
            });
            app.mapObjects.markers = [];

            var placesModel = val.places;
            // Load places from Google Places API
            placesModel.loadGooglePlaces(val.center());
        },

        update: function(elem, valueAccessor) {
            var val = valueAccessor();
            var placesModel = val.places;
            // Clear all markers
            app.mapObjects.markers.forEach(function(marker) {
                marker.setMap(null);
            })
            app.mapObjects.markers = [];

            // Display only markers for selected places
            placesModel.selectedPlaces().forEach(function(place) {
                var marker = new google.maps.Marker({
                    position: place.latLng,
                    map: app.mapObjects.map
                });

                // Set the marker icon to the first type
                marker.setIcon('img/' + place.types[0] + '.png');

                // Clear marker listeners in case it has any
                google.maps.event.clearListeners(marker, 'click');
                // Add listener to marker
                marker.addListener('click', function() {
                    // Load yelp data
                    placesModel.loadYelpDetails(place);
                    // Set Current Place to trigger bidning with current place
                    placesModel.currentPlace(place);
                    // Get the Infowindow template
                    app.mapObjects.infowindow.setContent(val.info);
                    app.mapObjects.infowindow.open(app.mapObjects.map, marker);
                });
            });
        }
    }

    var MapViewModel = function(model) {
        this.mapModel = ko.observable(model);
    };

    app.viewModels.mapVM = new MapViewModel(app.models.mapModel);
})();