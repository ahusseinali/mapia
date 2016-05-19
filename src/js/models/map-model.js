var app = app || {};
app.models = app.models || {};

(function() {
    'use strict';

    var MapModel = function() {
        this.center = ko.observable(new google.maps.LatLng(47.6163, -122.192));
        this.styles = ko.observable(app.models.mapStyles.grayscale);
        this.places = new app.models.placesModel(this);
        // Indicates if the sideNav should be visible or not.
        this.sideNavVisible = ko.observable(false);
    };

    // Perform search and result filteration.
    MapModel.prototype.search = function(keyword) {
        // Pass the search to the placesModel
        this.places.search(keyword);
    };

    MapModel.prototype.openSideNav = function() {
        this.sideNavVisible(true);
    }

    MapModel.prototype.closeSideNav = function() {
        this.sideNavVisible(false);
    }

    // Specify the map initialization options
    app.models.mapModel = MapModel;
})();