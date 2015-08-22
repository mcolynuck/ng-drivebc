'use strict';

// Utility Functions =================================================

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
function prepEventData(data){
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



// Convert array data to object with property names.
function prepFerryData(data){
  var obj = [];

  for (var i = 0; i < data.length; i++) {
    obj.push({
      name:       data[i][0],
      latitude:   data[i][1],
      longitude:  data[i][2],
      link:       data[i][3]
    });
  }
  return obj;
}


// Starts the progress indicator animation.
function run_inProgress(){
  $('#gridData').waitMe({ effect: "bounce", text: 'Loading event data...', bg: 'rgba(255,255,255,0)', color: '#000' });
}


// Load external data for the grid and filtering options.
// defer.process called at end of loading event data as it is the largest data file.
function loadExternalData(scope, http, defer){

    // POPULAR ROUTES
    http.get('data/popularroutes.json').
      success(function(data) { 
        scope.popularJson = data;   // {name: "", segments: [{hwy: "", start: 123, end: 123}]}
    }).
    error(function(msg){
      $('#gridData').waitMe('hide');        // Hide progress indicator
      alert("Error loading popular route json data.\n" + msg);
    });


    // INLAND FERRIES (aka road in event data)
    http.get('data/ferries.json').
      success(function(data) { 
         var objArray = prepFerryData(data);
         scope.ferryJson = objArray;  // {name: "", longitude: "", latitude: "", link: ""}
    }).
    error(function(msg){
      $('#gridData').waitMe('hide');        // Hide progress indicator
      alert("Error loading inland ferry json data.\n" + msg);
    });


    // ROUTES (aka road in event data)
    http.get('data/highways.json').
      success(function(data) { 
        scope.routeJson = data;   // {name: "", road1: "", road2: ""}
    }).
    error(function(msg){
      $('#gridData').waitMe('hide');        // Hide progress indicator
      alert("Error loading event json data.\n" + msg);
    });


    // AREAS (aka district in event data)
    http.get('data/areas.json').
      success(function(data) { 
        scope.areaJson = data;   // {name: "value"}
    }).
    error(function(msg){
      $('#gridData').waitMe('hide');        // Hide progress indicator
      alert("Error loading area json data.\n" + msg);
    });


    // EVENT DATA
    // Largest file so use it to hide the progress indicator when done or error.
    http.get('data/events.json').
      success(function(data) { 
         var eventData = prepEventData(data);
        scope.eventJson = eventData;
        defer.resolve();    // Resolve promise
    }).
    error(function(){
      alert("Error loading event json data.\n" + arguments);
      defer.resolve();    // Resolve promise
    });  
}

// End of utility functions ========================================


/**
 * @ngdoc function
 * @name drivebcApp.controller:ListCtrl
 * @description
 * # ListCtrl
 * Controller of the drivebcApp
 */
angular.module('drivebcApp')
  .controller('ListCtrl', ['$scope', '$http', '$sce', '$q', 'gridFilter', function ($scope, $http, $sce, $q, gridFilter) {

    run_inProgress();   // Start progress gif indicator


    // =======================================================================================
    // Table content configuration

    // label - Text label for column header
    // field - Field the column data relates to
    // width - Size of column (px, em, %, etc.)
    // isMultiline - Will column display wrapped text over one or more lines?
    // cellRenderer - Function that generates html to use in place of regular column data text.
    var columnDefs = [
// Could add min/max width, sort comparitor function, filtering, etc.
        { label: "Type",         field: "eventType",   width: "7%",  isMultiline: false, sort: true, cellRenderer: function(data){return $sce.trustAsHtml(setIconByType(data.eventType));} },
        { label: "Severity",     field: "severity",    width: "7%",  isMultiline: false, sort: true },
        { label: "Route",        field: "road",        width: "13%", isMultiline: false, sort: true },
        { label: "Description",  field: "description", width: "58%", isMultiline: true,  sort: true },
        { label: "Last Updated", field: "lastUpdated", width: "15%", isMultiline: false, sort: true },
        { label: "District",     field: "district",    width: "0%",  isHidden: true}     // Filtering on this so need to load it and hide from view.
    ];

    $scope.gridOptions = {
        columnDefs: columnDefs,     // Column display and meta information
        rowData: null,              // Retreived in http.get call from external source
        filterService: gridFilter   // Service to communicate selections between directive and filter
    };


    // =======================================================================================
    // Checkbox filtering configuration

    $scope.checkboxVals = {"road condition": true, "incident": true, "current planned": true, "future planned": true};
    
    // id - Unique id for each item.
    // model_prop - Property name in 'checkboxVals' model for each item.
    // trueVal - Value in model for property when checkbox checked.
    // falseVal - Value in model for property when checkbox unchecked.
    // image - Image next to label
    // label - Text label next to checkbox
    var filterCheckboxDefs = [
      { id:"road condition",  model_prop: "road condition",  trueVal: "true", falseVal: "false", image: 'images/road.png',      label: "Road Condition"},
      { id:"incident",        model_prop: "incident",        trueVal: "true", falseVal: "false", image: 'images/incident.png',  label: "Incident"},
      { id:"current planned", model_prop: "current planned", trueVal: "true", falseVal: "false", image: 'images/red-cone.png',  label: "Currrent Planned Event"},
      { id:"future planned",  model_prop: "future planned",  trueVal: "true", falseVal: "false", image: 'images/blue-cone.png', label: "Future Planned Event"}
    ];

    $scope.filterCheckboxes = {
      filterDefs: filterCheckboxDefs,
      model: $scope.checkboxVals,
      filterService: gridFilter
    };

    
    // =======================================================================================
    // Radio button filtering configuration

    $scope.radioBtn = "";   // Value of selected radio button.

    // id - Unique id related to the item data.
    // value - Radio button value, when checked.  Used when no selection lists configured.
    // field - Event data column to be filtered with the selections. If blank, no filtering will be performed.
    // label - Next to radio button.
    // available - Items to display in dropdown list. (optional)
    // selected - Items selected from 'available' list. Each object in array will generate a select list.
    // prompt - Next to select list.
    var filterRadioDefs = [
      { id: "all",       value: "",         field: "",             label: "All" },
      { id: "severity",  value: "major",    field: "severity",     label: "Major Events" },
      { id: "area",      value: "area",     field: "district",     label: "By Area",          available: $scope.areaJson,    selected: [{name: ""}, {name: ""}, {name: ""}, {name: ""}], prompt: "Select Area:" },
      { id: "route",     value: "route",    field: "road",         label: "By Route",         available: $scope.routeJson,   selected: [{name: ""}, {name: ""}, {name: ""}, {name: ""}], prompt: "Select Route:"},
      { id: "popular",   value: "popular",  field: "popularRoute", label: "By Popular Route", available: $scope.popularJson, selected: [{name: ""}, {name: ""}, {name: ""}, {name: ""}], prompt: "Select Popular Route:" },
      { id: "ferry",     value: "ferry",    field: "road",         label: "By Inland Ferry",  available: $scope.ferryJson,   selected: [{name: ""}, {name: ""}, {name: ""}, {name: ""}], prompt: "Select Inland Ferry:" }
    ];

    $scope.filterRadioButtons = {
      filterDefs: filterRadioDefs,    // Definition of radio buttons and optional dropdowns
      model: $scope.radioBtn,         // Holds value of selected radio button.
      filterService: gridFilter       // Utility functions to manage grid filtering values
    };


    // End of configuration items ===========================================================================


    var defer = $q.defer();   // Defer processes that need data to be loaded first.

    // Data will be assigned to specific scoped variables when loaded.
    loadExternalData($scope, $http, defer);


    // To execute when promise is resolved (data loaded)
    defer.promise.then(function(){
      $('#gridData').waitMe('hide');      // Hide progress indicator

      // Update grid data
      $scope.gridOptions.rowData = $scope.eventJson;

      // Update select option lists.  (Index hard-coded here so must match order in configuration definition above!)
      filterRadioDefs[2].available = $scope.areaJson;
      filterRadioDefs[3].available = $scope.routeJson;
      filterRadioDefs[4].available = $scope.popularJson;
      filterRadioDefs[5].available = $scope.ferryJson;

    });
  }])
;