var app = app || {};
app.models = app.models || {};

(function() {
    'use strict';

    var PlacesModel = function() {
        this.places = ko.observableArray([]);
    };

    // Use Ajax JSONP request to get near by places.
    // Using Google Places API
    PlacesModel.prototype.loadGooglePlaces = function(latLng) {
        this.places.splice(0, this.places.length);
        this.placesService = new google.maps.places.PlacesService(app.mapObjects.map);
        // Load stores
        this.addGooglePlaces(latLng, 'store');
        // Load lodges
        this.addGooglePlaces(latLng, 'lodge');
        // Load restaurants
        this.addGooglePlaces(latLng, 'restaurant');
        // Load grocery
        this.addGooglePlaces(latLng, 'grocery');
    };

    PlacesModel.prototype.addGooglePlaces = function(latLng, type) {
        var request = {
            location: latLng,
            keyword: type,
            radius: '2000'
        };
        var self = this;
        self.placesService.nearbySearch(request, function(response) {
            response.forEach(function(googlePlace) {
                // If the place exists, add new type only
                var existingPlace = self.places().filter(function(place) {
                    return place.id == googlePlace.place_id;
                });
                if(existingPlace.length > 0) {
                    existingPlace[0].types.push(type);
                } else {
                    self.places.push(new app.models.place(googlePlace, type));
                }
            });
        });
    }

    app.models.placesModel = new PlacesModel();
})();