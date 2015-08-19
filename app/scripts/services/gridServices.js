'use strict';

// Service to manage the filter state between the grid directive and the checkbox filter directive.
angular.module('gridServices', [])
  .service('gridFilter', function() {
    var filterArray = [];

    // Set content of filter array
    // value - Filter value to add/remove
    // isAdded - true to add value, false to remove value from array.
    this.updateFilter = function(value, isAdded) {
      if(isAdded){
        if(filterArray.indexOf(value) < 0) {
          filterArray.push(value);
        }
      } else {
        var i = 0;
        if((i = filterArray.indexOf(value)) != -1) {
          filterArray.splice(i, 1);
        }        
      }
    };

    // Get array of filters
    this.getFilterArray = function() {
      return filterArray;
    };
  })
;
