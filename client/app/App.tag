<app>
  <h1>From App</h1>

	<div id="nav-tag"></div>

	<div id="content-tag"></div>

	<script type='es6'>
    this.on('mount', () => {
			riot.mount('#nav-tag', 'navi')
			route.start(true)
    })

		route((path) => {
			if(path === "signup"){
				riot.mount('#content-tag', 'signup')
			} else if (path === "company"){
				riot.mount('#content-tag', 'company')
			} else {
				riot.mount('#content-tag', 'signup')
			}
		})
	</script>
</app>
