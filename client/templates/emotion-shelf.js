Template.filesShelf.onRendered(function() {
	let usr = Meteor.userId();
	Session.set('queryLimit', 10);

	Meteor.autorun(function() {
  		Meteor.subscribe('emotions', Session.get('queryLimit'), usr);
  		Meteor.subscribe('covers');
  		
  		if (Session.get("queryLimit") >= Session.get('itemsInQuery')) {
  			$('#loadMore').addClass('hidden');
  		} else {
  			$('#loadMore').removeClass('hidden');
  		}
  	});	
});

Template.filesShelf.helpers({
	'emotions': function() {
		let usr = Meteor.userId()
		Meteor.call('emotionsAmount', usr, function(err, result) {
			Session.set('itemsInQuery', result)
		});

		return Emotions.find({'user': usr});
	},
	'ifAnyEmotion': function() {
		let usr = Meteor.userId();

		return Emotions.find({'user': usr}).count() > 0;
	}
});

Template.filesShelf.events({
	'click #loadMore': function() {
  		let queryLimit = Session.get("queryLimit") + 10;
  		Session.set("queryLimit", queryLimit);
	}
	
});

Template.fileItem.onRendered(function() {
    $('#tiles').imagesLoaded().progress( function() {
        let $grid = $('#tiles').masonry({
            itemSelector: '.tile',
            transitionDuration: 5
        });

        $grid.masonry( 'reloadItems' );
    });

    Emotions.find().observe({
        added: function() {
            let $grid = $('#tiles').masonry();
            $grid.masonry( 'reloadItems' );
        },
        changed: function() {
            let $grid = $('#tiles').masonry();
            $grid.masonry( 'reloadItems' );
        },
        removed: function() {
            let $grid = $('#tiles').masonry();
            $grid.masonry( 'reloadItems' );
        }
    });
});

Template.fileItem.helpers({
    'imagesSome': function() {

        let emotion = Emotions.findOne(this._id).img;
        let images = Covers.find({_id: {$in: emotion}}).fetch();

        return images;
    }
});