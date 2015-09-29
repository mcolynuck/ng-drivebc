'use strict';

/**
 * @ngdoc function
 * @name formatWebcamJson
 * @description
 * Formats basic json array to include property names for DriveBC webcam data.
 */
function formatWebcamJson(data){
	var obj = [];

	for (var i = 0; i < data.length; i++){
		obj.push({
			    id: 							data[i][0],
			    title: 							data[i][1],
			    caption: 						data[i][2],
			    credit: 						data[i][3],
			    orientation: 					data[i][4],
			    latitude: 						data[i][5],
			    longitude: 						data[i][6],
			    shortmessage: 					data[i][7],
			    longmessage: 					data[i][8],
			    regionGroup: 					data[i][9],
			    regionHighwayGroup: 			data[i][10],
			    regionHighwayCameraOrder: 		data[i][11],
			    region: 						data[i][12],
			    highwayNumber: 					data[i][13],
			    highwayLocationDescription: 	data[i][14],
			    elevation: 						data[i][15],
			    weatherStation: 				data[i][16],
			    forecastID: 					data[i][17],
			    uploadPeriod: 					data[i][18],
			    isNew: 							(data[i][19] === "true" ? true : false),
			    isOnDemand: 					(data[i][20] === "true" ? true : false)
			});
	}
	return obj;
}


/**
 * @ngdoc function
 * @name appendWebcamLinks
 * @description
 * Appends image url and clickable link to json data
 */
function appendWebcamLinks(jsonArray){
	for (var i = 0; i < jsonArray.length; i++) {
		jsonArray[i].imgurl = 'http://images.drivebc.ca/bchighwaycam/pub/cameras/' + jsonArray[i].id + '.jpg';
		jsonArray[i].clickurl = 'http://images.drivebc.ca/bchighwaycam/pub/html/dbc/' + jsonArray[i].id + '.html';
	}
	return jsonArray;
}


/**
 * @ngdoc function
 * @name prepWebcamData
 * @description
 * Coordinates the process from raw json array data from DriveBC, calling other functions to generate a properly labeled json data file.
 */
function prepWebcamData(data){
	return appendWebcamLinks(formatWebcamJson(data));
}



/**
 * @ngdoc overview
 * @name drivebcApp
 * @description Module for webcam page
 */
angular.module('drivebcApp')
	/**
	 * @ngdoc controller
	 * @name drivebcApp.controller:WebcamsCtrl
	 * @description
	 * # WebcamsCtrl
	 * Controller of the drivebcApp webcam page
	 */
  .controller('WebcamsCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
	$scope.webcamData= [];
	$scope.webcamRegion = { region: ($routeParams.hasOwnProperty('region') ? $routeParams.region : "Vancouver Island")};	// default to Van. Is.

	$http.get('data/webcams.json').
		success(function(data) { 
	    	 $scope.webcamData = prepWebcamData(data);
		}).
		error(function(){
			console.error("Error loading webcam json data. ", arguments);
		});
  }]);