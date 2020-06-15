//setting for leaflet 

let mymap = L.map('map', {
    center: [28.394, 84.1240],  //map is zoomed directly to given  cordinate [28.394, 84.1240]
    zoom: 7                     //this is cool hai guys
});

//setting for leaflet tilelayer
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', //osm tile layer and copyright are generated
    maxZoom: 18,
    id: 'mapbox.streets',
}).addTo(mymap);


// getting Nepal covid-19 Provincedata  through API 
$.ajax({
    url: "https://data.nepalcorona.info/api/v1/covid/summary",
    method: "GET",
    success: function (provin) {
        var cases = [];
        for (let i in provin.province.cases) {
            let musician = provin.province.cases[i];
            cases.push(musician.count);
        }
        console.log(cases);
        var max = Math.max(...cases);
        var min = Math.min(...cases);
        //console.log(max);

        //Getting color on province on basis of ratio of maximum cases
        function getColor(d) {
            for (let i in provin.province.cases) {
                let totalcases = provin.province.cases[i];
                if (d == totalcases.province) {
                    var e = totalcases.count;
                }
            }
            return e > max / 4 * 3 ? '#02818a' :
                e > max / 4 * 2 ? '#67a9cf' :
                    e > max / 4 * 1 ? '#bdc9e1' :

                        e > 0 ? '#f6eff7' :
                            'black';
        }


        function style(feature) {

            return {
                fillColor: getColor(feature.properties.OBJECTID),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }

        //This function returns number data in comma format
        function formatNumber(num) {
            return num
                .toString()
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        }



        // To add the Province JSON data and repective color 
        L.geoJson(leafmap, { style: style }).addTo(mymap);


        let highlightStyle = {
            weight: 5,
            color: "black",
            fillOpacity: 0.5
        };
        function highlightFeature(e) {
            var layer = e.target;
            info.update(layer.feature.properties.OBJECTID);
            layer.setStyle(highlightStyle);

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }
        }

        function resetHighlight(e) {
            geojson.resetStyle(e.target);
            info.update();
        }

        function zoomToFeature(e) {
            mymap.fitBounds(e.target.getBounds());
        }

        function onEachFeature(feature, layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature
            });
        }

        // Adding legend on map
        let legend = L.control({ position: "bottomleft" });
        legend.onAdd = function () {
            let div = L.DomUtil.create("div", "legendClass");
            div.innerHTML =
                '<b>Total cases</b><br>Province wise<br>' +
                '<i style="background-color: #02818a"></i>Highest cases<br>' +
                '<i style="background-color: #67a9cf"></i>Medium cases  <br>' +
                '<i style="background-color: #bdc9e1"></i>Low cases <br>' +
                '<i style="background-color: #f6eff7"></i>No cases<br>';
            return div;
        };
        legend.addTo(mymap);


        geojson = L.geoJson(leafmap, {
            onEachFeature: onEachFeature
        }).addTo(mymap);


        //This will setup info box
        var info = L.control();
        info.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
            this.update();
            return this._div;
        };

        // method that we will use to update the control based on feature properties passed 
        info.update = function (props) {

            for (let i in provin.province.deaths) {
                let deathcases = provin.province.deaths[i];          //for deathCases
                if (props == deathcases.province) {
                    var deathCases = formatNumber(deathcases.count);
                }


                for (let i in provin.province.cases) {
                    let totalcases = provin.province.cases[i];          //for totalCases
                    if (props == totalcases.province) {
                        var totalCases = formatNumber(totalcases.count);
                        var proName = formatNumber(totalcases.province);
                    }



                    for (let i in provin.province.active) {
                        let activecases = provin.province.active[i];                ////for activeCases
                        if (props == activecases.province) {
                            var activeCases = formatNumber(activecases.count);
                        }


                        for (let i in provin.province.recovered) {
                            let recoveredcases = provin.province.recovered[i];          //for recoveredCases
                            if (props == recoveredcases.province) {
                                var recoveredCases = formatNumber(recoveredcases.count);
                            }


                            this._div.innerHTML = '<h4>Nepal Covid-19 Information</h4>' + (props ?
                                '<b>Province No : &nbsp;</b>' + proName + '<br /><b>Total Cases : &nbsp;</b>' + totalCases + '<br /><b>Active Cases : &nbsp;</b>' + activeCases + '<br /><b>Recovered : &nbsp;</b> ' + recoveredCases + '<br /><b>Deaths : &nbsp;</b> ' + deathCases
                                : 'Hover over a province');
                        }

                    };
                };
            };
        };

        info.addTo(mymap);
    }
})



