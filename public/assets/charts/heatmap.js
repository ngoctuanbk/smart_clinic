var heatmapData = {
    "map": "vietnamLow",
    "areas": [ {
      "id": "VN-HN",
      "value": 4447100
    }, {
      "id": "VN-SG",
      "value": 626932
    }, {
      "id": "VN-DN",
      "value": 5130632
    }, {
      "id": "VN-HP",
      "value": 2673400
    }]
};

var HeatMap = function() {
    var initHeatMap = function() {
        var map = AmCharts.makeChart( "activity_map", {
  			"type": "map",
  			"theme": "light",
  			"colorSteps": 10,
  			"dataProvider": heatmapData,
  			"areasSettings": {
    			"autoZoom": true
  			},
  			"valueLegend": {
    			"right": 10,
    			"minValue": "thấp",
    			"maxValue": "cao"
  			},
        })
    }
    
    return {
        //main function to initiate the module
        init: function() {
            initHeatMap();   
        }
    };

}();

jQuery(document).ready(function() {    
   HeatMap.init(); 
});