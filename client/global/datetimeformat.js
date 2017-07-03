Template.registerHelper('fullMonthAndYear', function(date) {
	return moment(date).format('MMMM, YYYY')
});

Template.registerHelper('inputFormat', function(date) {
	return moment(date).format('YYYY-MM-DD')
});