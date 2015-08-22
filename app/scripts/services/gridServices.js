'use strict';

/*
    Service to manage the filter state between the grid and filter selectors.
 */
angular.module('gridServices', [])

  .service('gridFilter', function() {

    var filterObject = {};    // Contains properties (grid field name) and array of values (lower-case versions)
                              // i.e. { "eventType": ["incident", "current construction"]}

    // Add value to a property if not an empty value.
    this.updateFilterByName = function(propertyName, value, isAdding) {
// console.log("** updateFilterByName =============");
      var tempObj = filterObject;     // Make changes to a copy then back when done.

      if(propertyName && propertyName.trim().length > 0 && value && value.trim().length > 0) {
        if(isAdding) {
          if(!tempObj.hasOwnProperty(propertyName)) {
            tempObj[propertyName] = [];    // Add new empty property so we can add to it.
          }

          if(tempObj[propertyName].indexOf(value) < 0) {
            tempObj[propertyName].push(value);
          }
        } else {
          if (tempObj.hasOwnProperty(propertyName)) {   // Does this property exist to have a value removed?
            var i = 0;
            if((i = tempObj[propertyName].indexOf(value)) >= 0) {
              tempObj[propertyName].splice(i, 1);

              // Remove property if there are no values left.
              if (tempObj[propertyName].length === 0) {
                delete tempObj[propertyName];
              }
            }
          }
        }
      }
      filterObject = tempObj;     // Copy modified data back to filter object.
//console.log("filter:",filterObject);
    };


    // Change content of filter for a property in one shot with prepopulated array of values.
    this.bulkUpdateFilterByName = function(propertyName, data) {
// console.log("** bulkUpdateFilterByName "+propertyName);
      filterObject[propertyName] = data;
    };


    // Removes property from filter object
    this.clearFilterByName = function(propertyName) {
// console.log("** clearFilterByName "+propertyName);
      delete filterObject[propertyName];
    }


    // Get specific filter property array data
    this.getFilterArrayByName = function(propertyName) {
// console.log("** getFilterArrayByName "+propertyName);
      if(propertyName && filterObject[propertyName]) {
        return filterObject[propertyName];
      }
      return [];    // Not found, so return empty array.
    };


    // Get filter object with all filtering data
    this.getFilterObject = function() {
// console.log("** getFilterObject");
      return filterObject;
    }
  })
;