<signup>
	<h1>Sign Up</h1>
  
		<input ref="username"  placeholder="Enter your username">
		<input ref="name"  placeholder="Enter your name">
		<input ref="password"  placeholder="Enter your password">
		<input ref="email"  placeholder="Enter your email">
		<input onclick={ submit } type="submit" value="Submit">

	<script type='es6'>
		this.submit = (e) => {
      console.log('Submit clicked ' + this.refs.username.value)

			const url = '/api/register';
			const xhr = new XMLHttpRequest();
			// const data = FormData(formData);

			xhr.open('POST', url, true);

			// //Send the proper header information along with the request
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

			// //Call a function when the state changes.
			xhr.onreadystatechange = () => {
				if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
					// Request finished. Do processing here.
						console.log('Response ' + xhr.responseText)
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
