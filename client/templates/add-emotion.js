Template.addEmotion.onCreated(function() {
	Session.setDefault('imgObj', undefined);
	let self = this;
	let emotionId =  Router.current().params._id;

  	self.autorun(function() {
  		self.subscribe('covers', Session.get('fileObj'));
    	self.subscribe('singleEmotion', emotionId);
  	});
});

Template.addEmotion.onRendered(function() {
	let template = this;

	let validation = $('#emotionForm').validate({
		rules: {
			title: {
				required: true,
				minlength: 3
			},
            description: {
				required: true,
				minlength: 3
			},
			pubpate: {
				required: true,
				date: true
			},
			cover: {
				required: false
			}
		},
		messages: {
			title: {
				required: "<strong>I see you forgot to fill this field</strong>"
			},
            description: {
				required: "<strong>Whom this book was written?</strong>"
			},
			pubpate: {
				required: "<strong>When this book was written?</strong>",
				date: true
			},
			cover: {
				required: "<strong>This book need a cover</strong>"
			}
		},
		errorElement: 'p',
		errorClass: 'warning-text',
		highlight: function(element, errorClass, validClass) {
			$(element).nextAll('#input-error').removeClass('hidden');
			$(element).nextAll('#input-success').addClass('hidden');
  		},
  		unhighlight: function(element, errorClass, validClass) {
    		$(element).nextAll('#input-error').addClass('hidden');
    		$(element).nextAll('#input-success').removeClass('hidden');
  		},
  		submitHandler: function() {
            let sGet = Session.get('imageFileObjID');
			let insertPack = {
				title: $('#title').val(),
                description: $('#descritpion').val(),
				img: sGet,
				user: Meteor.userId(),
				pubDate: new Date($('#emotion-pubpate').val()),
				createdDate: new Date
			};

			let exist =  Router.current().params._id;

			if (exist) {
				Meteor.call('updateEmotion', exist, insertPack, function(error) {
					if(error) {
						validator.showErrors();
					} else {
                        toastr.success('Your emotion was successfully updated');
						Router.go('home')
					}
				});
			} else {
				Meteor.call('insertEmotion', insertPack, function(error) {
					if(error) {
						validator.showErrors();
					} else {
                        toastr.success('Your emotion was successfully added');
                        toastr.warning('This emotion will be removed after 7 days');
						Router.go('home')
					}
				});
			}
  		}
	});
	$('.user-input--description').autosize();
});

Template.addEmotion.events({
	'click [name=removeImg]': function(event) {
        event.preventDefault();

        let sget = Session.get('imageFileObjID');

        let index = sget.indexOf(this._id);
        if(index != -1) {
            sget.splice(index, 1);
        }

        Session.set('imageFileObjID', sget);
        Meteor.call('removeFile', this._id);
    }
});

Template.addEmotion.helpers({
	'isEditEmotion': function(){
		let emotionId = Router.current().params._id;

		return !!Emotions.findOne(emotionId);
	},
	'emotion': function() {
		let emotionId = Router.current().params._id;
		let emotion = Emotions.findOne(emotionId);

		if(emotion) {
            Session.set('imageFileObjID', emotion.img);
		}

		return emotion;
	},
    uloadedImg: function() {
        let img;
        let sGet = Session.get('imageFileObjID');

        if (sGet) {
            if(sGet.length) {
                img = Covers.find({_id: {$in: sGet}}).fetch();
            } else {
                img = [{
                    link: "/placeholder.png"
                }]
            }
        } else {
            img = [{
                link: "/placeholder.png"
            }];
        }

        return img;
    },
});

























