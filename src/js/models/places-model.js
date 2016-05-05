var app = app || {};
app.models = app.models || {};

(function() {
    var PlacesModel = function() {
        this.places = ko.observable([]);
    };

    // Use Ajax JSONP request to get near by places.
    // Using Google Places API
    PlacesModel.prototype.loadGooglePlaces = function(map, latLng) {
        var placesService = new google.maps.places.PlacesService(map)
        var request = {
            location: latLng,
            radius: '2000'
        };

        placesService.nearbySearch(request, function(response) {
            console.log(response);
        });
    };

    app.models.placesModel = new PlacesModel();
})();