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
		"dojo/cookie",
		 "dojo/json",
        "dojo/fx",
        "dojo/i18n!./nls/template.js",
        "dojox/dtl/filter/strings"
], function(ready, declare, connect, Deferred, lang, event, array, dom, query, domClass, domConstruct, domGeom, domStyle, date, number, win, on, Cookie,Json,coreFx, i18n, strings) {
	var Widget = declare("modules.emergencyState", null, {
		constructor: function(){
			var _self = this;
			this.deferreds = [];
			this.options = {
			};
			this.checkedData = [];
			_self.init();
		},
		init: function(){
			this.initUI();
			array.forEach(document.getElementsByName("weiboCheckBox"),function(node){
				connect.connect(node,"onclick",lang.hitch(this,'updateWeiboPreviewContent'));
			},this);
			connect.connect(dojo.byId("save"),"onclick",lang.hitch(this,'saveWeiboSet'));
			connect.connect(dojo.byId("cancer"),"onclick",lang.hitch(this,'dispose'));
		},
		 updateWeiboPreviewContent:function(){
		 	this.checkedData = [];
		 	var time = new Date().Format("yyyy/M/dd hh:mm:ss");
		 	var data = app.currentTrafficData.All;
			var names = ["交通指数","拥堵等级","平均速度","全路网总体运行状态"];
			var values = [data.congestionIndex,data.congestionIndex,data.speed,data.state];
			var summary ="";
			var checkedLength = 0;
		 	for(var i =0;i< document.getElementsByName("weiboCheckBox").length;i++){
				var node = document.getElementsByName("weiboCheckBox")[i];
				var temp = values[i]?values[i]:"***";
				if(node.checked){
					summary += names[i] +": " + temp + ".";
					checkedLength++;
					this.checkedData.push(i);
				}
			}
			if(checkedLength <= 0){
				alert("请至少选择一项发布的专题");
				return;
			}
			summary = "当前XX市全路网" + summary + "发布时间：" + time;
//		 	array.forEach(document.getElementsByName("weiboCheckBox"),function(node){
//				  "当前XX市全路网交通指数:" + data.congestionIndex + "， 拥堵等级：" + data.congestionIndex + "， 平均速度" + data.speed +"km/h，全路网总体运行状态: "+ data.state +", 发布时间：" + time;
//			},this);
			dojo.byId("weiboPublisher").innerHTML = summary;
		 },
		 
		 saveWeiboSet:function(){
		 	if(this.checkedData.length == 0){
				this.checkedData = [0,1,2,3];
			}
		 	Cookie("weiboConfig", this.checkedData.join("|"),{expires: 5 });
			alert("保存成功!");
			this.dispose();
		 },
		//初始化界面
		initUI: function(){
			var _self = this;
			var winBox = win.getBox();
			var headerBox = dojo.position(dojo.byId('header'));
			var node = dom.byId('weiboContainer');
			
			domStyle.set(node, {
				"height": (winBox.h - headerBox.h) + 'px'
			});
			node.style.display = "block";
		},
		onUpdateEnd: function(){},
		dispose: function(){	
			var node = dom.byId('weiboContainer');
			node.style.display = "none";
		}
	});
	return Widget;
});