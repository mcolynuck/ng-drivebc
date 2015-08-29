'use strict';

// Parse the json into the expected format
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


// Tasked with loading data from source and resolving promise with formatted data.
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
 * @ngdoc function
 * @name drivebcApp.controller:LinksCtrl
 * @description
 * # LinksCtrl
 * Controller of the drivebcApp
 */
angular.module('drivebcApp')
  .controller('LinksCtrl', ['$scope', '$http', '$q', function ($scope, $http, $q) {
  	var defer = $q.defer();
  	$scope.links = {};

  	loadData($http, defer);

  	defer.promise.then(function(data){
  		$scope.links.data = data;		// Set with data once loaded
  	});
  }])
;