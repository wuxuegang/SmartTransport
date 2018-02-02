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
		"esri/symbols/PictureMarkerSymbol",
		"esri/tasks/locator",
  		"esri/layers/GraphicsLayer",
  		"esri/InfoTemplate", 
  		"esri/graphic",
		"esri/geometry/webMercatorUtils",
		"esri/geometry/Point",
		"esri/SpatialReference",
		"esri/layers/FeatureLayer",
		"esri/renderers/SimpleRenderer",
		"esri/tasks/QueryTask",
		"esri/tasks/query",
		"esri/toolbars/draw",
		"esri/symbols/SimpleFillSymbol",
		"esri/symbols/SimpleLineSymbol",
		"dojo/_base/Color",
		"esri/geometry", 
		"esri/utils" 
], function(ready, declare, connect, Deferred, lang, event, array, dom, query, domClass, domConstruct, domGeom, domStyle, date, number, win, on, coreFx, i18n, strings, AMapLayer, nvd3Module, TVoronoiDiagramLayer,esri,PictureMarkerSymbol,Locator,GraphicsLayer,InfoTemplate,Graphic,WebMercatorUtils,Point,SpatialReference,FeatureLayer,SimpleRenderer,QueryTask,Query,Draw,SimpleFillSymbol,SimpleLineSymbol,Color) {
	var Widget = declare("modules.emergencyState", null, {
		constructor: function(options){
			var _self = this;
			this.deferreds = [];
			this.options = {
					url: '',
					interval: 20000 
			};
			declare.safeMixin(this.options, options);
			this.map = app.map;
			this.resourceLayers = [{"name":"党政机关","type":"重点防护目标","url":"http://beta.arcgisonline.cn/gistech/b6659e508de6c3d2ff913a81b012c129fa32ff5d5d66732da4f69cce3deaceeb/7","marker":"images/poi/dangzhengjiguan.png"},
									{"name":"科研机构","type":"重点防护目标","url":"http://beta.arcgisonline.cn/gistech/b6659e508de6c3d2ff913a81b012c129fa32ff5d5d66732da4f69cce3deaceeb/1","marker":"images/poi/keyanjigou.png"},
									{"name":"银行机构","type":"重点防护目标","url":"http://beta.arcgisonline.cn/gistech/b6659e508de6c3d2ff913a81b012c129fa32ff5d5d66732da4f69cce3deaceeb/15","marker":"images/poi/yinhangjigou.png"},
									{"name":"证券交易所","type":"重点防护目标","url":"http://beta.arcgisonline.cn/gistech/b6659e508de6c3d2ff913a81b012c129fa32ff5d5d66732da4f69cce3deaceeb/18","marker":"images/poi/zhengquanjiaoyisuo.png"},
									{"name":"港口码头","type":"重点防护目标","url":"http://beta.arcgisonline.cn/gistech/b6659e508de6c3d2ff913a81b012c129fa32ff5d5d66732da4f69cce3deaceeb/2","marker":"images/poi/gangkoumatou.png"},
									{"name":"飞机场","type":"重点防护目标","url":"http://beta.arcgisonline.cn/gistech/b6659e508de6c3d2ff913a81b012c129fa32ff5d5d66732da4f69cce3deaceeb/6","marker":"images/poi/jichang.png"},
//									{"name":"大型商场超市","type":"公众聚集场所","url":"http://beta.arcgisonline.cn/gistech/b6659e508de6c3d2ff913a81b012c129fa32ff5d5d66732da4f69cce3deaceeb/12","marker":"images/poi/daxingshangchao.png"},
									{"name":"网吧","type":"公众聚集场所","url":"http://beta.arcgisonline.cn/gistech/b6659e508de6c3d2ff913a81b012c129fa32ff5d5d66732da4f69cce3deaceeb/21","marker":"images/poi/wangba.png"},
									{"name":"影剧院","type":"公众聚集场所","url":"http://beta.arcgisonline.cn/gistech/b6659e508de6c3d2ff913a81b012c129fa32ff5d5d66732da4f69cce3deaceeb/14","marker":"images/poi/yingjuyuan.png"},
									{"name":"星级宾馆饭店","type":"公众聚集场所","url":"http://beta.arcgisonline.cn/gistech/b6659e508de6c3d2ff913a81b012c129fa32ff5d5d66732da4f69cce3deaceeb/4","marker":"images/poi/xingjibingguan.png"},
									{"name":"幼儿园","type":"学校","url":"http://beta.arcgisonline.cn/gistech/b6659e508de6c3d2ff913a81b012c129fa32ff5d5d66732da4f69cce3deaceeb/17","marker":"images/poi/youeryuan.png"},
									{"name":"小学","type":"学校","url":"http://beta.arcgisonline.cn/gistech/b6659e508de6c3d2ff913a81b012c129fa32ff5d5d66732da4f69cce3deaceeb/20","marker":"images/poi/xiaoxue.png"},
									{"name":"中学","type":"学校","url":"http://beta.arcgisonline.cn/gistech/b6659e508de6c3d2ff913a81b012c129fa32ff5d5d66732da4f69cce3deaceeb/19","marker":"images/poi/zhognxue.png"},
//									{"name":"大学","type":"学校","url":"http://beta.arcgisonline.cn/gistech/b6659e508de6c3d2ff913a81b012c129fa32ff5d5d66732da4f69cce3deaceeb/13","marker":"images/poi/daxue.png"},
									{"name":"加油站","type":"危险源","url":"http://beta.arcgisonline.cn/gistech/b6659e508de6c3d2ff913a81b012c129fa32ff5d5d66732da4f69cce3deaceeb/10","marker":"images/poi/jiayouzhan.png"}];
 			this.resultSymbol = new PictureMarkerSymbol("images/i_bookmark.png", 40, 40);
     		this.locator = new Locator("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");
      		this.locator.spatialReference = app.map.spatialReference;
      		this.locator.on("address-to-locations-complete", lang.hitch(this, 'showResult'));
			this.locationType = "geocode";
			this.locationResults = [];
			this.locationResultLayer = new GraphicsLayer();
			this.gpsLayer = new FeatureLayer("http://106.120.241.131:9001/arcgis/rest/services/carinbj2/MapServer/0",{"outFields":["*"],"infoTemplate":this.buildeGPSLayerInfoTemplate()});
			this.gpsLayer.setRenderer(this.buildGPSLayerRenderer());
			var queryTask = new QueryTask("http://106.120.241.131:9001/arcgis/rest/services/carinbj2/MapServer/0");
			var query = new Query();
			query.outFields = ["*"];
			query.outSpatialReference = this.map.spatialReference;
			query.returnGeometry  = true;
			query.where = "1=1";
			queryTask.execute(query,lang.hitch(this,'showGPSList'));
//			this.gpsLayer.on("update",lang.hitch(this,'showGPSList'));
			this.map.addLayer(this.locationResultLayer);
			this.map.addLayer(this.gpsLayer);
			this.drawTool = new Draw(this.map,{ showTooltips: true });
			this.drawTool.on("draw-end",lang.hitch(this,'showDrawAndQuery'));
			this.drawLayer = new GraphicsLayer();
			this.map.addLayer(this.drawLayer);
			this.initResourceLayers();
			app.showGra = lang.hitch(this, 'showGra');
			this.interval = setInterval(lang.hitch(this, 'refreshData'),6000);
			/*var testlayer = new TVoronoiDiagramLayer({
				url: this.options.url,
				roadStateurl: "http://eye.bjjtw.gov.cn/Web-T_bjjt_new/query.do?serviceType=jam&acode=110000&type=1&cls=4&rcd=1000",
				interval: 10000
			});
			app.map.addLayer(testlayer);*/
			_self.init();
		},
		resize:function(){
			var mapHeight = document.documentElement.clientHeight - 24 - dojo.byId("header").clientHeight;
			dojo.byId("mapcon").style.height = mapHeight +"px";
			dojo.byId("chartIndexTotal").style.height = (mapHeight-420-24) +"px";
			dojo.byId("tablewidget").style.height = (mapHeight-420-24-40) +"px";
			app.map.resize();
    		app.map.reposition();
		},
		init: function(){
			var _self = this;
			_self.initUI();
			setTimeout(_self.resize, 1000)
			window.onresize = function(){
                setTimeout(_self.resize, 1000)
            }
//			_self.initAMapLayer();
//			_self.update();
//			_self.congInterval = setInterval(function(){			
//				_self.update();
//			},_self.options.interval);
		},
		//初始化资源显示图层
		initResourceLayers:function(){
			for(var i=0;i<this.resourceLayers.length;i++){
				var layer = new GraphicsLayer();
				layer.id = "resource_" + i;
				var symbol = new PictureMarkerSymbol(this.resourceLayers[i].marker,47,47);
				var renderer = new SimpleRenderer(symbol);
				layer.setRenderer(renderer);
				var infoTemplate = new InfoTemplate( 
					"名称: ${Name_CHN}", 
			        "地址: ${Address}<br />电话 : ${Telephone}");
				layer.setInfoTemplate(infoTemplate);
				this.map.addLayer(layer);
			}
		},
		clearResourceLayers:function(){
			for(var i=0;i<this.resourceLayers.length;i++){
				var layer = this.map.getLayer("resource_" + i);
				layer.clear();
			}
			this.drawLayer.clear();
			this.map.infoWindow.hide();
		},
		buildeGPSLayerInfoTemplate:function(){
			var infoT = new InfoTemplate();
			buildTitle = function(graphic){
				var attr = graphic.attributes;
				return "京BR" + attr.id.substring(9);
			};
			buildContent = function(graphic){
				var attr = graphic.attributes;
				var carNo = "京BR" + attr.id.substring(9);
				var status = attr.dwstatus == 0?"正常":"异常";
				var alertInfo = attr.alertinfo == 0?"无":attr.alertinfo;
				return "车牌号: " + carNo + "<br />"
					    +"状态: " + status + "<br />"
						+ "报警信息: " + alertInfo;
			};
			infoT.setTitle(buildTitle);
			infoT.setContent(buildContent);
			return infoT;
		},
		
		buildGPSLayerRenderer:function(){
			var symbol = new PictureMarkerSymbol("images/car.png",64,64);
			var renderer = new SimpleRenderer(symbol);
			return renderer;
		},
		refreshData:function(){
			this.gpsLayer.refresh();
		},
		
		initAMapLayer: function(){
			var _self = this;
//			if(_self.aMapLayer){
//				app.map.removeLayer(_self.aMapLayer);
//				_self.aMapLayer = null;
//			}
//            _self.aMapLayer = new AMapLayer({
//            	map: app.map,
//                id: "aMapLayer",
//                label: "交通流量",
//                opacity: 0.75
//            });
//			app.map.addLayer(_self.aMapLayer);
		},
		//解析地理编码信息
		showResult:function(evt){
			  this.locationResults = [];
		      array.forEach(evt.addresses,function(candidate){
		        if(candidate.score > 40){
		            var attributes = { 
		                address: candidate.address, 
		                score: candidate.score, 
		                locatorName: candidate.attributes.Loc_name 
		              };
		          // var symbol = new SimpleMarkerSymbol();
		          
		          if (candidate.location !== undefined ) {
		            this.locationResults.push({"address":attributes.address,
		                                        "subTitle":"Score:" + attributes.score,
		                                        "point": candidate.location,
		                                        "attributes":attributes});
		          }
		        }
		      },this);
      
//      this.displayLocationsList();
		      if(this.locationResults.length>0){
		        this.showLocation(this.locationResults[0]);
		      }
		},
		
		//将地理编码地址显示在地图上
		showLocation:function(location){
		      app.map.infoWindow.hide();
		      this.locationResultLayer.clear();
		      var infoTemplate = new InfoTemplate(
		        "Location", 
		        "Address: ${address}<br />Score: ${score}<br />Source locator: ${locatorName}"
		      );
		      // symbol.setStyle(SimpleMarkerSymbol.STYLE_SQUARE);
		      // symbol.setColor(new Color([153,0,51,0.75]));
		      var graphic = new Graphic(location.point,this.resultSymbol,location.attributes,infoTemplate);
		      this.locationResultLayer.add(graphic);
		      if (this.map.getScale() > 10000)
		      {
		          this.map.setScale(10000);
		      }
		      // // this.map.centerAndZoom(candidate.location, 12);
		        this.map.infoWindow.setFeatures([graphic]);
		        this.map.infoWindow.show(location.point);
		        this.map.infoWindow.reposition();
		        this.map.centerAt(location.point);
//		        this.map.resize();
	    },
		redraw:function(){
			var self = this;
//			self.path = self.path
//		      .data(self.voronoi(self.vertices), self.polygon);
//
//			self.path.exit().remove();
//
//			self.path.enter().append("path")
//		      .attr("class", function(d, i) { return "q" + (i % 9) + "-9"; })
//		      .attr("d", self.polygon);
//
//			self.path.order();
		},
		polygon: function(d){
//			return "M" + d.join("L") + "Z";
		},
		//初始化界面
		initUI: function(){
			var _self = this;
			var node = dom.byId('knobTotal');
			var html = '';
			
			html +=	'<div class="geocode-section" style="display: block;">'
					+	'<FIELDSET align="center" style="width: 98%;">'
					+		'<LEGEND style="font-weight: bold;" onselectstart="return false;">事故点定位</LEGEND>' 
					+		'<input id="geocodeType" name="locationType" type="radio" value= 0 checked style="padding-left:20px;margin:10px;">地址定位</input>'
					+		'<input id="lonlatTypes" name="locationType" type="radio" value= 1 style="padding-left:20px;margin:10px;">经纬度定位</input>'
					+		    '<input id="geocodeLocation" class="jimu-input input-address-name" type="text" placeholder="地址" style="display:block;" >'
					+			'<div id="xyLocation"  style="display:none;">'
					+			 	'<span>经度:</span>'
					+				'<input id="lonInput" type="text" class="jimu-lonlat-input input-address-name"></input>'
					+				'</br><span>纬度:</span>'
					+			 	'<input id="latInput" type="text" class="jimu-lonlat-input input-address-name"></input>'
					+			 '</div>'
					+		    '<div class="btn-add">'
					+		      '<div class="clear-btn" id="locateBtn" >定位</div>'
					+		      '<div class="clear-btn" id ="clearBtn" >清除</div>'
					+		     '</div>' 
					+	'</fieldset>'    
					+ '</div>';
					
			html += '<div class="geocode-section" style="display: block;">'
					+'<fieldset align="center" style="width: 98%;">'
					+	'<legend style="font-weight: bold;" onselectstart="return false;">应急资源监控</legend>' 
					+	    '<div class="btn-group" style="position: relative; display: inline-block; font-size: 0px; vertical-align: middle; white-space: nowrap; line-height: 20px; color: rgb(51, 51, 51); cursor: auto; text-align: center; width: 100%;">'
				    +             '<button class="btn" type="button" id= "drawPoint"> 点选查询 </button>'
					+			  '<button class="btn" type="button" id = "drawExtent"> 拉框查询 </button>'
					+			  '<button class="btn" type="button" id = "drawPolygon"> 多边形查询 </button>'
					+			  '<button class="btn" type="button" id= "clear"> 清除 </button>'
			        +        '</div>'
					+		'<div  id="layerList"  style="margin-top:10px;">' 
					+			'<div style="float: left; width: 45%; overflow: hidden;text-align: left; " id="leftLayerList">';
					var middleIndex = 0;
					if(this.resourceLayers.length%2 == 0){
						middleIndex = parseInt(this.resourceLayers.length/2);
					}else{
						middleIndex = parseInt(this.resourceLayers.length/2)+1;
					}
					for(var i=0;i<middleIndex;i++){
						html += '<div class="checkbox">'                
								 +       '<input type="checkbox"  style="margin-left:30px;" name=layerListCheckbox id ="check' + i +'">' +  this.resourceLayers[i].name
								 +   '</div>';
					}
					html +='</div>'	
							+	'<div id="rightLayerList" style="float: right; width: 45%; text-align: left; overflow: hidden;" >'; 
					for(var j=middleIndex;j<this.resourceLayers.length;j++){
						html += '<div class="checkbox">'                
								 +       '<input type="checkbox"  style="margin-left:30px;" name=layerListCheckbox id ="check' + j +'">' +  this.resourceLayers[j].name
								 +   '</div>';
					}
					
					html +='</div>'	
						 +	'</div>'		
//						 +   '<div class="btn-add">'
//						 +     '<div class="clear-btn">定位</div>'
//						 +     '<div class="clear-btn">清除</div>'
//						 +    '</div>'  
					+'</fieldset>'
				+ '</div>';
					 
			if (node && node.innerHTML=='') {
                node.innerHTML = html;
            }
//			dojo.byId("knobTotal").style.height = "420px";
			if(window.screen.width>1024){
			    dojo.byId('knobTotal').style.height = '420px';
			}
			else
				dojo.byId('knobTotal').style.height = '240px';
			
			connect.connect(dojo.byId("locateBtn"),"onclick",lang.hitch(this,'executeLocate'));
			connect.connect(dojo.byId("geocodeType"),"onclick",function(evt){
				dojo.byId("geocodeLocation").style.display = "block";
				dojo.byId("xyLocation").style.display = "none";
				_self.locationType = "geocode";
			});
			connect.connect(dojo.byId("lonlatTypes"),"onclick",function(evt){
				dojo.byId("geocodeLocation").style.display = "none";
				dojo.byId("xyLocation").style.display = "block";
				_self.locationType = "lonlat";
				 
			});
			connect.connect(dojo.byId("drawPoint"),"onclick",function(evt){
				_self.draw("Point");
			});
			connect.connect(dojo.byId("drawExtent"),"onclick",function(evt){
				_self.draw("Extent");
			});
			connect.connect(dojo.byId("drawPolygon"),"onclick",function(evt){
				_self.draw("Polygon");
			});
			connect.connect(dojo.byId("clear"),"onclick",function(evt){
 				_self.clearResourceLayers();
			});
			connect.connect(dojo.byId("clearBtn"),"onclick",lang.hitch(this,"clearLocate"));
//			_self.options.totalChart = new nvd3Module(_self.chartOptions);
		},
		draw:function(type){
			this.clearResourceLayers();
			
			if(type == "Point"){
				this.drawTool.activate(Draw.POINT);
			}else if (type == "Extent"){
				this.drawTool.activate(Draw.EXTENT);
			}else if(type == "Polygon"){
				this.drawTool.activate(Draw.POLYGON);
			}
		},
		showDrawAndQuery:function(gra){
			this.drawTool.deactivate();
			var selectedLayers = this.getSelectedLayers();
			if(selectedLayers.length <= 0){
				alert("请先选择要检索的图层!");
				return;
			}
			//显示绘制的图形
			var symbol = null;
			if(gra.geometry.type == "point"){
				symbol = new PictureMarkerSymbol("images/marker.png",25,41);
			}else if(gra.geometry.type == "extent" || gra.geometry.type == "polygon"){
				symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
    					 new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([169,115,199]),2),new Color([224,195,247,0.40])
  						);
			} 
			var graphic = new Graphic(gra.geometry,symbol);
			this.drawLayer.add(graphic);
			//使用这些图形进行空间查询 
			for(var j=0;j<selectedLayers.length;j++){
				selectedLayers[j].geometry = gra.geometry;
			}
			array.forEach(selectedLayers,function(layer){
				var queryTask = new QueryTask(layer.url);
				var query = new Query();
				query.outFields = ["*"];
				query.outSpatialReference = this.map.spatialReference;
				query.returnGeometry  = true;
				query.where = "1=1";
				query.geometry = layer.geometry;
				queryTask.execute(query,lang.hitch(this,"showQueryResult",layer.url));
			},this);
		},
		//显示资源查询的结果
		showQueryResult:function(layerUrl,featureSet){
			for(var i=0;i<this.resourceLayers.length;i++){
				if(this.resourceLayers[i].url == layerUrl){
					var layer = this.map.getLayer("resource_" + i);
					array.forEach(featureSet.features,function(feature){
						feature.symbol = new PictureMarkerSymbol(this.resourceLayers[i].marker,47,47);
						feature.infoTemplate = new InfoTemplate( 
										"名称: ${Name_CHN}", 
								        "地址: ${Address}<br />电话 : ${Telephone}");
						layer.add(feature);
					},this);
//					layer.graphics = featureSet.features;
					
//					var symbol = new PictureMarkerSymbol(this.resourceLayers[i].marker,47,47);
//				var renderer = new SimpleRenderer(symbol);
//				layer.setRenderer(renderer);
//				var infoTemplate = new InfoTemplate( 
//				"名称: ${Name_CHN}", 
//		        "地址: ${Address}<br />电话 : ${Telephone}");
//				layer.setInfoTemplate(infoTemplate);
				}
			}
		},
		
		getSelectedLayers:function(){
			var layers = [];
			var chkBoxes = document.getElementsByName("layerListCheckbox");
			array.forEach(chkBoxes,function(checkbox){
				if(checkbox.checked){
					var layerIndex = parseInt(checkbox.id.substring(checkbox.id.indexOf("check")+5));
					layers.push(this.resourceLayers[layerIndex]);
				}
			},this);
			return layers;
		},
		
		showGPSList:function(featureSet){
			var gpsNode = dom.byId('chartIndexTotal');
			var gpsNodeHtml = '<FIELDSET align="center" style="width: 98%;">'
						+	'<LEGEND style="font-weight: bold;" onselectstart="return false;">车辆监控</LEGEND>'  
						+	'<div class="block span6" >'
						+        '<div class="block-body in collapse" id="tablewidget" style="height:300px;overflow:auto;">'
						+            '<table class="table" id="gpsTable">' 
		  				+			  '<thead>'
						+                '<tr>'
						+                  '<th>车牌号</th>'
						+                  '<th>状态</th>'
						+                  '<th>报警信息</th>'
						+                '</tr>'
						+              '</thead>'
						+              '<tbody>';
			array.forEach(featureSet.features,function(graphic){
				var attr = graphic.attributes;
				var carNo = "京BR" + attr.id.substring(9);
				var status = attr.dwstatus == 0?"正常":"异常";
				var alertInfo = attr.alertinfo == 0?"无":attr.alertinfo;
				var attrs = [carNo,status,alertInfo,graphic.attributes.id];
				gpsNodeHtml += this.createTR(attrs);
			},this);
			 gpsNodeHtml +=
			 
						              '</tbody>'
						   +         '</table>'
						   +    ' </div>'
						   +' </div>'
						+'</fieldset>'; 
			if (gpsNode && gpsNode.innerHTML=='') {
                gpsNode.innerHTML = gpsNodeHtml;
            }
			if(window.screen.width>1024){
				dojo.byId('chartIndexTotal').style.height = '320px';
			}
			else{
				dojo.byId('chartIndexTotal').style.height = '200px';
			}
		},
		createTR:function(attrs){
			var html =  '<tr>'
	               +   '<td class=\"colTitle\" onclick=app.showGra("' +attrs[3] +'")>' + attrs[0] +'</td>'
	               +   '<td>' + attrs[1] +'</td>'
	               +   '<td>' + attrs[2] +'</td>'
	               +  '</tr>';
			return html;
		},
		showGra:function(graphicId){
			array.forEach(this.gpsLayer.graphics,function(graphic){
				var attr = graphic.attributes;
				if(graphicId == attr.id){
					this.map.infoWindow.setFeatures([graphic]);
			        this.map.infoWindow.show(graphic.geometry);
		        	this.map.infoWindow.reposition();
					this.map.centerAt(graphic.geometry);
//					this.map.resize();
				}
			},this);
		},
		
		//执行定位
		executeLocate:function(){
			app.map.infoWindow.hide();
			this.locationResultLayer.clear();
			if(this.locationType == "geocode"){
				var address = {
	             "SingleLine": dojo.byId("geocodeLocation").value
	           };
		         var options = {
		             address: address,
		             outFields: ["Loc_name"]
		           }
			    this.locator.addressToLocations(options);
			}else if(this.locationType == "lonlat"){
				var lon = dojo.byId("lonInput").value;
				var lat = dojo.byId("latInput").value;
				var point = WebMercatorUtils.geographicToWebMercator(new Point(lon,lat,new SpatialReference(4326)));
				
				this.map.infoWindow.hide();
			    this.locationResultLayer.clear();
			    var infoTemplate = new InfoTemplate(
			       "定位", 
			        "经度: ${lontitude}<br />纬度: ${latitude}"
			    );
			      var graphic = new Graphic(point,this.resultSymbol,{"lontitude":lon,"latitude":lat},infoTemplate);
			      this.locationResultLayer.add(graphic);
			      if (this.map.getScale() > 10000)
			      {
			          this.map.setScale(10000);
			      }
			      // // this.map.centerAndZoom(candidate.location, 12);
			        this.map.infoWindow.setFeatures([graphic]);
			        this.map.infoWindow.show(point);
			        this.map.infoWindow.reposition();
			        this.map.centerAt(point);
//			        this.map.resize();
			}
		},
		clearLocate:function(){
			this.locationResultLayer.clear();
			if(this.locationType == "geocode"){
				dojo.byId("geocodeLocation").value = "";
			}else{
				dojo.byId("lonInput").value = "";
				dojo.byId("latInput").value = ""; 
			}
		},
		creatDetialCongestionChart: function(){
//			var _self = this;
//			var node = dom.byId('chartIndexTotal');
//			var html = '';
//			html +='<h3>其他类型路段拥堵比例:</h3>';
//			html +='<svg></svg>';
//			if (node && node.innerHTML=='') {
//                node.innerHTML = html;
//            }
//			if(window.screen.width>1024){
//				dojo.byId('chartIndexTotal').style.height = '320px';
//			}
//			else{
//				dojo.byId('chartIndexTotal').style.height = '200px';
//			}
//			
//			_self.options.otherRoadChart = new nvd3Module(_self.multiBarOptions);
		},	
		constructQuery: function(queryUrl, callback) {
			var _self = this;
//			_self.isBusy = true;
//			var query = _self.options.url + "?url=" + strings.urlencode(queryUrl);
//			_self.sendRequest(query, callback);
		},
		sendRequest: function(url, callback){
			var _self = this;
//			var deferred = esri.request({
//				url: url,
//				handleAs: "text",
//				timeout: _self.options.interval,
//				load: lang.hitch(this, function(data){
//					eval("var jsonobj = " + data);
//					if(callback)callback(jsonobj);
//				}),
//				error: lang.hitch(this, function(e){
//					_self.currentlyData = null;
//					this.onError(e.message);
//				})
//			},{usePost: true});
//			
//			_self.deferreds.push(deferred);
		},
		pushData: function(options, data){
//			if(!data)return;
//			options.data[0][0].y = data.nums.jam;
//			options.data[0][1].y = data.nums.slow;
//			options.data[0][2].y = data.nums.flow;
		},
		update: function(){
			var _self = this;
//			//update AMapLayer
//			_self.initAMapLayer();
//			//update CongestionChart of all roads
//			_self.constructQuery(_self.options.congestionStatUrl, function(data){
//				_self.pushData(_self.chartOptions, data);
//				_self.creatCongestionChart();
//			});
//			//update CongestionChart of loop and highway
//			_self.constructQuery(_self.options.loopCongStatUrl, function(data){
//				_self.multiBarOptions.data[0].values[0].value = data.nums.jam * -1;
//				_self.multiBarOptions.data[1].values[0].value = data.nums.slow * -1;
//				_self.multiBarOptions.data[2].values[0].value = data.nums.flow;
//				_self.constructQuery(_self.options.highWayCongStatUrl, function(data){
//					_self.multiBarOptions.data[0].values[1].value = data.nums.jam * -1;
//					_self.multiBarOptions.data[1].values[1].value = data.nums.slow * -1;
//					_self.multiBarOptions.data[2].values[1].value = data.nums.flow;
//					_self.creatDetialCongestionChart();
//				});
//				_self.onUpdateEnd();
//			});
		},
		onUpdateEnd: function(){},
		dispose: function(){	
			this.clearResourceLayers();
			clearInterval(this.interval);
			this.gpsLayer.clear();
			dom.byId('chartIndexTotal').innerHTML = '';
			dom.byId('detailCharts').innerHTML = '';
			dom.byId('knobTotal').innerHTML = '';	
 			dojo.byId("knobTotal").style.height = "400px";
			dojo.byId("chartIndexTotal").style.height = "320px;"
		}
	});
	return Widget;
});