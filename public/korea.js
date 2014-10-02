// var population = new L.LayerGroup(); // population layer

// populcation data
var rateById = d3.map();

var quantize = d3.scale.quantize()
	.domain([0, 3300])
	.range(d3.range(9).map(function(i) { return "q"+i+"-9"; }));

var tooltip = d3.select("body")
	.append("div")
	.attr("id", "tooltip");


queue() // upload data using queue 
	// .defer(d3.json, "skorea-municipalities-topo.json") //  GIS data
	.defer(d3.json, "skorea-provinces-topo.json")
	.defer(d3.csv, "rate_province.csv", function(d) { 
		rateById.set(d.id, +d.total); // cambridge CDD data
	// 	popAcrebyID.set(d.id, + d.population_per_acre);
	// 	housingAcrebyID.set(d.id, + d.housing_units_per_acre);
	})
	.await(ready);
 
 function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight
	})
}

function highlightFeature(e) {
	var layer = e.target;

	// mouse position
	var tx = e.containerPoint.x;
	var ty = e.containerPoint.y;

	layer.setStyle({
		weight: 1,
		color: "blue",
		opacity: 1,
		fillOpacity: 0.82
	});

	layer.bringToFront();

	// var tract = layer.feature.properties.NAME10;
	// var pop = rateById.get(tract);

	var name = layer.feature.geometry.properties.NAME_1;
	var rate = rateById.get(name);
	// console.log(name);


	tooltip.style("left", tx-70+"px");
	tooltip.style("top", ty+40+"px");

	tooltip.html(function(d) {
		return "<span style='font-weight:bold;font-size:13px'>" 
				+ name +"</span><br>"
			+"Total: "+ rate;
	});

	tooltip.style("visibility", "visible");
}


function resetHighlight(e) {
	var layer = e.target;
	var tract = layer.feature.properties.NAME10;
	var c = getColor( quantize(rateById.get(tract)) );

	layer.setStyle({
		weight: 1.3,
		color: c,
		fillOpacity: 0.86
	});

	layer.bringToBack();
	tooltip.style("visibility", "hidden");
}
 


function ready(error, kor) {
	console.log("geographic data uploaded");

	// var municipalities = topojson.object(kor, kor.objects['skorea-municipalities-geo']);
	// var geometries = municipalities.geometries;
	
	var provinces = topojson.object(kor, kor.objects['skorea-provinces-geo']);
	var geometries = provinces.geometries;

	L.geoJson(geometries, {
		style: function(feature) {
			// console.log(feature.geometry.properties.NAME_1);
			var name = feature.geometry.properties.NAME_1;
			// console.log(name);
			var c = getColor( quantize( rateById.get(name) ) );

			return {
				color: 'white',
				weight: 2,
				fillColor: c,
				fillOpacity: 0.9
			};
		},
		onEachFeature: onEachFeature
	}).addTo(map);
}


//  maps
var mbUrl = 'https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';

var grayscale   = L.tileLayer(mbUrl, {id: 'examples.map-20v6611k'}),
	streets  = L.tileLayer(mbUrl, {id: 'examples.map-i875mjb7'});

var map = L.map('map', {
	center: [35.8615204,127.096405],
	zoom: 6,
	layers: grayscale
});


// layers
var baseLayers = {
	"Grayscale": grayscale
	// "Streets": streets
};

// L.control.layers(baseLayers).addTo(map);


function getColor(d) {
	switch(d) {
		case 'q0-9': return "rgb(247,251,255)";
		case 'q1-9': return "rgb(222,235,247)";
		case 'q2-9': return "rgb(198,219,239)";
		case 'q3-9': return "rgb(158,202,225)";
		case 'q4-9': return "rgb(107,174,214)";
		case 'q5-9': return "rgb(66,146,198)";
		case 'q6-9': return "rgb(33,113,181)";
		case 'q7-9': return "rgb(8,81,156)";
		case 'q8-9': return "rgb(8,48,107)";
	}
}
