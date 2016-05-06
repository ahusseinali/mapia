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
        var placesService = new google.maps.places.PlacesService(app.map)
        var request = {
            location: latLng,
            radius: '2000'
        };
        this.places.splice(0, this.places.length);
        var self = this;
        placesService.nearbySearch(request, function(response) {
            response.forEach(function(googlePlace) {
                self.places.push(new app.models.place(googlePlace));
            });
        });
    };

    app.models.placesModel = new PlacesModel();
})();