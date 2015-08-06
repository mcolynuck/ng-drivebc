'use strict';

/**
 * @ngdoc overview
 * @name drivebcApp
 * @description
 * # drivebcApp
 *
 * Main module of the application.
 */
angular
  .module('drivebcApp', [
    // 'ngAnimate',
    // 'ngResource',
    'ngRoute'
    // ,
    // 'ngSanitize'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/map', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        controllerAs: 'map'
      })
      .when('/list', {
        templateUrl: 'views/list.html',
        controller: 'ListCtrl',
        controllerAs: 'list'
      })
      .when('/webcams', {
        templateUrl: 'views/webcams.html',
        controller: 'WebcamsCtrl',
        controllerAs: 'webcams'
      })
      .when('/links', {
        templateUrl: 'views/links.html',
        controller: 'LinksCtrl',
        controllerAs: 'links'
      })
      .when('/help', {
        templateUrl: 'views/help.html',
        controller: 'HelpCtrl',
        controllerAs: 'help'
      })
      .otherwise({
        redirectTo: '/'
      });
  })

  .directive('mapCanvas', function() {
    return {
        restrict: 'EA',
        link: function(scope, element) {
          console.log("linking div");
            var mapOptions = {
                zoom: 8,
                center: new google.maps.LatLng(-34.397, 150.644)    // Change this to BC with correct zoom factor
            };
            new google.maps.Map(element[0], mapOptions);
        }
    };
});
