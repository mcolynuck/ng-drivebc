'use strict';

/**
 * @ngdoc function
 * @name drivebcApp.controller:RootCtrl
 * @description
 * # MainCtrl
 * Controller of the drivebcApp
 */
angular.module('drivebcApp')
  .controller('RootCtrl', ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {
    $scope.isMouseover = false;

    $scope.hover = function(){
      console.log("hover");
      
    };

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