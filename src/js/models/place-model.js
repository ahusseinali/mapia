var app = app || {};
app.models = app.models || {};

(function() {
    'use strict';

    // Initialized using Google Places Result
    var Place = function(googlePlace, type) {
        var location = googlePlace.geometry.location;
        this.id = googlePlace.place_id;
        this.latLng = location;
        this.name = googlePlace.name;
        this.address = googlePlace.vicinity;
        this.rating = googlePlace.rating;
        // Use Google street view API
        this.img = 'https://maps.googleapis.com/maps/api/streetview?' +
           'size=350x250&heading=151.78&pitch=-0.76&location=' + location.lat() +',' + location.lng() +
           '&key=' + googleMapsKey;
        this.types = [type];
        // This is to be filled with the yelp result.
        this.yelp = ko.observable(null);
        this.marker = null;
    };

    Place.prototype.setMarker = function(marker) {
        this.marker = marker;
    }

    Place.prototype.hasYelpData = function() {
        return this.yelp() != null;
    };

    app.models.place = Place;
})();