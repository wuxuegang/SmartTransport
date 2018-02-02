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
        "js/plugins/nvd3/lib/d3.v3.js",
        "js/plugins/nvd3/nv.d3.js",
        "js/plugins/nvd3/src/tooltip.js",
        "js/plugins/nvd3/src/utils.js",
        "js/plugins/nvd3/models/axis.js",
        "js/plugins/nvd3/models/historicalBar.js",
        "js/plugins/nvd3/models/historicalBarChart.js",
        "js/plugins/nvd3/models/multiBarHorizontal.js",
        "js/plugins/nvd3/models/multiBarHorizontalChart.js",
        "js/plugins/nvd3/models/legend.js",
        "js/plugins/nvd3/models/line.js",
        "js/plugins/nvd3/models/pie.js",
        "js/plugins/nvd3/models/pieChart.js",
        "js/plugins/nvd3/models/linePlusBarChart.js",
        "js/plugins/nvd3/models/scatter.js",
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
],function(ready, declare, connect, Deferred, lang, event, array, dom, query, domClass, domConstruct, domGeom, domStyle, date, number, win, on, coreFx, i18n, d3v3, nvd3, tooltip, utils, axis, historicalBar, historicalBarChart, legend, line, linePlusBarChart, scatter, Dialog, HorizontalSlider, VerticalSlider, nlTraverse, nlManipulate,esri){
	var Widget = declare("modules.nvd3Module", null, {
		constructor: function(options){
			var _self = this;
			this.options = options;
			_self.creatCharts();
		},
		creatCharts: function(){
			var _self = this;
			var chart;
			if(_self.options.type=="line"){
				chart = nv.models.lineChart()
				.margin({top: 30, right: 60, bottom: 50, left: 30})
		        .x(function(d,i) {return i;})
		        .tooltips(true);
				chart.xAxis
				.axisLabel(_self.options.XaxisLabel)
				.tickFormat(function(d){
		  			  var dx = _self.options.data[1].values[d] && _self.options.data[1].values[d].x || 0;

		  			  return dx ? d3.time.format('%X')(new Date(dx*1000)) : '';
					  
				  })
				  .showMaxMin(false);
				
			    chart.yAxis
			    .axisLabel(_self.options.YaxisLabel)
			    .tickFormat(d3.format(',.1f'));
			}
			else if(_self.options.type=="linePlusBar"){
				chart = nv.models.linePlusBarChart()
		        .x(function(d,i) {return i;})
		        .tooltips(true);
				chart.xAxis
				.tickFormat(function(d){
		  			  var dx = _self.options.data[1].values[d] && _self.options.data[1].values[d].x || 0;

		  			  return dx ? d3.time.format('%X')(new Date(dx*1000)) : '';
					  
				  })
				      .showMaxMin(false);		
			    chart.y1Axis
			    .tickFormat(d3.format(',.1f'));
			    chart.y2Axis
			    .tickFormat(d3.format(',.1f'));
			    //chart.bars.forceY([0]).padData(false);
			}
			else if(_self.options.type=="multiChart"){
				_self.options.data[0].type = "bar";
				_self.options.data[0].yAxis = 1;
				_self.options.data[1].type = "bar";
				_self.options.data[1].yAxis = 1;
				_self.options.data[2].type = "bar";
				_self.options.data[2].yAxis = 1;
				_self.options.data[3].type = "bar";
				_self.options.data[3].yAxis = 1;
				_self.options.data[4].type = "bar";
				_self.options.data[4].yAxis = 1;
				_self.options.data[5].type = "bar";
				_self.options.data[5].yAxis = 1;	

				chart = nv.models.lineChart()
				.color(d3.scale.category10().range());
				chart.xAxis
				.showMaxMin(true)
				.tickFormat(function(d){
		  			  return d3.time.format('%X')(new Date(d*1000));
					  
				  });
			    chart.yAxis
			    .tickFormat(d3.format(',.1f'));
			}
			else if(_self.options.type=="singleline"){
				chart = nv.models.lineChart()
				.margin({top: 30, right: 60, bottom: 50, left: 30})
		        .x(function(d,i) {return i;})
		        .tooltips(true);
				chart.xAxis
				.axisLabel(_self.options.XaxisLabel)
				.tickFormat(function(d){
		  			  var dx = _self.options.data[0].values[d] && _self.options.data[0].values[d].x || 0;

		  			  return dx ? d3.time.format('%X')(new Date(dx*1000)) : '';
					  
				  })
				  .showMaxMin(false);
				
			    chart.yAxis
			    .axisLabel(_self.options.YaxisLabel)
			    .tickFormat(d3.format(',.1f'));
			}
			else if(_self.options.type=="pie"){
				var chart = nv.models.pieChart()
				.margin({top: 0, right: 0, bottom: 20, left: 0})
		        .x(function(d) {return d.key;})
		        .y(function(d) { return d.y; })
		        .showLabels(true)
		        .showLegend(_self.options.showLegend)
		        .pieLabelsOutside(false)
		        .values(function(d) { return d; })
		        .color(d3.scale.category10().range());
			}
			else if(_self.options.type == "multiBarHorizontal"){
				var chart = nv.models.multiBarHorizontalChart()
				.x(function(d) { return d.label; })
			    .y(function(d) { return d.value; })
			    .margin({top: 0, right: 20, bottom: 60, left: 50})
			    //.showValues(true)
			    //.tooltips(false)
			    .barColor(d3.scale.category20().range())
			    .showControls(_self.options.showControl);
			}

			d3.select(_self.options.domID)
			     .datum(_self.options.data)
			     .transition().duration(500)
			     .call(chart);
			nv.utils.windowResize(chart.Update);
			return chart;
		}
	});
	return Widget;
});