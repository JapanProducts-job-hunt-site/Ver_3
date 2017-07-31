<App>
	<h1>From App</h1>

	<a href="#">Home</a>
	<a href="#tag1">Tag1</a>
	<div id="content"></div>

	<script type='es6'>

		route((path) => {
			if(path === 'tag1'){
				console.log('Tag1 mount')
				riot.mount('#content', 'TestTag')
			}
		})
		route.start(true)
	</script>
</App>
