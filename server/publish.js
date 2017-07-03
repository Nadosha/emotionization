Meteor.publish('emotions', function(limit, userId) {
	if (limit) {
		return Emotions.find({'user': userId}, {limit: limit}, {sort: {createdDate: 1}});
	}
});

Meteor.publish('allemotion', function() {
	return Emotions.find({'user': this.userId});
})

Meteor.publish('singleEmotion', function(emotionId) {
	return Emotions.find({_id: emotionId, 'user': this.userId});
});

Meteor.publish('covers', function() {
	return Covers.find({'meta.user': this.userId}).cursor;
});