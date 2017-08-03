riot.tag2('app', '<div id="nav-tag"></div> <div class="container"> <div id="content-tag"></div> <div id="footer-tag"></div> </div>', '', '', function(opts) {
'use strict';

var _this = this;

this.is_authenticated = function () {
	return localStorage.getItem('token') !== null;
};

this.on('mount', function () {
	riot.mount('#nav-tag', 'navi', { is_authenticated: _this.is_authenticated });
	riot.mount('#footer-tag', 'footer-tag');
	route.start(true);
});

route(function (path) {
	if (path === "landing") {
		riot.mount('#content-tag', 'landing');
	} else if (path === "companies") {
		riot.mount('#content-tag', 'companies');
	} else if (path === "dashboard") {
		riot.mount('#content-tag', 'dashboard');
	} else if (path === "profile") {
		riot.mount('#content-tag', 'profile');
	} else if (path === "logout") {
		riot.mount('#content-tag', 'logout');
	} else if (path === "signup") {
		riot.mount('#content-tag', 'signup');
	} else if (path === "company") {
		riot.mount('#content-tag', 'company');
	} else {
		riot.mount('#content-tag', 'landing');
	}
});
});

riot.tag2('companies', '<h1>Companies</h1>', '', '', function(opts) {
});

riot.tag2('company', '<h1>Company</h1>', '', '', function(opts) {
});

riot.tag2('dashboard', '<head> <link href="/static/css/dashboard.css" rel="stylesheet"> </head> <div class="container-fluid"> <div class="row"> <div class="col-sm-3 col-md-2 sidebar"> <ul class="nav nav-sidebar"> <li class="active"><a href="#">Profile<span class="sr-only">(current)</span></a></li> <li><a href="#">Reports</a></li> <li><a href="#">Analytics</a></li> </ul> <ul class="nav nav-sidebar"> <li><a href="">Nav item</a></li> <li><a href="">Another nav item</a></li> </ul> </div> <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main"> <h1 class="page-header">Dashboard</h1> <form class="form-signin"> <h2 class="form-signin-heading">Public profile</h2> <label for="inputName">Name</label> <input ref="name" type="text" id="inputName" class="form-control" placeholder="{name}"> <label for="inputUsername">Username</label> <input ref="username" type="text" id="inputUsername" class="form-control" placeholder="{username}"> <label for="inputEmail">Email address</label> <input ref="email" id="inputEmail" class="form-control" placeholder="{email}" type="email"> <label for="inputPassword">Password</label> <input ref="password" type="password" id="inputPassword" class="form-control"> <button class="btn btn-lg btn-primary btn-block" onclick="{submit}" type="submit">Update Changes</button> </form> </div> </div> </div>', '', '', function(opts) {
'use strict';

var _this = this;

//Ajax call for updading profile
this.submit = function (e) {
	console.log('Submit clicked ' + _this.refs.username.value);

	var url = '/api/users';
	var xhr = new XMLHttpRequest();

	xhr.open('PUT', url, true);

	// //Send the proper header information along with the request
	xhr.setRequestHeader("Content-type", "application/json");

	// //Call a function when the state changes.
	xhr.onreadystatechange = function () {
		if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
			// Request finished. Do processing here.
			console.log('Response ' + xhr.responseText);
		} else if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 403) {
			console.log('Response ' + xhr.responseText);
		}
	};
	xhr.send(_this.queryStringify(_this.refs.username.value, _this.refs.name.value, _this.refs.password.value, _this.refs.email.value));
};

this.queryStringify = function (username, name, password, email) {
	var updateJson = '{ "user": {';
	if (username) {
		updateJson += '"username": ' + username + ' ';
	}

	updateJson += '} }';
	return 'username=' + username + '&name=' + name + '&email=' + email + '&password=' + password;
};

// Right after the tag is mounted
this.on('mount', function () {
	console.log('Dashboard mounted');

	// Check if token exist
	// if not exist
	if (localStorage.getItem('token') === null) {
		route('landing');
	}

	var url = '/api/user';
	var xhr = new XMLHttpRequest();

	xhr.open('GET', url, true);
	// //Send the proper header information along with the request
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("x-access-token", localStorage.getItem('token'));

	// //Call a function when the state changes.
	xhr.onreadystatechange = function () {
		if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
			// Request finished. Do processing here.
			var responseObject = JSON.parse(xhr.response);

			_this.name = responseObject.name;
			_this.username = responseObject.username;
			_this.password = responseObject.password;
			_this.email = responseObject.email;

			console.log('JSON' + responseObject.name);
			_this.update();
		} else if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 403) {
			console.log('Response ' + xhr.responseText);
			route('login');
		}
	};
	xhr.send();
});
});

riot.tag2('footer-tag', '<footer class="footer"> <div class="container"> <p class="text-muted">Place sticky footer content here.</p> </div> </footer>', '', '', function(opts) {
});

riot.tag2('landing', '', '', '', function(opts) {
});

