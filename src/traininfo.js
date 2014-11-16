var app = angular.module('myApp', ['ui.bootstrap']);
    
app.controller('stationsController', function($scope, $http) {
  var traininfo = new Trafikinfo();
    
  $scope.selectedStation = undefined;
  traininfo.getStations($http,
    function(response) {
      $scope.stations = response;
    },
    function(response) {
      // alert(response);
    });
});

var Trafikinfo = function()  {
    this.url = "http://api.trafikinfo.trafikverket.se/v1/data.json";
    this.authKey = "0f6e8fc7f2c34aa58cf8de26cc592617";
    this.trainStationRequest =
      "<REQUEST>" +
        "<LOGIN authenticationkey='" + this.authKey + "' />" +
        "<QUERY objecttype='TrainStation'>" +
            "<FILTER/>" +
            "<INCLUDE>Prognosticated</INCLUDE>" +
            "<INCLUDE>AdvertisedLocationName</INCLUDE>" +
            "<INCLUDE>LocationSignature</INCLUDE>" +
        "</QUERY>" +
      "</REQUEST>";
};

Trafikinfo.prototype.getStations = function($http, success, error) {
    $http
    .post(
      this.url,
      this.trainStationRequest,
      { headers: { 'Content-Type': 'text/xml' }})
    .success(function(data){ getStationsSuccess(data, success, error); })
    .error(error);
}

function getStationsSuccess(data, success, error) {
  if (data.RESPONSE.ERROR) {
    error(data.RESPONS.ERROR);
  }
  else if (data.RESPONSE.RESULT
            && data.RESPONSE.RESULT.length
            && data.RESPONSE.RESULT[0].TrainStation){
    success(data.RESPONSE.RESULT[0].TrainStation);
  }
  else {
    error(data);
  }
}
