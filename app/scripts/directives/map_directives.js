'use strict';

/**
 * @ngdoc overview
 * @name drivebcApp.module:map_directives
 * @description Module for Map page.
 */
angular.module('map_directives', [])
	/**
	 * @ngdoc directive
	 * @name drivebcApp.module:map_directives:mapCanvas
	 * @restrict A
	 * @description
	 * # map_directives
	 * Directive for mapCtrl for Google map centered over British Columbia.
	 */
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