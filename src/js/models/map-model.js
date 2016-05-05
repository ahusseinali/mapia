var app = app || {};
app.models = app.models || {};

(function() {
    'use strict';

    // Specify the map initialization options
    app.models.mapModel = {
        center: ko.observable(new google.maps.LatLng(47.608, -122.335)),
        zoom: ko.observable(8),
        locations: ko.observableArray([])
    };
})();