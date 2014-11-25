angular.module('Trafikinfo.controllers', [])
    .controller('stationsController', function ($scope, TrafikinfoAPIService) {
        $scope.stations = [];
        $scope.announcements = [];
        $scope.selectedStation = undefined;
    
        $scope.getAnnouncements = function (stationSign) {
            TrafikinfoAPIService.getAnnouncements(stationSign).success(function (response) {
                $scope.announcements = response.RESPONSE.RESULT[0].TrainAnnouncement;
            });
        }
        
        TrafikinfoAPIService.getStations().success(function(response) {
            $scope.stations = response.RESPONSE.RESULT[0].TrainStation;
        });
});