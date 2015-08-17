'use strict';

// Create img html based on event string value (case insensitive)
function setIconByType(evType){
  if(evType){
    var imgFile = "";
    if(evType.toLowerCase() == 'incident'){
      imgFile = "images/incident.png";
    } else if (evType.toLowerCase() == 'future planned'){
      imgFile = "images/blue-cone.png";
    } else if (evType.toLowerCase() == 'current planned'){
      imgFile = "images/red-cone.png";
    } else if (evType.toLowerCase() == 'road condition'){
      imgFile = "images/road.png";
    } else {
      return evType;
    }
    return '<img src="'+imgFile+'" title="'+evType+'" alt="'+evType+'"/>';
  } else {
    return evType;
  }
}


// Formats basic json array to include property names
function formatEventJson(data){
  var obj = [];

  for (var i = 0; i < data.length; i++){
    obj.push({
      title:            data[i][0],
      latitude:         parseFloat(data[i][1]),
      longitude:        parseFloat(data[i][2]),
      district:         data[i][3],
      road:             data[i][4],
      direction:        data[i][5],
      eventType:        data[i][6],
      severity:         data[i][7],
      lastUpdated:      '' + new Date(data[i][8]).toLocaleString(),
      description:      data[i][9],
      ateid:            data[i][10],
      trafficPattern:   data[i][11],
      popularRoute:     data[i][12]
    });
  }
  return obj;
}


// Perform any data manipulation after formatting the json data
function prepEventData(data){
  return formatEventJson(data);
}



/**
 * @ngdoc function
 * @name drivebcApp.controller:ListCtrl
 * @description
 * # ListCtrl
 * Controller of the drivebcApp
 */
angular.module('drivebcApp')
  .controller('ListCtrl', ['$scope', '$http', '$sce', function ($scope, $http, $sce) {

    $http.get('data/events.json').
      success(function(data) { 
         var eventData = prepEventData(data);
         $scope.gridOptions.rowData = eventData;       
//         $scope.gridOptions.api.onNewRows();
    }).
    error(function(){
      console.error("Error loading event json data. ", arguments);
    });

    var columnDefs = [
// Could add min/max width, sort & sort comparitor, hide, etc.
        {label: "Type",         field: "eventType",   width: "5%", isMultiline: false, cellRenderer: function(data){return $sce.trustAsHtml(setIconByType(data.eventType));}},
        {label: "Severity",     field: "severity",    width: "10%", isMultiline: false},
        {label: "Route",        field: "road",        width: "12%", isMultiline: false},
        {label: "Description",  field: "description", width: "58%", isMultiline: true},
        {label: "Last Updated", field: "lastUpdated", width: "15%", isMultiline: false}
    ];

    $scope.gridOptions = {
        columnDefs: columnDefs,
        rowData: null
    };

  }]);
