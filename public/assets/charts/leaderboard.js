var leaderBoardData = [{
        "name": "Trung",
        "sales": 35.654,
        "color": "#7F8DA9",
        "bullet": "../assets/pages/media/profile/avatar_01.jpg",
    }, {
        "name": "Ha",
        "sales": 65.456,
        "color": "#FEC514",
        "bullet": "../assets/pages/media/profile/avatar_02.jpg",
    }, {
        "name": "Truong",
        "sales": 45.724,
        "color": "#DB4C3C",
        "bullet": "../assets/pages/media/profile/avatar_03.jpg",
    }, {
        "name": "Binh",
        "sales": 13.654,
        "color": "#DAF0FD",
        "bullet": "../assets/pages/media/profile/avatar_01.jpg",
        "iconClass": "icon",
    },{
        "name": "An",
        "sales": 18.654,
        "color": "#DAF0FD",
        "bullet": "../assets/pages/media/profile/avatar_01.jpg",
    }];
    
var LeaderBoard = function() {

    var initLeaderBoard = function() {
        var chart = AmCharts.makeChart("leaderboard", {
        	"type": "serial",
    		"theme": "light",
    		"autoMargins": false,
            "marginLeft": 60,
            "color":    '#888',
            "dataProvider": leaderBoardData,
            "valueAxes": [{
				"maximum": 100,
				"minimum": 0,
				"axisAlpha": 0,
				"dashLength": 4,
				"position": "left",
				"title": "Doanh thu (mil VNĐ)",
			}],
			"startDuration": 1,
			"graphs": [{
				"balloonText": "<span style='font-size:13px;'>[[category]]: <b>[[value]]</b></span>",
				"bulletOffset": 10,
				"bulletSize": 52,
				"colorField": "color",
				"cornerRadiusTop": 8,
				"customBulletField": "bullet",
				"fillAlphas": 0.8,
				"lineAlpha": 0,
				"type": "column",
				"valueField": "sales"
			}],
			"smoothCustomBullets": {
				"borderRadius": "auto"
			},
			"categoryField": "name",
			"categoryAxis": {
				"axisAlpha": 0,
				"gridAlpha": 0,
				"inside": true,
				"tickLength": 0
			},
		})
	}
	return {
        //main function to initiate the module
        init: function() {
            initLeaderBoard();   
        }
    };

}();

jQuery(document).ready(function() {    
   LeaderBoard.init(); 
});