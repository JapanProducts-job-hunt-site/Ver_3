<SignUp>
	<h1>Sign Up</h1>

	<input ref="username" placeholder="Enter your username">
	<input ref="name" placeholder="Enter your name">
	<input ref="password" placeholder="Enter your password">
	<input ref="email" placeholder="Enter your email">
	<button onclick='{submit}'>Sign Up</button>

	<script type='es6'>
		this.submit = () => {
			console.log('Clicked submit' + this.refs.username.value)

			const url = '/test'
			const xhr = new XMLHttpRequest();

			xhr.open("GET", '/test', true);

			//Send the proper header information along with the request
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

			xhr.onreadystatechange = function() {//Call a function when the state changes.
				if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
					// Request finished. Do processing here.
          console.log('Response ' + xhr.responseText)
				}
			}
      xhr.send();
		}
	</script>
</SignUp>
