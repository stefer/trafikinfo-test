/*global angular, */
angular.module('Trafikinfo.controllers', [])
    .controller('stationsController', function ($scope, TrafikinfoAPIService) {
        "use strict";
        $scope.stations = [];
        $scope.announcements = [];
        $scope.selectedStation = undefined;

        $scope.getAnnouncements = function (stationSign) {
            TrafikinfoAPIService.getAnnouncements(stationSign).success(function (response) {
                $scope.announcements = response.RESPONSE.RESULT[0].TrainAnnouncement;
            });
        };

        $scope.getStation = function (stationId) {
            return ($scope.stations || []).find(function (element, index, array) {
                return element.LocationSignature === stationId;
            });
        };

        TrafikinfoAPIService.getStations().success(function (response) {
            $scope.stations = response.RESPONSE.RESULT[0].TrainStation;
            TrafikinfoAPIService.cachedStations = $scope.stations;
        });
    })
    .controller('trainController', function ($scope, TrafikinfoAPIService, $routeParams) {
        "use strict";
        $scope.trainAnnouncements = [];
        $scope.trainId = $routeParams.trainId;

        $scope.getStation = function (stationId) {
            return (TrafikinfoAPIService.cachedStations || []).find(function (element, index, array) {
                return element.LocationSignature === stationId;
            });
        };

    
        TrafikinfoAPIService.getTrainAnnouncements($scope.trainId).success(function (response) {
            var announcements = response.RESPONSE.RESULT[0].TrainAnnouncement,
                result = [],
                input,
                existing,
                i;
            
            // We get both Avgang and Ankomst Activity types.
            // The Ankomst Activity is needed to get the times for the end station.
            // Here, we make sure that only one element for each station (and date) 
            // are preserved in the answer
            for (i = 0; i < announcements.length; i++) {
                input = announcements[i];
                existing = result.find(function (element, index, array) {
                    return element.LocationSignature === input.LocationSignature &&
                        element.AdvertisedTimeAtLocation.slice(0, 10) === input.AdvertisedTimeAtLocation.slice(0, 10);
                });
                
                if (!existing) {
                    result.push(input);
                    existing = input;
                }
                
                if (input.ActivityType === 'Avgang') {
                    existing.AvgangAdvertisedTimeAtLocation = input.AdvertisedTimeAtLocation;
                    existing.AvgangEstimatedTimeAtLocation = input.EstimatedTimeAtLocation;
                    existing.AvgangTimeAtLocation = input.TimeAtLocation;
                } else {
                    existing.AnkomstAdvertisedTimeAtLocation = input.AdvertisedTimeAtLocation;
                    existing.AnkomstEstimatedTimeAtLocation = input.EstimatedTimeAtLocation;
                    existing.AnkomstTimeAtLocation = input.TimeAtLocation;
                }
            }
            $scope.trainAnnouncements = result;
        });
    })
    .filter('stationIdsToNames', function () {
        "use strict";
        return function (input, scope) {
            return (input || [])
                .map(function (stationId) { return scope.getStation(stationId); })
                .filter(function (station) {return station !== null; })
                .map(function (station) {return station.AdvertisedLocationName; })
                .join(', ');
        };
    })
    .filter('stationIdToName', function () {
        "use strict";
        return function (input, scope) {
            return scope.$parent.getStation(input).AdvertisedLocationName;
        };
    })
    .filter('arrayToList', function () {
        "use strict";
        return function (input, delim) {
            return (input || []).join(delim || ', ');
        };
    });