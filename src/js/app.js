var app = app || {};

(function() {
// Entry point for app initialization
function init() {
    app.map = new app.MapView({
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });
}

    google.maps.event.addDomListener(window, 'load', init);
})();
