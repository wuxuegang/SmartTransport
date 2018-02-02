define([ 
        "dojo/ready",
        "dojo/_base/declare",
        "dojo/_base/connect",
        "dojo/_base/Deferred",
        "dojo/_base/lang",
        "dojo/_base/event",
        "dojo/_base/array",
        "dojo/dom",
        "dojo/query",
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/dom-geometry",
        "dojo/dom-style",
        "dojo/date",
        "dojo/number",
        "dojo/window",
        "dojo/on",
        "dojo/fx",
        "dojo/i18n!./nls/template.js",
        "dojox/dtl/filter/strings",
        "js/plugins/nvd3/lib/d3.v3.js",
		"esri", 
		"esri/layers/graphics",
		"esri/geometry", 
		"esri/utils" 
],function(ready, declare, connect, Deferred, lang, event, array, dom, query, domClass, domConstruct, domGeom, domStyle, date, number, win, on, coreFx, i18n, strings, d3v3, esri){
	var Widget = declare("modules.TVoronoiDiagramLayer", esri.layers.GraphicsLayer, {
		constructor: function(options){
			var _self = this;
			this.deferreds = [];
			this.positions = [];
			this.options = {
					url: '',
					roadStateurl : '',
					interval : 10000
				};
			this._styles = [{
				key: 'fill',
				value: 'rgb(0, 0, 0)'
					}];
			this._attrs = options.attrs || [];
		    this._events = options.events || [];

		    this._path = options.path || d3.geo.path();
		    this.path = this._path.projection( _self._project );
			declare.safeMixin(this.options, options);
			this._load(function(){
				_self._render();
				self.onLoad( self );
			});
		},
		_load: function(callback){
			var _self = this;
			_self.update(function(){
				callback && callback();
			});
		},
		init: function(){
			
		},	
		constructQuery: function(queryUrl, callback) {
			var _self = this;
			_self.isBusy = true;
			var query = _self.options.url + "?url=" + strings.urlencode(queryUrl);
			_self.sendRequest(query, callback);
		},
		sendRequest: function(url, callback){
			var _self = this;
			var deferred = esri.request({
				url: url,
				handleAs: "text",
				timeout: _self.options.interval,
				load: lang.hitch(this, function(data){
					eval("var jsonobj = " + data);
					if(callback)callback(jsonobj);
				}),
				error: lang.hitch(this, function(e){
					_self.currentlyData = null;
					this.onError(e.message);
				})
			},{usePost: true});
			
			_self.deferreds.push(deferred);
		},
		update: function(callback){
			var _self = this;
			_self.constructQuery(_self.options.roadStateurl, function(d){
				_self.geojson = {'type': 'FeatureCollection', 'features': []};
				for (var i = 0; i < d.roads.length; i++){
					var road = d.roads[i];
					var geojson = {
							type: 'Feature'
					};
					geojson.properties = {
							time: road.time,
							direction: road.txtInfo
					};
					var xy = esri.geometry.lngLatToXY(road.lonlat[0], road.lonlat[1]);
					if(isNaN(xy[0])){
						var nan = xy;
					}
					var point = new esri.geometry.Point(xy[0], xy[1], app.map.spatialReference);
					geojson.geometry = {type: 'Point', coordinates: [point.x, point.y]};
					geojson.geometry_id = road.road;
					_self.geojson.features.push( geojson );
				}
				_self.bounds = d3.geo.bounds( _self.geojson );
				_self.loaded = true;
				callback && callback();
			});
		},
		_bind: function(map){
		      this._connects = [];
		      this._connects.push( dojo.connect( map, "onZoomEnd", this, this._reset ) );
		      this._connects.push( dojo.connect( this._map, "onPanEnd", this, this._reset ) );
		    },
		_project: function(x){
			var self = this;
			var projection = d3.geo.azimuthalEquidistant();
		    var p = new esri.geometry.Point( x[0], x[1] );
		    var point = app.map.toScreen( esri.geometry.webMercatorToGeographic( p ), app.map.spatialReference );
		    if(!isNaN(point.x) && !isNaN(point.y)){
		    	self.positions.push(projection([+point.x, +point.y]));
		    }
		    
		    return [ point.x, point.y ];
		 },
		 _render: function(){
		      var self = this;
		      var p = this._paths();
		      	      
		      p.data( this.geojson.features )
		        .enter().append( "circle" )
		          .attr('cx', function(d, i) {
		        	  return self._project(self.geojson.features[i].geometry.coordinates)[0]; 
		        	  } )
		          .attr('cy', function(d, i) { 
		        	  return self._project(self.geojson.features[i].geometry.coordinates)[1]; 
		        	  } )
		          .attr('transform', 'matrix(1.00000000,0.00000000,0.00000000,1.00000000,0.00000000,0.00000000)')
		          .attr("r", 1.5);
		      self.polygons = d3.geom.voronoi(self.positions);
		      //self.cells = d3.select("#map_gc").append("svg:g")
		      //.attr("id", "cells");
		      d3.select("g#" + this.id + "_layer").selectAll( "path" ).data( self.polygons )
		        .enter().append( "path" )
		        .attr("style","fill: white; stroke: brown;")
		          .attr('d', function(d, i) { return "M" + self.polygons[i].join("L") + "Z"; } );
              
		      
		      this._styles.forEach(function( s, i ) { 
		        self.style(s);
		      });

		      this._attrs.forEach(function( s, i ) {
		        self.attr(s);
		      });

		      this._events.forEach(function( s, i ) {
		        self.event(s);
		      });

		      this._bind(app.map);
		    },

		    style: function( s ){
		      this._paths().style(s.key, s.value);
		    },
		    attr: function( a ){
		      this._paths().attr(a.key, a.value);
		    },

		    event: function( e ){
		      this._paths().on(e.type, e.fn);
		    },

		    _reset: function(){
		      var self = this;
		      this._paths()
		      .attr('cx', function(d, i) { return self._project(self.geojson.features[i].geometry.coordinates)[0]; } )
	          .attr('cy', function(d, i) { return self._project(self.geojson.features[i].geometry.coordinates)[1]; } )
	          .attr('transform', 'matrix(1.00000000,0.00000000,0.00000000,1.00000000,0.00000000,0.00000000)')
	          .attr("r", 1.5);
		      self.polygons = d3.geom.voronoi(self.positions);
		      d3.select("g#" + this.id + "_layer").selectAll( "path" )
		          .attr('d', function(d, i) { return "M" + self.polygons[i].join("L") + "Z"; } );
		    },

		    _element: function(){
		      return d3.select("g#" + this.id + "_layer");
		    },

		    _paths: function(){
		      return this._element().selectAll( "circle" );
		    }
		    
	});
	return Widget;
});