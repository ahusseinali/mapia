var app = app || {};

// This function is called after Google Map loads.
function init() {
    var mapModel = new app.models.mapModel();
    var mapVM = new app.viewModels.mapVM(mapModel);
    // Apply binding to View Models
    ko.applyBindings(mapVM);
}

// This function is called in case of Google Maps failure
function googleMapsFailure() {
    alert('Failed to load Google Maps. Check your connection.');
}
