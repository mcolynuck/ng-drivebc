'use strict';

// Service to manage the filter state between the grid directive and the checkbox filter directive.
angular.module('gridServices', [])

  .service('gridFilter', function() {
    // var filterArray = [];
    var filters = {};

    this.updateFilterByName = function(filterName, id, isAdding) {
      if(!filters[filterName]) {
        filters[filterName] = [];
      }

      if(isAdding) {
        if(filters[filterName].indexOf(id) < 0) {
          filters[filterName].push(id);
        }
      } else {
        var i = 0;
        if((i = filters[filterName].indexOf(id)) >= 0) {
          filters[filterName].splice(i, 1);
        }
      }
    }

    this.getFilterArrayByName = function(filterName) {
      if(filterName && filters[filterName]) {
        return filters[filterName];
      }
      return [];
    }

    this.getAllFilters = function() {
      return filters;
    }
  })
;

/*

  filters {
    eventType: [],      // <= list of event types to match with
    road: [],           // <= list of roads to match with
    severity: []        // <= 'Major' (or nothing) to match with
  }

*/