'use strict';


/**
 * @ngdoc function
 * @name drivebcApp.module:map_directives
 * @description
 * # map_directives
 * Directives for mapCtrl
 */
angular.module('grid_directives', [])

	.directive('myGrid', function() {		// Data table grid
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


	.filter('gridFilter', function () {		// Custom filter
		return function (data, filterService) {

			if(data && data.length > 0){	// Any data to filter?

				var resultArray = [],								// What we will return
					filterObj = filterService.getFilterObject(),	// What we filter against
					resultObj = {};									// Hash list to prevent duplicates from multliple filters matching a record

				if(filterObj && Object.keys(filterObj).length > 0) {	// Anything to filter with?

					for(var i=0; i < data.length; i++){			// Loop over data and compare with filter
						for (var field in filterObj) {
							try {
								if(typeof data[i][field] === 'string') {
									if(filterObj[field].indexOf(data[i][field].toLowerCase()) >= 0){		// Does column value match filter value?
										resultObj[i] = data[i];
									}
								} else {	// Assume array
									for(var item in data[i][field]) {
										if(filterObj[field].indexOf(data[i][field][item].toLowerCase()) >= 0){		// Does column value match filter value?
											resultObj[i] = data[i];
										}										
									}
								}
							} catch (err) {
								console.log("data: ",data[i]);
								console.error("field: ["+field+"]  loop: "+i+"  filterObj:",filterObj);
								console.error(err);
								return data;
							}
						}
					}
					for (var key in resultObj){				// Put hash list into array format for return.
						resultArray.push(resultObj[key]);
					}
				} else {
					resultArray = data;		// No filter or filter has no data to filter with yet.
				}
			} else {
				resultArray = [];	// No data provided so return empty array.
			}

			return resultArray;			
		};
	})
;