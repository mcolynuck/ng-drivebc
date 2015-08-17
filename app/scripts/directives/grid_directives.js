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
	        },
	        controller: function($scope){
/*
	Sorting needs to be fleshed out.  
	Use ng-click fnc call (as it does now), or using comparitor function that is optionally proided by user in columnDefs.
	Clicking on same column should set reverse ordering (compare with previous col name)
*/
	        	$scope.sortCol = "";
	        	$scope.setSortBy = function(colField){
	        		// Check first if gridOptions.columnDefs.sort is true for this field
	        			// If sorting, do they provide the sorting function?

	        		// Sort by this column
	        		$scope.sortCol = colField;
	        	}
	        }
	    };
  });