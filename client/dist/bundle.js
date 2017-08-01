riot.tag2('app', '<div id="nav-tag"></div> <div id="content-tag"></div>', '', '', function(opts) {
'use strict';

var _this = this;

this.is_authenticated = function () {
	return localStorage.getItem('token') !== null;
};

this.on('mount', function () {
	riot.mount('#nav-tag', 'navi', { is_authenticated: _this.is_authenticated });
	route.start(true);
});

route(function (path) {
	if (path === "landing") {
		riot.mount('#content-tag', 'landing');
	} else if (path === "companies") {
		riot.mount('#content-tag', 'companies');
	} else if (path === "dashboard") {
		riot.mount('#content-tag', 'dashboard');
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

riot.tag2('dashboard', '<h1>Dashboard</h1> <h2>You are logged in</h2> <p>Name : {name}</p> <p>Username : {username}</p> <p>Password : {password}</p> <p>email : {email}</p>', '', '', function(opts) {
'use strict';

var _this = this;

// Right after the tag is mounted
this.on('mount', function () {
  console.log('Dashboard mounted');

  // Check if token exist
  // if not exist
  if (localStorage.getItem('token') === null) {
    route('login');
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

riot.tag2('landing', '<h1>Landing</h1>', '', '', function(opts) {
});

riot.tag2('login', '<h1>Log In</h1> <input ref="username" placeholder="Enter your username"> <input ref="password" placeholder="Enter your password"> <input onclick="{submit}" type="submit" value="Log In">', '', '', function(opts) {
'use strict';

var _this = this;

this.submit = function (e) {
	console.log('Log In clicked');

	var url = '/api/authenticate';
	var xhr = new XMLHttpRequest();
	// const data = FormData(formData);

	xhr.open('POST', url, true);

	// //Send the proper header information along with the request
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	// //Call a function when the state changes.
	xhr.onreadystatechange = function () {
		if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
			// Request finished. Do processing here.
			var responseObject = JSON.parse(xhr.response);
			var JWT = responseObject.token;
			localStorage.setItem('token', JWT);
			riot.update();
			console.log('JWT ' + JWT);

			// go to dashboard page after logging in
			route('dashboard');
		} else if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 403) {
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
  // riot.update();
};
});

riot.tag2('navi', '<div if="{opts.is_authenticated()}"> <a href="#companies">Companies</a> <a href="#dashboard">Dashboard</a> <a href="#logout">Log Out</a> </div> <div if="{opts.is_authenticated() === false}"> <a href="#landing">Landing</a> <a href="#signup">Sign Up</a> <a href="#login">Log In</a> <a href="#company">You are not student</a> </div>', '', '', function(opts) {
'use strict';

this.on('mount', function () {
	riot.mount('#login-tag', 'login');
	console.log(opts.is_authenticated());
});
});

riot.tag2('profile', '<h1>Profile</h1>', '', '', function(opts) {
});

riot.tag2('signup', '<h1>Sign Up</h1> <input ref="username" placeholder="Enter your username"> <input ref="name" placeholder="Enter your name"> <input ref="password" placeholder="Enter your password"> <input ref="email" placeholder="Enter your email"> <input onclick="{submit}" type="submit" value="Submit">', '', '', function(opts) {
'use strict';

var _this = this;

this.submit = function (e) {
		console.log('Submit clicked ' + _this.refs.username.value);

		var url = '/api/register';
		var xhr = new XMLHttpRequest();
		// const data = FormData(formData);

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
		xhr.send(_this.queryStringify(_this.refs.username.value, _this.refs.name.value, _this.refs.password.value, _this.refs.email.value));
};

this.queryStringify = function (username, name, password, email) {
		return 'username=' + username + '&name=' + name + '&email=' + email + '&password=' + password;
};
});
