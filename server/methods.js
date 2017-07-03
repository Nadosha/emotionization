Meteor.startup(function() {
	return Meteor.methods({
		'insertEmotion': function(insertPack) {
			check( insertPack, Emotions.simpleSchema() );

			Emotions.insert(insertPack, function(error, result) {
				if(error) {
					return error;
				} else {
                    Meteor.call('addCronJob', result);
				}
			});


		},
		'updateEmotion': function(bookId, insertPack) {
			Emotions.update({_id: bookId}, {$set: insertPack})
		},
		'removeEmotion': function(emotionId, userId) {
			let emotion = Emotions.findOne(emotionId).img;

            Covers.remove({_id: {$in: emotion}});
			Emotions.remove({_id: emotionId, user: userId});
		},
		'removeLastImg': function(imgId) {
			Covers.remove(imgId)
		},
		'emotionsAmount': function(usrId) {
			return Emotions.find({'user': usrId}).count();
		},
        'removeFile': function(fileId) {
            //check(fileId, String);
            if(!this.userId) throw new Meteor.Error("You are not logged in");

            Covers.remove({
                _id: fileId
            });

            return null, true;
        }
	})
});