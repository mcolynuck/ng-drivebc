'use strict';

/**
 * @ngdoc function
 * @name drivebcApp.module:map_directives
 * @description
 * # map_directives
 * Directives for mapCtrl
 */
angular.module('grid_filter_directives', [])

	.directive('myFilterlist', function() {
	    return {
			restrict: 'A',
			templateUrl: "templates/my-filterlist.html",
			scope: {
				filterData: "="
			},
			controller: function($scope){
				$scope.updateFilter = function(id, value) {
					$scope.filterData.filterService.updateFilter(id, value);
				};
			}
	    };
  	})
;