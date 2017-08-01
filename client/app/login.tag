<LogIn>
  <h1>Log In</h1>

	<input ref="username"  placeholder="Enter your username">
	<input ref="password"  placeholder="Enter your password">
	<input onclick={ submit } type="submit" value="Log In">

  <script type='es6'>
    this.submit = (e) => {
      console.log('Log In clicked')

			const url = '/api/authenticate';
			const xhr = new XMLHttpRequest();
			// const data = FormData(formData);

			xhr.open('POST', url, true);

			// //Send the proper header information along with the request
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

			// //Call a function when the state changes.
			xhr.onreadystatechange = () => {
				if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
					// Request finished. Do processing here.
          const responseObject = JSON.parse(xhr.response);
          const JWT = responseObject.token;
          localStorage.setItem('token', JWT);
          riot.update();
					console.log('JWT ' + JWT)

          // go to dashboard page after logging in
          route('dashboard')
				} else if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 403) {
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
