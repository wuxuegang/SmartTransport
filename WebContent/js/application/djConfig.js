/**
 * @author GAO JIE@ESRI 2013
 */
var pathRegex = new RegExp(/\/[^\/]+$/);
var locationPath = location.pathname.replace(pathRegex,'');
//dojo config
var dojoConfig = { 
		parseOnLad:true,
		packages:[
		          {
		        	  name : "modules",
		        	  location : locationPath + '/js/modules/'	   
		          },
		          {
		        	  name : "application",
		        	  location : locationPath + '/js/application/'
		          },
		          {
		        	  name : "plugins",
		        	  location : locationPath + '/js/plugins/'
		          },
		          {
		        	  name : "proxy",
		        	  location : locationPath + '/proxy/'
		          }
		          ]
};
