'use strict';

/**
 * @ngdoc function
 * @name drivebcApp.module:map_directives
 * @description
 * # map_directives
 * Directives for mapCtrl
 */
angular.module('grid_directives', [])
	.directive('myGrid', function() {
	    return {
	        restrict: 'A',
	        templateUrl: "templates/my-grid.html",
	        scope: {
	        	gridOptions: "="
	        }
	    };
  });