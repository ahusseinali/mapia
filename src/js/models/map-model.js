var app = app || {};
app.models = app.models || {};

(function() {
    'use strict';

    var MapModel = function() {
        this.center = ko.observable(new google.maps.LatLng(47.6163, -122.192));
        this.zoom = ko.observable(15);
        this.styles = ko.observable(app.models.mapStyles.grayscale);
        this.places = app.models.placesModel;
    };

    // Specify the map initialization options
    app.models.mapModel = new MapModel();
})();