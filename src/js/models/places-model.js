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
        this.addGooglePlaces(latLng, 'hotel');
        // Load restaurants
        this.addGooglePlaces(latLng, 'restaurant');
        // Load grocery
        this.addGooglePlaces(latLng, 'grocery');
    };

    PlacesModel.prototype.addGooglePlaces = function(latLng, type) {
        var request = {
            location: latLng,
            type: type,
            radius: '2000',
            rankby: google.maps.places.RankBy.DISTANCE
        };
        var self = this;
        self.placesService.nearbySearch(request, function(response) {
            response.forEach(function(googlePlace) {
                self.places.push(new app.models.place(googlePlace, type));
            });
        });
    }

    app.models.placesModel = new PlacesModel();
})();