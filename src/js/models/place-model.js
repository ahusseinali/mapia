var app = app || {};
app.models = app.models || {};

(function() {
    'use strict';

    // Initialized using Google Places Result
    var Place = function(googlePlace) {
        this.latLng = googlePlace.geometry.location;
        this.name = googlePlace.name;
        this.address = googlePlace.vicinity;
        this.types = googlePlace.types;
    };

    app.models.place = Place;
})();