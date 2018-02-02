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
	var Widget = declare("modules.weatherState", null, {
		constructor: function(options){
			var _self = this;
			this.deferreds = [];
			this.options = {
					cityList: [
					           {
					        	   name: '北京市',
					        	   code: '101010100',
					        	   lon: '39.89',
					        	   lat: '116.37',
					        	   initialized: false,
					        	   cityInfo:{
						        		temp1: '',
						        		temp2: '',
						        		weather: '',
						        		img:''
						        	},
						        	realTimeInfo:{
						        		temp: '',
						        		wd: '',
						        		ws: '',
						        		sd: '',
						        		time: ''
						        	},
						        	data:{
						        		temp1: '',
						        		temp2: '',
						        		temp3: '',
						        		temp4: '',
						        		temp5: '',
						        		temp6: '',
						        		weather1: '',
						        		weather2: '',
						        		weather3: '',
						        		weather4: '',
						        		weather5: '',
						        		weather6: ''
						        	}	   
					           },
					           {
					        	   name: '海淀',
					        	   code: '101010200',
					        	   lon: '39.9584559159',
					        	   lat: '116.2919448432',
					        	   initialized: false,
					        	   cityInfo:{
						        		temp1: '',
						        		temp2: '',
						        		weather: '',
						        		img:''
						        	},
						        	realTimeInfo:{
						        		temp: '',
						        		wd: '',
						        		ws: '',
						        		sd: '',
						        		time: ''
						        	},
						        	data:{
						        		temp1: '',
						        		temp2: '',
						        		temp3: '',
						        		temp4: '',
						        		temp5: '',
						        		temp6: '',
						        		weather1: '',
						        		weather2: '',
						        		weather3: '',
						        		weather4: '',
						        		weather5: '',
						        		weather6: ''
						        	}
					           },
					           {
					        	   name: '朝阳',
					        	   code: '101010300',
					        	   lon: '39.919651645',
					        	   lat: '116.4369760039',
					        	   initialized: false,
					        	   cityInfo:{
						        		temp1: '',
						        		temp2: '',
						        		weather: '',
						        		img:''
						        	},
						           realTimeInfo:{
						        		temp: '',
						        		wd: '',
						        		ws: '',
						        		sd: '',
						        		time: ''
						        	},
						        	data:{
						        		temp1: '',
						        		temp2: '',
						        		temp3: '',
						        		temp4: '',
						        		temp5: '',
						        		temp6: '',
						        		weather1: '',
						        		weather2: '',
						        		weather3: '',
						        		weather4: '',
						        		weather5: '',
						        		weather6: ''
						        	}
					           },
					           {
					        	   name: '顺义',
					        	   code: '101010400',
					        	   lon: '40.13',
					        	   lat: '116.62',
					        	   initialized: false,
					        	   cityInfo:{
						        		temp1: '',
						        		temp2: '',
						        		weather: '',
						        		img:''
						        	},
						        	realTimeInfo:{
						        		temp: '',
						        		wd: '',
						        		ws: '',
						        		sd: '',
						        		time: ''
						        	},
						        	data:{
						        		temp1: '',
						        		temp2: '',
						        		temp3: '',
						        		temp4: '',
						        		temp5: '',
						        		temp6: '',
						        		weather1: '',
						        		weather2: '',
						        		weather3: '',
						        		weather4: '',
						        		weather5: '',
						        		weather6: ''
						        	}
					           },
					           {
					        	   name: '怀柔',
					        	   code: '101010500',
					        	   lon: '40.37',
					        	   lat: '116.63',
					        	   initialized: false,
					        	   cityInfo:{
						        		temp1: '',
						        		temp2: '',
						        		weather: '',
						        		img:''
						        	},
						        	realTimeInfo:{
						        		temp: '',
						        		wd: '',
						        		ws: '',
						        		sd: '',
						        		time: ''
						        	},
						        	data:{
						        		temp1: '',
						        		temp2: '',
						        		temp3: '',
						        		temp4: '',
						        		temp5: '',
						        		temp6: '',
						        		weather1: '',
						        		weather2: '',
						        		weather3: '',
						        		weather4: '',
						        		weather5: '',
						        		weather6: ''
						        	}
					           },
					           {
					        	   name: '通州',
					        	   code: '101010600',
					        	   lon: '39.84',
					        	   lat: '116.62',
					        	   initialized: false,
					        	   cityInfo:{
						        		temp1: '',
						        		temp2: '',
						        		weather: '',
						        		img:''
						        	},
						        	realTimeInfo:{
						        		temp: '',
						        		wd: '',
						        		ws: '',
						        		sd: '',
						        		time: ''
						        	},
						        	data:{
						        		temp1: '',
						        		temp2: '',
						        		temp3: '',
						        		temp4: '',
						        		temp5: '',
						        		temp6: '',
						        		weather1: '',
						        		weather2: '',
						        		weather3: '',
						        		weather4: '',
						        		weather5: '',
						        		weather6: ''
						        	}
					           },
					           {
					        	   name: '昌平',
					        	   code: '101010700',
					        	   lon: '40.22',
					        	   lat: '116.22',
					        	   initialized: false,
					        	   cityInfo:{
						        		temp1: '',
						        		temp2: '',
						        		weather: '',
						        		img:''
						        	},
						        	realTimeInfo:{
						        		temp: '',
						        		wd: '',
						        		ws: '',
						        		sd: '',
						        		time: ''
						        	},
						        	data:{
						        		temp1: '',
						        		temp2: '',
						        		temp3: '',
						        		temp4: '',
						        		temp5: '',
						        		temp6: '',
						        		weather1: '',
						        		weather2: '',
						        		weather3: '',
						        		weather4: '',
						        		weather5: '',
						        		weather6: ''
						        	}
					           },
					           {
					        	   name: '延庆',
					        	   code: '101010200',
					        	   lon: '40.45',
					        	   lat: '115.97',
					        	   initialized: false,
					        	   cityInfo:{
						        		temp1: '',
						        		temp2: '',
						        		weather: '',
						        		img:''
						        	},
						        	realTimeInfo:{
						        		temp: '',
						        		wd: '',
						        		ws: '',
						        		sd: '',
						        		time: ''
						        	},
						        	data:{
						        		temp1: '',
						        		temp2: '',
						        		temp3: '',
						        		temp4: '',
						        		temp5: '',
						        		temp6: '',
						        		weather1: '',
						        		weather2: '',
						        		weather3: '',
						        		weather4: '',
						        		weather5: '',
						        		weather6: ''
						        	}
					           },
					           {
					        	   name: '丰台',
					        	   code: '101010900',
					        	   lon: '39.84',
					        	   lat: '116.27',
					        	   initialized: false,
					        	   cityInfo:{
						        		temp1: '',
						        		temp2: '',
						        		weather: '',
						        		img:''
						        	},
						        	realTimeInfo:{
						        		temp: '',
						        		wd: '',
						        		ws: '',
						        		sd: '',
						        		time: ''
						        	},
						        	data:{
						        		temp1: '',
						        		temp2: '',
						        		temp3: '',
						        		temp4: '',
						        		temp5: '',
						        		temp6: '',
						        		weather1: '',
						        		weather2: '',
						        		weather3: '',
						        		weather4: '',
						        		weather5: '',
						        		weather6: ''
						        	}
					           },
					           {
					        	   name: '石景山',
					        	   code: '101011000',
					        	   lon: '39.9044174582',
					        	   lat: '116.2168068432',
					        	   initialized: false,
					        	   cityInfo:{
						        		temp1: '',
						        		temp2: '',
						        		weather: '',
						        		img:''
						        	},
						        	realTimeInfo:{
						        		temp: '',
						        		wd: '',
						        		ws: '',
						        		sd: '',
						        		time: ''
						        	},
						        	data:{
						        		temp1: '',
						        		temp2: '',
						        		temp3: '',
						        		temp4: '',
						        		temp5: '',
						        		temp6: '',
						        		weather1: '',
						        		weather2: '',
						        		weather3: '',
						        		weather4: '',
						        		weather5: '',
						        		weather6: ''
						        	}
					           },
					           {
					        	   name: '大兴',
					        	   code: '101011100',
					        	   lon: '39.72',
					        	   lat: '116.35',
					        	   initialized: false,
					        	   cityInfo:{
						        		temp1: '',
						        		temp2: '',
						        		weather: '',
						        		img:''
						        	},
						        	realTimeInfo:{
						        		temp: '',
						        		wd: '',
						        		ws: '',
						        		sd: '',
						        		time: ''
						        	},
						        	data:{
						        		temp1: '',
						        		temp2: '',
						        		temp3: '',
						        		temp4: '',
						        		temp5: '',
						        		temp6: '',
						        		weather1: '',
						        		weather2: '',
						        		weather3: '',
						        		weather4: '',
						        		weather5: '',
						        		weather6: ''
						        	}
					           },
					           {
					        	   name: '房山',
					        	   code: '101011200',
					        	   lon: '39.68',
					        	   lat: '116.13',
					        	   initialized: false,
					        	   cityInfo:{
						        		temp1: '',
						        		temp2: '',
						        		weather: '',
						        		img:''
						        	},
						        	realTimeInfo:{
						        		temp: '',
						        		wd: '',
						        		ws: '',
						        		sd: '',
						        		time: ''
						        	},
						        	data:{
						        		temp1: '',
						        		temp2: '',
						        		temp3: '',
						        		temp4: '',
						        		temp5: '',
						        		temp6: '',
						        		weather1: '',
						        		weather2: '',
						        		weather3: '',
						        		weather4: '',
						        		weather5: '',
						        		weather6: ''
						        	}
					           },
					           {
					        	   name: '密云',
					        	   code: '101011300',
					        	   lon: '40.38',
					        	   lat: '116.87',
					        	   initialized: false,
					        	   cityInfo:{
						        		temp1: '',
						        		temp2: '',
						        		weather: '',
						        		img:''
						        	},
						        	realTimeInfo:{
						        		temp: '',
						        		wd: '',
						        		ws: '',
						        		sd: '',
						        		time: ''
						        	},
						        	data:{
						        		temp1: '',
						        		temp2: '',
						        		temp3: '',
						        		temp4: '',
						        		temp5: '',
						        		temp6: '',
						        		weather1: '',
						        		weather2: '',
						        		weather3: '',
						        		weather4: '',
						        		weather5: '',
						        		weather6: ''
						        	}
					           },
					           {
					        	   name: '门头沟',
					        	   code: '101011400',
					        	   lon: '39.92',
					        	   lat: '116.12',
					        	   initialized: false,
					        	   cityInfo:{
						        		temp1: '',
						        		temp2: '',
						        		weather: '',
						        		img:''
						        	},
						        	realTimeInfo:{
						        		temp: '',
						        		wd: '',
						        		ws: '',
						        		sd: '',
						        		time: ''
						        	},
						        	data:{
						        		temp1: '',
						        		temp2: '',
						        		temp3: '',
						        		temp4: '',
						        		temp5: '',
						        		temp6: '',
						        		weather1: '',
						        		weather2: '',
						        		weather3: '',
						        		weather4: '',
						        		weather5: '',
						        		weather6: ''
						        	}
					           },
					           {
					        	   name: '平谷',
					        	   code: '101011500',
					        	   lon: '40.17',
					        	   lat: '117.12',
					        	   initialized: false,
					        	   cityInfo:{
						        		temp1: '',
						        		temp2: '',
						        		weather: '',
						        		img:''
						        	},
						           realTimeInfo:{
						        		temp: '',
						        		wd: '',
						        		ws: '',
						        		sd: '',
						        		time: ''
						        	},
						        	data:{
						        		temp1: '',
						        		temp2: '',
						        		temp3: '',
						        		temp4: '',
						        		temp5: '',
						        		temp6: '',
						        		weather1: '',
						        		weather2: '',
						        		weather3: '',
						        		weather4: '',
						        		weather5: '',
						        		weather6: ''
						        	}
					           }
					           ],
					interval: 20000,
					cityInfoUrl: 'http://www.weather.com.cn/data/cityinfo/$.html',
					dataUrl: 'http://m.weather.com.cn/data/$.html?_=1387135809650',
					skUrl: 'http://www.weather.com.cn/data/sk/$.html',
					zsUrl: 'http://flash.weather.com.cn/sk2/$.xml',
					imageUrl: 'http://www.weather.com.cn/m2/i/icon_weather/29x20/'
			};
			declare.safeMixin(this.options, options);
			_self.init();
		},
		init: function(){
			var _self = this;
			esri.config.defaults.io.proxyUrl = 'proxy/proxy.jsp';	
			domStyle.set(dojo.byId('knobTotal'), {
				"height": '398px'
			});
			_self.getCityInfo();
			
		},
		creatRealTimeInfo: function(city){
			var _self = this;
			var node = dom.byId('knobTotal');
			var html = '';
			html += '<h3>当前实况(' + city.name + '):</h3>';
			html += '<div style="margin-left: auto;margin-right: auto;display: table;">';
			html += '<div>';
			html += '<p style="font-weight: bolder;color: #E77826;font-size: 64px;margin:0px;text-align: center;">' + city.realTimeInfo.temp + '</p>';
			html += '<p style="font-weight: bolder;color: #E77826;font-size: 16px;margin:0px;text-align: center;">' + city.cityInfo.weather + '</p>';
			html += '<p style="font-weight: bolder;color: #E77826;font-size: 16px;margin:0px;text-align: center;">' + city.realTimeInfo.wd + ' ' + city.realTimeInfo.ws + '</p>';
			html += '<p style="font-weight: bolder;color: #E77826;font-size: 16px;margin:0px;text-align: center;">湿度 ' + city.realTimeInfo.sd + '</p>';
			html += '</div>';
			html += '<div style="width: 100px;height: 100px;display: table-cell;">';
			html += _self.getWeatherIcon(city.cityInfo.weather);
			html += '</div>';
			html += '</div>';
			html +='<ul style="margin:0;">';
			html +='<li class="width_auto">';
			html += '<div style="width: 100px;height: 100px;">';
			html += _self.getWeatherIcon(city.data.weather1);
			html += '</div>';
			html +='<p>今天</p>';
			html +='<p>' + city.data.temp1 + '</p>';
			html +='</li>';
			html +='<li class="width_auto">';
			html += '<div style="width: 100px;height: 100px;">';
			html += _self.getWeatherIcon(city.data.weather2);
			html += '</div>';
			html +='<p>明天</p>';
			html +='<p>' + city.data.temp2 + '</p>';
			html +='</li>';
			html +='<li class="width_auto">';
			html += '<div style="width: 100px;height: 100px;">';
			html += _self.getWeatherIcon(city.data.weather3);
			html += '</div>';
			html +='<p>后天</p>';
			html +='<p>' + city.data.temp3 + '</p>';
			html +='</li>';
			html +='</ul>';
			if (node){
				node.innerHTML = html;
			}
		},
		creatCityTable: function(){
			var _self = this;
			var node = dom.byId('chartIndexTotal');
			var html = '';
			html += '<h3 id="tbTitle">城市列表：</h3>';
			html += '<table id="tbThead" class="pure-table">';
			html += '<thead><tr><th>城市</th><th>天气</th><th>温度</th></tr></thead>';
			html += '</table>';	
			html += '<div id="VMSDiv" class="ps-container">';
			html += '<table id="VMSTable" class="pure-table" style="margin-top:0px;">';
			html += '<thead style="display: none;"><tr><th>城市</th><th>天气</th><th>温度</th></tr></thead>';
			html += '<tbody>';
			_self.options.cityList.forEach(function(city){
				html += '<tr><td>' + city.name + '</td><td>' + city.cityInfo.weather + '</td><td>' + city.cityInfo.temp1 + '~' + city.cityInfo.temp2 + '</td></tr>';
			});
			html += '</tbody>';
			html += '</table>';
			html += '</div>';
			if (node){
				node.innerHTML = html;
				$('#VMSDiv').perfectScrollbar({wheelPropagation:false});
                $('#VMSDiv').perfectScrollbar('update');
                connect.connect(dom.byId('VMSTable'), 'onclick', function(event){
                	event = event.target || event.srcElement;
                	if (event.tagName == 'TD' && event.parentNode.tagName == 'TR') {
                        var rowIndex = event.parentNode.rowIndex - 1;
                        var selectCity = _self.options.cityList[rowIndex];
                        if(selectCity){
                        	array.forEach(app.map.graphics.graphics,function(graphic){
                        		if(graphic.attributes){
                        			var attr = graphic.attributes;
                    				if(selectCity.name == attr.name){
                    					app.map.infoWindow.setFeatures([graphic]);
                    			        app.map.infoWindow.show(graphic.geometry);
                    		        	app.map.infoWindow.reposition();
                    					app.map.centerAt(graphic.geometry);
                    				}
                        		}
                			},this);
                        	_self.getRealTimeInfo(selectCity);
                        }
                    }
                });
                _self.updateLayout();
			}
		},
		getCityInfo: function(){
			var _self = this;
			array.forEach(_self.options.cityList,function(city){
				_self.constructQuery(_self.options.cityInfoUrl.replace('$', city.code), function(result){
					city.cityInfo.temp1 = result.weatherinfo.temp1;
					city.cityInfo.temp2 = result.weatherinfo.temp2;
					city.cityInfo.weather = result.weatherinfo.weather;
					city.cityInfo.img = _self.options.imageUrl + result.weatherinfo.img1;
					city.initialized = true;
					_self.appendGeo(city);
					for(var i = 0; i < _self.options.cityList.length; i++){
						if(!_self.options.cityList[i].initialized)
							return;
					}
					_self.getRealTimeInfo(_self.options.cityList[0]);
					_self.creatCityTable();
					//app.map.setExtent(_self.getExtent());
				});
        	});
		},
		getRealTimeInfo: function(city){
			var _self = this;
			_self.constructQuery(_self.options.skUrl.replace('$', city.code), function(relResult){
				city.realTimeInfo.temp = relResult.weatherinfo.temp + '℃';
				city.realTimeInfo.wd = relResult.weatherinfo.WD;
				city.realTimeInfo.ws = relResult.weatherinfo.WS;
				city.realTimeInfo.sd = relResult.weatherinfo.SD;
				city.realTimeInfo.time = relResult.weatherinfo.time;
				_self.constructQuery(_self.options.dataUrl.replace('$', city.code), function(data){
					city.data.temp1 = data.weatherinfo.temp1;
					city.data.temp2 = data.weatherinfo.temp2;
					city.data.temp3 = data.weatherinfo.temp3;
					city.data.temp4 = data.weatherinfo.temp4;
					city.data.temp5 = data.weatherinfo.temp5;
					city.data.temp6 = data.weatherinfo.temp6;
					city.data.weather1 = data.weatherinfo.weather1;
					city.data.weather2 = data.weatherinfo.weather2;
					city.data.weather3 = data.weatherinfo.weather3;
					city.data.weather4 = data.weatherinfo.weather4;
					city.data.weather5 = data.weatherinfo.weather5;
					city.data.weather6 = data.weatherinfo.weather6;
					_self.creatRealTimeInfo(city);
				});
			});
		},
		appendGeo: function(city){
			var _self = this;
			app.map.infoWindow.hide();
			var xy = esri.geometry.lngLatToXY(city.lat, city.lon);
			var selectPnt = new esri.geometry.Point(xy[0], xy[1], app.map.spatialReference);
			var attrs = {"name":city.name,"weather":city.cityInfo.weather,"temp":city.cityInfo.temp1+'~'+city.cityInfo.temp2};
			var infoTemp = new esri.InfoTemplate("${name}", "天气：${weather} <br/>气温：${temp} <br/>");
			app.map.graphics.add(new esri.Graphic(selectPnt, _self.createSymbol(city.cityInfo.img), attrs, infoTemp));
		},
		getExtent: function(){
			return esri.graphicsExtent(app.map.graphics.graphics);
		},
		createSymbol: function(img){
			var pictureMarkerSymbol = new esri.symbol.PictureMarkerSymbol(img, 29, 20);
			return pictureMarkerSymbol;
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
		constructQuery: function(queryUrl, callback) {
			var _self = this;
			_self.isBusy = true;
			var query = queryUrl;
			_self.sendRequest(query, callback);
		},
		sendRequest: function(url, callback){
			var _self = this;
			var deferred = esri.request({
				url: url,
				handleAs: "json",
				timeout: _self.options.interval,
				load: lang.hitch(this, function(data){
					//eval("var jsonobj = " + data);
					if(callback)callback(data);
				}),
				error: lang.hitch(this, function(e){
					console.log("error", e.message);
				})
			},{usePost: false});
			
			_self.deferreds.push(deferred);
		},
		getWeatherIcon: function(weather){
			var _self = this;
			var icon = '';
			if(weather == '晴'){
				icon = _self.getSun();
			}
			else if(weather.indexOf('沙') > -1){
				icon = _self.getSandstorm();
			}
			else if(weather.indexOf('雾') > -1 || weather.indexOf('霾') > -1){
				icon = _self.getFog();
			}
			else if(weather.indexOf('雷') > -1){
				icon = _self.getStrom();
			}
			else if(weather.indexOf('雪') > -1){
				icon = _self.getSnow();
			}
			else if(weather.indexOf('雨') > -1){
				icon = _self.getRain();
			}
			else if(weather.indexOf('多云') > -1){
				icon = _self.getCloudy();
			}
			else if(weather.indexOf('阴') > -1){
				icon = _self.getCloud();
			}
			else{
				icon = _self.getSun();
			}
			return icon;
		},
		//晴
		getSun: function(){
			var sun = '';
			sun += '<svg version="1.1" id="sun" class="climacon climacon_sun" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="15 15 70 70" enable-background="new 15 15 70 70" xml:space="preserve">';
			sun += '<clipPath id="sunFillClip">';
			sun += '<path d="M0,0v100h100V0H0z M50.001,57.999c-4.417,0-8-3.582-8-7.999c0-4.418,3.582-7.999,8-7.999s7.998,3.581,7.998,7.999C57.999,54.417,54.418,57.999,50.001,57.999z"/>';
			sun += '</clipPath>';
			sun += '<g class="climacon_iconWrap climacon_iconWrap-sun">';
			sun += '<g class="climacon_componentWrap climacon_componentWrap-sun">';
			sun += '<g class="climacon_componentWrap climacon_componentWrap-sunSpoke">';
			sun += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_sunSpoke climacon_component-stroke_sunSpoke-east" d="M72.03,51.999h-3.998c-1.105,0-2-0.896-2-1.999s0.895-2,2-2h3.998c1.104,0,2,0.896,2,2S73.136,51.999,72.03,51.999z"/>';
			sun += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_sunSpoke climacon_component-stroke_sunSpoke-northEast" d="M64.175,38.688c-0.781,0.781-2.049,0.781-2.828,0c-0.781-0.781-0.781-2.047,0-2.828l2.828-2.828c0.779-0.781,2.047-0.781,2.828,0c0.779,0.781,0.779,2.047,0,2.828L64.175,38.688z"/>';
			sun += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_sunSpoke climacon_component-stroke_sunSpoke-north" d="M50.034,34.002c-1.105,0-2-0.896-2-2v-3.999c0-1.104,0.895-2,2-2c1.104,0,2,0.896,2,2v3.999C52.034,33.106,51.136,34.002,50.034,34.002z"/>';
			sun += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_sunSpoke climacon_component-stroke_sunSpoke-northWest" d="M35.893,38.688l-2.827-2.828c-0.781-0.781-0.781-2.047,0-2.828c0.78-0.781,2.047-0.781,2.827,0l2.827,2.828c0.781,0.781,0.781,2.047,0,2.828C37.94,39.469,36.674,39.469,35.893,38.688z"/>';
			sun += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_sunSpoke climacon_component-stroke_sunSpoke-west" d="M34.034,50c0,1.104-0.896,1.999-2,1.999h-4c-1.104,0-1.998-0.896-1.998-1.999s0.896-2,1.998-2h4C33.14,48,34.034,48.896,34.034,50z"/>';
			sun += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_sunSpoke climacon_component-stroke_sunSpoke-southWest" d="M35.893,61.312c0.781-0.78,2.048-0.78,2.827,0c0.781,0.78,0.781,2.047,0,2.828l-2.827,2.827c-0.78,0.781-2.047,0.781-2.827,0c-0.781-0.78-0.781-2.047,0-2.827L35.893,61.312z"/>';
			sun += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_sunSpoke climacon_component-stroke_sunSpoke-south" d="M50.034,65.998c1.104,0,2,0.895,2,1.999v4c0,1.104-0.896,2-2,2c-1.105,0-2-0.896-2-2v-4C48.034,66.893,48.929,65.998,50.034,65.998z"/>';
			sun += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_sunSpoke climacon_component-stroke_sunSpoke-southEast" d="M64.175,61.312l2.828,2.828c0.779,0.78,0.779,2.047,0,2.827c-0.781,0.781-2.049,0.781-2.828,0l-2.828-2.827c-0.781-0.781-0.781-2.048,0-2.828C62.126,60.531,63.392,60.531,64.175,61.312z"/>';
			sun += '</g>';
			sun += '<g class="climacon_componentWrap climacon_componentWrap_sunBody" clip-path="url(#sunFillClip)">';
			sun += '<circle class="climacon_component climacon_component-stroke climacon_component-stroke_sunBody" cx="50.034" cy="50" r="11.999"/>';
			sun += '</g>';
			sun += '</g>';
			sun += '</g>';
			sun += '</svg>';
			return sun;
		},
		//阴
		getCloud: function(){
			var icon = '';
			icon += '<svg version="1.1" id="cloud" class="climacon climacon_cloud" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="15 15 70 70" enable-background="new 15 15 70 70" xml:space="preserve">';
			icon += '<clipPath id="cloudFillClip">';
			icon += '<path d="M15,15v70h70V15H15z M59.943,61.639c-3.02,0-12.381,0-15.999,0c-6.626,0-11.998-5.371-11.998-11.998c0-6.627,5.372-11.999,11.998-11.999c5.691,0,10.434,3.974,11.665,9.29c1.252-0.81,2.733-1.291,4.334-1.291c4.418,0,8,3.582,8,8C67.943,58.057,64.361,61.639,59.943,61.639z"/>';
			icon += '</clipPath>';
			icon += '<g class="climacon_iconWrap climacon_iconWrap-cloud">';
			icon += '<g class="climacon_componentWrap climacon_componentWrap_cloud" clip-path="url(#cloudFillClip)">';
			icon += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_cloud" d="M43.945,65.639c-8.835,0-15.998-7.162-15.998-15.998c0-8.836,7.163-15.998,15.998-15.998c6.004,0,11.229,3.312,13.965,8.203c0.664-0.113,1.338-0.205,2.033-0.205c6.627,0,11.998,5.373,11.998,12c0,6.625-5.371,11.998-11.998,11.998C57.168,65.639,47.143,65.639,43.945,65.639z"/>';
			icon += '</g>';
			icon += '</g>';
			icon += '</svg>';
			return icon;
		},
		//多云
		getCloudy: function(){
			var icon = '';
			icon += '<svg version="1.1" id="cloudSun" class="climacon climacon_cloudSun" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="15 15 70 70" enable-background="new 15 15 70 70" xml:space="preserve">';
			icon += '<clipPath id="cloudFillClip">';
			icon += '<path d="M15,15v70h70V15H15z M59.943,61.639c-3.02,0-12.381,0-15.999,0c-6.626,0-11.998-5.371-11.998-11.998c0-6.627,5.372-11.999,11.998-11.999c5.691,0,10.434,3.974,11.665,9.29c1.252-0.81,2.733-1.291,4.334-1.291c4.418,0,8,3.582,8,8C67.943,58.057,64.361,61.639,59.943,61.639z"/>';
			icon += '</clipPath>';
			icon += '<clipPath id="sunCloudFillClip">';
			icon += '<path d="M15,15v70h70V15H15z M57.945,49.641c-4.417,0-8-3.582-8-7.999c0-4.418,3.582-7.999,8-7.999s7.998,3.581,7.998,7.999C65.943,46.059,62.362,49.641,57.945,49.641z"/>';
			icon += '</clipPath>';
			icon += '<g class="climacon_iconWrap climacon_cloudSun-iconWrap">';
			icon += '<g clip-path="url(#cloudFillClip)">';
			icon += '<g class="climacon_componentWrap climacon_componentWrap-sun climacon_componentWrap-sun_cloud"  >';
			icon += '<g class="climacon_componentWrap climacon_componentWrap_sunSpoke">';
			icon += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_sunSpoke climacon_component-stroke_sunSpoke-orth" d="M80.029,43.611h-3.998c-1.105,0-2-0.896-2-1.999s0.895-2,2-2h3.998c1.104,0,2,0.896,2,2S81.135,43.611,80.029,43.611z"/>';
			icon += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_sunSpoke climacon_component-stroke_sunSpoke-north" d="M72.174,30.3c-0.781,0.781-2.049,0.781-2.828,0c-0.781-0.781-0.781-2.047,0-2.828l2.828-2.828c0.779-0.781,2.047-0.781,2.828,0c0.779,0.781,0.779,2.047,0,2.828L72.174,30.3z"/>';
			icon += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_sunSpoke climacon_component-stroke_sunSpoke-north" d="M58.033,25.614c-1.105,0-2-0.896-2-2v-3.999c0-1.104,0.895-2,2-2c1.104,0,2,0.896,2,2v3.999C60.033,24.718,59.135,25.614,58.033,25.614z"/>';
			icon += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_sunSpoke climacon_component-stroke_sunSpoke-north" d="M43.892,30.3l-2.827-2.828c-0.781-0.781-0.781-2.047,0-2.828c0.78-0.781,2.047-0.781,2.827,0l2.827,2.828c0.781,0.781,0.781,2.047,0,2.828C45.939,31.081,44.673,31.081,43.892,30.3z"/>';
			icon += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_sunSpoke climacon_component-stroke_sunSpoke-north" d="M42.033,41.612c0,1.104-0.896,1.999-2,1.999h-4c-1.104,0-1.998-0.896-1.998-1.999s0.896-2,1.998-2h4C41.139,39.612,42.033,40.509,42.033,41.612z"/>';
			icon += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_sunSpoke climacon_component-stroke_sunSpoke-north" d="M43.892,52.925c0.781-0.78,2.048-0.78,2.827,0c0.781,0.78,0.781,2.047,0,2.828l-2.827,2.827c-0.78,0.781-2.047,0.781-2.827,0c-0.781-0.78-0.781-2.047,0-2.827L43.892,52.925z"/>';
			icon += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_sunSpoke climacon_component-stroke_sunSpoke-north" d="M58.033,57.61c1.104,0,2,0.895,2,1.999v4c0,1.104-0.896,2-2,2c-1.105,0-2-0.896-2-2v-4C56.033,58.505,56.928,57.61,58.033,57.61z"/>';
			icon += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_sunSpoke climacon_component-stroke_sunSpoke-north" d="M72.174,52.925l2.828,2.828c0.779,0.78,0.779,2.047,0,2.827c-0.781,0.781-2.049,0.781-2.828,0l-2.828-2.827c-0.781-0.781-0.781-2.048,0-2.828C70.125,52.144,71.391,52.144,72.174,52.925z"/>';
			icon += '</g>';
			icon += '<g class="climacon_componentWrap climacon_componentWrap-sunBody" clip-path="url(#sunCloudFillClip)">';
			icon += '<circle class="climacon_component climacon_component-stroke climacon_component-stroke_sunBody" cx="58.033" cy="41.612" r="11.999"/>';
			icon += '</g>';
			icon += '</g>';
			icon += '</g>';
			icon += '<g class="climacon_componentWrap climacon_componentWrap-cloud" clip-path="url(#cloudFillClip)">';
			icon += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_cloud" d="M44.033,65.641c-8.836,0-15.999-7.162-15.999-15.998c0-8.835,7.163-15.998,15.999-15.998c6.006,0,11.233,3.312,13.969,8.203c0.664-0.113,1.338-0.205,2.033-0.205c6.627,0,11.998,5.373,11.998,12c0,6.625-5.371,11.998-11.998,11.998C57.26,65.641,47.23,65.641,44.033,65.641z"/>';
			icon += '</g>';
			icon += '</g>';
			icon += '</svg>';
			return icon;
		},
		//雨
		getRain: function(){
			var icon = '';
			icon += '<svg version="1.1" id="cloudDrizzleAlt" class="climacon climacon_cloudDrizzleAlt" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="15 15 70 70" enable-background="new 15 15 70 70" xml:space="preserve">';
			icon += '<g class="climacon_iconWrap climacon_iconWrap-cloudDrizzleAlt">';
			icon += '<g class="climacon_componentWrap climacon_componentWrap-drizzle">';
			icon += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_drizzle climacon_component-stroke_drizzle-left" id="Drizzle-Left_1_" d="M56.969,57.672l-2.121,2.121c-1.172,1.172-1.172,3.072,0,4.242c1.17,1.172,3.07,1.172,4.24,0c1.172-1.17,1.172-3.07,0-4.242L56.969,57.672z"/>';
			icon += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_drizzle climacon_component-stroke_drizzle-middle" d="M50.088,57.672l-2.119,2.121c-1.174,1.172-1.174,3.07,0,4.242c1.17,1.172,3.068,1.172,4.24,0s1.172-3.07,0-4.242L50.088,57.672z"/>';
			icon += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_drizzle climacon_component-stroke_drizzle-right" d="M43.033,57.672l-2.121,2.121c-1.172,1.172-1.172,3.07,0,4.242s3.07,1.172,4.244,0c1.172-1.172,1.172-3.07,0-4.242L43.033,57.672z"/>';
			icon += '</g>';
			icon += '<g class="climacon_componentWrap climacon_componentWrap-cloud">';
			icon += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_cloud" d="M59.943,41.642c-0.696,0-1.369,0.092-2.033,0.205c-2.736-4.892-7.961-8.203-13.965-8.203c-8.835,0-15.998,7.162-15.998,15.997c0,5.992,3.3,11.207,8.177,13.947c0.276-1.262,0.892-2.465,1.873-3.445l0.057-0.057c-3.644-2.061-6.106-5.963-6.106-10.445c0-6.626,5.372-11.998,11.998-11.998c5.691,0,10.433,3.974,11.666,9.29c1.25-0.81,2.732-1.291,4.332-1.291c4.418,0,8,3.581,8,7.999c0,3.443-2.182,6.371-5.235,7.498c0.788,1.146,1.194,2.471,1.222,3.807c4.666-1.645,8.014-6.077,8.014-11.305C71.941,47.014,66.57,41.642,59.943,41.642z"/>';
			icon += '</g>';
			icon += '</g>';
			icon += '</svg>';
			return icon;
		},
		//雪
		getSnow: function(){
			var icon = '';
			icon += '<svg version="1.1" id="cloudHailAlt" class="climacon climacon_cloudHailAlt" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="15 15 70 70" enable-background="new 15 15 70 70" xml:space="preserve">';
			icon += '<g class="climacon_iconWrap climacon_iconWrap-cloudHailAlt">';
			icon += '<g class="climacon_componentWrap climacon_componentWrap-hailAlt">';
			icon += '<g class="climacon_component climacon_component-stroke climacon_component-stroke_hailAlt climacon_component-stroke_hailAlt-left">';
			icon += '<circle cx="42" cy="65.498" r="2"/>';
			icon += '</g>';
			icon += '<g class="climacon_component climacon_component-stroke climacon_component-stroke_hailAlt climacon_component-stroke_hailAlt-middle">';
			icon += '<circle cx="49.999" cy="65.498" r="2"/>';
			icon += '</g>';
			icon += '<g class="climacon_component climacon_component-stroke climacon_component-stroke_hailAlt climacon_component-stroke_hailAlt-right">';
			icon += '<circle cx="57.998" cy="65.498" r="2"/>';
			icon += '</g>';
			icon += '<g class="climacon_component climacon_component-stroke climacon_component-stroke_hailAlt climacon_component-stroke_hailAlt-left">';
			icon += '<circle cx="42" cy="65.498" r="2"/>';
			icon += '</g>';
			icon += '<g class="climacon_component climacon_component-stroke climacon_component-stroke_hailAlt climacon_component-stroke_hailAlt-middle">';
			icon += '<circle cx="49.999" cy="65.498" r="2"/>';
			icon += '</g>';
			icon += '<g class="climacon_component climacon_component-stroke climacon_component-stroke_hailAlt climacon_component-stroke_hailAlt-right">';
			icon += '<circle cx="57.998" cy="65.498" r="2"/>';
			icon += '</g>';
			icon += '</g>';
			icon += '<g class="climacon_componentWrap climacon_componentWrap-cloud">';
			icon += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_cloud" d="M63.999,64.941v-4.381c2.39-1.384,3.999-3.961,3.999-6.92c0-4.417-3.581-8-7.998-8c-1.602,0-3.084,0.48-4.334,1.291c-1.23-5.317-5.974-9.29-11.665-9.29c-6.626,0-11.998,5.372-11.998,11.998c0,3.549,1.55,6.728,3.999,8.924v4.916c-4.776-2.768-7.998-7.922-7.998-13.84c0-8.835,7.162-15.997,15.997-15.997c6.004,0,11.229,3.311,13.966,8.203c0.663-0.113,1.336-0.205,2.033-0.205c6.626,0,11.998,5.372,11.998,12C71.998,58.863,68.656,63.293,63.999,64.941z"/>';
			icon += '</g>';
			icon += '</g>';
			icon += '</svg>';
			return icon;
		},
		//雷
		getStrom: function(){
			var icon = '';
			icon += '<svg version="1.1" id="cloudLightning" class="climacon climacon_cloudLightning" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="15 15 70 70" enable-background="new 15 15 70 70" xml:space="preserve">';
			icon += '<g class="climacon_iconWrap climacon_iconWrap-cloudLightning">';
			icon += '<g class="climacon_componentWrap climacon_componentWrap-lightning">';
			icon += '<polygon class="climacon_component climacon_component-stroke climacon_component-stroke_lightning" points="48.001,51.641 57.999,51.641 52,61.641 58.999,61.641 46.001,77.639 49.601,65.641 43.001,65.641 "/>';
			icon += '</g>';
			icon += '<g class="climacon_componentWrap climacon_componentWrap-cloud">';
			icon += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_cloud" d="M59.999,65.641c-0.28,0-0.649,0-1.062,0l3.584-4.412c3.182-1.057,5.478-4.053,5.478-7.588c0-4.417-3.581-7.998-7.999-7.998c-1.602,0-3.083,0.48-4.333,1.29c-1.231-5.316-5.974-9.29-11.665-9.29c-6.626,0-11.998,5.372-11.998,12c0,5.446,3.632,10.039,8.604,11.503l-1.349,3.777c-6.52-2.021-11.255-8.098-11.255-15.282c0-8.835,7.163-15.999,15.998-15.999c6.004,0,11.229,3.312,13.965,8.204c0.664-0.114,1.338-0.205,2.033-0.205c6.627,0,11.999,5.371,11.999,11.999C71.999,60.268,66.626,65.641,59.999,65.641z"/>';
			icon += '</g>';
			icon += '</g>';
			icon += '</svg>';
			return icon;
		},
		//雾霾
		getFog: function(){
			var icon = '';
			icon += '<svg version="1.1" id="cloudFogAlt" class="climacon climacon_cloudFogAlt" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="15 15 70 70" enable-background="new 15 15 70 70" xml:space="preserve">';
			icon += '<g class="climacon_iconWrap climacon_iconWrap-cloudFogAlt">';
			icon += '<g class="climacon_componentWrap climacon_componentWrap-Fog">';
			icon += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_fogLine" d="M29.177,55.641c-0.262-0.646-0.473-1.314-0.648-2h43.47c0,0.685-0.069,1.349-0.181,2H29.177z"/>';
			icon += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_fogLine" d="M36.263,35.643c2.294-1.271,4.93-1.999,7.738-1.999c2.806,0,5.436,0.73,7.728,1.999H36.263z"/>';
			icon += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_fogLine" d="M28.142,47.642c0.085-0.682,0.218-1.347,0.387-1.999h40.396c0.552,0.613,1.039,1.281,1.455,1.999H28.142z"/>';
			icon += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_fogLine" d="M29.177,43.643c0.281-0.693,0.613-1.359,0.984-2h27.682c0.04,0.068,0.084,0.135,0.123,0.205c0.664-0.114,1.339-0.205,2.033-0.205c2.451,0,4.729,0.738,6.627,2H29.177z"/>';
			icon += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_fogLine" d="M31.524,39.643c0.58-0.723,1.225-1.388,1.92-2h21.123c0.689,0.61,1.326,1.28,1.902,2H31.524z"/>';
			icon += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_fogLine" d="M71.816,51.641H28.142c-0.082-0.656-0.139-1.32-0.139-1.999h43.298C71.527,50.285,71.702,50.953,71.816,51.641z"/>';
			icon += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_fogLine" d="M71.301,57.641c-0.246,0.699-0.555,1.367-0.921,2H31.524c-0.505-0.629-0.957-1.299-1.363-2H71.301z"/>';
			icon += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_fogLine" d="M33.444,61.641h35.48c-0.68,0.758-1.447,1.435-2.299,2H36.263C35.247,63.078,34.309,62.4,33.444,61.641z"/>';
			icon += '</g>';
			icon += '</g>';
			icon += '</svg>';
			return icon;
		},
		//沙尘暴
		getSandstorm: function(){
			var icon = '';
			icon += '<svg version="1.1" id="tornado" class="climacon climacon_tornado" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="15 15 70 70" enable-background="new 15 15 70 70" xml:space="preserve">';
			icon += '<g class="climacon_iconWrap climacon_iconWrap-tornado">';
			icon += '<g class="climacon_componentWrap climacon_componentWrap-tornado">';
			icon += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_tornadoLine" d="M68.997,36.459H31.002c-1.104,0-2-0.896-2-1.999c0-1.104,0.896-2,2-2h37.995c1.104,0,2,0.896,2,2C70.997,35.563,70.102,36.459,68.997,36.459z"/>';
			icon += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_tornadoLine" d="M35.002,40.459h29.996c1.104,0,2,0.896,2,2s-0.896,1.999-2,1.999H35.002c-1.104,0-2-0.896-2-1.999C33.002,41.354,33.898,40.459,35.002,40.459z"/>';
			icon += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_tornadoLine" d="M39.001,48.458h21.998c1.104,0,1.999,0.896,1.999,1.999c0,1.104-0.896,2-1.999,2H39.001c-1.104,0-1.999-0.896-1.999-2C37.002,49.354,37.897,48.458,39.001,48.458z"/>';
			icon += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_tornadoLine" d="M47,64.456h5.999c1.104,0,2,0.896,2,1.999s-0.896,2-2,2H47c-1.104,0-2-0.896-2-2S45.896,64.456,47,64.456z"/>';
			icon += '<path class="climacon_component climacon_component-stroke climacon_component-stroke_tornadoLine" d="M40.869,58.456c0-1.104,0.896-1.999,2-1.999h13.998c1.104,0,2,0.896,2,1.999c0,1.104-0.896,2-2,2H42.869C41.765,60.456,40.869,59.561,40.869,58.456z"/>';
			icon += '</g>';
			icon += '</g>';
			icon += '</svg>';
			return icon;
		},
		onUpdateEnd: function(){},
		dispose: function(){	
			var _self = this;
        	if(_self.VMSInterval){
        		clearInterval(_self.VMSInterval);
        	}
        	if(_self.layoutInterval){
				clearInterval(_self.layoutInterval);
			}
        	app.map.infoWindow.hide();
        	app.map.graphics.clear();
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