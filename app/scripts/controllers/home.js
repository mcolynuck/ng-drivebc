'use strict';

// Swap image src attribute
function swapImg (imgId, srcPath) {
	var el = $("#"+imgId);
	if (el) {
		el.attr("src", srcPath);
	}
}

/**
 * @ngdoc function
 * @name drivebcApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the drivebcApp
 */
angular.module('drivebcApp')
  .controller('HomeCtrl', function () {
  });
