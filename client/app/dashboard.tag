<Dashboard>
  <h1>Dashboard</h1>
  <h2>You are logged in</h2>

  <p>Name : { name }</p>
  <p>Username : { username }</p>
  <p>Password : { password }</p>
  <p>email : { email }</p>

  <script type='es6'>
    // Right after the tag is mounted
    this.on('mount', () => {
      console.log('Dashboard mounted')
       
			const url = '/api/user';
			const xhr = new XMLHttpRequest();

			xhr.open('GET', url, true);
			// //Send the proper header information along with the request
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhr.setRequestHeader("x-access-token", localStorage.getItem('token'));

			// //Call a function when the state changes.
			xhr.onreadystatechange = () => {
				if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
					// Request finished. Do processing here.
          const responseObject = JSON.parse(xhr.response);
          
          this.name = responseObject.name;
					this.username = responseObject.username;
          this.password = responseObject.password;
          this.email = responseObject.email;

					console.log('JSON' + responseObject.name)
          this.update();
				} else if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 403) {
					console.log('Response ' + xhr.responseText)
				}
			}
			xhr.send();
    })
  </script>
</Dashboard>
