angular.module('Trafikinfo.services', [])
    .factory('TrafikinfoAPIService', function($http) {
    
        var trafikInfoAPI = { };
        var baseUrl = "http://api.trafikinfo.trafikverket.se/v1/data.json";
        var authKey = "0f6e8fc7f2c34aa58cf8de26cc592617";
    
        trafikInfoAPI.cachedStations = [];
    
        trafikInfoAPI.getStations = function() {
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
            
            return $http.post(
                baseUrl,
                trainStationRequest,
                { headers: { 'Content-Type': 'text/xml' }});
        }
        
        trafikInfoAPI.getAnnouncements = function(stationSign) {
            var announcementsRequest = 
                "<REQUEST version='1.0'>" +
                    "<LOGIN authenticationkey='" + authKey + "' />" +
                    "<QUERY objecttype='TrainAnnouncement' " +
                        "orderby='AdvertisedTimeAtLocation' >" +
                        "<FILTER>" +
                        "<AND>" +
                            "<OR>" +
                                "<AND>" +
                                    "<GT name='AdvertisedTimeAtLocation' " +
                                                "value='$dateadd(-00:15:00)' />" +
                                    "<LT name='AdvertisedTimeAtLocation' " +
                                                "value='$dateadd(14:00:00)' />" +
                                "</AND>" +
                                "<GT name='EstimatedTimeAtLocation' value='$now' />" +
                            "</OR>" +
                            "<EQ name='LocationSignature' value='" + stationSign + "' />" +
                            "<EQ name='ActivityType' value='Avgang' />" +
                        "</AND>" +
                        "</FILTER>" +
                        // Just include wanted fields to reduce response size.
                        "<INCLUDE>InformationOwner</INCLUDE>" +
                        "<INCLUDE>AdvertisedTimeAtLocation</INCLUDE>" +
                        "<INCLUDE>TrackAtLocation</INCLUDE>" +
                        "<INCLUDE>FromLocation</INCLUDE>" +
                        "<INCLUDE>ToLocation</INCLUDE>" +
                        "<INCLUDE>AdvertisedTrainIdent</INCLUDE>" +
                        "<INCLUDE>Canceled</INCLUDE>" +
                        "<INCLUDE>Deviation</INCLUDE>" +
                        "<INCLUDE>EstimatedTimeAtLocation</INCLUDE>" +
                    "</QUERY>" +
                "</REQUEST>";
            
            return $http.post(
                baseUrl,
                announcementsRequest,
                { headers: { 'Content-Type': 'text/xml' }});
        }

        trafikInfoAPI.getTrainAnnouncements = function(trainId) {
            var announcementsRequest = 
                "<REQUEST version='1.0'>" +
                    "<LOGIN authenticationkey='" + authKey + "' />" +
                    "<QUERY objecttype='TrainAnnouncement' " +
                        "orderby='AdvertisedTimeAtLocation' >" +
                        "<FILTER>" +
                            "<AND>" +
                                "<EQ name='AdvertisedTrainIdent' value='" + trainId + "' />" +
                                "<EQ name='ActivityType' value='Avgang' />" +
                            "</AND>" +
                        "</FILTER>" +
                        // Just include wanted fields to reduce response size.
                        "<INCLUDE>LocationSignature</INCLUDE>" +
                        "<INCLUDE>TrackAtLocation</INCLUDE>" +
                        "<INCLUDE>FromLocation</INCLUDE>" +
                        "<INCLUDE>AdvertisedLocationName</INCLUDE>" +
                        "<INCLUDE>ToLocation</INCLUDE>" +
                        "<INCLUDE>AdvertisedTrainIdent</INCLUDE>" +
                        "<INCLUDE>Canceled</INCLUDE>" +
                        "<INCLUDE>Deviation</INCLUDE>" +
                        "<INCLUDE>EstimatedTimeAtLocation</INCLUDE>" +
                        "<INCLUDE>AdvertisedTimeAtLocation</INCLUDE>" +
                        "<INCLUDE>TimeAtLocation</INCLUDE>" +                
                        "<INCLUDE>ActivityType</INCLUDE>" +                
                    "</QUERY>" +
                "</REQUEST>";
            
            return $http.post(
                baseUrl,
                announcementsRequest,
                { headers: { 'Content-Type': 'text/xml' }});
        }
        
        return trafikInfoAPI;
});