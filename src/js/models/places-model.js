var app = app || {};
app.models = app.models || {};

(function() {
    'use strict';

    var PlacesModel = function(mapModel) {
        this.yelp = {
            url: 'http://api.yelp.com/v2/search',

            consumerKey: yelpConsumerKey,
            consumerSecret: yelpConsumerSecret,
            accessToken: yelpAccessToken,
            accessTokenSecret: yelpAccessTokenSecret,
            serviceProvider: {
                signatureMethod: "HMAC-SHA1"
            }
        };
        this.places = [];
        this.selectedPlaces = ko.observableArray([]);
        this.currentPlace = ko.observable(null);
        this.mapModel = mapModel;
    };

    PlacesModel.prototype.isPlaceSelected = function(place) {
        return this.currentPlace() && place.id == this.currentPlace().id;
    };

    // Perform search and filter selectedPlaces
    PlacesModel.prototype.search = function(keyword) {
        if(!keyword) {
            return;
        }
        // Clear current place selection
        this.currentPlace(null);

        // Hide all places markers
        this.places.forEach(function(place) {
            place.marker.setVisible(false);
        });

        // Search for the keyword
        keyword = keyword.toLowerCase();
        var filteredPlaces = this.places.filter(function(place) {
            return place.name.toLowerCase().indexOf(keyword) > -1 ||
                place.types.join(' ').toLowerCase().indexOf(keyword) > -1 ||
                place.address.toLowerCase().indexOf(keyword) > -1;
        });

        // Show filtered places markers
        filteredPlaces.forEach(function(place) {
            place.marker.setVisible(true);
        });
        this.selectedPlaces(filteredPlaces);
    };

    // Use Ajax JSONP request to get near by places.
    // Using Google Places API
    PlacesModel.prototype.loadGooglePlaces = function(latLng) {
        this.places.splice(0, this.places.length);
        this.placesService = new google.maps.places.PlacesService(app.mapObjects.map);
        // Load stores
        this._addGooglePlaces(latLng, 'store');
        // Load lodges
        this._addGooglePlaces(latLng, 'lodge');
        // Load restaurants
        this._addGooglePlaces(latLng, 'restaurant');
        // Load grocery
        this._addGooglePlaces(latLng, 'grocery');
        // Load hospitals
        this._addGooglePlaces(latLng, 'hospital');
        // Load parks
        this._addGooglePlaces(latLng, 'park');
    };

    PlacesModel.prototype._addGooglePlaces = function(latLng, type) {
        var request = {
            location: latLng,
            keyword: type,
            radius: '2000'
        };
        var self = this;
        self.placesService.nearbySearch(request, function(response) {
            response.forEach(function(googlePlace) {
                // If the place exists, add new type only
                var existingPlace = self.places.filter(function(place) {
                    return place.id == googlePlace.place_id;
                });
                if(existingPlace.length > 0) {
                    existingPlace[0].types.push(type);
                } else {
                    var newPlace = new app.models.place(googlePlace, type);
                    // Create marker and add it to place
                    var newMarker = self._createMarker(newPlace);
                    newPlace.setMarker(newMarker);
                    self.places.push(newPlace);
                    self.selectedPlaces.push(newPlace);
                }
            });
        });
    };

    PlacesModel.prototype._loadYelpDetails = function(place) {
        var terms = place.name;
        var near = place.latLng.lat() + ',' + place.latLng.lng();

        var self = this;

        // Construct Request Parameters
        var parameters = [];
        parameters.push(['term', terms]);
        parameters.push(['ll', near]);
        parameters.push(['callback', 'cb']);
        parameters.push(['oauth_consumer_key', self.yelp.consumerKey]);
        parameters.push(['oauth_consumer_secret', self.yelp.consumerSecret]);
        parameters.push(['oauth_token', self.yelp.accessToken]);
        parameters.push(['oauth_signature_method', self.yelp.serviceProvider.signatureMethod]);

        var message = {
            'action': self.yelp.url,
            'method': 'GET',
            'parameters': parameters
        };

        var accessor = {
            consumerSecret: self.yelp.consumerSecret,
            tokenSecret: self.yelp.accessTokenSecret
        };

        OAuth.setTimestampAndNonce(message);
        OAuth.SignatureMethod.sign(message, accessor);
        var parameterMap = OAuth.getParameterMap(message.parameters);
        parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);

        // Perform the ajax call.
        $.ajax({
            'url': message.action,
            'data': parameterMap,
            'cache': true,
            'dataType': 'jsonp',
            'jsonpCallback': 'cb',
            // 'headers': oauth.toHeader(oauth.authorize(message, token)),
            'success': function(data, textStats, XMLHttpRequest) {
                // Take the first object in the businesses array.
                if(data.businesses && data.businesses.length > 0) {
                    var yelpObj = new app.models.yelp(data.businesses[0]);
                    place.yelp(yelpObj);
                } else {
                    // No data found. Create No data object.
                    place.yelp(new app.models.yelp(null));
                }
            }
        });

        // Handle failure with timeout function
        setTimeout(function() {
            if(place.yelp() == null) {
                // Set yelp object with failure to get data message
                place.yelp(new app.models.yelp(null));
                place.yelp().noData = 'Failed to load Yelp Data';
            }
        }, 2000);
    };

    // Creates a marker for the place object.
    // It also handles marker animation and click handler
    PlacesModel.prototype._createMarker = function(place) {
        var marker = new google.maps.Marker({
            position: place.latLng,
            map: app.mapObjects.map
        });

        var self = this;

        // Set the marker icon to the first type
        marker.setIcon('img/' + place.types[0] + '.png');
        // Add click listener to marker
        marker.addListener('click', function() {
            // Close the side navigation
            self.mapModel.closeSideNav.call(self.mapModel);
            // Close InfoWindow from old location (if any is open)
            new google.maps.event.trigger(app.mapObjects.infowindow, 'closeclick');
            // Load yelp data
            self._loadYelpDetails(place);
            // Set Current Place to trigger bidning with current place
            self.currentPlace(place);

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

        return marker;
    };

    app.models.placesModel = PlacesModel;
})();