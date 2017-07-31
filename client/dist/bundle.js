riot.tag2('app', '<h1>From App</h1> <a href="#">Home</a> <a href="#tag1">Tag1</a> <div id="content"></div>', '', '', function(opts) {
'use strict';

route(function (path) {
	if (path === 'tag1') {
		console.log('Tag1 mount');
		riot.mount('#content', 'TestTag');
	}
});
route.start(true);
});

riot.tag2('testtag', '<h1>From TestTag<h2>', '', '', function(opts) {
});
