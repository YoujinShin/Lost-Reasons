var population = new L.LayerGroup(); // population layer

// populcation data
var rateById = d3.map();

// var quantize = d3.scale.quantize()
// 	.domain([0, 9000])
// 	.range(d3.range(9).map(function(i) { return "q"+i+"-9"; }));


queue() // upload data using queue 
	.defer(d3.json, "tracts_2010.geojson") // cambridge GIS data
	// .defer(d3.csv, "camb_tract_pop_2010.csv", function(d) { 
	// 	rateById.set(d.id, +d.population); // cambridge CDD data
	// 	popAcrebyID.set(d.id, + d.population_per_acre);
	// 	housingAcrebyID.set(d.id, + d.housing_units_per_acre);
	// })
	.await(ready);
 

function ready(error, tract) {
	console.log("tract geographic data uploaded");

	L.geoJson(tract, {
		style: function(feature) {
			var tract = feature.properties.NAME10;
			var c = getColor( quantize( rateById.get(tract) ) );

			return {
				color: c,
				weight: 1.3,
				fillColor: c,
				fillOpacity: 0.84
			};
		},

	}).addTo(map);
}


//  maps
var mbUrl = 'https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';

var grayscale   = L.tileLayer(mbUrl, {id: 'examples.map-20v6611k'}),
	streets  = L.tileLayer(mbUrl, {id: 'examples.map-i875mjb7'});

var map = L.map('map', {
	center: [42.3783903,-71.1129096],
	zoom: 13,
	layers: grayscale
});


// layers
var baseLayers = {
	"Grayscale": grayscale,
	"Streets": streets
};


L.control.layers(baseLayers).addTo(map);
