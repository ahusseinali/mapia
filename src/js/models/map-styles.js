var app = app || {};
app.models = app.models || {};

(function() {
    'use strict';

    // Custome styles for google maps
    app.models.mapStyles = {
        // Taken from: https://snazzymaps.com/style/46184/facebook
        facebook: [
            {
                "featureType": "all",
                "elementType": "all",
                "stylers": [{"hue": "#3b5998"},{"saturation": -22}]
            },{
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [{"visibility":"on"},{"color":"#3b5998"}]
            },{
                "featureType": "administrative.country",
                "elementType": "geometry.stroke",
                "stylers": [{"visibility":"simplified"},{"color":"#3b5998"}]
            },{
                "featureType": "administrative.province",
                "elementType": "all",
                "stylers": [{"visibility":"off"}]
            },{
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [{"visibility":"on"},{"color":"#f7f7f7"},{"saturation":10},{"lightness":76}]
            },{
                "featureType": "landscape.natural",
                "elementType": "all",
                "stylers": [{"color":"#f7f7f7"}]
            },{
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [{"color":"#8b9dc3"},{"visibility":"simplified"}]
            },{
                "featureType": "road.highway",
                "elementType": "labels.icon",
                "stylers": [{"visibility":"on"}]
            },{
                "featureType": "road.local",
                "elementType": "geometry.fill",
                "stylers": [{"color":"#8b9dc3"}]
            },{
                "featureType": "transit.line",
                "elementType": "geometry.fill",
                "stylers": [{"color":"#ffffff"},{"weight":0.43}]
            },{
                "featureType": "water",
                "elementType": "all",
                "stylers":[{"color":"#3b5998"}]
            }
        ],
    };
})();