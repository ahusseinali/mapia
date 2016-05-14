var app = app || {};
app.viewModels = app.viewModels || {};
app.mapObjects = app.mapObjects || {};

(function() {
    'use strict';

    // Add custom binding handler for google maps
    ko.bindingHandlers.googlemap = {
        init: function(elem, valueAccessor) {
            var val = valueAccessor().map,

            mapOptions = {
                zoom: val.zoom(),
                center: val.center(),
                styles: val.styles(),
                mapTypeControl: false
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
            var val = valueAccessor().map;
            var infobox = valueAccessor().info;
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
                    // Close the side navigation
                    val.closeSideNav();
                    // Load yelp data
                    placesModel.loadYelpDetails(place);
                    // Set Current Place to trigger bidning with current place
                    placesModel.currentPlace(place);
                    // Get the Infowindow template
                    app.mapObjects.infowindow.setContent(infobox);
                    app.mapObjects.infowindow.open(app.mapObjects.map, marker);
                });

                app.mapObjects.markers.push(marker);
            });
        }
    }

    var MapViewModel = function(model) {
        this.mapModel = ko.observable(model);
    };

    // Display Infobox when a place in side bar is selected.
    MapViewModel.prototype.selectPlace = function(index) {
        // Trigger marker click
        new google.maps.event.trigger(app.mapObjects.markers[index], 'click');
        // this.mapModel().closeSideNav();
    }

    app.viewModels.mapVM = new MapViewModel(app.models.mapModel);
})();