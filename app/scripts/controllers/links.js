'use strict';

/**
 * @ngdoc function
 * @name prepLinkData
 * @description
 * Parse the json into the expected format.
 */
function prepLinkData(data) {
	var result = [];
	if (data) {
	  	for (var i = 0; i < data.length; i++){
			var inner = [];
			for (var j=0; j<data[i]['item'].length; j++) {
				inner.push({
					column: i,
					title: data[i]['item'][j].title,
					links: data[i]['item'][j].links
				})
			}
			result[i] = inner;
	  	}
	}
	return result;
}


/**
 * @ngdoc function
 * @name loadData
 * @description
 * Tasked with loading data from source and resolving promise with formatted data.
 */
function loadData(http, defer) {
    http.get('data/links.json').
      success(function(data) {
        var output = prepLinkData(data);
        defer.resolve(output);    // Resolve promise
    }).
    error(function(){
      alert("Error loading links json data.\n" + arguments);
      defer.resolve();    // Resolve promise
    });
}


/**
 * @ngdoc overview
 * @name drivebcApp
 * @description
 * Module for Links page
 */
angular.module('drivebcApp')
  /**
   * @ngdoc controller
   * @name drivebcApp.controller:LinksCtrl
   * @description
   * # LinksCtrl
   * Controller of the drivebcApp
   */
  .controller('LinksCtrl', ['$scope', '$http', '$q', function ($scope, $http, $q) {
  	var defer = $q.defer();
  	$scope.links = {};

  	loadData($http, defer);

  	defer.promise.then(function(data){
  		$scope.links.data = data;		// Set with data once loaded
  	});
  }])
;