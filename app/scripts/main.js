/*global angular, google */
/*eslint-disable no-new */
'use strict';

angular.module('avionmakeGallery', [])
.controller('MainController', ['$http', function($http) {
    var self = this;
    self.type = '';

    function initMap(points) {
        var customMapTypeId = 'custom_style';
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 9,
            center: {lat: 46.522281, lng: 6.5873744},
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.ROADMAP, customMapTypeId]
            }
        });

        var customMapType = new google.maps.StyledMapType([
            {
                stylers: [
                {hue: '#890000'},
                {visibility: 'simplified'},
                {gamma: 0.5},
                {weight: 0.5}
                ]
            },
            {
                elementType: 'labels',
                stylers: [{visibility: 'off'}]
            },
            {
                featureType: 'water',
                stylers: [{color: '#000089'}]
            }
            ], {
            name: 'Basic'
        });


        map.mapTypes.set(customMapTypeId, customMapType);
          map.setMapTypeId(customMapTypeId);

        new google.maps.visualization.HeatmapLayer({
            data: points,
            radius: 20,
            map: map
        });
    }

    /*
    function findPcode(code){
        for(var i = 0; i < self.codes.length; i++){
            if(code === self.codes[i].PLZ) {
                return self.codes[i];
            }
        }
    }
    */

    $http.get('lemanmake2015.json')
    .then(function(result){
        self.planes = result.data;
        //group
        self.c = {};
        self.d = {};
        var points = [];
        self.planes.forEach(function(e) {
            if(e.info.c){
                if(!self.c.hasOwnProperty(e.info.c)){
                    self.c[e.info.c] = 0;
                }
                self.c[e.info.c]++;
            }
            if(e.info.d){
                if(!self.d.hasOwnProperty(e.info.d)){
                    self.d[e.info.d] = 0;
                }
                self.d[e.info.d]++;
            }
            if(!isNaN(e.info.lat) && !isNaN(e.info.lng)){
                points.push(new google.maps.LatLng(parseFloat(e.info.lat), parseFloat(e.info.lng)));
            }
        });
        self.c = Object.keys(self.c).map(function(key){
            return {key: key, value: self.c[key]};
        }).sort(function(a, b){
            return b.value - a.value;
        });
        self.d = Object.keys(self.d).map(function(key){
            return {key: key, value: self.d[key]};
        }).sort(function(a, b){
            return b.value - a.value;
        });
        initMap(points);
        /*
        Papa.parse('scripts/PLZO_CSV_WGS84.csv', {
            download: true,
            header: true,
            complete: function(results) {
                console.log("Finished:", results.data);
                self.codes = results.data;
                self.planes.forEach(function(element) {
                    var complete = findPcode(element.info.pcode);
                    if(complete){
                        element.info.city = complete.Ortschaftsname;
                        element.info.d = complete.Gemeindename;
                        element.info.c = complete["Kantonskürzel"];
                        element.info.lat = complete.N;
                        element.info.lng = complete.E;
                    }
                });
                console.log(angular.toJson(self.planes));
            }
        });
        */
    });

}]);
