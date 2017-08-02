<signup>

	<head>
		<!-- Custom styles for this template -->
		<link href="/static/css/signin.css" rel="stylesheet">
	</head>

	<form class="form-signin">
		<h2 class="form-signin-heading">Please sign up</h2>

		<label for="inputName" class="sr-only">Name</label>
		<input ref="name" type="text" id="inputName" class="form-control" placeholder="Name" required autofocus>

		<label for="inputUsername" class="sr-only">Username</label>
		<input ref="username" type="text" id="inputUsername" class="form-control" placeholder="Username" required>

    <div class="form-group">
			<label for="inputEmail"  class="sr-only">Email address</label>
			<input ref="email" onkeyup={ validateEmail } type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus>
    <div>

		<label for="inputPassword" class="sr-only">Password</label>
		<input ref="password" type="password" id="inputPassword" class="form-control" placeholder="Password" required>

		<label for="inputPassword" class="sr-only">Password</label>
		<input ref="password2" type="password" id="inputPassword2" class="form-control" placeholder="Confirm password" required>

		<div class="checkbox">
			<label>
				<input type="checkbox" value="remember-me"> Remember me
			</label>
		</div>
		<button class="btn btn-lg btn-primary btn-block" onclick={ submit } type="submit">Sign up</button>
	</form>

	<script type='es6'>
    this.validateEmail = (e) => {
      console.log('Key up ' + validator.isEmail(this.refs.email.value))
		}

		this.submit = (e) => {
		  console.log('Submit clicked ' + this.refs.username.value)

			const url = '/api/register';
			const xhr = new XMLHttpRequest();

			xhr.open('POST', url, true);

			// //Send the proper header information along with the request
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

			// //Call a function when the state changes.
			xhr.onreadystatechange = () => {
				if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
					// Request finished. Do processing here.
					console.log('Response ' + xhr.responseText)
											route('login')
				} else if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 403) {
					console.log('Response ' + xhr.responseText)
				}
			}
			xhr.send(this.queryStringify(this.refs.username.value, this.refs.name.value, this.refs.password.value, this.refs.email.value));
		}

		this.queryStringify = (username, name, password, email) => {
		  return `username=${username}&name=${name}&email=${email}&password=${password}`
		}
	</script>

</signup>
