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
            $scope.trainAnnouncements = response.RESPONSE.RESULT[0].TrainAnnouncement;
        });
    })
    .filter('stationIdsToNames', function () {
        "use strict";
        return function (input, scope) {
            return (input || [])
                .map(function (stationId) { return scope.getStation(stationId); })
                .filter(function (station) {return station != null;})
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