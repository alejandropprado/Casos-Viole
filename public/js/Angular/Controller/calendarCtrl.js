app.controller('calendarCtrl', ['$scope','calendarConfig', function(vm, calendarConfig){

	moment.locale('es');


	calendarConfig.dateFormatter = 'moment';
	calendarConfig.allDateFormats.moment.date.hour = 'HH:mm'; 
	calendarConfig.allDateFormats.moment.title.day = 'DD MM YYYY'; 
	calendarConfig.i18nStrings.weekNumber = 'Week {week}'; 
	calendarConfig.displayAllMonthEvents = true;
	calendarConfig.showTimesOnWeekView = true;

	vm.calendarView = 'month';

	vm.viewDate = moment();

	var actions = [{
		label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
		onClick: function(args) {
			console.log('Edited', args.calendarEvent);
		}
	}, {
		label: '<i class=\'glyphicon glyphicon-remove\'></i>',
		onClick: function(args) {
			console.log('Deleted', args);
		}
	}];

	vm.events = [
	  {
	    title: 'My event title', // The title of the event
	    startsAt: moment('26/12/2016', 'DD/MM/YYYY'), // A javascript date object for when the event starts
	    endsAt: moment('27/12/2016', 'DD/MM/YYYY'), // Optional - a javascript date object for when the event ends
	    color: { // can also be calendarConfig.colorTypes.warning for shortcuts to the deprecated event types
	      primary: '#e3bc08', // the primary event color (should be darker than secondary)
	      secondary: '#fdf1ba' // the secondary event color (should be lighter than primary)
	    },
	    actions: actions,
	    draggable: true, //Allow an event to be dragged and dropped
	    resizable: true, //Allow an event to be resizable
	    incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
	    recursOn: 'year', // If set the event will recur on the given period. Valid values are year or month
	    cssClass: 'a-css-class-name', //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
	    allDay: false // set to true to display the event as an all day event on the day view
	  },
	  {
	    title: 'My event title', // The title of the event
	    startsAt: moment(), // A javascript date object for when the event starts
	    endsAt: moment(), // Optional - a javascript date object for when the event ends
	    color: { // can also be calendarConfig.colorTypes.warning for shortcuts to the deprecated event types
	      primary: '#e3bc08', // the primary event color (should be darker than secondary)
	      secondary: '#fdf1ba' // the secondary event color (should be lighter than primary)
	    },
	    actions: actions,
	    draggable: true, //Allow an event to be dragged and dropped
	    resizable: true, //Allow an event to be resizable
	    incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
	    recursOn: 'year', // If set the event will recur on the given period. Valid values are year or month
	    cssClass: 'a-css-class-name', //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
	    allDay: false // set to true to display the event as an all day event on the day view
	  }
	];

	vm.addEvent = function() {
		vm.events.push({
			title: 'New event',
			startsAt: moment().startOf('day').toDate(),
			endsAt: moment().endOf('day').toDate(),
			color: calendarConfig.colorTypes.important,
			draggable: true,
			resizable: true,
			actions: actions
		});
	};



}]);