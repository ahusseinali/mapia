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
                center: val.center(),
                styles: val.styles(),
                mapTypeControl: false
            };

            // Initialize map and info window and markers
            app.mapObjects.map = new google.maps.Map(elem, mapOptions);
            app.mapObjects.bounds = new google.maps.LatLngBounds()
            app.mapObjects.infobox = valueAccessor().info;
            app.mapObjects.infowindow = new google.maps.InfoWindow(
            {
                content: ''
            });

            // Set close event listener to info window
            // The handler should return infowindow template content to template div.
            app.mapObjects.infowindow.addListener('closeclick', function() {
                this.close();
            });

            var placesModel = val.places;
            // Load places from Google Places API
            placesModel.loadGooglePlaces(val.center());
        }
    };

    var MapViewModel = function(model) {
        this.mapModel = ko.observable(model);
    };

    //Search functionality
    MapViewModel.prototype.search = function(keyword) {
        // Manual trigger to gracefully close infowindow.
        // Prevent a maps bug that makes window disappear without closing.
        new google.maps.event.trigger(app.mapObjects.infowindow, 'closeclick');

        this.mapModel().search(keyword);
    };

    // Display Infobox when a place in side bar is selected.
    MapViewModel.prototype.selectPlace = function(place) {
        // Trigger marker click
        new google.maps.event.trigger(place.marker, 'click');
    };

    app.viewModels.mapVM = MapViewModel;
})();