riot.tag2('logout', '<h1>Log Out</h1> <input onclick="{submit}" type="submit" value="Log Out">', '', '', function(opts) {
'use strict';

var self = this;
this.submit = function () {
  console.log('Log Out clicked');
  localStorage.removeItem('token');
  // go to dashboard page after logging in
  route('login');
  riot.update();
};
});

riot.tag2('navi', '<nav class="navbar navbar-inverse"> <div class="container"> <div class="navbar-header"> <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> <a class="navbar-brand" href="#">Brand</a> </div> <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1"> <ul class="nav navbar-nav"> <li class="active"><a href="#">Home<span class="sr-only">(current)</span></a></li> <li><a href="#landing">About Us</a></li> <li><a href="#">FAQ</a></li> <li><a href="#profile">Profile</a></li> <li><a href="#setting">setting</a></li> <li><a href="#logout">Sign out</a></li> <li><a href="#signup">Registration</a></li> <div if="{opts.is_authenticated() === false}"> <form id="signin" class="navbar-form navbar-right" role="form" method="get"> <div class="input-group"> <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span> <input ref="email" id="email" class="form-control" name="email" value="" placeholder="Email Address" type="email"> </div> <div class="input-group"> <span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span> <input ref="password" id="password" type="password" class="form-control" name="password" value="" placeholder="Password"> </div> <button type="submit" class="btn btn-primary" onclick="{submit}" type="submit">Login</button> </form> </div> </ul> </div> </div> </nav>', '', '', function(opts) {
'use strict';

var _this = this;

this.submit = function (e) {
	console.log('Log In clicked');

	var url = '/api/authenticate';
	var xhr = new XMLHttpRequest();

	xhr.open('POST', url, true);
	console.log(_this.queryStringify(_this.refs.email.value, _this.refs.password.value));

	// //Send the proper header information along with the request
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	// //Call a function when the state changes.
	xhr.onreadystatechange = function () {
		if (xhr.readyState == XMLHttpRequest.DONE && xhr.status === 200) {
			// Request finished. Do processing here.
			var responseObject = JSON.parse(xhr.response);
			var JWT = responseObject.token;
			localStorage.setItem('token', JWT);
			riot.update();
			console.log('JWT ' + JWT);

			// go to dashboard page after logging in
			route('dashboard');
		} else if (xhr.readyState == XMLHttpRequest.DONE && xhr.status === 403) {
			console.log('Response ' + xhr.responseText);
		}
	};
	xhr.send(_this.queryStringify(_this.refs.email.value, _this.refs.password.value));
};

this.queryStringify = function (email, password) {
	return 'email=' + email + '&password=' + password;
};
});

riot.tag2('profile', '<h1>Profile</h1>', '', '', function(opts) {
});

riot.tag2('signup', '<link href="/static/css/signup.css" rel="stylesheet"> <div class="container"> <div class="row centered-form"> <div class="col-xs-12 col-sm-8 col-md-4 col-sm-offset-2 col-md-offset-4"> <div class="panel panel-default"> <div class="panel-heading"> <h3 class="panel-title">Please sign up for Job Hunt <small>It\'s free!</small></h3> </div> <div class="panel-body"> <form role="form" method="post"> <div class="row"> <div class="col-xs-6 col-sm-6 col-md-6"> <div class="form-group"> <input ref="firstName" type="text" name="firstName" id="first_name" class="form-control input-sm" placeholder="First Name"> </div> </div> <div class="col-xs-6 col-sm-6 col-md-6"> <div class="form-group"> <input ref="lastName" type="text" name="lastName" id="last_name" class="form-control input-sm" placeholder="Last Name"> </div> </div> </div> <div class="form-group"> <input ref="email" name="email" id="email" class="form-control input-sm" placeholder="Email Address" type="email"> </div> <div class="row"> <div class="col-xs-6 col-sm-6 col-md-6"> <div class="form-group"> <input ref="password" type="password" name="password" id="password" class="form-control input-sm" placeholder="Password"> </div> </div> <div class="col-xs-6 col-sm-6 col-md-6"> <div class="form-group"> <input type="password" name="password_confirmation" id="password_confirmation" class="form-control input-sm" placeholder="Confirm Password"> </div> </div> </div> <button type="submit" value="Register" class="btn btn-info btn-block" onclick="{submit}" type="submit">Register</button> </form> </div> </div> </div> </div> </div>', '', '', function(opts) {
'use strict';

var _this = this;

this.submit = function (e) {
	console.log('Submit clicked ' + _this.refs.firstName.value);

	var url = '/api/register';
	var xhr = new XMLHttpRequest();

	xhr.open('POST', url, true);

	// //Send the proper header information along with the request
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	// //Call a function when the state changes.
	xhr.onreadystatechange = function () {
		if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
			// Request finished. Do processing here.
			console.log('Response ' + xhr.responseText);
		} else if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 403) {
			console.log('Response ' + xhr.responseText);
		}
	};
	xhr.send(_this.queryStringify(_this.refs.firstName.value, _this.refs.lastName.value, _this.refs.password.value, _this.refs.email.value));
};

this.queryStringify = function (firstName, lastName, password, email) {
	return 'firstName=' + firstName + '&lastName=' + lastName + '&email=' + email + '&password=' + password;
};
});
