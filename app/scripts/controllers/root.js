'use strict';

/**
 * @ngdoc function
 * @name drivebcApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the drivebcApp
 */
angular.module('drivebcApp')
  .controller('RootCtrl', ['$scope', '$location', function ($scope, $location) {
  	$scope.isMap = false;
  	$scope.isMapPage = function(){
  		// True if map page is active
console.log("isMapPage");
return true;
  	};
  }]);