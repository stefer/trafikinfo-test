/*global jasmine, module, it, beforeEach, inject, describe, expect */
describe('Unit: stationsController', function () {
    "use strict";
    var ctrl, scope, q;
    
    // Load our controller module
    beforeEach(module('Trafikinfo.controllers'));

    // inject the $controller and $rootScope services in the beforeEach block
    beforeEach(inject(function ($controller, $rootScope, $q) {
        // Create a new scope that's a child of the $rootScope
        scope = $rootScope.$new();
        // Create the controller
        ctrl = $controller;
        q = $q;
    }));
    
    describe('when calling getStations', function () {
        var deferred, spyPromise, TAPIService;
        
        beforeEach(function () {
            // http://jsfiddle.net/onekilo79/LrAhf/
            deferred = q.defer();
            spyPromise = deferred.promise;

            TAPIService = jasmine.createSpyObj('TrafikinfoAPIService', ['getStations']);
            TAPIService.getStations.and.returnValue(spyPromise);

            spyPromise.success = function (fn) {
                spyPromise.then(function (data) {
                    return fn(data);
                });
                return spyPromise;
            };
                
            ctrl('stationsController', {$scope: scope, TrafikinfoAPIService: TAPIService});
        });
        
        it('should set $scope.stations to empty before calling getStations', function () {
            expect(scope.stations.length).toBe(0);
        });
        
        it('should set $scope.stations', function () {
            
            deferred.resolve({
                "RESPONSE": {"RESULT": [{"TrainStation": [
                    {"AdvertisedLocationName": "Västeraspby", "LocationSignature": "Väy", "Prognosticated": true},
                    {"AdvertisedLocationName": "Nässjö C", "LocationSignature": "N", "Prognosticated": true},
                    {"AdvertisedLocationName": "Källene", "LocationSignature": "Käe", "Prognosticated": false},
                    {"AdvertisedLocationName": "Järpås", "LocationSignature": "Jps", "Prognosticated": true}]}]}
            });
    
            scope.$apply();
            expect(scope.stations.length).toBe(4);
        });
    });
});