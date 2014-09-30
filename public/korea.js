// var population = new L.LayerGroup(); // population layer

// populcation data
// var rateById = d3.map();

// // var quantize = d3.scale.quantize()
// // 	.domain([0, 9000])
// // 	.range(d3.range(9).map(function(i) { return "q"+i+"-9"; }));


queue() // upload data using queue 
	.defer(d3.json, "skorea-municipalities-topo.json") // cambridge GIS data
	// .defer(d3.csv, "camb_tract_pop_2010.csv", function(d) { 
	// 	rateById.set(d.id, +d.population); // cambridge CDD data
	// 	popAcrebyID.set(d.id, + d.population_per_acre);
	// 	housingAcrebyID.set(d.id, + d.housing_units_per_acre);
	// })
	.await(ready);
 

function ready(error, kor) {
	console.log("geographic data uploaded");

	var municipalities = topojson.object(kor, kor.objects['skorea-municipalities-geo']);
	var geometries = municipalities.geometries;
	// console.log(geometries);

	L.geoJson(geometries, {
		style: function(feature) {
			// var tract = feature.properties.NAME10;
			// var c = getColor( quantize( rateById.get(tract) ) );

			return {
				color: 'blue',
				weight: 1.3,
				fillOpacity: 0
			};
		},

	}).addTo(map);
}


//  maps
var mbUrl = 'https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';

var grayscale   = L.tileLayer(mbUrl, {id: 'examples.map-20v6611k'}),
	streets  = L.tileLayer(mbUrl, {id: 'examples.map-i875mjb7'});

var map = L.map('map', {
	center: [35.8615204,127.096405],
	zoom: 7,
	layers: grayscale
});


// layers
var baseLayers = {
	"Grayscale": grayscale,
	"Streets": streets
};


L.control.layers(baseLayers).addTo(map);
