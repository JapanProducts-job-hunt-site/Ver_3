<app>
	<div id="nav-tag"></div>

	<!-- Page Content -->
	<div class="container">
		<div id="content-tag"></div>
		<div id="footer-tag"></div>
	</div>
	<!-- /.container -->

<script type='es6'>
	this.is_authenticated = () => {
		return localStorage.getItem('token') !== null;
	}

	this.on('mount', () => {
		riot.mount('#nav-tag', 'navi', {is_authenticated: this.is_authenticated})
		riot.mount('#footer-tag', 'footer-tag')
		route.start(true)
	})

	route((path) => {
		if(path === "landing"){
			riot.mount('#content-tag', 'landing')
		} else if (path === "companies"){
			riot.mount('#content-tag', 'companies')
		} else if (path === "dashboard"){
			riot.mount('#content-tag', 'dashboard')
		} else if (path === "logout"){
			riot.mount('#content-tag', 'logout')
		} else if (path === "signup"){
			riot.mount('#content-tag', 'signup')
		} else if (path === "company"){
			riot.mount('#content-tag', 'company')
		} else {
			riot.mount('#content-tag', 'landing')
		}
	})
</script>
</app>
