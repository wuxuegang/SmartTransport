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
	var Widget = declare("modules.VMSLayer", esri.layers.GraphicsLayer, {
		constructor: function(options){
			var _self = this;
			this.deferreds = [];
			this.positions = [];
			this.options = {
					url: '',
					key: '', 
					zoomToExtent: true, 
					geojson: true,
					styles: [],
					attrs: []
				};
			this.videos = ["M2U00430.flv","M2U00431.flv","M2U00432.flv","M2U00433.flv","M2U00434.flv","M2U00435.flv","M2U00436.flv","M2U004377.flv","M2U00438.flv","M2U00439.flv"
			               ,"M2U00440.flv","M2U00441.flv","M2U00442.flv","M2U00443.flv","M2U00444.flv","M2U00445.flv","M2U00446.flv","M2U00447.flv","M2U00448.flv","M2U00449.flv"
			               ,"M2U00450.flv","M2U00451.flv","M2U00452.flv","M2U00453.flv","M2U00454.flv","M2U00455.flv"];
			this.id = 'vms';
			declare.safeMixin(_self.options, options);
			this._styles = options.styles || [];
			this._attrs = options.attrs || [];
		    this._events = options.events || [];

		    this._path = options.path || d3.geo.path();
		    this.path = this._path.projection( _self._project );
		    _self.init();
			this._load(_self.options.geojson, function(){
				_self._render();
				_self.creatVMSTable();
				_self.updateLayout();
				_self.layoutInterval = setInterval(function(){
					_self.updateLayout();
	        	},500);
				_self.onLoad( _self );
			});
		},
		init: function(){
			domStyle.set(dojo.byId('knobTotal'), {
				"height": '100%'
			});
		},
		_load: function(is_geojson, callback){
			var _self = this;
			if(is_geojson){
				d3.json(_self.options.url, function(geojsons){
					_self.geojson = {'type': 'FeatureCollection', 'features': []};
					for (var i = 0; i < geojsons.features.length; i++){
						var f = geojsons.features[i];
			        	  var geojson = {
			        			  id: f.attributes[_self.options.key],
			        			  type: 'Feature'
			        	  };
			        	  var xy = esri.geometry.lngLatToXY(f.geometry.x, f.geometry.y);
			        	  var point = new esri.geometry.Point(xy[0], xy[1], app.map.spatialReference);
						  geojson.geometry = {type: 'Point', coordinates: [point.x, point.y]};
						  geojson.geometry_id = f.attributes[_self.options.key];
						  geojson.properties = f.attributes;
						  _self.geojson.features.push( geojson );
					}
					_self.bounds = d3.geo.bounds( _self.geojson );
					_self.loaded = true;
					callback && callback();
				});
			}
		},
		creatVMSImage: function(feature){
			var _self = this;
			var node = dom.byId('knobTotal');
			var html = '';
			html += '<h3>视频监控(' + feature.properties['name'] + '):</h3>';
			html += '<div id="FlashFile">';
			html += '</div>';
			if (node) {
                node.innerHTML = html;
                var so = new SWFObject('video/flvplayer.swf','single','300','288','7');            
                so.addParam("allowfullscreen","false");
                so.addVariable("file",_self.videos[_self.RndNum(0, 25)]);
                so.addVariable("displayheight","300");
                so.addVariable("backcolor","0xFFFFFF");
                so.addVariable("wmode", "transparent");
                so.addVariable("autostart","true");
                so.addVariable("repeat","true");
                so.addVariable("showdigits", "false");
                so.addVariable("overstretch", "fit");
                so.write('FlashFile');
            }
		},
		showVMSImage: function(feature){
			var temp = '';
			app.closeDialog();
			temp = '<img src="' + feature.properties['url'] + '"/>';
			app.openDialog(null, temp);
		},
		creatVMSTable: function(){
			var _self = this;
			var node = dom.byId('chartIndexTotal');
			var html = '';
			html += '<h3 id="tbTitle">交通引导指示牌列表：</h3>';
			html += '<table id="tbThead" class="pure-table">';
			html += '<thead><tr><th>引导牌编号</th><th>引导牌位置</th><th>引导方向</th></tr></thead>';
			html += '</table>';	
			html += '<div id="VMSDiv" class="ps-container">';
			html += '<table id="VMSTable" class="pure-table" style="margin-top:0px;">';
			html += '<thead style="display: none;"><tr><th>引导牌编号</th><th>引导牌位置</th><th>引导方向</th></tr></thead>';
			html += '<tbody>';
			_self.geojson.features.forEach(function(feature){
				html += '<tr><td>' + feature.properties['Id'] + '</td><td>' + feature.properties['name'] + '</td><td>' + feature.properties['direction'] + '</td></tr>';
			});
			html += '</tbody>';
			html += '</table>';
			html += '</div>';
			if (node){
				node.innerHTML = html;
				$('#VMSDiv').perfectScrollbar({wheelPropagation:false});
                $('#VMSDiv').perfectScrollbar('update');
                connect.connect(dom.byId('VMSTable'), 'onclick', function(event){
                	app.map.graphics.clear();
                	event = event.target || event.srcElement;
                	if (event.tagName == 'TD' && event.parentNode.tagName == 'TR') {
                        var rowIndex = event.parentNode.rowIndex - 1;
                        var selectRoad = _self.geojson.features[rowIndex];
                        if(selectRoad){
                        	_self.showVMSImage(selectRoad);
                        	_self.creatVMSImage(selectRoad);
                        	app.map.infoWindow.hide();
                        	var selectPnt = new esri.geometry.Point(selectRoad.geometry.coordinates[0], selectRoad.geometry.coordinates[1], app.map.spatialReference);
                        	var attrs = selectRoad.properties;
                        	var infoTemp = new esri.InfoTemplate("交通引导牌", "位置:${name} <br/>引导方向:${direction} <br/>");
                        	app.map.graphics.add(new esri.Graphic(selectPnt, _self.createSymbol("#2CA02C"), attrs, infoTemp));
                        	app.map.centerAt(selectPnt);
                        	if(_self.VMSInterval){
                        		clearInterval(_self.VMSInterval);
                        	}
                        	_self.VMSInterval = setInterval(function(){
                        		_self.showVMSImage(selectRoad);
            	        	},10000);
                        }
                    }
                });
			}
		},
		updateLayout: function(){
			var winBox = win.getBox();
			var headerBox = dojo.position(dojo.byId('header'));
			var knobBox = dojo.position(dojo.byId('knobTotal'));
			domStyle.set(dojo.byId('mapcon'), {
				"height": (winBox.h - headerBox.h - 2*12) + 'px'
			});
			domStyle.set(dojo.byId('chartIndexTotal'), {
				"height": (winBox.h - headerBox.h - knobBox.h - 2*12) + 'px'
			});
			// resize
            app.map.resize();
            app.map.reposition();
			var tableBox = dojo.position(dojo.byId('chartIndexTotal'));
			var tbTitleBox = dojo.position(dojo.byId('tbTitle'));
			var tbTheadBox = dojo.position(dojo.byId('tbThead'));
			domStyle.set(dojo.byId('VMSDiv'), {
				"height": (tableBox.h - tbTitleBox.h - tbTheadBox.h - 15) + 'px'
			});
			dojo.byId('detailCharts').style.display = 'none';
			$('#VMSDiv').perfectScrollbar('update');
		},
		RndNum: function(Min, Max) {
            var Range = Max - Min;
            var Rand = Math.random();
            return (Min + Math.round(Rand * Range));
        },
		createSymbol:function(color){
			var iconPath = "M13.6 1.6h-1.438c-0.354 0-0.642 0.288-0.642 0.64v6.080h-5.658c-0.264 0-0.592 0.061-0.906 0.157-0.317 0.098-0.619 0.232-0.835 0.379l-3.8 2.608c-0.214 0.147-0.322 0.341-0.322 0.536s0.107 0.389 0.322 0.536l3.8 2.608c0.216 0.147 0.518 0.282 0.835 0.379 0.314 0.096 0.642 0.157 0.906 0.157h5.658v14.080c0 0.354 0.288 0.64 0.64 0.64h1.44c0.354 0 0.64-0.288 0.64-0.64v-27.52c0-0.352-0.286-0.64-0.64-0.64zM31.678 8.266l-3.8-2.608c-0.214-0.147-0.517-0.282-0.834-0.379-0.315-0.098-0.643-0.158-0.907-0.158h-10.938l1.282 7.36h9.656c0.264 0 0.592-0.061 0.907-0.157s0.619-0.232 0.834-0.378l3.8-2.608c0.216-0.149 0.322-0.342 0.322-0.538s-0.106-0.389-0.322-0.534z";
			var markerSymbol = new esri.symbol.SimpleMarkerSymbol();
	        markerSymbol.setPath(iconPath);
	        markerSymbol.setColor(new dojo.Color(color));
	        markerSymbol.setOutline(null);
	        markerSymbol.setOffset(4,16);
	        return markerSymbol;
		},
		_bind: function(map){
		      this._connects = [];
		      this._connects.push( dojo.connect( map, "onZoomEnd", this, this._reset ) );
		      //this._connects.push( dojo.connect( this._map, "onPanEnd", this, this._reset ) );
		    },
		_project: function(x){
		    var p = new esri.geometry.Point( x[0], x[1] );
		    var point = app.map.toScreen( esri.geometry.webMercatorToGeographic( p ), app.map.spatialReference );
		    return [ point.x, point.y ];
		 },
		 _render: function(){
		      var self = this;
		      var p = this._paths();
		      	      
		      p.data( this.geojson.features )
		        .enter().append( "circle" )
		          .attr('cx', function(d, i) {return self._project(self.geojson.features[i].geometry.coordinates)[0]; } )
		          .attr('cy', function(d, i) { return self._project(self.geojson.features[i].geometry.coordinates)[1]; } )
		          .attr('transform', 'matrix(1.00000000,0.00000000,0.00000000,1.00000000,0.00000000,0.00000000)')
		          .attr("r", 4)
		          .attr('name', function(d, i){return self.geojson.features[i].properties['name'];})
		          .attr('direction', function(d, i){return self.geojson.features[i].properties['direction'];})
		          .attr('url', function(d, i){return self.geojson.features[i].properties['url'];});
	      
		      this._styles.forEach(function( s, i ) { 
		        self.style(s);
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
	          .attr("r", 4)
	          .attr('name', function(d, i){return self.geojson.features[i].properties['name'];})
	          .attr('direction', function(d, i){return self.geojson.features[i].properties['direction'];})
	          .attr('url', function(d, i){return self.geojson.features[i].properties['url'];});
		    },

		    _element: function(){
		      return d3.select("g#" + this.id + "_layer");
		    },

		    _paths: function(){
		      return this._element().selectAll( "circle" );
		    },
		    dispose: function(){	
				var _self = this;
	        	if(_self.VMSInterval){
            		clearInterval(_self.VMSInterval);
            	}
	        	if(_self.layoutInterval){
					clearInterval(_self.layoutInterval);
				}
	        	app.closeDialog();
	        	app.map.infoWindow.hide();
	        	app.map.graphics.clear();
	        	app.map.removeLayer(_self);
	        	app.map.setExtent(new esri.geometry.Extent(12913999.711897211, 4830387.145129631, 13008323.004800992, 4886491.923890875, app.map.spatialReference));
				dom.byId('chartIndexTotal').innerHTML = '';
				dom.byId('detailCharts').innerHTML = '';
				dom.byId('knobTotal').innerHTML = '';
				dojo.byId('detailCharts').style.display = 'block';
				domStyle.set(dojo.byId('mapcon'), {
					"height": '734px'
				});
				// resize
	            app.map.resize();
	            app.map.reposition();
			}
		    
	});
	return Widget;
});