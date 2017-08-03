<navi>
<nav class="navbar navbar-inverse">
	<div class="container">
		<div class="navbar-header">
			<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
				<span class="sr-only">Toggle navigation</span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</button>
			<a class="navbar-brand" href="#">Brand</a>
		</div>

		<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
			<ul class="nav navbar-nav">
				<li class="active"><a href="#">Home<span class="sr-only">(current)</span></a></li>
				<li><a href="#landing">About Us</a></li>
				<li><a href="#">FAQ</a></li>

				<li><a href="#profile">Profile</a></li>
				<li><a href="#setting">setting</a></li>
				<li><a href="#logout">Sign out</a></li>

				<li><a href="#signup">Registration</a></li>

				<div if= { opts.is_authenticated() === false }>
					<form id="signin" class="navbar-form navbar-right" role="form" method="get">
						<div class="input-group">
							<span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
							<input ref="email" id="email" type="email" class="form-control" name="email" value="" placeholder="Email Address">
						</div>
						<div class="input-group">
							<span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>
							<input ref="password" id="password" type="password" class="form-control" name="password" value="" placeholder="Password">
						</div>
						<button type="submit" class="btn btn-primary" onclick={ submit } type="submit">Login</button>
					</form>
				</div>
			</ul>
		</div>
	</div>
</nav>

		<script type='es6'>
				this.submit = (e) => {
					console.log('Log In clicked')

					const url = '/api/authenticate';
					const xhr = new XMLHttpRequest();

					xhr.open('POST', url, true);
					console.log(this.queryStringify(this.refs.email.value, this.refs.password.value))

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
					xhr.send(this.queryStringify(this.refs.email.value, this.refs.password.value));
				}

			this.queryStringify = (email, password) => {
				return `email=${email}&password=${password}`
			}
		</script>
</navi>
