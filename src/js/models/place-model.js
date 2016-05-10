var app = app || {};
app.models = app.models || {};

(function() {
    'use strict';

    // Initialized using Google Places Result
    var Place = function(googlePlace, type) {
        this.id = googlePlace.place_id;
        this.latLng = googlePlace.geometry.location;
        this.name = googlePlace.name;
        this.address = googlePlace.vicinity;
        this.rating = googlePlace.rating;
        this.img = '';
        // this.img = (googlePlace.photos && googlePlace.photos.length > 0) ?
        //            googlePlace.photos[0].getUrl() : '';
        this.types = [type];
        // This is to be filled with the yelp result.
        this.yelp = ko.observable(null);
    };

    Place.prototype.hasYelpData = function() {
        return this.yelp() != null;
    };

    app.models.place = Place;
})();