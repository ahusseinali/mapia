var app = app || {};
app.viewModels = app.viewModels || {};

(function() {
    'use strict';

    // Add custom binding handler for google maps
    ko.bindingHandlers.googlemap = {
        init: function(elem, valueAccessor) {
            var val = valueAccessor(),
            mapOptions = {
                zoom: val.zoom(),
                center: val.center(),
                styles: val.styles()
            },
            map = new google.maps.Map(elem, mapOptions);

            val.locations().forEach(function(loc) {
                var latLng = new google.maps.LatLng(
                    value.loc.latitude,
                    value.loc.longitude);

                var marker = new google.maps.Marker({
                    position: latLng,
                    map: map
                });
            });
        }
    }

    var MapViewModel = function(model) {
        this.mapModel = ko.observable(model);
    };

    app.viewModels.mapVM = new MapViewModel(app.models.mapModel);
})();