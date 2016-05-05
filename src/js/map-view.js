var app = app || {};

// Map manager initialization and functionality
(function() {
    'use strict';
    var MapView = function(options) {
        this.map = new google.maps.Map(document.getElementById('map'), options);
    };

    app.MapView = MapView;
})();