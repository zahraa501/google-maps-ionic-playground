// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
 
  $stateProvider
  .state('map', {
    url: '/',
    templateUrl: 'templates/map.html',
    controller: 'MapCtrl'
  });
 
  $urlRouterProvider.otherwise("/");
 
})

.controller('MapCtrl', function($scope, $state, $cordovaGeolocation) {
  var options = {timeout: 10000, enableHighAccuracy: true};
  var markerLocation;
  var geocoder = new google.maps.Geocoder;
  var infoWindow = new google.maps.InfoWindow;
  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
    var self = this;
    markerLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    setPositionInformation(markerLocation);
    var mapOptions = {
      center: markerLocation,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    //renders map
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    google.maps.event.addListener($scope.map, 'idle', function(){
      var marker = new google.maps.Marker({
            map: $scope.map,
            animation: google.maps.Animation.DROP,
            position: markerLocation 
        });      
          google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open($scope.map, marker);
      });
    });
  }, function(error){
    console.log("Could not get location");
  });

  $scope.searchValue = "";
  $scope.findLocation = function() {
    geocoder.geocode({'address': $scope.searchValue}, function(results, status) {
        if(status === "OK") {
           if (results[0]) {
              resetPosition(results[0].geometry.location);
              setMarker(results[0].geometry.location);
              infoWindow.setContent(results[0].formatted_address);
           } 
        } 
    });
  };

  var setPositionInformation = function(location) {
    geocoder.geocode({'location': location}, function(results, status) {
        if(status === "OK") {
           if (results[0]) {
              infoWindow.setContent(results[0].formatted_address);
           } 
        } 
    });
  };
  var resetPosition = function(location) {
    $scope.map.setCenter(location);
  };
  var setMarker = function(location) {
    markerLocation = location;
  }
});

