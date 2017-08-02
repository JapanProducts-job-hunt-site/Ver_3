<LogIn>

<head>
	<!-- Custom styles for this template -->
	<link href="/static/css/signin.css" rel="stylesheet">
</head>

<form class="form-signin">
	<h2 class="form-signin-heading">Please sign in</h2>
	<label for="inputUsername" class="sr-only">Username</label>
	<input ref="username" type="text" id="inputUsername" class="form-control" placeholder="Username" required autofocus>
	<label for="inputPassword" class="sr-only">Password</label>
	<input ref="password" type="password" id="inputPassword" class="form-control" placeholder="Password" required>
	<div class="checkbox">
		<label>
			<input type="checkbox" value="remember-me"> Remember me
		</label>
	</div>
	<button class="btn btn-lg btn-primary btn-block" onclick={ submit } type="submit">Sign in</button>
</form>

<script type='es6'>
	this.submit = (e) => {
	  console.log('Log In clicked')

			const url = '/api/authenticate';
			const xhr = new XMLHttpRequest();
			// const data = FormData(formData);

			xhr.open('POST', url, true);
console.log(this.queryStringify(this.refs.username.value, this.refs.password.value))

			// //Send the proper header information along with the request
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

			// //Call a function when the state changes.
			xhr.onreadystatechange = () => {
				if(xhr.readyState == XMLHttpRequest.DONE && xhr.status === 200) {
					// Request finished. Do processing here.
					const responseObject = JSON.parse(xhr.response);
					const JWT = responseObject.token;
					localStorage.setItem('token', JWT);
					riot.update();
					console.log('JWT ' + JWT)

					// go to dashboard page after logging in
					route('dashboard')
				} else if(xhr.readyState == XMLHttpRequest.DONE && xhr.status === 403) {
					console.log('Response ' + xhr.responseText)
				}
			}
			xhr.send(this.queryStringify(this.refs.username.value, this.refs.password.value));
		}

	this.queryStringify = (username, password) => {
	  return `username=${username}&password=${password}`
	}
</script>
</LogIn>
