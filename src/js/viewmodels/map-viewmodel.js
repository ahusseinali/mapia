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

            // Initialize map and info window
            app.mapObjects.map = new google.maps.Map(elem, mapOptions);
            app.mapObjects.infowindow = new google.maps.InfoWindow(
            {
                content: ''
            });

            var placesModel = val.places;
            // Load places from Google Places API
            placesModel.loadGooglePlaces(val.center());

            placesModel.places().forEach(function(place) {
                var marker = new google.maps.Marker({
                    position: place.latLng,
                    map: app.mapObjects.map
                });
            });
        },

        update: function(elem, valueAccessor) {
            var val = valueAccessor();
            var placesModel = val.places;

            placesModel.places().forEach(function(place) {
                var marker = new google.maps.Marker({
                    position: place.latLng,
                    map: app.mapObjects.map
                });

                if(place.types.length > 1) {
                    console.log(place);
                }

                // Set the marker icon to the first type
                marker.setIcon('img/' + place.types[0] + '.png');

                // Clear marker listeners in case it has any
                google.maps.event.clearListeners(marker, 'click');
                // Add listener to marker
                marker.addListener('click', function() {
                    app.mapObjects.infowindow.setContent(place.name);
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