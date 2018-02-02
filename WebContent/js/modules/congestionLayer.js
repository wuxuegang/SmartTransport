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
        "modules/d3Layer",
		"esri",
		"esri/layers/graphics",
		"esri/geometry", 
		"esri/utils"
        ],function(ready, declare, connect, Deferred, lang, event, array, dom, query, domClass, domConstruct, domGeom, domStyle, date, number, win, on, coreFx, i18n, d3Layer, esri){
	var Widget = declare("modules.congestionLayer",d3Layer,{
		constructor: function(url, options){
			//var _self = this;
			var tmpl = '';
			dojo.connect(this, "onLoad", function(lyr){
				d3.selectAll('path')
				.on('mouseover', function(e){
					tmpl = '';
					var areaName = this.getAttribute('Name');
					if(areaName){
						var index = this.getAttribute('congestionIndex');
						var state = this.getAttribute('state');
						var speed = this.getAttribute('speed');
						tmpl += '<ul>';
						tmpl += '<li class="liStyle"><p class="areaText">' + areaName + '</p></li>';
						tmpl += '<li class="liStyle"><p class="indexText">交通指数:' + (index? index : '未知') + '</p></li>';
						tmpl += '<li class="liStyle"><p class="stateText">拥堵等级:' + (state? state : '未知') + '</p></li>';
						tmpl += '<li class="liStyle"><p class="speedText">平均速度:' + (speed? (speed + 'km/h') : '未知') + '</p></li>';
						tmpl += '</ul>';
					}
					d3.select('path#'+this.getAttribute('id'))
					  .style('opacity', 0.5)
					  .style('stroke-width',2);
					app.openDialog(e, tmpl);
				})
				.on('mouseout', function(){
					d3.select('path#'+this.getAttribute('id'))
					  .style('opacity', 0.35)
					  .style('stroke-width',1);
					app.closeDialog();
				});
			});
		},
		updateData: function(data){
			var _self = this;
			this._paths()
			  .attr('congestionIndex',function(d){
				  var cityName = _self.nameMap(d.properties['Name']);
				  if(cityName != ''){
					  return data[cityName].congestionIndex;
				  }
			  })
			  .attr('speed',function(d){
				  var cityName = _self.nameMap(d.properties['Name']);
				  if(cityName != ''){
					  return data[cityName].speed;
				  }
			  })
			  .attr('state',function(d){
				  var cityName = _self.nameMap(d.properties['Name']);
				  if(cityName != ''){
					  return data[cityName].state;
				  }
			  })
			  .style('fill', function(d){
				  var cityName = _self.nameMap(d.properties['Name']);
				  if(cityName != ''){
					  var congestionIndex = parseFloat(data[cityName].congestionIndex);
					  if(congestionIndex <= 2 )
						  return '#007502';
					  else if(congestionIndex > 2 && congestionIndex <= 4)
						  return '#92C601';
					  else if(congestionIndex > 4 && congestionIndex <= 6)
						  return '#FFFF01';
					  else if(congestionIndex > 6 && congestionIndex <= 8)
						  return '#FF9C01';
					  else if(congestionIndex > 8)
						  return '#FE0000';
				  }
				  return 'rgb(125,125,125)';
			  });
		},
		nameMap: function(name){
			if(name=='东城区') return 'eastCity';
			else if(name=='西城区') return 'westCity';
			else if(name=='海淀区') return 'haiDian';
			else if(name=='朝阳区') return 'chaoYang';
			else if(name=='丰台区') return 'fengTai';
			else if(name=='石景山区') return 'siJingSan';
			else return '';
		}
	});
	return Widget;
});