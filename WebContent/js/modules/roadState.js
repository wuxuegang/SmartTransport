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
        "modules/AMapLayer",
        "modules/nvd3Module",
        "modules/TVoronoiDiagramLayer",
		"esri", 
		"esri/geometry", 
		"esri/graphic",
		"esri/utils" 
], function(ready, declare, connect, Deferred, lang, event, array, dom, query, domClass, domConstruct, domGeom, domStyle, date, number, win, on, coreFx, i18n, strings, AMapLayer, nvd3Module, TVoronoiDiagramLayer, esri) {
	var Widget = declare("modules.roadState", null, {
		constructor: function(options){
			var _self = this;
			this.deferreds = [];
			this.options = {
					url: '',
					interval: 20000,
					congestionStatUrl: 'http://eye.bjjtw.gov.cn/Web-T_bjjt_new/query.do?serviceType=jam&acode=110000&type=2&cls=4&rcd=40',
					congestionRoadUrl: 'http://eye.bjjtw.gov.cn/Web-T_bjjt_new/query.do?serviceType=jam&acode=110000&type=3&cls=0&rcd=40000',
					loopCongStatUrl: 'http://eye.bjjtw.gov.cn/Web-T_bjjt_new/query.do?serviceType=jam&acode=110000&type=2&cls=1&rcd=40',
					freeWayStatUrl: 'http://eye.bjjtw.gov.cn/Web-T_bjjt_new/query.do?serviceType=jam&acode=110000&type=2&cls=3&rcd=40',
					highWayCongStatUrl: 'http://eye.bjjtw.gov.cn/Web-T_bjjt_new/query.do?serviceType=jam&acode=110000&type=2&cls=2&rcd=40',
					allRoadsStateUrl: "http://eye.bjjtw.gov.cn/Web-T_bjjt_new/query.do?serviceType=jam&acode=110000&type=1&cls=4&rcd=1000"
			};
			this.chartOptions = {
					type: 'pie',
					domID: '#knobTotal svg',
					showLegend: true,
					data : [[
				        	{
				        		"key" : "拥堵路段",
				        		"y" : 0
				        	},
				        	{
				        		"key" : "缓慢路段",
				        		"y" : 0
				        	},
				        	{
				        		"key" : "畅通路段",
				        		"y" : 0
				        	}
				        ]]
			};
			this.multiBarOptions = {
					type: 'multiBarHorizontal',
					domID: '#chartIndexTotal svg',
					showControl: window.screen.width > 1024,
					data: [
					       {
					    	   key: "拥堵路段",
					    	   color: '#1F77B4',
					    	   values: [
					    	            {
					    	            	"label": '环线',
					    	            	"value": 0
					    	            },
					    	            {
					    	            	"label": '高速',
					    	            	"value": 0
					    	            }
					    	            ]
					       },
					       {
					    	   key: "缓慢路段",
					    	   color: '#FF7F0E',
					    	   values: [
					    	            {
					    	            	"label": '环线',
					    	            	"value": 0
					    	            },
					    	            {
					    	            	"label": '高速',
					    	            	"value": 0
					    	            }					    	            
					    	            ]
					       },
					       {
					    	   key: "畅通路段",
					    	   color: '#2CA02C',
					    	   values: [
					    	            {
					    	            	"label": '环线',
					    	            	"value": 0
					    	            },
					    	            {
					    	            	"label": '高速',
					    	            	"value": 0
					    	            }					    	            
					    	            ]
					       }
					       ]
			};
			this.loopchartOptions = {
					type: 'pie',
					domID: '#chartIndexTotal ul li #pool',
					showLegend: false,
					data : [[
				        	{
				        		"key" : "拥堵路段",
				        		"y" : 0
				        	},
				        	{
				        		"key" : "缓慢路段",
				        		"y" : 0
				        	},
				        	{
				        		"key" : "畅通路段",
				        		"y" : 0
				        	}
				        ]]
			};
			this.hwchartOptions = {
					type: 'pie',
					domID: '#chartIndexTotal ul li #highway',
					showLegend: false,
					data : [[
				        	{
				        		"key" : "拥堵路段",
				        		"y" : 0
				        	},
				        	{
				        		"key" : "缓慢路段",
				        		"y" : 0
				        	},
				        	{
				        		"key" : "畅通路段",
				        		"y" : 0
				        	}
				        ]]
			};
			declare.safeMixin(this.options, options);
			/*var testlayer = new TVoronoiDiagramLayer({
				url: this.options.url,
				roadStateurl: "http://eye.bjjtw.gov.cn/Web-T_bjjt_new/query.do?serviceType=jam&acode=110000&type=1&cls=4&rcd=1000",
				interval: 10000
			});
			app.map.addLayer(testlayer);*/
			this.isVrLoaded = false;
			_self.init();
		},
		init: function(){
			var _self = this;
			_self.initAMapLayer();
			_self.initDatas();
			_self.update();
			_self.congInterval = setInterval(function(){			
				_self.update();
			},_self.options.interval);
		},
		initDatas: function(){
			var _self = this;
			//cityRoad
			_self.cityConRoads = [];
			_self.cityRoadOptions = {
					type: 'CityRoad',
					name: '市内道路',
					data : [
				        	{
				        		"key" : "拥堵路段",
				        		"y" : 0
				        	},
				        	{
				        		"key" : "缓慢路段",
				        		"y" : 0
				        	},
				        	{
				        		"key" : "畅通路段",
				        		"y" : 0
				        	}
				        ]
			};
			_self.cityRoadHOptions = {
					type: 'CityRoad',
					name: '市内道路',
					data : [
				        	{
				        		"key" : "拥堵路段",
				        		"y" : 0
				        	},
				        	{
				        		"key" : "缓慢路段",
				        		"y" : 0
				        	},
				        	{
				        		"key" : "畅通路段",
				        		"y" : 0
				        	}
				        ]
			};
			//loopRad
			_self.loopRoadOptions = {
					type: 'LoopRoad',
					name: '环线',
					data : [
				        	{
				        		"key" : "拥堵路段",
				        		"y" : 0
				        	},
				        	{
				        		"key" : "缓慢路段",
				        		"y" : 0
				        	},
				        	{
				        		"key" : "畅通路段",
				        		"y" : 0
				        	}
				        ]
			};
			_self.loopRoadHOptions = {
					type: 'LoopRoad',
					name: '环线',
					data : [
				        	{
				        		"key" : "拥堵路段",
				        		"y" : 0
				        	},
				        	{
				        		"key" : "缓慢路段",
				        		"y" : 0
				        	},
				        	{
				        		"key" : "畅通路段",
				        		"y" : 0
				        	}
				        ]
			};
			//freeWay
			_self.freeWayOptions = {
					type: 'FreeWay',
					name: '快速路',
					data : [
				        	{
				        		"key" : "拥堵路段",
				        		"y" : 0
				        	},
				        	{
				        		"key" : "缓慢路段",
				        		"y" : 0
				        	},
				        	{
				        		"key" : "畅通路段",
				        		"y" : 0
				        	}
				        ]
			};
			_self.freeWayHOptions = {
					type: 'FreeWay',
					name: '快速路',
					data : [
				        	{
				        		"key" : "拥堵路段",
				        		"y" : 0
				        	},
				        	{
				        		"key" : "缓慢路段",
				        		"y" : 0
				        	},
				        	{
				        		"key" : "畅通路段",
				        		"y" : 0
				        	}
				        ]
			};
			//highWay
			_self.highWayOptions = {
					type: 'HighWay',
					name: '高速公路',
					data : [
				        	{
				        		"key" : "拥堵路段",
				        		"y" : 0
				        	},
				        	{
				        		"key" : "缓慢路段",
				        		"y" : 0
				        	},
				        	{
				        		"key" : "畅通路段",
				        		"y" : 0
				        	}
				        ]
			};
			_self.highWayHOptions = {
					type: 'HighWay',
					name: '高速公路',
					data : [
				        	{
				        		"key" : "拥堵路段",
				        		"y" : 0
				        	},
				        	{
				        		"key" : "缓慢路段",
				        		"y" : 0
				        	},
				        	{
				        		"key" : "畅通路段",
				        		"y" : 0
				        	}
				        ]
			};
			//Total
			_self.totalOptions = {
					type: 'Total',
					name: '总计',
					data : [
				        	{
				        		"key" : "拥堵路段",
				        		"y" : 0
				        	},
				        	{
				        		"key" : "缓慢路段",
				        		"y" : 0
				        	},
				        	{
				        		"key" : "畅通路段",
				        		"y" : 0
				        	}
				        ]
			};
			_self.totalHOptions = {
					type: 'Total',
					name: '总计',
					data : [
				        	{
				        		"key" : "拥堵路段",
				        		"y" : 0
				        	},
				        	{
				        		"key" : "缓慢路段",
				        		"y" : 0
				        	},
				        	{
				        		"key" : "畅通路段",
				        		"y" : 0
				        	}
				        ]
			};
		},
		initAMapLayer: function(){
			var _self = this;
			if(_self.aMapLayer){
				app.map.removeLayer(_self.aMapLayer);
				_self.aMapLayer = null;
			}
            _self.aMapLayer = new AMapLayer({
            	map: app.map,
                id: "aMapLayer",
                label: "交通流量",
                opacity: 0.75
            });
			app.map.addLayer(_self.aMapLayer);
		},
		initVoronoiLayer: function(){
			var self = this;
			var width = dojo.byId('map').clientWidth;
			var height = dojo.byId('map').clientHeight;
			self.isVrLoaded = true;
			self.vertices = d3.range(500).map(function(d) {
				  return [Math.random() * width, Math.random() * height];
				});
			self.voronoi = d3.geom.voronoi();
		    //.clipExtent([[0, 0], [width, height]]);
			self.svg = d3.select("#map_gc")
		    .on("mousemove", function() { self.vertices[0] = d3.mouse(this); self.redraw(); });
			self.path = self.svg.append("g").selectAll("path");
			self.svg.selectAll("circle")
		    .data(self.vertices.slice(1))
		  .enter().append("circle")
		    .attr("transform", function(d) { return "translate(" + d + ")"; })
		    .attr("r", 1.5);
			self.redraw();
		},
		redraw:function(){
			var self = this;
			self.path = self.path
		      .data(self.voronoi(self.vertices), self.polygon);

			self.path.exit().remove();

			self.path.enter().append("path")
		      .attr("class", function(d, i) { return "q" + (i % 9) + "-9"; })
		      .attr("d", self.polygon);

			self.path.order();
		},
		polygon: function(d){
			return "M" + d.join("L") + "Z";
		},
		creatCongestionChart: function(){
			var _self = this;
			var node = dom.byId('knobTotal');
			var html = '';
			html +='<h3>全路网拥堵比例:</h3>';
			html +='<svg></svg>';
			if (node && node.innerHTML=='') {
                node.innerHTML = html;
            }
			if(window.screen.width>1024){
			    dojo.byId('knobTotal').style.height = '400px';
			}
			else
				dojo.byId('knobTotal').style.height = '240px';
			_self.chartOptions.data[0] = _self.totalOptions.data;
			_self.options.totalChart = new nvd3Module(_self.chartOptions);
		},
		creatDetialCongestionChart: function(){
			var _self = this;
			var node = dom.byId('chartIndexTotal');
			var html = '';
			html +='<h3>其他类型路段拥堵比例:</h3>';
			html +='<svg></svg>';
			if (node && node.innerHTML=='') {
                node.innerHTML = html;
            }
			if(window.screen.width>1024){
				dojo.byId('chartIndexTotal').style.height = '320px';
			}
			else{
				dojo.byId('chartIndexTotal').style.height = '200px';
			}
			
			_self.options.otherRoadChart = new nvd3Module(_self.multiBarOptions);
		},
		creatDetialTable:function(){
			var _self = this;
			var node = dom.byId('chartIndexTotal');
			var html = '';
			html +='<h3>全路网拥堵明细:</h3>';	
			html +='<table class="pure-table">';
			html +='<thead><tr><th>类型</th><th>趋势</th><th>拥堵路段</th><th>缓慢路段</th><th>畅通路段</th></tr></thead>';
			html += '<tbody>';
			html += '<tr><td>' + _self.cityRoadOptions.name + '</td><td>' + _self.getTrend(_self.cityRoadOptions, _self.cityRoadHOptions) + '</td><td>' + _self.cityRoadOptions.data[0].y + '</td><td>' + _self.cityRoadOptions.data[1].y + '</td><td>' + _self.cityRoadOptions.data[2].y + '</td></tr>';
			html += '<tr><td>' + _self.loopRoadOptions.name + '</td><td>' + _self.getTrend(_self.loopRoadOptions, _self.loopRoadHOptions) + '</td><td>' + _self.loopRoadOptions.data[0].y + '</td><td>' + _self.loopRoadOptions.data[1].y + '</td><td>' + _self.loopRoadOptions.data[2].y + '</td></tr>';
			html += '<tr><td>' + _self.freeWayOptions.name + '</td><td>' + _self.getTrend(_self.freeWayOptions, _self.freeWayHOptions) + '</td><td>' + _self.freeWayOptions.data[0].y + '</td><td>' + _self.freeWayOptions.data[1].y + '</td><td>' + _self.freeWayOptions.data[2].y + '</td></tr>';
			html += '<tr><td>' + _self.highWayOptions.name + '</td><td>' + _self.getTrend(_self.highWayOptions, _self.highWayHOptions) + '</td><td>' + _self.highWayOptions.data[0].y + '</td><td>' + _self.highWayOptions.data[1].y + '</td><td>' + _self.highWayOptions.data[2].y + '</td></tr>';
			html += '<tr><td>' + _self.totalOptions.name + '</td><td>' + _self.getTrend(_self.totalOptions, _self.totalHOptions) + '</td><td>' + _self.totalOptions.data[0].y + '</td><td>' + _self.totalOptions.data[1].y + '</td><td>' + _self.totalOptions.data[2].y + '</td></tr>';
			html += '</tbody>';
			html += '</table>';
			if(node){
				domStyle.set(node, {
					"height": '100%'
				});
				node.innerHTML = html;
			}
		},
		creatConRoadDetial: function(){
			var _self = this;
			var node = dom.byId('detailCharts');
			var html = '';
			
			html += '<div class="width_3_quarter">';
			html += '<h3>市内拥堵路段列表：</h3>';		
			html += '<table class="pure-table">';
			html += '<thead><tr><th>道路名称</th><th>拥堵方向</th><th>起始位置</th><th>终止位置</th><th>拥堵信息</th></tr></thead>';
			html += '</table>';			
			html += '<div id="cityRoads" class="ps-container">';
			html += '<table id="cityRoadTable" class="pure-table" style="margin-top:0px;">';
			html += '<thead style="display: none;"><tr><th>道路名称</th><th>拥堵方向</th><th>起始位置</th><th>终止位置</th><th>拥堵信息</th></tr></thead>';
			html += '<tbody>';
			_self.cityConRoads.forEach(function(conRoad){
				html += '<tr><td>' + conRoad.road + '</td><td>' + conRoad.txtInfo[0].direction + '</td><td>' + conRoad.txtInfo[0].section[0].sName + '</td><td>' + conRoad.txtInfo[0].section[0].eName + '</td><td>' + conRoad.txtInfo[0].section[0].info + '</td></tr>';
			});
			html += '</tbody>';
			html += '</table>';			
			html += '</div>';
			html += '</div>';
			
			html += '<div class="width_quarter">';
			html +='<h3>拥堵及缓慢路段示意图：</h3>';
			html += '<img src="http://www.bjjtw.gov.cn/jtw_service/public/images/bmfw/zs001.png" height="460px"/>';
			html += '</div>';
			if (node) {
                node.innerHTML = html;
                $('#cityRoads').perfectScrollbar({wheelPropagation:false});
                $('#cityRoads').perfectScrollbar('update');
                connect.connect(dom.byId('cityRoadTable'), 'onclick', function(event){
                	app.map.graphics.clear();
                	event = event.target || event.srcElement;
                	if (event.tagName == 'TD' && event.parentNode.tagName == 'TR') {
                        var rowIndex = event.parentNode.rowIndex - 1;
                        var selectRoad = _self.cityConRoads[rowIndex];
                        if(selectRoad){
                        	var xyStart = esri.geometry.lngLatToXY(selectRoad.txtInfo[0].section[0].slonlat[0], selectRoad.txtInfo[0].section[0].slonlat[1]);
                        	var xyEnd = esri.geometry.lngLatToXY(selectRoad.txtInfo[0].section[0].elonlat[0], selectRoad.txtInfo[0].section[0].elonlat[1]);
                        	var pntStart = new esri.geometry.Point(xyStart[0], xyStart[1], app.map.spatialReference);
                        	var pntEnd = new esri.geometry.Point(xyEnd[0], xyEnd[1], app.map.spatialReference);
                        	var attrStart = {"Name":selectRoad.txtInfo[0].section[0].sName,"Info":selectRoad.txtInfo[0].section[0].info};
                        	var attrEnd = {"Name":selectRoad.txtInfo[0].section[0].eName,"Info":selectRoad.txtInfo[0].section[0].info};
                        	var infoTempleStart = new esri.InfoTemplate("拥堵起始位置", "${Name} <br/>${Info} <br/>");
                        	var infoTempleEnd = new esri.InfoTemplate("拥堵终止位置", "${Name} <br/>${Info} <br/>");
                        	//app.map.centerAndZoom(pntStart, 14);
                        	app.map.graphics.add(new esri.Graphic(pntStart, _self.createSymbol("#5F6F81"), attrStart, infoTempleStart));
                        	app.map.graphics.add(new esri.Graphic(pntEnd, _self.createSymbol("#FF7F0E"), attrEnd, infoTempleEnd));
                        	app.map.setExtent(_self.getExtent());
                        }
                    }
                });
            }
		},
		getTrend:function(options, hoptions){
			if(parseInt(options.data[0].y) > parseInt(hoptions.data[0].y))
				return '<span class="icon-arrow-up-right"></span>';
			else if(parseInt(options.data[0].y) < parseInt(hoptions.data[0].y))
				return '<span class="icon-arrow-down-right"></span>';
			else
				return '<span class="icon-arrow-right"></span>';
		},
		getExtent: function(){
			return esri.graphicsExtent(app.map.graphics.graphics).expand(3);
		},
		createSymbol:function(color){
			var iconPath = "M16 0c-6.627 0-12 5.373-12 12s12 20 12 20 12-13.373 12-20-5.373-12-12-12zM16 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zM16 8c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4z";
			var markerSymbol = new esri.symbol.SimpleMarkerSymbol();
	        markerSymbol.setPath(iconPath);
	        markerSymbol.setColor(new dojo.Color(color));
	        markerSymbol.setOutline(null);
	        return markerSymbol;
		},
		copyOptions:function(options, hoptions){
			hoptions.type = options.type;
			hoptions.name = options.name;
			hoptions.data[0].y = options.data[0].y;
			hoptions.data[1].y = options.data[1].y;
			hoptions.data[2].y = options.data[2].y;
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
		pushData: function(options, data){
			if(!data)return;
			options.data[0][0].y = data.nums.jam;
			options.data[0][1].y = data.nums.slow;
			options.data[0][2].y = data.nums.flow;
		},
		update: function(){
			var _self = this;
			//update AMapLayer
			_self.initAMapLayer();
			//update CongestionChart of all roads
			_self.updateStatInfo();
			_self.updateConRoadInfo();

		},
		updateStatInfo:function(){
			var _self = this;
			_self.constructQuery(_self.options.congestionStatUrl,function(data){
				_self.copyOptions(_self.cityRoadOptions, _self.cityRoadHOptions);
				_self.updataData(_self.cityRoadOptions, data);
				_self.constructQuery(_self.options.loopCongStatUrl, function(data){
					_self.copyOptions(_self.loopRoadOptions, _self.loopRoadHOptions);
					_self.updataData(_self.loopRoadOptions, data);
					_self.constructQuery(_self.options.highWayCongStatUrl, function(data){
						_self.copyOptions(_self.highWayOptions, _self.highWayHOptions);
						_self.updataData(_self.highWayOptions, data);
						_self.constructQuery(_self.options.freeWayStatUrl, function(data){
							_self.copyOptions(_self.freeWayOptions, _self.freeWayHOptions);
							_self.updataData(_self.freeWayOptions, data);
							_self.updataTotalData();
							_self.creatCongestionChart();
							_self.creatDetialTable();
							_self.onUpdateEnd();
						});
					});
				});
			});
		},
		updataData:function(options, data){
			if(!data)return;
			options.data[0].y = data.nums.jam;
			options.data[1].y = data.nums.slow;
			options.data[2].y = data.nums.flow;
		},
		updataTotalData:function(){
			var _self = this;
			_self.copyOptions(_self.totalOptions, _self.totalHOptions);
			_self.totalOptions.data[0].y = _self.cityRoadOptions.data[0].y + _self.loopRoadOptions.data[0].y + _self.highWayOptions.data[0].y + _self.freeWayOptions.data[0].y;
			_self.totalOptions.data[1].y = _self.cityRoadOptions.data[1].y + _self.loopRoadOptions.data[1].y + _self.highWayOptions.data[1].y + _self.freeWayOptions.data[1].y;
			_self.totalOptions.data[2].y = _self.cityRoadOptions.data[2].y + _self.loopRoadOptions.data[2].y + _self.highWayOptions.data[2].y + _self.freeWayOptions.data[2].y;
		},
		updateConRoadInfo: function(){
			var _self = this;
			_self.constructQuery(_self.options.congestionRoadUrl, function(data){
				_self.cityConRoads = data.roads;
				_self.creatConRoadDetial();
			});
		},
		onUpdateEnd: function(){},
		dispose: function(){	
			var _self = this;
        	array.forEach(_self.deferreds,function(def){
        		def.cancel();
        	});
        	if(_self.deferreds){
        		_self.deferreds.length = 0;
        	}
        	if(_self.congInterval){
				clearInterval(_self.congInterval);
			}
        	app.map.graphics.clear();
        	app.map.removeLayer(_self.aMapLayer);
        	app.map.setExtent(new esri.geometry.Extent(12913999.711897211, 4830387.145129631, 13008323.004800992, 4886491.923890875, app.map.spatialReference));
			dom.byId('chartIndexTotal').innerHTML = '';
			dom.byId('detailCharts').innerHTML = '';
			dom.byId('knobTotal').innerHTML = '';
			dojo.byId('knobTotal').style.height = '100%';
		}
	});
	return Widget;
});