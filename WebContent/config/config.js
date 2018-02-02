var configOptions = {
		"webmap":"e2ff2bd4d217464688d8407b8c1c73eb",
		"geometryserviceurl":"http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer",
		"proxyUrl":"proxy/proxy.jsp",
		"getCongestionIndexUrl":"Congestion",
		"HistoryCongestionIndexUrl":"HistoryCongestion",
		"RoadCongestionUrl":"RoadCongestionState",
		"taxiserviceurl":"http://localhost:6080/arcgis/rest/services/ITS/TaxiService/MapServer/0",
		"taxiSVG":"M15.834,29.084 15.834,16.166 2.917,16.166 29.083,2.917z",
		"clusterImage":"images/map/cluster72x72.png",
		"clusterHoverImage":"images/map/clusterHover72x72.png",
		"taxiDirImage":"images/arrow.png",
		"localJson":{
			"beiJing":{
				url: "Data/beijing.json", 
				key: "OBJECTID", 
				zoomToExtent: true, 
				geojson: true, 
				styles: [{
					key: 'fill',
					value: 'rgb(125,125,125)'
				},{
					key: 'stroke',
					value: '#DDD'
				},{
					key: 'stroke-width',
					value: 1
				},{
					key: 'opacity',
					value: 0.35
				}],
				attrs:[
				       {key: 'congestionIndex', value: 0},
				       {key: 'state', value: '未知'},
				       {key: 'speed', value: 0}
				       ]
			},
			"roadstate":{
				url: "Data/roadstate.json", 
				key: "FID", 
				zoomToExtent: true, 
				geojson: true, 
				styles: [{
					key: 'fill',
					value: '#FF7F0E'
				},{
					key: 'stroke',
					value: '#FFFFFF'
				},{
					key: 'stroke-width',
					value: 2
				}],
				attrs:[
				       {key: 'name', value: '未知'},
				       {key: 'direction', value: '未知'},
				       {key: 'url', value: '#'}
				       ]
			}
		}
};