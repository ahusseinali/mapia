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