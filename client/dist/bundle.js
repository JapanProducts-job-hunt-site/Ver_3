riot.tag2('app', '<h1>From App</h1> <signup></SignUp> <login></LogIn> <div if="{isAuthenticated()}"> <dashboard></Dashboard> <logout></LogOut> </div>', '', '', function(opts) {
'use strict';

isAuthenticated = function isAuthenticated() {
	return localStorage.getItem('token') !== null;
};
});

riot.tag2('dashboard', '<h1>Dashboard</h1> <h2>You are logged in</h2> <p>Name : {name}</p> <p>Username : {username}</p> <p>Password : {password}</p> <p>email : {email}</p>', '', '', function(opts) {
'use strict';

var _this = this;

// Right after the tag is mounted
this.on('mount', function () {
	console.log('Dashboard mounted');

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
		}
	};
	xhr.send();
});
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
  riot.update();
};
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
