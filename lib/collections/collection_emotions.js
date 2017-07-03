import { Mongo } from 'meteor/mongo';

Emotions = new Mongo.Collection('emotions');

emotionsSchema = new SimpleSchema({
	title: {
  	  	type: String,
  	  	label: "Title",
  	  	max: 200
  	},
    description: {
  	  	type: String,
  	  	label: "Description"
  	},
	img: {
  	  	type: [String],
  	  	label: "Image"
  	},
	user: {
  	  	type: this.userId,
  	  	label: "User"
  	},
  	pubDate: {
  	  	type: Date,
  	  	label: "Publication Date fuck"
  	},
	createdDate: {
		type: Date,
		autoValue: function() {

			if(this.isInsert) {

				return new Date;

			}

		}
  	}
});

Emotions.attachSchema( emotionsSchema );