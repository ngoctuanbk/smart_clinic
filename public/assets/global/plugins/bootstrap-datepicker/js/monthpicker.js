/**
* @version: 1.0.0
* @author: Z-CRM Team 
* @copyright: Copyright (c) 2017 GMO-Z.com RUNSYSTEM. All rights reserved.
* @license: Licensed under the MIT license. See http://www.opensource.org/licenses/mit-license.php
* @website: https://z.com/
* Clone from Datepicker, but view only Month, include Quarter view
* Return picked month or first month of quartered selected
*/

(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['moment', 'jquery', 'exports'], function(momentjs, $, exports) {
      root.monthpicker = factory(root, exports, momentjs, $);
    });

  } else if (typeof exports !== 'undefined') {
      var momentjs = require('moment');
      var jQuery = (typeof window != 'undefined') ? window.jQuery : undefined;  //isomorphic issue
      if (!jQuery) {
          try {
              jQuery = require('jquery');
              if (!jQuery.fn) jQuery.fn = {}; //isomorphic issue
          } catch (err) {
              if (!jQuery) throw new Error('jQuery dependency not found');
          }
      }

    factory(root, exports, momentjs, jQuery);

  // Finally, as a browser global.
  } else {
    root.monthpicker = factory(root, {}, root.moment || moment, (root.jQuery || root.Zepto || root.ender || root.$));
  }

}(this || {}, function(root, monthpicker, moment, $) { // 'this' doesn't exist on a server

    var MonthPicker = function(element, options, cb) {
    
    	this.element = $(element);
        this.pickDate = moment().startOf('day');
        this.pickQuarter = -1;
        this.pickYear = -1;
        this.mode = 0;
        this.pickFullString = '';
        this.pickShortString = '';
        this.autoApply = false;
        this.autoUpdateInput = true;
        this.choices = {};
        this.pickRange = {};
        this.datePicker;
        
        this.opens = 'right';
        if (this.element.hasClass('pull-right'))
            this.opens = 'left';
            
        this.drops = 'down';
        if (this.element.hasClass('dropup'))
            this.drops = 'up';
        
        this.buttonClasses = 'btn btn-sm';
        this.applyClass = 'btn-success';
        this.cancelClass = 'btn-default';
            
        this.locale = {
        	format: 'DD/MM/YYYY',
        	lang: 'vi',
        	applyLabel: 'Apply',
        	cancelLabel: 'Cancel',
        	customChoiceLabel: 'Custom Choice',
        	yearFull: 'Year',
        	yearShort: 'Y',
        	quarterFull: 'Quarter',
        	quarterShort: 'Q',
        };
        
        this.callback = function() { };
        
        this.isShowing = false;
        
        //custom options from user
        if (typeof options !== 'object' || options === null)
            options = {};
        
        options = $.extend(this.element.data(), options);
        if (typeof options.template !== 'string')
            options.template = '<div class="monthpicker opensleft dropdown-menu pull-right">' +
            						'<div class="calendar center">' + 
										'<div class="monthpicker_input">' + 
											'<input class="input-mini active" type="text" name="monthpicker" value="">' + 
												'<i class="fa fa-calendar"></i>' + 
											'</div>' + 
											'<div class="calendar-table">' + 
												'<div class="month-picker date-picker" data-date-format="mm/yyyy"> </div>' + 
											'</div>' + 
										'</div>' + 
										'<div class="choices" id = "picker_choices">' + 
											'<div class="choice_buttons">' + 
												'<button class="applyBtn btn btn-sm btn-success" type="button">Apply</button> ' + 
												'<button class="cancelBtn btn btn-sm btn-default" type="button">Cancel</button> ' + 
											'</div>' + 
										'</div>' + 
									'</div>' + 
								'</div>' ;
            
            
        this.container = $(options.template).appendTo(this.element);
        
        if (typeof options.locale === 'object') {
        	if (typeof options.locale.format === 'string')
                this.locale.format = options.locale.format;

            if (typeof options.locale.applyLabel === 'string')
              this.locale.applyLabel = options.locale.applyLabel;

            if (typeof options.locale.cancelLabel === 'string')
              this.locale.cancelLabel = options.locale.cancelLabel;
              
            if (typeof options.locale.customChoiceLabel === 'string')
              this.locale.customChoiceLabel = options.locale.customChoiceLabel;
            
            if (typeof options.locale.lang === 'string')
              this.locale.lang = options.locale.lang;
              
            if (typeof options.locale.yearFull === 'string')
              this.locale.yearFull = options.locale.yearFull;
            if (typeof options.locale.yearShort === 'string')
              this.locale.yearShort = options.locale.yearShort;
            if (typeof options.locale.quarterFull === 'string')
              this.locale.quarterFull = options.locale.quarterFull;
            if (typeof options.locale.quarterShort === 'string')
              this.locale.quarterShort = options.locale.quarterShort;
              
        }
        
        if (typeof options.pickDate === 'string')
            this.pickDate = moment(options.pickDate, this.locale.format);

        if (typeof options.pickDate === 'object')
            this.pickDate = moment(options.pickDate);

        if (typeof options.applyClass === 'string')
            this.applyClass = options.applyClass;

        if (typeof options.cancelClass === 'string')
            this.cancelClass = options.cancelClass;
            
        if (typeof options.opens === 'string')
            this.opens = options.opens;

        if (typeof options.drops === 'string')
            this.drops = options.drops;
        
        if (typeof options.buttonClasses === 'string')
            this.buttonClasses = options.buttonClasses;

        if (typeof options.buttonClasses === 'object')
            this.buttonClasses = options.buttonClasses.join(' ');

        if (typeof options.showDropdowns === 'boolean')
            this.showDropdowns = options.showDropdowns;
            
        if (typeof options.autoApply === 'boolean')
            this.autoApply = options.autoApply;

        if (typeof options.autoUpdateInput === 'boolean')
            this.autoUpdateInput = options.autoUpdateInput;
        
        if (typeof options.isInvalidDate === 'function')
            this.isInvalidDate = options.isInvalidDate;
        
        var pick, choice;
        
        //if no dates set, check if an input element contains initial values
        if (typeof options.pickDate === 'undefined' ) {
            if ($(this.element).is('input[type=text]')) {
                var val = $(this.element).val();

                pick = null;
				
				if (val !== "") {
                    pick = moment(val, this.locale.format);
                }
                if (pick !== null ) {
                    this.setPickDate(pick);
                }
            }
        }
        
        if (typeof options.choices === 'object') {
            for (choice in options.choices) {

                if (typeof options.choices[choice][0] === 'string')
                    pick = moment(options.choices[choice][0], this.locale.format);
                else
                    pick = moment(options.choices[choice][0]);

                var elem = document.createElement('textarea');
                elem.innerHTML = choice;
                choiceHtml = elem.value;
				if (typeof options.choices[choice][1] === 'number') {
                	this.choices[choiceHtml] = [pick,options.choices[choice][1]];
                } else {
                	this.choices[choiceHtml] = [pick,0];
                }
            }

            var list = '<ul>';
            for (choice in this.choices) {
                list += '<li>' + choice + '</li>';
            }
            list += '<li>' + this.locale.customChoiceLabel + '</li>';
            list += '</ul>';
            this.container.find('.choices').prepend(list);
        }
        
        if (typeof cb === 'function') {
            this.callback = cb;
        }
        
        if (this.autoApply && typeof options.choices !== 'object') {
            this.container.find('.choices').hide();
        } else if (this.autoApply) {
            this.container.find('.applyBtn, .cancelBtn').addClass('hide');
        }
        
        if (typeof options.choices === 'undefined') {
            this.container.addClass('show-calendar');
        }
        
        this.container.addClass('opens' + this.opens);
        
        //apply CSS classes and labels to buttons
        this.container.find('.applyBtn, .cancelBtn').addClass(this.buttonClasses);
        if (this.applyClass.length)
            this.container.find('.applyBtn').addClass(this.applyClass);
        if (this.cancelClass.length)
            this.container.find('.cancelBtn').addClass(this.cancelClass);
        this.container.find('.applyBtn').html(this.locale.applyLabel);
        this.container.find('.cancelBtn').html(this.locale.cancelLabel);

		//
        // event listeners
        //
        
        this.container.find('.choices')
            .on('click.monthpicker', 'button.applyBtn', $.proxy(this.clickApply, this))
            .on('click.monthpicker', 'button.cancelBtn', $.proxy(this.clickCancel, this))
            .on('click.monthpicker', 'li', $.proxy(this.clickChoice, this))
            .on('mouseenter.monthpicker', 'li', $.proxy(this.hoverChoice, this))
            .on('mouseleave.monthpicker', 'li', $.proxy(this.updateFormInput, this));
		
		if (this.element.is('input')) {
            this.element.on({
                'click.monthpicker': $.proxy(this.show, this),
                'focus.monthpicker': $.proxy(this.show, this),
                'keyup.monthpicker': $.proxy(this.elementChanged, this),
                'keydown.monthpicker': $.proxy(this.keydown, this)
            });
        } else {
            this.element.on('click.monthpicker', $.proxy(this.toggle, this));
        }
        
        if (this.element.is('input') && this.autoUpdateInput ) {
            this.element.val(this.pickDate.format(this.locale.format));
            this.element.trigger('change');
        }

    };
    
    MonthPicker.prototype = {

        constructor: MonthPicker,
        
        setPickDate: function(pickDate) {
            if (typeof pickDate === 'string')
                this.pickDate = moment(pickDate, this.locale.format);

            if (typeof pickDate === 'object')
                this.pickDate = moment(pickDate);

            if (!this.isShowing)
                this.updateElement();
        },
                
		isInvalidDate: function() {
            return false;
        },
        
        updateView: function() {
            this.updateCalendar();
            this.updateFormInput();
        },
        
        updateCalendar: function() {
        
        	this.renderCalendar();
        	this.container.find('.choices li').removeClass('active');
        	
        	var customChoice = true;
        	var quarterChoice = false;
            var i = 0;
            
            for (var choice in this.choices) {
				if ( (this.pickDate.format('YYYY-MM-DD') == this.choices[choice][0].format('YYYY-MM-DD')) && (this.choices[choice][1] == this.mode) ) {
					customChoice = false;
					quarterChoice = true;
					this.chosenLabel = this.container.find('.choices li:eq(' + i + ')').addClass('active').html();
					break;
				} 
				i++;
			}
			
            if (customChoice) {
                this.chosenLabel = this.container.find('.choices li:last').addClass('active').html();
                this.showCalendar();
            }

        },
        
        renderCalendar: function() {
        	var self = this;
        	
        	this.datePicker = this.container.find('.date-picker').datepicker({
					rtl: App.isRTL(),
					orientation: "left",
					autoclose: true,
					quarterView: true,
					minViewMode: 1,
            });
             
        	this.datePicker.on('changeDate', function(ev) {
            	ev.stopPropagation();
            	self.pickDate = moment(ev.dates[0]);
            	self.pickQuarter = ev.quarter;
            	self.mode = ev.mode,
            	self.container.find('input[name=monthpicker]').val(self.getInputValue(self.pickDate,self.mode));
            });
        },
        
        getInputValue: function (date,mode) {
        	
        	var value = "";
        	
        	if (mode == 3) {
				value = date.format('['+this.locale.yearShort+'] YYYY');
			} else if (mode == 2) {
                value = date.format('['+this.locale.quarterShort+'] Q/YYYY');
			} else if (mode == 1) {
            	value = date.locale(this.locale.lang).format('MMM/YYYY');
			} else {
				value = date.format(this.locale.format);
			}
			
			return value;
        },
        
        updateFormInput: function() {

            //ignore mouse movements while an above-calendar text input has focus
            if (this.container.find('input[name=monthpicker]').is(":focus") )
                return;
			
			this.container.find('input[name=monthpicker]').val(this.getInputValue(this.pickDate,this.mode));
        },
        
        show: function(e) {
            if (this.isShowing) return;
            
            this.oldPickDate = this.pickDate.clone();
            
            this.updateView();
            //this.container.show();
            this.element.trigger('show.monthpicker', this);
            this.isShowing = true;
        },

        hide: function(e) {
            if (!this.isShowing) return;
			//incomplete date selection, revert to last values
            if (!this.pickDate) {
                this.pickDate = this.oldPickDate.clone();
            }

            //if a new date choice was selected, invoke the user callback function
            if (!this.pickDate.isSame(this.oldPickDate) )
                this.callback(this.pickDate, this.chosenLabel);

            //if picker is attached to a text input, update it
            this.updateElement();

            this.element.removeClass('open');
            this.element.trigger('hide.monthpicker', this);
            this.isShowing = false;
        },

        toggle: function(e) {
            if (this.isShowing) {
                this.hide();
            } else {
                this.show();
            }
        },
        
        showCalendar: function() {
            this.container.addClass('show-calendar');
            this.element.trigger('showCalendar.monthpicker', this);
        },

        hideCalendar: function() {
            this.container.removeClass('show-calendar');
            this.element.trigger('hideCalendar.monthpicker', this);
        },

        hoverChoice: function(e) {

            //ignore mouse movements while an above-calendar text input has focus
            if (this.container.find('input[name=monthpicker]').is(":focus") )
                return;

            var label = e.target.innerHTML;
            if (label == this.locale.customChoiceLabel) {
               
                this.updateView();
            } else {
                var dates = this.choices[label];
                this.container.find('input[name=monthpicker]').val(this.getInputValue(dates[0],dates[1]));
            }
            
        },

        clickChoice: function(e) {
            var label = e.target.innerHTML;
            this.chosenLabel = label;
            
            if (label == this.locale.customChoiceLabel) {
            	e.stopPropagation();
                this.showCalendar();
            } else {
            	this.pickQuarter = -1;
            	this.pickYear = -1;
                var options = this.choices[label];
                this.pickDate = options[0];
                this.mode = options[1];
                if (this.mode === 2) {
                	this.pickQuarter = this.pickDate.quarter() - 1;
                } else if (this.mode === 3) {
                	this.pickYear = this.pickDate.year();
                }
                
                this.hideCalendar();
                this.clickApply(e);
            }
            
            if (this.pickDate) {
            	var year = this.pickDate.year();
            	var month = this.pickDate.month();
            	if (this.mode == 3) {
            		this.datePicker.datepicker('setYear',this.pickYear);	
            	} else if (this.mode == 2) {
					this.datePicker.datepicker('setQuarter', year, this.pickQuarter);
				} else if (this.mode == 1) {
					this.datePicker.datepicker('setMonth', year, month);
				} else {
					this.datePicker.datepicker('setDate',this.pickDate.toDate());
				}
            }
            //this.updateView();
        },
        
        clickApply: function(e) {
        	if (this.mode == 0) {
        		this.pickRange = [moment(this.pickDate).startOf('month'),this.pickDate];
        		this.pickFullString = this.pickDate.locale(this.locale.lang).format("D MMMM, YYYY");
        		this.pickShortString = this.pickDate.locale(this.locale.lang).format("D MMM, YYYY");
        	} else if (this.mode == 1) {
        		this.pickRange = [moment(this.pickDate).startOf('month'),moment(this.pickDate).endOf('month')];
        		this.pickFullString = this.pickDate.locale(this.locale.lang).format("MMMM, YYYY");
        		this.pickShortString = this.pickDate.locale(this.locale.lang).format("MMM, YYYY");
        	} else if (this.mode == 2) {
        		this.pickRange = [moment(this.pickDate).startOf('month'),moment(this.pickDate).add(3,'months').endOf('month')];
        		this.pickFullString = this.pickDate.locale(this.locale.lang).format("["+this.locale.quarterFull+"] Q/YYYY");
                this.pickShortString = this.pickDate.locale(this.locale.lang).format("["+this.locale.quarterShort+"] Q/YYYY");
        	} else if (this.mode == 3) {
        		this.pickRange = [moment(this.pickDate).startOf('year'),moment(this.pickDate).endOf('year')];
        		this.pickFullString = this.locale.yearFull + " " + this.pickDate.year();
        		this.pickShortString = this.locale.yearShort + " " + this.pickDate.year();
            }
            this.hide();
            this.element.trigger('apply.monthpicker', this);
        },

        clickCancel: function(e) {
            this.pickDate = this.oldPickDate;
            this.hide();
            this.element.trigger('cancel.monthpicker', this);
        },
        
        updateElement: function() {
            if (this.element.is('input') && this.autoUpdateInput) {
                this.element.val(this.pickDate.format(this.locale.format));
                this.element.trigger('change');
            }
        },

        remove: function() {
            this.container.remove();
            this.element.off('.monthpicker');
            this.element.removeData();
        }

    };
    
    $.fn.monthpicker = function(options, callback) {
        this.each(function() {
            var el = $(this);
            if (el.data('monthpicker'))
                el.data('monthpicker').remove();
            el.data('monthpicker', new MonthPicker(el, options, callback));
        });
        return this;
    };

}));
