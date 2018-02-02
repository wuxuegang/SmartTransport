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
        "modules/nvd3Module",
        "modules/congestionLayer",
        "modules/AMapLayer",
		"esri", 
		"esri/geometry", 
		"esri/utils" 
], function(ready, declare, connect, Deferred, lang, event, array, dom, query, domClass, domConstruct, domGeom, domStyle, date, number, win, on, coreFx, i18n, nvd3Module, congestionLayer, AMapLayer, esri) {
	var Widget = declare("modules.congestionIndex", null, {
		constructor : function(options) {
			var _self = this;
			this.deferreds = [];
			this.options = {
				url : '',
				historyUrl : '',
				beiJing: '',
				interval : 10000,
				congestionIndexUrl: 'http://www.bjjtw.gov.cn/jtw_service/page/service/congestion_index.jsp'
			};
			this.chartOptions = {
					XaxisLabel: '',
					YaxisLabel: '',
					type: 'line',
					domID: '#chartIndexTotal svg',
					data : [
				        	{
				        		"key" : "今日",
				        		"color": '#ff7f0e',
				        		"values" : []
				        	},
				        	{
				        		"key" : "昨日",
				        		"bar": true,
				        		"color": '#2ca02c',
				        		"values" : []
				        	}
				        ]
			};
			this.chartSpeedOptions = {
					XaxisLabel: '',
					YaxisLabel: '',
					type: 'singleline',
					domID: '#chartSpeedTotal svg',
					data : [
				        	{
				        		"key" : "平均速度(km/h)",
				        		"color": '#ff7f0e',
				        		"values" : []
				        	}
				        ]
			};
			this.datialChart = {
					type: 'multiChart',
					domID: '#detailCharts svg',
					data: [
		                   {
		                	   key:"西城区指数",
		                	   values:[]
		                   },
		                   {
		                	   key:"东城区指数",
		                	   values:[]
		                   },
		                   {
		                	   key:"海淀区指数",
		                	   values:[]
		                   },
		                   {
		                	   key:"朝阳区指数",
		                	   values:[]
		                   },
		                   {
		                	   key:"丰台区指数",
		                	   values:[]
		                   },
		                   {
		                	   key:"石景山区指数",
		                	   values:[]
		                   }
		                   ]
			};
			this.eastChartOptions = {
					type: 'linePlusBar',
					domID: '#east svg',
					data : [
				        	{
				        		"key" : "指数",
				        		"color": '#ff7f0e',
				        		"values" : []
				        	},
				        	{
				        		"key" : "平均速度",
				        		"bar": true,
				        		"color": '#2ca02c',
				        		"values" : []
				        	}
				        ]
			};
			this.westChartOptions = {
					type: 'linePlusBar',
					domID: '#west svg',
					data : [
				        	{
				        		"key" : "指数",
				        		"color": '#ff7f0e',
				        		"values" : []
				        	},
				        	{
				        		"key" : "平均速度",
				        		"bar": true,
				        		"color": '#2ca02c',
				        		"values" : []
				        	}
				        ]
			};
			this.hdChartOptions = {
					type: 'linePlusBar',
					domID: '#hd svg',
					data : [
				        	{
				        		"key" : "指数",
				        		"color": '#ff7f0e',
				        		"values" : []
				        	},
				        	{
				        		"key" : "平均速度",
				        		"bar": true,
				        		"color": '#2ca02c',
				        		"values" : []
				        	}
				        ]
			};
			this.cyChartOptions = {
					type: 'linePlusBar',
					domID: '#cy svg',
					data : [
				        	{
				        		"key" : "指数",
				        		"color": '#ff7f0e',
				        		"values" : []
				        	},
				        	{
				        		"key" : "平均速度",
				        		"bar": true,
				        		"color": '#2ca02c',
				        		"values" : []
				        	}
				        ]
			};
			this.ftChartOptions = {
					type: 'linePlusBar',
					domID: '#ft svg',
					data : [
				        	{
				        		"key" : "指数",
				        		"color": '#ff7f0e',
				        		"values" : []
				        	},
				        	{
				        		"key" : "平均速度",
				        		"bar": true,
				        		"color": '#2ca02c',
				        		"values" : []
				        	}
				        ]
			};
			this.sjsChartOptions = {
					type: 'linePlusBar',
					domID: '#sjs svg',
					data : [
				        	{
				        		"key" : "指数",
				        		"color": '#ff7f0e',
				        		"values" : []
				        	},
				        	{
				        		"key" : "平均速度",
				        		"bar": true,
				        		"color": '#2ca02c',
				        		"values" : []
				        	}
				        ]
			};
            this.isBusy = false;
			declare.safeMixin(this.options, options);
			_self.init();
		},
		init: function() {
			var _self = this;
			//get yesterday's data
			esri.request({
				url: _self.options.historyUrl,
				handleAs: "text",
				timeout: _self.options.interval,
				load: lang.hitch(this, function(data){
					eval("var jsonobj = " + data);
					this.chartOptions.data[0].values = jsonobj.valuesToday;
					this.chartOptions.data[1].values = jsonobj.valuesYestorday;
				}),
				error: lang.hitch(this, function(e){
					this.onError(e.message);
				})
			});
			
			_self.constructQuery();
			//loop for today
			if(_self.congInterval){
				clearInterval(_self.congInterval);
			}
			_self.congInterval = setInterval(function(){
				_self.update();
			},_self.options.interval);
			
			//initial congestion layers
			_self.initStatAreaLayer();
			
		},
		initStatAreaLayer: function(){
			var _self = this;
			if(_self.options.beiJing && _self.options.beiJing.url){
				_self.options.beiJing.attrs.push({
					key: 'id',
					value: function(d){
							return 'path'+d.properties[_self.options.beiJing.key];
						}
				});
				_self.options.beiJing.attrs.push({
					key: 'Name',
					value: function(d){
							return d.properties['Name'];
						}
				});
				_self.statAreaLayer = new congestionLayer(_self.options.beiJing.url,_self.options.beiJing);
				app.map.addLayer(_self.statAreaLayer);
			}
		},
		update: function() {
			var _self = this;
			if (_self.isBusy){
				_self.onUpdateEnd();
				return;
			}
			this.constructQuery();
		},
		constructQuery: function() {
			var _self = this;
			_self.isBusy = true;
			var query = _self.options.url + "?url=" + _self.options.congestionIndexUrl;
			_self.sendRequest(query);
		},
		sendRequest: function(url){
			var _self = this;
			var deferred = esri.request({
				url: url,
				handleAs: "text",
				timeout: _self.options.interval,
				load: lang.hitch(this, function(data){
					eval("var jsonobj = " + data);   
					if(!jsonobj.All){
						_self.currentlyData = null;
						this.onError('Can not get data from ' + _self.options.congestionIndexUrl);
						return;
					}
					_self.currentlyData = jsonobj;
					//Added by Zhangnan
					app.currentTrafficData = jsonobj;
					//Added by Zhangnan
                    _self.pushDatas(jsonobj);
					_self.creatKnob();
					_self.creatIndexChart();
					//_self.creatSpeedChart();
					_self.creatDetailCharts();
					_self.statAreaLayer.updateData(jsonobj);
				}),
				error: lang.hitch(this, function(e){
					_self.currentlyData = null;
					this.onError(e.message);
				})
			});
			_self.onUpdateEnd();
			_self.deferreds.push(deferred);
		},
		pushDatas: function(jsonobj){
			var _self = this;
			var now = new Date();
			//all
			if(_self.chartOptions.data[0].values.length == 0 || _self.chartOptions.data[0].values[_self.chartOptions.data[0].values.length-1].y!=jsonobj.All.congestionIndex){
				_self.chartOptions.data[0].values.push({
					x : Math.round(now.getTime()/1000),
					y : jsonobj.All.congestionIndex
				});			
			}
			//if(_self.chartSpeedOptions.data[0].values[_self.chartSpeedOptions.data[0].values.length-1].y!=jsonobj.All.speed){
		
			//}
			_self.chartSpeedOptions.data[0].values.push({
				x : Math.round(now.getTime()/1000),
				y : jsonobj.All.speed
			});	

			//datail
			_self.datialChart.data[0].values.push({
				x : Math.round(now.getTime()/1000),
				y : jsonobj.westCity.congestionIndex
			});
			_self.datialChart.data[1].values.push({
				x : Math.round(now.getTime()/1000),
				y : jsonobj.eastCity.congestionIndex
			});
			_self.datialChart.data[2].values.push({
				x : Math.round(now.getTime()/1000),
				y : jsonobj.haiDian.congestionIndex
			});
			_self.datialChart.data[3].values.push({
				x : Math.round(now.getTime()/1000),
				y : jsonobj.chaoYang.congestionIndex
			});
			_self.datialChart.data[4].values.push({
				x : Math.round(now.getTime()/1000),
				y : jsonobj.fengTai.congestionIndex
			});
			_self.datialChart.data[5].values.push({
				x : Math.round(now.getTime()/1000),
				y : jsonobj.siJingSan.congestionIndex
			});
			/*
			_self.datialChart.data[6].values.push({
				x : Math.round(now.getTime()/1000),
				y : jsonobj.westCity.speed
			});
			_self.datialChart.data[7].values.push({
				x : Math.round(now.getTime()/1000),
				y : jsonobj.eastCity.speed
			});
			_self.datialChart.data[8].values.push({
				x : Math.round(now.getTime()/1000),
				y : jsonobj.haiDian.speed
			});
			_self.datialChart.data[9].values.push({
				x : Math.round(now.getTime()/1000),
				y : jsonobj.chaoYang.speed
			});
			_self.datialChart.data[10].values.push({
				x : Math.round(now.getTime()/1000),
				y : jsonobj.fengTai.speed
			});
			_self.datialChart.data[11].values.push({
				x : Math.round(now.getTime()/1000),
				y : jsonobj.siJingSan.speed
			});*/
			//west
			_self.westChartOptions.data[0].values.push({
				x : Math.round(now.getTime()/1000),
				y : jsonobj.westCity.congestionIndex
			});
			_self.westChartOptions.data[1].values.push({
				x : Math.round(now.getTime()/1000),
				y : jsonobj.westCity.speed
			});
			//east
			_self.eastChartOptions.data[0].values.push({
				x : Math.round(now.getTime()/1000),
				y : jsonobj.eastCity.congestionIndex
			});
			_self.eastChartOptions.data[1].values.push({
				x : Math.round(now.getTime()/1000),
				y : jsonobj.eastCity.speed
			});
			//haidian
			_self.hdChartOptions.data[0].values.push({
				x : Math.round(now.getTime()/1000),
				y : jsonobj.haiDian.congestionIndex
			});
			_self.hdChartOptions.data[1].values.push({
				x : Math.round(now.getTime()/1000),
				y : jsonobj.haiDian.speed
			});
			//chaoyang
			_self.cyChartOptions.data[0].values.push({
				x : Math.round(now.getTime()/1000),
				y : jsonobj.chaoYang.congestionIndex
			});
			_self.cyChartOptions.data[1].values.push({
				x : Math.round(now.getTime()/1000),
				y : jsonobj.chaoYang.speed
			});
			//fengtai
			_self.ftChartOptions.data[0].values.push({
				x : Math.round(now.getTime()/1000),
				y : jsonobj.fengTai.congestionIndex
			});
			_self.ftChartOptions.data[1].values.push({
				x : Math.round(now.getTime()/1000),
				y : jsonobj.fengTai.speed
			});
			//shijinshan
			_self.sjsChartOptions.data[0].values.push({
				x : Math.round(now.getTime()/1000),
				y : jsonobj.siJingSan.congestionIndex
			});
			_self.sjsChartOptions.data[1].values.push({
				x : Math.round(now.getTime()/1000),
				y : jsonobj.siJingSan.speed
			});
		},
		creatIndexChart: function(){
			var _self = this;
			var node = dom.byId('chartIndexTotal');
			var html = '';
			html +='<h3>拥堵指数走势图:</h3>';
			html +='<svg></svg>';
            if (node && node.innerHTML=='') {
            	domStyle.set(node, {
					"height": '420px'
				});
                node.innerHTML = html;
            }
            _self.options.totalChart = new nvd3Module(_self.chartOptions);
		},
		creatSpeedChart: function(){
			var _self = this;
			var node = dom.byId('chartSpeedTotal');
			var html = '';
			//html +='<h3>平均速度走势图:</h3>';
			html +='<svg></svg>';
            if (node && node.innerHTML=='') {
                node.innerHTML = html;
            }
            _self.options.totalSpeedChart = new nvd3Module(_self.chartSpeedOptions);
		},
		creatDetailCharts: function(){
			var _self = this;
			var node = dom.byId('detailCharts');
			var html = '';
			html +='<h3>各区域交通情况走势：</h3>';
			html +='<svg style="height:500px;"></svg>';
			/*
			html +='<div id="hd" class="width_half">';
			html +='<h3>海淀区：</h3>';
			html +='<svg></svg>';
			html +='</div>';
			html +='<div class="clear"></div>';
			html +='<div id="west" class="width_half">';
			html +='<h3>西城区：</h3>';
			html +='<svg></svg>';
			html +='</div>';
			html +='<div id="cy" class="width_half">';
			html +='<h3>朝阳区：</h3>';
			html +='<svg></svg>';
			html +='</div>';
			html +='<div class="clear"></div>';
			html +='<div id="ft" class="width_half">';
			html +='<h3>丰台区：</h3>';
			html +='<svg></svg>';
			html +='</div>';
			html +='<div id="sjs" class="width_half">';
			html +='<h3>石景山区：</h3>';
			html +='<svg></svg>';
			html +='</div>';*/
            if (node && node.innerHTML=='') {
                node.innerHTML = html;
            }
            _self.options.eastChart = new nvd3Module(_self.datialChart);
            /*
            _self.options.hdChart = new nvd3Module(_self.hdChartOptions);
            _self.options.westChart = new nvd3Module(_self.westChartOptions);
            _self.options.cyChart = new nvd3Module(_self.cyChartOptions);
            _self.options.ftChart = new nvd3Module(_self.ftChartOptions);
            _self.options.sjsChart = new nvd3Module(_self.sjsChartOptions);*/
		},
		creatKnob: function(){
			var _self = this;
			var node = dom.byId('knobTotal');
			var html = '';
			html +='<h3>全路网交通指数:</h3>';
			html +='<ul style="margin:0;">';
			html +='<li class="width_auto">';
			html +='<input class="knob" data-displayInput="false" data-readOnly="true" data-max="10" data-width="100" data-fgColor="#E77826" data-bgColor="#FFFFFF" data-thickness=".1" value="'+_self.currentlyData.All.congestionIndex+'">';
			html +='<p>交通指数</p>';
			html +='</li>';
			html +='<li class="width_auto">';
			html +='<input class="knob" data-displayInput="false" data-readOnly="true" data-max="10" data-width="100" data-fgColor="#4B98DC" data-bgColor="#FFFFFF" data-thickness=".1" value="'+_self.currentlyData.All.congestionIndex+'">';
			html +='<p>拥堵等级</p>';
			html +='</li>';
			html +='<li class="width_auto">';
			html +='<input class="knob" data-displayInput="false" data-readOnly="true" data-max="100" data-width="100" data-fgColor="#4FC281" data-bgColor="#FFFFFF" data-thickness=".1" value="'+_self.currentlyData.All.speed+'">';
			html +='<p>平均速度(km/h)</p>';
			html +='</li>';
			html +='</ul>';
            if (node) {
                node.innerHTML = html;
            }
            $(".knob").knob();
		},
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
			
			app.map.removeLayer(_self.statAreaLayer);
			app.map.setExtent(new esri.geometry.Extent(12913999.711897211, 4830387.145129631, 13008323.004800992, 4886491.923890875, app.map.spatialReference));
			dom.byId('chartIndexTotal').innerHTML = '';
			dom.byId('detailCharts').innerHTML = '';
			dom.byId('knobTotal').innerHTML = '';
		},
		// events
		onUpdateEnd: function() {
			var _self = this;
			_self.isBusy = false;

		},
		onError: function(msg){
			console.log("ERROR-[congestionIndex]:",msg);
		}
	});
	return Widget;
});