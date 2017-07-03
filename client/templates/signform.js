Template.registr.onRendered(function() {
	var validator = $('#registr').validate({
		rules: {
			email: {
				required: true,
				email: true
			},
			password: {
				required: true,
				minlength: 6
			},
			userName: {
				required: true
			},
			userLastName: {
				required: true
			}
		},
		messages: {
			email: {
				required: "<strong>Sorry! You forgot to fill this!</strong> I need your email to identify you.",
				email: "Oops! I think you missed simbol like @ or dots!"
			},
			password: {
				required: "<strong>Sorry! You forgot to fill this!</strong> I need your password to protect your account.",
				minlength: "<strong>Oops! Must be at least {0} characters!</strong> It is bad password, it can be hacked by anyone."
			},
			userName: {
				required: "<strong>Sorry! You forgot to fill this!</strong> Please, don't be so shy! Tell me your name )"
			},
			userLastName: {
				required: "<strong>Sorry! You forgot to fill this!</strong> Your friends can search you by your last name."
			}
		},
		errorElement: 'p',
		errorClass: "warning-text",
		highlight: function(element, errorClass, validClass) {
			$(element).nextAll('#input-error').removeClass('hidden');
			$(element).nextAll('#input-success').addClass('hidden');
  		},
  		unhighlight: function(element, errorClass, validClass) {
    		$(element).nextAll('#input-error').addClass('hidden');
    		$(element).nextAll('#input-success').removeClass('hidden');
  		},
  		submitHandler: function(event) {
  			var email = $('[name=email]').val();
			var password = $('[name=password]').val();
			var firstName = $('[name=userName]').val();
			var lastName = $('[name=userLastName]').val();

			Accounts.createUser({
				email: email,
				password: password,
				profile: {
					firstName: firstName,
					lastName: lastName
				}
			}, function(error, res) {
				if(error) {
					if(error.reason == "Email already exists."){
						validator.showErrors({
							email: "Email already exists."
						});
					} 
				} else {
					var redirect = Session.get("redirectAfterLogin");
					var currentRoute = Router.current().route.getName();

					if(currentRoute == 'registr') {
						if(redirect) {
							Router.go(redirect);
						} else {
							Router.go('home');
						}
					} else {
						Router.go(currentRoute);
					}
				}		
			});
  		}
	});
});

Template.login.onRendered(function() {
	var validator = $('#login').validate({
		rules: {
			email: {
				required: true,
				email: true
			},
			password: {
				required: true
			}
		},
		messages: {
			email: {
				required: "<strong>Sorry! You forgot to fill this!</strong> I need your email to identify you",
				email: "Don't forget simbols like @ or dots )"
			},
			password: {
				required: "<strong>Sorry! You forgot to fill this!</strong> I need your password to protect your account "
			}
		},
		errorElement: 'p',
		errorClass: "warning-text",
		highlight: function(element, errorClass, validClass) {
			$(element).nextAll('#input-error').removeClass('hidden');
			$(element).nextAll('#input-success').addClass('hidden');
  		},
  		unhighlight: function(element, errorClass, validClass) {
    		$(element).nextAll('#input-error').addClass('hidden');
    		$(element).nextAll('#input-success').removeClass('hidden');
  		},
  		submitHandler: function(event) {
  			var email = $('[name=email]').val();
			var password = $('[name=password]').val();
			Meteor.loginWithPassword(email, password, function(error){
				if(error){
					if(error.reason == "User not found"){
						validator.showErrors({
							email: "Probably we are not familiar yet - <a href=\"/signup\">become acquainted</a>. Or maybe you filled incorrect email?"
						});
					}
					if(error.reason == "Incorrect password"){
						validator.showErrors({
							password: "You entered an incorrect password. I hope you're not a hacker ;)"
						});
					}
				} else {
					var redirect = Session.get("redirectAfterLogin");
					var currentRoute = Router.current().route.getName();

					if(currentRoute == 'login' || currentRoute == 'logout') {
						if(redirect) {
							Router.go(redirect);
						} else {
							Router.go('home');
						}
					} else {
						Router.go(currentRoute);
					}
					
					
				}
			});
  		}
	});
		
});












































