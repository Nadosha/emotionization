Template.navBar.helpers({
	'user': function() {
		let user = Meteor.user();
		if (user) {
			return {
				first: user.profile.firstName,
				last: user.profile.lastName,
				exist: true
			}
		}
	}
});

Template.navBar.events({
	'click #logout': function(event) {
		event.preventDefault();
		Meteor.logout();
	}
});