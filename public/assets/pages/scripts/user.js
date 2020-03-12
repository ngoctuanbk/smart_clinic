//event attach for delete button

var Member = function () {
	var datePikcer = function() {
		if (jQuery().datepicker) {
            $('.date-picker').datepicker({
                rtl: App.isRTL(),
                orientation: "left",
                weekStart: 1,
                autoclose: true
            });
        }
    }
    var bsSelect = function () {
        $('.selectpicker').selectpicker({
            iconBase: 'fa',
            tickIcon: 'fa-check'
        });
    }

    return {
        //main function to initiate the module
        init: function () {  
            datePikcer();
            bsSelect();
        }
    };

}();

jQuery(document).ready(function() {    
	Member.init(); 
});