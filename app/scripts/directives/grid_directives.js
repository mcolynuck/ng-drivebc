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
	        	$scope.curSortCol = "";				// Column currently sorting by
	        	$scope.isDescendingSort = false;	// Is column sorted in descending order?	        	

	        	$scope.setSortBy = function(column){
	        		var colDef = null;
	        		for (var x=0; x < $scope.gridOptions.columnDefs.length; x++) {
	        			if ($scope.gridOptions.columnDefs[x].field === column) {
	        				colDef = $scope.gridOptions.columnDefs[x];	// Shorten var name for ease of use

			        		// Does this column have sorting functionality configured?
			        		if (colDef.sort !== 'undefined') {
				        		if (colDef.sort === true) {
					        		// Check first if gridOptions.columnDefs.sort is true for this field
					        		if ($scope.curSortCol === column){
					        			// Flip sort ordering
					        			if ($scope.isDescendingSort) {	// Sort ascending
					        				$scope.isDescendingSort = false;
						        			$scope.sortCol = $scope.curSortCol;
					        			} else {					// Sort descending
					        				$scope.isDescendingSort = true;
						        			$scope.sortCol = '-' + $scope.curSortCol;
					        			}
					        		} else {
					        			$scope.isDescendingSort = false;		// New column sort has ascending by default
					        			$scope.sortCol = column;
					        		}
					        		
					        		// TODO: If sorting, do they provide the sorting function?

					        		// Save for later use
					        		$scope.curSortCol = column;
				        		} else {
				        			// Not sortable as defined by user.
				        		}
			        		} else {
			        			// No sorting option defined, so default to not allowing it.
			        		}
	        			}
	        		}
	        	};
	        }
	    };
  	})

	.filter('eventTypeFilter', function () {	// Custom filter for array input with property 'age'.  Default age is 18
		return function (data, filterService) {
	      	// Create array of selected items to filter with
	      	var selectedTypes = [],
	      		filterData = filterService.getFilterArray();

	      	for (var x in filterData) {
	      		if(filterData[x].length > 0) {
	          		selectedTypes.push(filterData[x]);
	      		}
	      	}

	      	// If we have data and something to filter with
			if (data && selectedTypes.length > 0){
				var retArray = [];

				for(var i=0; i < data.length; i++){
					if(selectedTypes.indexOf(data[i].eventType.toLowerCase()) >= 0){
						retArray.push(data[i]);
					}
				}
				return retArray;				
			}
			return data;	// Nothing to be filtered
		};
	})
;