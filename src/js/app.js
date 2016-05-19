var app = app || {};

// This function is called after Google Map loads.
function init() {
    var mapModel = new app.models.mapModel();
    var mapVM = new app.viewModels.mapVM(mapModel);
    // Apply binding to View Models
    ko.applyBindings(mapVM);
}

(function() {
    // Handle failure to load Google maps in 5 seconds
    setTimeout(function() {
        if(typeof google == 'undefined' || typeof google.maps == 'undefined') {
            alert('Failed to load Google Maps. Check your connection.');
        }
    }, 5000);
})();
