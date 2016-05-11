var app = app || {};
app.models = app.models || {};

(function() {
    'use strict';

    // Custome styles for google maps
    app.models.mapStyles = {
        // Taken from: https://snazzymaps.com/style/15/subtle-grayscale
        grayscale: [
            {
                "featureType":"landscape",
                "stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]
            },{
                "featureType":"poi",
                "stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]
            },{
                "featureType":"road.highway",
                "stylers":[{"saturation":-100},{"visibility":"simplified"}]
            },{
                "featureType":"road.arterial",
                "stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]
            },{
                "featureType":"road.local",
                "stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]
            },{
                "featureType":"transit",
                "stylers":[{"saturation":-100},{"visibility":"simplified"}]
            },{
                "featureType":"administrative.province",
                "stylers":[{"visibility":"off"}]
            },{
                "featureType":"water",
                "elementType":"labels",
                "stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]
            },{
                "featureType":"water",
                "elementType":"geometry",
                "stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]
            }
        ]
    };
})();