<setting>

<head>
	<link href="/static/css/dashboard.css" rel="stylesheet">
</head>

<div class="container-fluid">
	<div class="row">
		<div class="col-sm-3 col-md-2 sidebar">
			<ul class="nav nav-sidebar">
				<li class="active"><a href="#">Profile<span class="sr-only">(current)</span></a></li>
				<li><a href="#">Password</a></li>
				<li><a href="#">Another setting</a></li>
			</ul>
			<ul class="nav nav-sidebar">
				<li><a href="">Nav item</a></li>
				<li><a href="">Another nav item</a></li>
			</ul>
		</div>
		<div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">

			<h1 class="page-header">Setting</h1>

			<form class="form-signin">
				<h2 class="form-signin-heading">Public profile</h2>

				<label for="inputName">Name</label>
				<input ref="name" type="text" id="inputName" class="form-control" placeholder={ name }>

				<label for="inputUsername">Username</label>
				<input ref="username" type="text" id="inputUsername" class="form-control" placeholder={ username }>

				<label for="inputEmail">Email address</label>
				<input ref="email" type="email" id="inputEmail" class="form-control" placeholder={ email }>

				<label for="inputPassword">Password</label>
				<input ref="password" type="password" id="inputPassword" class="form-control">

				<button class="btn btn-lg btn-primary btn-block" onclick={ submit } type="submit">Update Changes</button>
			</form>

		</div> <!-- col-sm-9 -->
	</div> <!-- row -->
</div> <!-- container-fluid -->


<script type='es6'>

  //Ajax call for updading profile
	this.submit = (e) => {
		console.log('Submit clicked ' + this.refs.username.value)

		const url = '/api/users';
		const xhr = new XMLHttpRequest();

		xhr.open('PUT', url, true);

		// //Send the proper header information along with the request
		xhr.setRequestHeader("Content-type", "application/json");

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
    let updateJson = '{ "user": {'
    if (username) {
      updateJson+= `"username": ${username} `
    }

    updateJson+='} }'
		return `username=${username}&name=${name}&email=${email}&password=${password}`
	}

// Right after the tag is mounted
	this.on('mount', () => {
			console.log('Dashboard mounted')

			// Check if token exist
			// if not exist
			if(localStorage.getItem('token') === null) {
				route('landing')
			}

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
					route('login')
				}
			}
			xhr.send();
	})
</script>
</setting>
