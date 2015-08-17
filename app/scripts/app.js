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
    'map_directives', 
    'grid_directives',
    'ngSanitize'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'home'              // <= Used to set active nav button using name matching.
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
  });
