'use strict';

// Swap image src attribute
/**
 * @ngdoc function
 * @name swapImg
 * @description
 * Changes the image src content for an img tag id.
 * Example
 * swapImg ("logo", "http://billmurray.com/100/100");
 */
function swapImg (imgId, srcPath) {
	var el = $("#"+imgId);
	if (el) {
		el.attr("src", srcPath);
	}
}

/**
 * @ngdoc overview
 * @name drivebcApp
 * @description
 * # HomeCtrl
 * Module for home / welcome page
 */
angular.module('drivebcApp')
	/**
	 * @ngdoc controller
	 * @name drivebcApp.controller:HomeCtrl
	 * @description
	 * # HomeCtrl
	 * Controller of the drivebcApp home / welcome page
	 */
  .controller('HomeCtrl', function () {
  });
