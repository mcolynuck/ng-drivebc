'use strict';

/**
 * @ngdoc function
 * @name drivebcApp.module:map_directives
 * @description
 * # map_directives
 * Directives for mapCtrl
 */
angular.module('grid_filter_directives', [])

	.directive('myFilterlist', function() {			// Checkboxes for event types
	    return {
			restrict: 'A',
			templateUrl: "templates/my-filterlist.html",
			scope: {
				filterData: "="
			},
			controller: function($scope){
				$scope.updateEventTypeFilter = function(id, value) {
// for(var i=0; i<$scope.filterData.filterDefs.length; i++){
// 	console.log($scope.filterData.filterDefs[i].id+" "+$scope.filterData.filterDefs[i].model);
// }
					$scope.filterData.filterService.updateFilterByName('eventType', id, value);
				};
			}
	    };
  	})

	.directive('myViewFilterlist', function() {			// Radio buttons like 'All', 'Area', 'Major'
	    return {
			restrict: 'A',
			templateUrl: "templates/my-viewfilterlist.html",
			scope: {
				radioFilterData: "="
			},
			controller: function($scope){
				$scope.updateViewFilter = function(id, value) {
console.log("updateViewFilter: "+id+", "+value);
console.log("radio model",$scope.radioFilterData.model);

/*
	NEED TO GROUP SELECTS IN FILTERDATA AND INDEX ON NAME/ID SO WE CAN FIND THE APPROPRIATE OPTIONS TO UPDATE THE FILTER WITH !!!!
*/
					// Set filter service with selected options, etc. so filtering takes place.
					// Find out if there is an selection property
					//   If so, check if a string value or object
					//     If object, pass the 'selectedOption' property value, otherwise the string
//					radioFilterData.filterService.updateFilterByName(id, values);

	// '' will clear filtering
	// 'severity' will filter severity
	// All others filter road base on data from dropdowns.

					// if(!id || id.length === 0) {	// 'All' selected or radios were all cleared.
					// 	$scope.radioFilterData.filterService.clearFilters(false);		// Clear all but 'eventType' filters						
					// }

					// $scope.radioFilterData.filterService.updateFilterByName(id, id, true);
					// console.log("allFilters:",$scope.radioFilterData.filterService.getAllFilters());
				};

				// Overwrite slected item at index with following item and repeat up the array to the end which will always have a blank (after the delete).
				$scope.deleteSelect = function(index) {
					for (var i = index; i < ($scope.radioFilterData.area.selectedOption.length - 1); i++) {
						$scope.radioFilterData.area.selectedOption[i] = $scope.radioFilterData.area.selectedOption[i+1];
					}
					$scope.radioFilterData.area.selectedOption[$scope.radioFilterData.area.selectedOption.length - 1] = {name: ""};

					// Update filter service with selections
				};
			}
	    };
  	})

;