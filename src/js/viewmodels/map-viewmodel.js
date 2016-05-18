var app = app || {};
app.viewModels = app.viewModels || {};
app.mapObjects = app.mapObjects || {};

(function() {
    'use strict';

    // Add custom binding handler for google maps
    ko.bindingHandlers.googlemap = {
        init: function(elem, valueAccessor) {
            var val = valueAccessor().map,

            mapOptions = {
                zoom: val.zoom(),
                center: val.center(),
                styles: val.styles(),
                mapTypeControl: false
            };

            // Initialize map and info window and markers
            app.mapObjects.map = new google.maps.Map(elem, mapOptions);
            app.mapObjects.infowindow = new google.maps.InfoWindow(
            {
                content: ''
            });

            // Set close event listener to info window
            // The handler should return infowindow template content to template div.
            app.mapObjects.infowindow.addListener('closeclick', function() {
                // Get #infoboxContainer from inside #infobox
                var content = this.getContent();
                if(content) {
                    content = content.firstChild;
                    // Return #infoContainer to template
                    $('#infoboxTemplate').append(content);
                    this.setContent('');
                }
                this.close();
            });
            app.mapObjects.markers = [];

            var placesModel = val.places;
            // Load places from Google Places API
            placesModel.loadGooglePlaces(val.center());
        },

        update: function(elem, valueAccessor) {
            var val = valueAccessor().map;
            var infoboxName = valueAccessor().info;
            var placesModel = val.places;
            // Clear all markers
            app.mapObjects.markers.forEach(function(marker) {
                marker.setMap(null);
            })
            app.mapObjects.markers = [];
            app.mapObjects.infoboxName = infoboxName;

            // Display only markers for selected places
            placesModel.selectedPlaces().forEach(function(place) {
                var marker = new google.maps.Marker({
                    position: place.latLng,
                    map: app.mapObjects.map
                });

                // Set the marker icon to the first type
                marker.setIcon('img/' + place.types[0] + '.png');

                // Clear marker listeners in case it has any
                google.maps.event.clearListeners(marker, 'click');
                // Add click listener to marker
                marker.addListener('click', function() {
                    // Close the side navigation
                    val.closeSideNav();
                    // Close InfoWindow from old location (if any is open)
                        new google.maps.event.trigger(app.mapObjects.infowindow, 'closeclick');
                    // Load yelp data
                    placesModel.loadYelpDetails(place);
                    // Set Current Place to trigger bidning with current place
                    placesModel.currentPlace(place);

                    // Set Marker Animation for 1 second
                    // Then Display Info Window content.
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(function() {
                        marker.setAnimation(null);

                        // Display Info Window Content
                        var infobox = $('<div id="' + app.mapObjects.infoboxName +'"></div>')
                            .append($('#infoContainer'));
                        app.mapObjects.infowindow.setContent(infobox[0]);
                        app.mapObjects.infowindow.open(app.mapObjects.map, marker);
                    }, 1000);
                });

                app.mapObjects.markers.push(marker);
            });
        }
    }

    var MapViewModel = function(model) {
        this.mapModel = ko.observable(model);
    };

    //Search functionality
    MapViewModel.prototype.search = function(keyword) {
        // Manual trigger to gracefully close infowindow.
        // Prevent a maps bug that makes window disappear without closing.
        new google.maps.event.trigger(app.mapObjects.infowindow, 'closeclick');

        this.mapModel().search(keyword);
    }

    // Display Infobox when a place in side bar is selected.
    MapViewModel.prototype.selectPlace = function(index) {
        // Trigger marker click
        new google.maps.event.trigger(app.mapObjects.markers[index], 'click');
    }

    app.viewModels.mapVM = new MapViewModel(app.models.mapModel);
})();