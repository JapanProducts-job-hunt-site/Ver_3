<signup>

<link href="/static/css/signup.css" rel="stylesheet">

<div class="container">
	<div class="row centered-form">
		<div class="col-xs-12 col-sm-8 col-md-4 col-sm-offset-2 col-md-offset-4">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h3 class="panel-title">Please sign up for Job Hunt <small>It's free!</small></h3>
				</div>
				<div class="panel-body">
					<form role="form" method="post">
						<div class="row">
							<div class="col-xs-6 col-sm-6 col-md-6">
								<div class="form-group">
									<input ref="firstName" type="text" name="firstName" id="first_name" class="form-control input-sm" placeholder="First Name">
								</div>
							</div>
							<div class="col-xs-6 col-sm-6 col-md-6">
								<div class="form-group">
									<input ref="lastName" type="text" name="lastName" id="last_name" class="form-control input-sm" placeholder="Last Name">
								</div>
							</div>
						</div>

						<div class="form-group">
							<input ref="email" type="email" name="email" id="email" class="form-control input-sm" placeholder="Email Address">
						</div>

						<div class="row">
							<div class="col-xs-6 col-sm-6 col-md-6">
								<div class="form-group">
									<input ref="password" type="password"  name="password" id="password" class="form-control input-sm" placeholder="Password">
								</div>
							</div>
							<div class="col-xs-6 col-sm-6 col-md-6">
								<div class="form-group">
									<input type="password" name="password_confirmation" id="password_confirmation" class="form-control input-sm" placeholder="Confirm Password">
								</div>
							</div>
						</div>
						<button type="submit" value="Register" class="btn btn-info btn-block" onclick={ submit } type="submit">Register</button>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>


<script type='es6'>
		this.submit = (e) => {
		  console.log('Submit clicked ' + this.refs.firstName.value)

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
					} else if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 403) {
						console.log('Response ' + xhr.responseText)
					}
				}
				xhr.send(this.queryStringify(this.refs.firstName.value, 
																		 this.refs.lastName.value,
																		 this.refs.password.value, 
																		 this.refs.email.value));
			}

		this.queryStringify = (firstName, lastName, password, email) => {
		  return `firstName=${firstName}&lastName=${lastName}&email=${email}&password=${password}`
		}
</script>
</signup>
