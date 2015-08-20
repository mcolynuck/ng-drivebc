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
				// Update the filter service data
				// @id - tablel column to be filtered
				// @value - filter object name to get selected list
				$scope.updateViewFilter = function(id, value) {		// i.e. ('road', 'popular')
console.log("updateViewFilter: "+id+", "+value);
console.log("radio model:",$scope.radioFilterData.model);

					for(var x=0; x<$scope.radioFilterData.selectList.length; x++) {
						if($scope.radioFilterData.selectList[x].name == value) {
// TODO: Add a filter group with selected items, but these times are a group of roads:
// 		areas (areas.json) = event.district
// 		route (highways.json) = event.highway
// 		popular (popularRoutes) = highways.name = event.highway
// 		ferry (ferries.json) = event.highway
							// $scope.radioFilterData.filterService.updateFilterByName(id, value, $scope.radioFilterData.selectList[x].options.selectd);
						}
					}


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
				$scope.deleteSelect = function(listName, index) {
console.log("deleteSelect");
					for (var x = 0; x < $scope.radioFilterData.selectList.length; x++) {
						if($scope.radioFilterData.selectList[x].name == listName) {
							for (var i = index; i < ($scope.radioFilterData.selectList[x].options.selected.length - 1); i++) {
								$scope.radioFilterData.selectList[x].options.selected[i] = $scope.radioFilterData.selectList[x].options.selected[i+1];
							}
							$scope.radioFilterData.selectList[x].options.selected[$scope.radioFilterData.selectList[x].options.selected.length - 1] = {name: ""};							
						}
					}
					// Update filter service with selections
				};
			}
	    };
  	})
;