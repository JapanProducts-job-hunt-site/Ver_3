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
	} else if (path === "profile") {
		riot.mount('#content-tag', 'profile');
	} else if (path === "setting") {
		riot.mount('#content-tag', 'setting');
	} else if (path === "logout") {
		riot.mount('#content-tag', 'logout');
	} else if (path === "signup") {
		riot.mount('#content-tag', 'signup');
	} else if (path === "login") {
		riot.mount('#content-tag', 'login');
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

riot.tag2('footer-tag', '<footer class="footer"> <div class="container"> <p class="text-muted">Place sticky footer content here.</p> </div> </footer>', '', '', function(opts) {
});

riot.tag2('landing', '<header class="jumbotron hero-spacer"> <h1>Job Hunt</h1> <p>Explain Job Hunt Page</p> <p><a href="#signup" class="btn btn-primary btn-large">Sign Up Now!</a></p> </header> <hr> <div class="row"> <div class="col-lg-12"> <h3>Latest Features</h3> </div> </div> <div class="row text-center"> <div class="col-md-3 col-sm-6 hero-feature"> <div class="thumbnail"> <img src="http://placehold.it/800x500" alt=""> <div class="caption"> <h3>Feature Label</h3> <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p> <p> <a href="#" class="btn btn-primary">Buy Now!</a> <a href="#" class="btn btn-default">More Info</a> </p> </div> </div> </div> <div class="col-md-3 col-sm-6 hero-feature"> <div class="thumbnail"> <img src="http://placehold.it/800x500" alt=""> <div class="caption"> <h3>Feature Label</h3> <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p> <p> <a href="#" class="btn btn-primary">Buy Now!</a> <a href="#" class="btn btn-default">More Info</a> </p> </div> </div> </div> <hr class="featurette-divider"> <div class="row featurette"> <div class="col-md-7"> <h2 class="featurette-heading">First featurette heading. <span class="text-muted">It\'ll blow your mind.</span></h2> <p class="lead">Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur. Fusce dapibus, tellus ac cursus commodo.</p> </div> <div class="col-md-5"> <img class="featurette-image img-responsive center-block" src="http://placehold.it/500x500" alt="Generic placeholder image"> </div> </div> <hr class="featurette-divider"> <div class="row featurette"> <div class="col-md-7 col-md-push-5"> <h2 class="featurette-heading">Oh yeah, it\'s that good. <span class="text-muted">See for yourself.</span></h2> <p class="lead">Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur. Fusce dapibus, tellus ac cursus commodo.</p> </div> <div class="col-md-5 col-md-pull-7"> <img class="featurette-image img-responsive center-block" data-src="holder.js/500x500/auto" alt="Generic placeholder image"> </div> </div> <hr class="featurette-divider"> <div class="row featurette"> <div class="col-md-7"> <h2 class="featurette-heading">And lastly, this one. <span class="text-muted">Checkmate.</span></h2> <p class="lead">Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur. Fusce dapibus, tellus ac cursus commodo.</p> </div> <div class="col-md-5"> <img class="featurette-image img-responsive center-block" data-src="holder.js/500x500/auto" alt="Generic placeholder image"> </div> </div> <hr class="featurette-divider"> </div> <hr>', '', '', function(opts) {
});

riot.tag2('login', '<head> <link href="/static/css/signin.css" rel="stylesheet"> </head> <form class="form-signin"> <h2 class="form-signin-heading">Please sign in</h2> <label for="inputUsername" class="sr-only">Username</label> <input ref="username" type="text" id="inputUsername" class="form-control" placeholder="Username" required autofocus> <label for="inputPassword" class="sr-only">Password</label> <input ref="password" type="password" id="inputPassword" class="form-control" placeholder="Password" required> <div class="checkbox"> <label> <input type="checkbox" value="remember-me"> Remember me </label> </div> <button class="btn btn-lg btn-primary btn-block" onclick="{submit}" type="submit">Sign in</button> </form>', '', '', function(opts) {
'use strict';

var _this = this;

this.submit = function (e) {
	console.log('Log In clicked');

	var url = '/api/authenticate';
	var xhr = new XMLHttpRequest();
	// const data = FormData(formData);

	xhr.open('POST', url, true);
	console.log(_this.queryStringify(_this.refs.username.value, _this.refs.password.value));

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
	xhr.send(_this.queryStringify(_this.refs.username.value, _this.refs.password.value));
};

this.queryStringify = function (username, password) {
	return 'username=' + username + '&password=' + password;
};
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

riot.tag2('navi', '<nav class="navbar navbar-inverse navbar-fixed-top" role="navigation"> <div class="container"> <div class="navbar-header"> <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> <a class="navbar-brand" href="#">Job Hunt Japan</a> </div> <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1"> <ul if="{opts.is_authenticated()}" class="nav navbar-nav"> <li> <a href="#companies">Companies</a> </li> <li> <a href="#profile">Profile</a> </li> <li> <a href="#setting">Setting</a> </li> <li> <a href="#logout">Log Out</a> </li> </ul> <ul if="{opts.is_authenticated() === false}" class="nav navbar-nav"> <li> <a href="#landing">Landing</a> </li> <li> <a href="#signup">Sign Up</a> </li> <li> <a href="#login">Log In</a> </li> <li> <a href="#company">Hiring?</a> </li> </ul> </div> </div> </nav>', '', '', function(opts) {
'use strict';

this.on('mount', function () {
	riot.mount('#login-tag', 'login');
});
});

riot.tag2('profile', '<h1>Profile</h1> <p>{name}</p> <p>{username}</p> <p>{password}</p> <p>{email}</p>', '', '', function(opts) {
'use strict';

var _this = this;

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

riot.tag2('setting', '<head> <link href="/static/css/dashboard.css" rel="stylesheet"> </head> <div class="container-fluid"> <div class="row"> <div class="col-sm-3 col-md-2 sidebar"> <ul class="nav nav-sidebar"> <li class="active"><a href="#">Profile<span class="sr-only">(current)</span></a></li> <li><a href="#">Password</a></li> <li><a href="#">Another setting</a></li> </ul> <ul class="nav nav-sidebar"> <li><a href="">Nav item</a></li> <li><a href="">Another nav item</a></li> </ul> </div> <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main"> <h1 class="page-header">Setting</h1> <form class="form-signin"> <h2 class="form-signin-heading">Public profile</h2> <label for="inputName">Name</label> <input ref="name" type="text" id="inputName" class="form-control" placeholder="{name}"> <label for="inputUsername">Username</label> <input ref="username" type="text" id="inputUsername" class="form-control" placeholder="{username}"> <label for="inputEmail">Email address</label> <input ref="email" id="inputEmail" class="form-control" placeholder="{email}" type="email"> <label for="inputPassword">Password</label> <input ref="password" type="password" id="inputPassword" class="form-control"> <button class="btn btn-lg btn-primary btn-block" onclick="{submit}" type="submit">Update Changes</button> </form> </div> </div> </div>', '', '', function(opts) {
'use strict';

var _this = this;

//Ajax call for updading profile
this.submit = function (e) {
	console.log('Submit clicked ' + _this.refs.username.value);

	// this.jsonData("Update username", "Update name","Update password","Update email")
	// this.jsonData("", "Update name","Update password","Update email")
	// this.jsonData("", "Update name","","Update email")
	// this.jsonData(null, "Update name","Update password","Update email")
	// this.jsonData(null, "Update name", null,"Update email")

	var url = '/api/users';
	var xhr = new XMLHttpRequest();

	xhr.open('PUT', url, true);

	// //Send the proper header information along with the request
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.setRequestHeader("x-access-token", localStorage.getItem('token'));

	// //Call a function when the state changes.
	xhr.onreadystatechange = function () {
		if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
			// Request finished. Do processing here.
			console.log('Response ' + xhr.responseText);
			_this.update();
		} else if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 403) {
			console.log('Response ' + xhr.responseText);
		}
	};
	xhr.send(_this.jsonData(_this.refs.username.value, _this.refs.name.value, _this.refs.password.value, _this.refs.email.value));
};

this.jsonData = function (username, name, password, email) {
	var arr = [];
	var updateJson = '{ "user": {';
	if (username) {
		arr.push('"username": "' + username + '"');
	}
	if (name) {
		arr.push('"name": "' + name + '"');
	}
	if (password) {
		arr.push('"password": "' + password + '"');
	}
	if (email) {
		arr.push('"email": "' + email + '"');
	}

	updateJson += arr.join();
	updateJson += '} }';
	console.log("updateJson" + updateJson);
	return updateJson;
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

riot.tag2('signup', '<head> <link href="/static/css/signin.css" rel="stylesheet"> </head> <form class="form-signin"> <h2 class="form-signin-heading">Please sign up</h2> <label for="inputName" class="sr-only">Name</label> <input ref="name" type="text" id="inputName" class="form-control" placeholder="Name" required autofocus> <label for="inputUsername" class="sr-only">Username</label> <input ref="username" type="text" id="inputUsername" class="form-control" placeholder="Username" required> <label for="inputEmail" class="sr-only">Email address</label> <input ref="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus type="email"> <label for="inputPassword" class="sr-only">Password</label> <input ref="password" type="password" id="inputPassword" class="form-control" placeholder="Password" required> <div class="checkbox"> <label> <input type="checkbox" value="remember-me"> Remember me </label> </div> <button class="btn btn-lg btn-primary btn-block" onclick="{submit}" type="submit">Sign up</button> </form>', '', '', function(opts) {
'use strict';

var _this = this;

this.submit = function (e) {
	console.log('Submit clicked ' + _this.refs.username.value);

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
			route('login');
		} else if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 403) {
			console.log('Response ' + xhr.responseText);
		}
	};
	xhr.send(_this.queryStringify(_this.refs.username.value, _this.refs.name.value, _this.refs.password.value, _this.refs.email.value));
};

this.queryStringify = function (username, name, password, email) {
	return 'username=' + username + '&name=' + name + '&email=' + email + '&password=' + password;
};
});
