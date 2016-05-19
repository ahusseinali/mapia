var app = app || {};

// This function is called after Google Map loads.
function init() {
    var mapModel = new app.models.mapModel();
    var mapVM = new app.viewModels.mapVM(mapModel);
    // Apply binding to View Models
    ko.applyBindings(mapVM);
}
