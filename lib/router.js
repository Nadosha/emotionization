// Configurations
LoginControll = RouteController.extend({
    onBeforeAction: function() {
        let currentUser = Meteor.userId();
        if (currentUser) {
            this.next();
        } else {
            Router.go('login');
        }
    }
});

// DEFINE ROUTS

//Login routs
Router.route('/registration', {
        name: 'registr',
        template: 'registr',
        layoutTemplate: 'loginPage'
    }
);
Router.route('/login', {
        name: 'login',
        template: 'login',
        layoutTemplate: 'loginPage',
        waitOn:function(){
            Accounts.loginServicesConfigured();
        }
    }
);

// App routs configurations
Router.route('/', {
    name: 'home',
    template: "filesShelf",
    onAfterAction: function() {
        //Simple example of SEO optimizing for Facebook and Google
        SEO.set({
            title: 'Emotionization - your local emotions storadge',
            meta: {
                'img': 'http://Emotionization.club/img/logotip.png'
            },
            og: {
                'title': 'Save all your emotions here',
                'img': 'http://Emotionization.club/img/logotip.png',
                'type': 'article',
                'site_name': 'Emotionization',
                'url': 'http://Emotionization.club/'
            }
        });
    },
    controller: 'LoginControll'
});

Router.route('/emotion/:_id', {
    name: 'fileDetails',
    template: 'fileDetails',
    data: function () {
      let event = Emotions.findOne({_id: this.params._id});
      return event;
    },
    controller: 'LoginControll'
});

Router.route('/add-file', {
    name: 'addFile',
    template: 'addEmotion',
    controller: 'LoginControll'
});

Router.route('/edit-file/:_id', {
    name: 'editFile',
    template: 'addEmotion',
    controller: 'LoginControll'
});

Router.route('/cdn/storage/covers/oLyhRW9L3oxvt7rcr/original/oLyhRW9L3oxvt7rcr.jpg', {
    template: '404',
    controller: 'LoginControll'
})


Router.configure({
    layoutTemplate: 'mainLayout'
});