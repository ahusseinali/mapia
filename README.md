# Mapia
Mapia is an interactive map about whats going on around you. It looks for interesting stories and places around you and display them on a Google Map.

## Installation
1. Download the respository.
2. (_Optional_)You can use your keys for Google Maps API and Yelp API or use the current keys.
2. Open _./dist/index.html_ in your browser (Compatible with recent browsers).

### Rebuild Instructions
1. Run `npm init` to install dependencies.
2. Run `gulp` to generate _./dist_ directory.

## Features
1. Display full size **Google Map** of my neighborhoud (Bellevue, WA, USA).
2. Get places of interest from **Google Places API** (__Restaurants, Hotels, Stores, Groceries, Hospitals__).
3. Get more details about a place when you click on its marker.
4. Place details are retrieved from **Google Places API, Google Street View Image, Yelp API**.
5. List of all the places on side navigation list.
6. Search and automatic result filteration capability.
7. Search includes results found in: _Name, Address, Place Category_.
8. Place details can be opened by selecting it from the search results.

## Known Issues
1. Places are fixed to a certain location, they don't change when you zoom in,out or drag to another place.
2. Street View Image is not accurate for some places.
3. Infowindow have some styling issues.

## Future Work
1. Use Foursquare API for more Place details.
2. Use Twitter API for more place details.
3. Use MediaWiki API for more place details.
4. Use News APIs for more place details.
5. Change list of places with the change of center point (by dragging to another place).
6. Add buttons for the categories of places (e.g. Restaurants, Hotels, etc..) and allow automatic filteration of categories with selecting/unselecting categories.
7. Add buttons to select types of details (e.g. Yelp, FourSquare, Twitter, etc..)
8. Add News Feed feature to display a collection of details and news for all surrounding places.