'use strict';

/**
 * @ngdoc function
 * @name drivebcApp.module:map_directives
 * @description
 * # map_directives
 * Directives for mapCtrl
 */
angular.module('map_directives', [])
	.directive('mapCanvas', function() {
	    return {
	        restrict: 'A',
	        link: function(scope, element) {
	            var mapOptions = {
	                zoom: 5,
	                center: new google.maps.LatLng(54.8833,-122.6667)    // Change this to BC with correct zoom factor
	            };
	            new google.maps.Map(element[0], mapOptions);
	          }
	    };
  });