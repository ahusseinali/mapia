var app = app || {};
app.models = app.models || {};

(function() {
    'use strict';

    var PlacesModel = function() {
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
    };

    PlacesModel.prototype.toString = function() {
        return this.selectedPlaces().length;
    }

    PlacesModel.prototype.isPlaceSelected = function(place) {
        return this.isAnyPlaceSelected() && place.id == this.currentPlace().id;
    };

    PlacesModel.prototype.isAnyPlaceSelected = function() {
        return this.currentPlace() != null;
    };

    // Perform search and filter selectedPlaces
    PlacesModel.prototype.search = function(keyword) {
        if(!keyword) {
            return;
        }
        keyword = keyword.toLowerCase();
        var filteredPlaces = this.places.filter(function(place) {
            return place.name.toLowerCase().indexOf(keyword) > -1 ||
                place.types.join(' ').toLowerCase().indexOf(keyword) > -1 ||
                place.address.toLowerCase().indexOf(keyword) > -1;
        });
        console.log(filteredPlaces);
        this.selectedPlaces(filteredPlaces);
    }

    // Use Ajax JSONP request to get near by places.
    // Using Google Places API
    PlacesModel.prototype.loadGooglePlaces = function(latLng) {
        this.places.splice(0, this.places.length);
        this.placesService = new google.maps.places.PlacesService(app.mapObjects.map);
        // Load stores
        this.addGooglePlaces(latLng, 'store');
        // Load lodges
        this.addGooglePlaces(latLng, 'lodge');
        // Load restaurants
        this.addGooglePlaces(latLng, 'restaurant');
        // Load grocery
        this.addGooglePlaces(latLng, 'grocery');
        // Load hospitals
        this.addGooglePlaces(latLng, 'hospital');
        // Load parks
        this.addGooglePlaces(latLng, 'park');
    };

    PlacesModel.prototype.addGooglePlaces = function(latLng, type) {
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
                    self.places.push(newPlace);
                    self.selectedPlaces.push(newPlace);
                }
            });
        });
    };

    PlacesModel.prototype.loadYelpDetails = function(place) {
        var terms = place.name;
        var near = place.latLng.lat() + ',' + place.latLng.lng();
        var accessor = {
            consumerSecret: this.yelp.consumerSecret,
            tokenSecret: this.yelp.accessTokenSecret
        };
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
            'success': function(data, textStats, XMLHttpRequest) {
                // Take the first object in the businesses array.
                if(data.businesses && data.businesses.length > 0) {
                    var yelpObj = new app.models.yelp(data.businesses[0]);
                    place.yelp(yelpObj);
                }
            }
        });
    };

    app.models.placesModel = PlacesModel;
})();