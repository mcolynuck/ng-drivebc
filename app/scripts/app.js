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
    'ngRoute',
    'map_directives'
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
  // })

  // .directive('mapCanvas', function() {
  //   return {
  //       restrict: 'A',
  //       link: function(scope, element) {
  //         var google = google || null;
  //         if (google) {
  //           var mapOptions = {
  //               zoom: 5,
  //               center: new google.maps.LatLng(54.8833,-122.6667)    // Change this to BC with correct zoom factor
  //           };
  //           new google.maps.Map(element[0], mapOptions);
  //         }
  //       }
  //   };
  });
