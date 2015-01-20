angular.module('TrafikinfoApp', [
    'ui.bootstrap', 
    'ngRoute',
    'Trafikinfo.controllers', 
    'Trafikinfo.services'])
.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/search', {
        templateUrl: 'partials/search-station.html',
        controller: 'stationsController'
      }).
      when('/train/:trainId', {
        templateUrl: 'partials/train.html',
        controller: 'trainController'
      }).
      otherwise({
        redirectTo: '/search'
      });
  }]);

if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

if (!Date.prototype.sameDay) {
    Date.prototype.sameDay = function(d) {
        return this.getFullYear() === d.getFullYear()
                && this.getDate() === d.getDate()
                && this.getMonth() === d.getMonth();
    }
}