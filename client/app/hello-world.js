riot.tag2('hello-world', '<h3>{opts.title}</h3> <input ref="helloInput" placeholder="Enter your name"> <button class="myButton" onclick="{sayHello}">Say Hello</button> <h4>{message}</h4>', 'hello-world .myButton,[data-is="hello-world"] .myButton{ background-color:#44c767; -moz-border-radius:18px; -webkit-border-radius:18px; border-radius:18px; border:1px solid #18ab29; display:inline-block; cursor:pointer; color:#ffffff; font-family:Arial; font-size:17px; padding:6px 21px; text-decoration:none; text-shadow:0px 1px 0px #2f6627; } hello-world .myButton:hover,[data-is="hello-world"] .myButton:hover{ background-color:#5cbf2a; } hello-world .myButton:active:enabled,[data-is="hello-world"] .myButton:active:enabled{ position:relative; top:1px; cursor: pointer; }', '', function(opts) {
'use strict';

var _this = this;

this.message = '';

this.sayHello = function (e) {
	var value = _this.refs.helloInput.value;
	if (value) {
		_this.message = 'Hello ' + value + '!';
	} else {
		_this.message = '';
	}
};
});
