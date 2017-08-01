<app>
	<div id="nav-tag"></div>

	<div id="content-tag"></div>

	<script type='es6'>
    this.is_authenticated = () => {
			return localStorage.getItem('token') !== null;
		}

    this.on('mount', () => {
			riot.mount('#nav-tag', 'navi', {is_authenticated: this.is_authenticated})
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
			} else if (path === "login"){
				riot.mount('#content-tag', 'login')
			} else if (path === "company"){
				riot.mount('#content-tag', 'company')
			} else {
				riot.mount('#content-tag', 'landing')
			}
		})
	</script>
</app>
