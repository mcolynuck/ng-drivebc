'use strict';

// Create img html based on event string value (case insensitive)
function setIconByType(evType){
  if(evType){
    var imgFile = "";
    if(evType.toLowerCase() === 'incident'){
      imgFile = "images/incident.png";
    } else if (evType.toLowerCase() === 'future planned'){
      imgFile = "images/blue-cone.png";
    } else if (evType.toLowerCase() === 'current planned'){
      imgFile = "images/red-cone.png";
    } else if (evType.toLowerCase() === 'road condition'){
      imgFile = "images/road.png";
    } else {
      return evType;
    }
    return '<img src="'+imgFile+'" title="'+evType+'" alt="'+evType+'"/>';
  } else {
    return evType;
  }
}


// Parse date string from event date and create local-specific string.
function localeDateFromString(dateStr) {
  if(dateStr && dateStr.trim().length > 0) {
    var parts = dateStr.split(' '),
        calParts = parts[0].split('-'),
        timeParts = parts[1].split(':');
    return new Date(calParts[0], calParts[1], calParts[2], timeParts[0], timeParts[1], timeParts[2]).toLocaleString();
  } else {
    return " ";
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
      lastUpdated:      localeDateFromString(data[i][8]),
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

// In progress animation during data load
function run_inProgress(){
  $('#gridData').waitMe({
      effect: "bounce",
      text: 'Loading event data...',
      bg: 'rgba(255,255,255,0)',
      color: '#000'
  });
}



/**
 * @ngdoc function
 * @name drivebcApp.controller:ListCtrl
 * @description
 * # ListCtrl
 * Controller of the drivebcApp
 */
angular.module('drivebcApp')
  .controller('ListCtrl', ['$scope', '$http', '$sce', 'gridFilter', function ($scope, $http, $sce, gridFilter) {

    run_inProgress();   // Start progress indicator


    // Called when checkbox clicked to set filterData array.
    $scope.selEvFilt = function (data) {
      $scope.gridOptions.filterData = data;
    };



    $http.get('data/events.json').
      success(function(data) { 
         var eventData = prepEventData(data);
        $scope.gridOptions.rowData = eventData;
        $('#gridData').waitMe('hide');      // Hide progress indicator
    }).
    error(function(){
      $('#gridData').waitMe('hide');        // Hide progress indicator
      console.error("Error loading event json data. ", arguments);
    });


    var columnDefs = [
// Could add min/max width, sort comparitor function, hide, etc.
        {label: "Type",         field: "eventType",   width: "7%",  isMultiline: false, sort: true, cellRenderer: function(data){return $sce.trustAsHtml(setIconByType(data.eventType));}, filterBy: $scope.eventTypeFilters},
        {label: "Severity",     field: "severity",    width: "7%",  isMultiline: false, sort: true},
        {label: "Route",        field: "road",        width: "13%", isMultiline: false, sort: true},
        {label: "Description",  field: "description", width: "58%", isMultiline: true,  sort: true},
        {label: "Last Updated", field: "lastUpdated", width: "15%", isMultiline: false, sort: true}
    ];

    $scope.gridOptions = {
        columnDefs: columnDefs,
        rowData: null,     // Retreived in http.get call from external source
        filterService: gridFilter
    };


    var filterDefs = [
      { id:"road condition",  model: "", trueVal: "true", falseVal: "false", image: 'images/road.png',      label: "Road Condition"},
      { id:"incident",        model: "", trueVal: "true", falseVal: "false", image: 'images/incident.png',  label: "Incident"},
      { id:"current planned", model: "", trueVal: "true", falseVal: "false", image: 'images/red-cone.png',  label: "Currrent Planned Event"},
      { id:"future planned",  model: "", trueVal: "true", falseVal: "false", image: 'images/blue-cone.png', label: "Future Planned Event"}
    ];

    $scope.filterCheckboxes = {
        filterDefs: filterDefs,
        filterService: gridFilter
    }
  }])
;