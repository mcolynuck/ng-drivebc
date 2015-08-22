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

				// Set filter with values to filter on
				$scope.updateEventTypeFilter = function(dataObj) {
					var arr = [];
					for(var prop in dataObj){
						if(dataObj[prop]) {		// Create array so we call filter service once for all values to filter with.
							arr.push(prop);
						}
					}

					// Update filter with results, if any found.
					if (arr.length > 0) {
						$scope.filterData.filterService.bulkUpdateFilterByName('eventType', arr);
					} else {
						$scope.filterData.filterService.clearFilterByName('eventType');		// No data so clear it from filter.
					}

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

				// Set the filter with the field and values to filter on
				$scope.updateViewFilter = function(colDefId) {	// i.e. 'all', 'route', 'popular', etc.

					// Start by clearing existing radio button filters.
					for(var x=0; x<$scope.radioFilterData.filterDefs.length; x++) {
						$scope.radioFilterData.filterService.clearFilterByName($scope.radioFilterData.filterDefs[x].field);
					}
					
					// Loop to find column definition match by id and set filter with selections or value (no selections configured)
					for(var x=0; x<$scope.radioFilterData.filterDefs.length; x++) {
						if($scope.radioFilterData.filterDefs[x].id == colDefId) {		// Match id?
							var field = $scope.radioFilterData.filterDefs[x].field;

							if (field.trim() == '') {
								break;		// No filtering to be set.
							}

							if($scope.radioFilterData.filterDefs[x].selected) {
								// Loop through selected items and add to filter
								for(var i=0; i < $scope.radioFilterData.filterDefs[x].selected.length; i++) {
									$scope.radioFilterData.filterService.updateFilterByName(
										field, 
										$scope.radioFilterData.filterDefs[x].selected[i].name.toLowerCase(), 
										true);
								}
							} else {
								// Just use value as this doesn't have a select dropdown
								$scope.radioFilterData.filterService.updateFilterByName(
									field, 
									$scope.radioFilterData.filterDefs[x].value.toLowerCase(), 
									true);								
							}
							break;		// No need to keep looping.
						}
					}
				};

				// Shift data from higher indexes down over top of the one we're deleting (if not the lst one...)
				$scope.deleteSelect = function(listName, index) {
					var valDeleted = "",	// Value being deleted
						field = "";			// Grid field value is associated with

					for (var x = 0; x < $scope.radioFilterData.filterDefs.length; x++) {
						if ($scope.radioFilterData.filterDefs[x].id == listName) {		// Find matching config item by its id.

							// Save for use later.
							valDeleted = $scope.radioFilterData.filterDefs[x].selected[index].name;
							field = $scope.radioFilterData.filterDefs[x].field;

							// Shift data down over the index we're blowing away.
							for (var i = index; i < ($scope.radioFilterData.filterDefs[x].selected.length - 1); i++) {
								$scope.radioFilterData.filterDefs[x].selected[i] = $scope.radioFilterData.filterDefs[x].selected[i+1];
							}
							// Blow away the end one.
							$scope.radioFilterData.filterDefs[x].selected[$scope.radioFilterData.filterDefs[x].selected.length - 1] = {name: ""};
							break;	// No need to keep looping
						}
					}

					// Update filter service by deleting item in question.
					if(valDeleted && valDeleted.trim().length !== 0 && field) {
						$scope.radioFilterData.filterService.updateFilterByName(field, valDeleted.toLowerCase(), false);
					}
				};
			}
	    };
  	})
;