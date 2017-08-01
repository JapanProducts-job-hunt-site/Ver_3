<navi>
  <div if={ opts.is_authenticated() }>
		<a href="#companies">Companies</a>
		<a href="#dashboard">Dashboard</a>
		<a href="#logout">Log Out</a>
  </div>
  <div if={ opts.is_authenticated() === false }>
		<a href="#landing">Landing</a>
		<a href="#signup">Sign Up</a>
		<a href="#login">Log In</a>
		<a href="#company">You are not student</a>
  </div>

	this.on('mount', () => {
		riot.mount('#login-tag', 'login')
    console.log(opts.is_authenticated())
	})
</navi>
