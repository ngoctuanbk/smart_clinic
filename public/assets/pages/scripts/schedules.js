//main class
var Schedules = function () {
    //collapse sidebar menu
    var initLayout = function() {
        $('body').addClass('page-sidebar-closed');
        $('.page-sidebar-menu').addClass('page-sidebar-menu-closed');
    }

	var handleEvents = function() {
		//select
        $('.selectpicker').selectpicker({
            iconBase: 'fa',
            tickIcon: 'fa-check'
        });
        
        //date-picker
        if (jQuery().datepicker) {
            $('.date-picker').datepicker({
                rtl: App.isRTL(),
                orientation: "left",
                weekStart: 1,
                autoclose: true
            });
        }
        
        //time
        $('.timepicker-24').timepicker({
			autoclose: true,
			minuteStep: 5,
			showSeconds: false,
            showMeridian: false,
		});
		// handle input group button click
		$('.time-picker').on('click', '.input-group-addon', function(e){
			e.preventDefault();
			$(this).parent('.input-group').find('.timepicker').timepicker('showWidget');
		});
		
	}
    // public functions
    return {

        //main function
        init: function () {
            handleEvents();   
            //initLayout();          
        },
    };

}();

jQuery(document).ready(function() {    
    Schedules.init(); 
});