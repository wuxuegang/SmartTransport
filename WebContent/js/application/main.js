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
        "dojo/cookie",
        "modules/nvd3Module",
        "modules/congestionIndex",
        "modules/roadState",
        "modules/VMSLayer",
        "modules/weatherState",
        "modules/emergencyState",
		"modules/weiboManager",
        "dijit/Dialog",
        "dijit/form/HorizontalSlider",
        "dijit/form/VerticalSlider",
        "dojo/NodeList-traverse",
        "dojo/NodeList-manipulate",
        "esri", 
        "esri/dijit/Geocoder",
        "esri/geometry",
        "esri/graphic",
        "esri/utils",
        "esri/map",
        "esri/IdentityManager",
        "esri/widgets",
        "esri/arcgis/utils",
        "esri/tasks/query"
],function(ready, declare, connect, Deferred, lang, event, array, dom, query, domClass, domConstruct, domGeom, domStyle, date, number, win, on, coreFx, i18n, Cookie, nvd3Module, congestionIndex, roadState, VMSLayer, weatherState, emergencyState, weiboManager, Dialog, HorizontalSlider, VerticalSlider, nlTraverse, nlManipulate,esri){
	var Widget = declare("application.main",null,{
		constructor: function(options){
			var _self = this;
			this.options = {};
			declare.safeMixin(_self.options, options);
			_self.setOptions();
			_self.init();
			// 对Date的扩展，将 Date 转化为指定格式的String  
			Date.prototype.Format = function(fmt) 
			{
			  var o = { 
			    "M+" : this.getMonth()+1,                 //月份 
			    "d+" : this.getDate(),                    //日 
			    "h+" : this.getHours(),                   //小时 
			    "m+" : this.getMinutes(),                 //分 
			    "s+" : this.getSeconds(),                 //秒 
			    "q+" : Math.floor((this.getMonth()+3)/3), //季度 
			    "S"  : this.getMilliseconds()             //毫秒 
			  }; 
			  if(/(y+)/.test(fmt)) 
			    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
			  for(var k in o) 
			    if(new RegExp("("+ k +")").test(fmt)) 
			  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
			  return fmt; 
			};
		},
		setDefaultOptions: function(){
			var _self = this;
			_self.options.homePage = "index.html";
            // Set geometry to HTTPS if protocol is used
            if (_self.options.geometryserviceurl && location.protocol === "https:") {
                _self.options.geometryserviceurl = _self.options.geometryserviceurl.replace('http:', 'https:');
            }
            esri.config.defaults.geometryService = new esri.tasks.GeometryService(_self.options.geometryserviceurl);
            //Set default date
            _self.startDateTime = new Date('2009/03/15 12:00:00');
            
            _self.options.currentModule = null;
		},
		setOptions: function(){
			var _self = this;
			_self.setDefaultOptions();
		},
		mapIsLoaded: function(){
			var _self = this;
            connect.connect(window, "onresize", function(){
                _self.resizeMap();
            });
            _self.loadConIndex();
            _self.releaseAppBusy();
		},
		constructMenu: function(){
			var _self = this;
			var html = '';
			var menuNode = dojo.byId('gn-menu');
			html += '<li class="gn-trigger">';
			html += '<a class="gn-icon gn-icon-menu"><span>Menu</span></a>';
			html += '<nav class="gn-menu-wrapper">';
			html += '<div class="gn-scroller">';
			html += '<ul class="gn-menu">';
			
			/*html += '<li class="gn-search-item">';
			html += '<input placeholder="查找" type="search" class="gn-search">';
			html += '<a class="gn-icon gn-icon-search"><span>查找</span></a>';
			html += '</li>';*/
			
			html += '<li>';
			html += '<a class="gn-icon gn-icon-road">道路交通实时监控</a>';
			html += '<ul class="gn-submenu">';
			html += '<li><a id="congestionItem" class="gn-icon gn-icon-rout">实时交通指数监控</a></li>';
			html += '<li><a id="roadStateItem" class="gn-icon gn-icon-visiable">实时路况监控</a></li>';
			html += '<li><a id="vmsViewerItem" class="gn-icon gn-icon-logo1">重点路段VMS监控</a></li>';
			html += '<li><a id="weatherStateItem" class="gn-icon gn-icon-cloud">交通天气监控</a></li>';
			html += '</ul>';
			html += '</li>';
			
			/*html += '<li>';
			html += '<a class="gn-icon gn-icon-logo3">道路交通分析预测</a>';
			html += '<ul class="gn-submenu">';
			html += '<li><a class="gn-icon gn-icon-statgra">交通流量分析</a></li>';
			html += '<li><a class="gn-icon gn-icon-blackpoint">交通黑点分析</a></li>';
			html += '<li><a class="gn-icon gn-icon-congestion">道路拥堵预测</a></li>';
			html += '</ul>';
			html += '</li>';*/
			
			html += '<li>';
			html += '<a id="emergencyManager" class="gn-icon gn-icon-sets3">交通应急与指挥</a>';
			//html += '<ul class="gn-submenu">';
			//html += '<li><a class="gn-icon gn-icon-emgenci">事故点定位</a></li>';
			//html += '<li><a class="gn-icon gn-icon-carm">应急资源监控</a></li>';
			//html += '<li><a class="gn-icon gn-icon-bus">牵引车调度指挥</a></li>';
			//html += '</ul>';
			html += '</li>';
			
			html += '<li>';
			html += '<a class="gn-icon gn-icon-talk">交通信息共享及发布</a>';
			html += '<ul class="gn-submenu">';
			//html += '<li><a class="gn-icon gn-icon-mail1">日常信息发布</a></li>';
			//html += '<li><a class="gn-icon gn-icon-speek">应急信息发布</a></li>';
			html += '<li><a id="weiboManager" class="gn-icon gn-icon-sets4">信息发布设置</a></li>';
			html += '</ul>';
			html += '</li>';
			
			
			
			html += '<li>';
			html += '<a class="gn-icon gn-icon-message">帮助</a>';
			html += '</li>';
			
			html += '</ul>';
			html += '<li><a href="http://www.esrichina-bj.cn/" class="codrops-icon codrops-icon-esri1">esri</a></li>';
			html += '</div>';
			html += '</nav>';
			html += '</li>';
			
			html += '<li>';
			html += '<a href="../ITSystem/index.html" >';
			html += '<span>道路交通流量监控</span>';
			html += '<span class="codrops-icon codrops-icon-down">&nbsp;</span>';
			html += '</a>';
			html += '</li>';
			
			html += '<li style="float:right;"><a class="codrops-icon codrops-icon-logout" href="javascript:app.publishWeibo()"  href="" title="发送微博"><span>发送微博</span></a></li>';
			
			if(menuNode){
				menuNode.innerHTML = html;
				_self.gnMenu = new gnMenu(document.getElementById('gn-menu'));
			}
		},
		congestionItemFun: function(){
			var _self = this;
			connect.connect(dojo.byId('congestionItem'), 'onclick', function(event){
				_self.setAppBusy();
				_self.options.currentModule.dispose();
				_self.loadConIndex();
				_self.releaseAppBusy();
			});
		},
		roadStateItemFun: function(){
			var _self = this;
			connect.connect(dojo.byId('roadStateItem'), 'onclick', function(event){
				_self.setAppBusy();
				_self.options.currentModule.dispose();
				_self.loadRoadState();
				_self.releaseAppBusy();
			});
		},
		vmsViewerFun: function(){
			var _self = this;
			connect.connect(dojo.byId('vmsViewerItem'), 'onclick', function(event){
				_self.setAppBusy();
				_self.options.currentModule.dispose();
				_self.loadVMSLayer();
				_self.releaseAppBusy();
			});
		},
		weatherStateFun: function(){
			var _self = this;
			connect.connect(dojo.byId('weatherStateItem'), 'onclick', function(event){
				_self.setAppBusy();
				_self.options.currentModule.dispose();
				_self.loadWeatherState();
				_self.releaseAppBusy();
			});
		},
		//Added by Zhangnan
		weiboManagerFun:function(){
			var _self = this;
			connect.connect(dojo.byId('weiboManager'), 'onclick', function(event){
				_self.setAppBusy();
				_self.options.currentModule.dispose();
				_self.loadWeiboManager();
				_self.releaseAppBusy();
			});
		},
		emergencyManagerFun:function(){
			var _self = this;
			connect.connect(dojo.byId("emergencyManager"),"onclick",function(event){
				_self.setAppBusy();
				_self.options.currentModule.dispose();
				_self.loadEmergencyState();
				_self.releaseAppBusy();
			});
		},
		loadWeiboManager:function(){
			var _self = this;
			_self.options.currentModule = new weiboManager();
		},
		loadEmergencyState:function(){
			var _self = this;
			var options = {
				
			};
			_self.options.currentModule = new emergencyState(options);
		},
		publishWeibo:function(){
			var data = app.currentTrafficData.All;
			var time = new Date().Format("yyyy/M/dd hh:mm:ss");
			
			var names = ["交通指数","拥堵等级","平均速度","全路网总体运行状态"];
			var values = [data.congestionIndex,data.congestionIndex,data.speed,data.state];
			var summary ="";
			var configs = Cookie("weiboConfig").split("|");
			for(var i=0;i< configs.length;i++){
				var idx = parseInt(configs[i]);
				summary += names[idx] +": " + values[idx] + ".";
			}
			summary = "当前XX市全路网" + summary + "发布时间：" + time;
			bShare.addEntry({ 
			    summary: summary,
				pic:location.href.substring(0,location.href.lastIndexOf("/")) +"/images/erweima.png"
		   });
		   bShare.share(null,'sinaminiblog',0);
		},
		//Added by Zhangnan
		loadConIndex: function(){
			var _self = this;
			var options = {
					url: _self.options.getCongestionIndexUrl,
					historyUrl : _self.options.HistoryCongestionIndexUrl,
					beiJing: _self.options.localJson.beiJing,
					interval: 10000,
					congestionIndexUrl: 'http://www.bjjtw.gov.cn/jtw_service/page/service/congestion_index.jsp'
			};
			_self.options.currentModule = new congestionIndex(options);
			
		},
		loadRoadState: function(){
			var _self = this;
			var options = {
					url: _self.options.RoadCongestionUrl,
					interval: 20000,
					congestionStatUrl: 'http://eye.bjjtw.gov.cn/Web-T_bjjt_new/query.do?serviceType=jam&acode=110000&type=2&cls=4&rcd=40',
					loopCongStatUrl: 'http://eye.bjjtw.gov.cn/Web-T_bjjt_new/query.do?serviceType=jam&acode=110000&type=2&cls=1&rcd=40',
					highWayCongStatUrl: 'http://eye.bjjtw.gov.cn/Web-T_bjjt_new/query.do?serviceType=jam&acode=110000&type=2&cls=2&rcd=40'
			};
			_self.options.currentModule = new roadState(options);
		},
		loadVMSLayer: function(){
			var _self = this;
			_self.options.currentModule = new VMSLayer(_self.options.localJson.roadstate);
			_self.map.addLayer(_self.options.currentModule);
		},
		loadWeatherState: function(){
			var _self = this;
			var options = {};
			_self.options.currentModule = new weatherState(options);
		},
		webmapReturned: function(response){
			var _self = this;
			//webMap
			_self.map = response.map;
			_self.itemInfo = response.itemInfo;
			//once map is loaded
			if(_self.map.loaded){
				_self.mapIsLoaded();
			}else{
				connect.connect(_self.map,"onLoad",function(){
					_self.mapIsLoaded();
				});
			}
		},
		creatWebMap: function(){
			var _self = this;
			var mapDeferred = esri.arcgis.utils.createMap(_self.options.webmap,"map",{
				mapOptions: {
					slider: true,
					wrapAround180: true,
					isScrollWheelZoom: true,
					logo: false
				},
				geometryServiceURL: _self.options.geometryserviceurl
			});
            // on successful response
            mapDeferred.addCallback(function (response) {
                _self.webmapReturned(response);
            });
            // on error response
            mapDeferred.addErrback(function (error) {console.log("error",error);
                //_self.alertDialog(i18n.viewer.errors.createMap + ": " + error.message);
            });
		},
		openDialog: function(evt, content){
		    this.closeDialog();

		    dojo.empty(dojo.byId('static-infowindow'));
		    dojo.byId('static-infowindow').style.display = 'block';
		    dojo.create('span', {id: "info-count", innerHTML: content}, 'static-infowindow');
		},
		closeDialog: function(){
		    dojo.byId('static-infowindow').style.display = 'none';
		    var widget = dijit.byId("tooltipDialog");
		    if (widget) {
		      widget.destroy();
		    }
		},
		setAppBusy: function(){
			var mainContentNode = query('#mainContent');
			dojo.byId('mapcon').style.display = 'none';
			mainContentNode.addClass('Loading');
		},
		releaseAppBusy: function(){
			var mainContentNode = query('#mainContent');
			mainContentNode.removeClass('Loading');
			dojo.byId('mapcon').style.display = 'block';
		},
		resizeMap: function(){
			var _self = this;
			if(_self.mapTimer){
				clearTimeout(_self.mapTimer);
			}
			
			_self.mapTimer = setTimeout(function(){
                // resize
                _self.map.resize();
                _self.map.reposition();
			}, 2000);
		},
		init: function(){
			var _self = this;
			_self.setOptions();
			_self.constructMenu();
			_self.congestionItemFun();
			_self.roadStateItemFun();
			_self.vmsViewerFun();
			_self.weatherStateFun();
			_self.emergencyManagerFun();
			_self.weiboManagerFun();
			_self.creatWebMap();           
		}
	});
	return Widget;
});