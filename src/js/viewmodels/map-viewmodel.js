var app = app || {};
app.viewModels = app.viewModels || {};

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

            app.map = new google.maps.Map(elem, mapOptions);

            var placesModel = val.places;
            // Load places from Google Places API
            placesModel.loadGooglePlaces(val.center());

            console.log(placesModel.places());
            placesModel.places().forEach(function(place) {
                console.log(place);
                var marker = new google.maps.Marker({
                    position: place.latLng,
                    map: app.map
                });
            });
        },

        update: function(elem, valueAccessor) {
            var val = valueAccessor();
            var placesModel = val.places;

            placesModel.places().forEach(function(place) {
                console.log(place);
                var marker = new google.maps.Marker({
                    position: place.latLng,
                    map: app.map
                });
            });
        }
    }

    var MapViewModel = function(model) {
        this.mapModel = ko.observable(model);
    };

    app.viewModels.mapVM = new MapViewModel(app.models.mapModel);
})();