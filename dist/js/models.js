var app = app || {};
app.models = app.models || {};

(function() {
    'use strict';

    var MapModel = function() {
        this.center = ko.observable(new google.maps.LatLng(47.6163, -122.192));
        this.zoom = ko.observable(15);
        this.styles = ko.observable(app.models.mapStyles.grayscale);
        this.places = new app.models.placesModel();
        // Indicates if the sideNav should be visible or not.
        this.sideNavVisible = ko.observable(false);
    };

    // Perform search and result filteration.
    MapModel.prototype.search = function(keyword) {
        // Pass the search to the placesModel
        this.places.search(keyword);
    };

    MapModel.prototype.openSideNav = function() {
        this.sideNavVisible(true);
    }

    MapModel.prototype.closeSideNav = function() {
        this.sideNavVisible(false);
    }

    // Specify the map initialization options
    app.models.mapModel = new MapModel();
})();
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
var app = app || {};
app.models = app.models || {};

(function() {
    'use strict';

    // Initialized using Google Places Result
    var Place = function(googlePlace, type) {
        var location = googlePlace.geometry.location;
        this.id = googlePlace.place_id;
        this.latLng = location;
        this.name = googlePlace.name;
        this.address = googlePlace.vicinity;
        this.rating = googlePlace.rating;
        // Use Google street view API
        this.img = 'https://maps.googleapis.com/maps/api/streetview?' +
           'size=350x250&heading=151.78&pitch=-0.76&location=' + location.lat() +',' + location.lng() +
           '&key=' + googleMapsKey;
        this.types = [type];
        // This is to be filled with the yelp result.
        this.yelp = ko.observable(null);
    };

    Place.prototype._getStreetViewImage = function() {
        var url
    }

    Place.prototype.hasYelpData = function() {
        return this.yelp() != null;
    };

    app.models.place = Place;
})();
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
        parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)

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
                }
            }
        });
    };

    app.models.placesModel = PlacesModel;
})();
var app = app || {};
app.models = app.models || {};

(function() {
    var YelpDetails = function(yelpObj) {
        this.img = yelpObj.image_url;
        this.rating = yelpObj.rating_img_url;
        this.url = yelpObj.url;
        this.snippet = yelpObj.snippet_text;
    };

    app.models.yelp = YelpDetails;
})();