'use strict';

/**
 * @ngdoc overview
 * @name drivebcApp
 * @description Module for Root level of website
 */
angular.module('drivebcApp')
  /**
   * @ngdoc controller
   * @name drivebcApp.controller:RootCtrl
   * @description
   * # MainCtrl
   * Controller of the drivebcApp at the root level.
   * Monitors route changes to update left-nav icons to relect the active page content.
   * Handles click events on left-nave icons to drive content.
   */
  .controller('RootCtrl', ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {
    $scope.isMouseover = false;

    $rootScope.$on( "$routeChangeStart", function(event, next) {
      if(next.controllerAs && next.controllerAs.length > 0){
        $scope.activeNavId = next.controllerAs;
      } else {
        $scope.activeNavId = "home";  // default
      }
    });

  	$scope.toPage = function(name){
  		$location.path("/"+name);
  	};

    $scope.btnImg = '';
    $scope.change_img = function(imgFile){
      $scope.btnImg = imgFile;
    };
  }])
;