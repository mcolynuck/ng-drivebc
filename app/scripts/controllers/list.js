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


// Convert array data to object with property names.
function formatFerryJson(data){
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

// Perform any data minuplation after formatting the json data
function prepFerryData(data){
  return formatFerryJson(data);
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


// Load external data for the grid and filtering options.
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


    // INLAND FERRIES
    http.get('data/ferries.json').
      success(function(data) { 
         var objArray = prepFerryData(data);
         scope.ferryJson = objArray;  // {name: "", longitude: "", latitude: "", link: ""}
    }).
    error(function(msg){
      $('#gridData').waitMe('hide');        // Hide progress indicator
      alert("Error loading inland ferry json data.\n" + msg);
    });


    // ROUTES
    http.get('data/highways.json').
      success(function(data) { 
        scope.routeJson = data;   // {name: "", road1: "", road2: ""}
    }).
    error(function(msg){
      $('#gridData').waitMe('hide');        // Hide progress indicator
      alert("Error loading event json data.\n" + msg);
    });


    // AREAS
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


    // Table content configuration -----------------------
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


    // Checkbox filtering configuration ---------------------
    $scope.checkboxVals = {"road condition": false, "incident": false, "current planned": false, "future planned": false};
    var filterCheckboxDefs = [
      { id:"road condition",  model: $scope.checkboxVals["road condition"],  trueVal: "true", falseVal: "false", image: 'images/road.png',      label: "Road Condition"},
      { id:"incident",        model: $scope.checkboxVals["incident"],        trueVal: "true", falseVal: "false", image: 'images/incident.png',  label: "Incident"},
      { id:"current planned", model: $scope.checkboxVals["current planned"], trueVal: "true", falseVal: "false", image: 'images/red-cone.png',  label: "Currrent Planned Event"},
      { id:"future planned",  model: $scope.checkboxVals["future planned"],  trueVal: "true", falseVal: "false", image: 'images/blue-cone.png', label: "Future Planned Event"}
    ];

    $scope.filterCheckboxes = {
      filterDefs: filterCheckboxDefs,
      filterService: gridFilter
    };

    
    // Radio button filtering configuration -------------------
    $scope.radioBtn = "";   // Value of selected radio button.
    $scope.selections = {area: [], route: [], popular: [], ferry: []};    // Array of selections from lists.
    var filterRadioDefs = [
      { id:"all",       value: "",         field: "",         label: "All" },
      { id:"severity",  value: "severity", field: "severity", label: "Major Events",     selection: "major" },
      { id:"area",      value: "area",     field: "road",     label: "By Area",          selection: $scope.areaJson,    selection_model: $scope.selections.area },
      { id:"route",     value: "route",    field: "road",     label: "By Route",         selection: $scope.routeJson,   selection_model: $scope.selections.route },
      { id:"popular",   value: "popular",  field: "road",     label: "By Popular Route", selection: $scope.popularJson, selection_model: $scope.selections.popular },
      { id:"ferry",     value: "ferry",    field: "road",     label: "By Inland Ferry",  selection: $scope.ferryJson,   selection_model: $scope.selections.ferry }
    ];

    // Select dropdown options (max 4 selects)
    $scope.areaSelect = {
      selectedOption: [{name: ""}, {name: ""}, {name: ""}, {name: ""}],    //This sets the default value of the select in the ui
      availableOptions: $scope.areaJson
    };

    $scope.routeSelect = {
      selectedOption: [{name: ""}, {name: ""}, {name: ""}, {name: ""}],
      availableOptions: $scope.routeJson
    };

    $scope.popularSelect = {
      selectedOption: [{name: ""}, {name: ""}, {name: ""}, {name: ""}],
      availableOptions: $scope.popularJson
    };

    $scope.ferrySelect = {
      selectedOption: [{name: ""}, {name: ""}, {name: ""}, {name: ""}],
      availableOptions: $scope.ferryJson
    };


    $scope.filterRadioButtons = {
      filterDefs: filterRadioDefs,
      model: $scope.radioBtn,
      filterService: gridFilter,
      area: $scope.areaSelect,
      route: $scope.routeSelect,
      popular: $scope.popularSelect,
      ferry: $scope.ferrySelect
    };

    // Start getting data ----------------------------
    var defer = $q.defer();

    // Data will be assigned to specific scoped variables when loaded.
    loadExternalData($scope, $http, defer);

    // These things need data to exist before being created
    defer.promise.then(function(){
      $('#gridData').waitMe('hide');      // Hide progress indicator

      // Update grid data
      $scope.gridOptions.rowData = $scope.eventJson;

      // Update select option lists.
      $scope.areaSelect.availableOptions = $scope.areaJson;
      $scope.routeSelect.availableOptions = $scope.routeJson;
      $scope.popularSelect.availableOptions = $scope.popularJson;
      $scope.ferrySelect.availableOptions = $scope.ferryJson;

    });

  }])
;