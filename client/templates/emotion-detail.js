Template.fileDetails.onRendered(function() {
	let self = this;
  	self.autorun(function() {
    	let emotionId = Router.current().params._id;
    	self.subscribe('singleEmotion', emotionId);
        Meteor.subscribe('covers');
  });
});

Template.fileDetails.helpers({
	emotion: function() {
		let emotionId = Router.current().params._id;
		let emotion = Emotions.findOne(emotionId);

		return emotion;
	},
    'imagesSome': function() {
		let currentEmotion =  Router.current().params._id;
        let emotion = Emotions.findOne(currentEmotion).img;
        let images = Covers.find({_id: {$in: emotion}}).fetch();

        return images;
    }
});

Template.fileDetails.events({
	'click #removeEmotion': function(event) {
		event.preventDefault();

		let emotionId = Router.current().params._id;
		let userId = Meteor.userId();
		Meteor.call('removeEmotion', emotionId, userId, function(err) {
			if(err) return err;
            Router.go('home');
		});
	}
});