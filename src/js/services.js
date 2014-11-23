angular.module('Trafikinfo.services', [])
    .factory('TrafikinfoAPIService', function($http) {
    
        var trafikInfoAPI = { };
        var baseUrl = "http://api.trafikinfo.trafikverket.se/v1/data.json";
        var authKey = "0f6e8fc7f2c34aa58cf8de26cc592617";
        var trainStationRequest =
                "<REQUEST>" +
                "<LOGIN authenticationkey='" + authKey + "' />" +
                "<QUERY objecttype='TrainStation'>" +
                    "<FILTER/>" +
                    "<INCLUDE>Prognosticated</INCLUDE>" +
                    "<INCLUDE>AdvertisedLocationName</INCLUDE>" +
                    "<INCLUDE>LocationSignature</INCLUDE>" +
                "</QUERY>" +
                "</REQUEST>";
    
        trafikInfoAPI.getStations = function() {
            return $http.post(
                baseUrl,
                trainStationRequest,
                { headers: { 'Content-Type': 'text/xml' }});
        }
        
        return trafikInfoAPI;
});