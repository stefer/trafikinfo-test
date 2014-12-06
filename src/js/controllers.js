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
        });
    })
    .filter('stationIdsToNames', function () {
        "use strict";
        return function (input, scope) {
            return (input || [])
                .map(function (stationId) { return scope.getStation(stationId).AdvertisedLocationName; })
                .join(', ');
        };
    })
    .filter('arrayToList', function () {
        "use strict";
        return function (input, delim) {
            return (input || []).join(delim || ', ');
        };
    });