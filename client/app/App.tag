<App>
  <h1>From App</h1>

	<SignUp></SignUp>
	<LogIn></LogIn>
  <div if={ isAuthenticated() }>
		<Dashboard></Dashboard>
		<LogOut></LogOut>
  </div>
  
  <script type='es6'>
		isAuthenticated = () => {
			return localStorage.getItem('token') !== null;
		}
  </script>
</App>
