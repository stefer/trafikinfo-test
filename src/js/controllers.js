angular.module('Trafikinfo.controllers', [])
    .controller('stationsController', function($scope, TrafikinfoAPIService) {
        $scope.stations = [];
        $scope.selectedStation = undefined;
        TrafikinfoAPIService.getStations().success(function(response) {
            $scope.stations = response.RESPONSE.RESULT[0].TrainStation;
        });
});