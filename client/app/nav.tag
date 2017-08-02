<navi>
<!-- Navigation -->
    <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div class="container">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#">Job Hunt Japan</a>
            </div>
            <!-- Collect the nav links, forms, and other content for toggling -->
			<div  class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
				<ul if={ opts.is_authenticated() } class="nav navbar-nav">
					<li>
						<a href="#companies">Companies</a>
					</li>
					<li>
						<a href="#profile">Profile</a>
					</li>
					<li>
						<a href="#setting">Setting</a>
					</li>
					<li>
						<a href="#logout">Log Out</a>
					</li>
				</ul>
				<ul if={ opts.is_authenticated() === false } class="nav navbar-nav">
					<li>
						<a href="#landing">Landing</a>
					</li>
					<li>
						<a href="#signup">Sign Up</a>
					</li>
					<li>
						<a href="#login">Log In</a>
					</li>
					<li>
						<a href="#company">Hiring?</a>
					</li>
				</ul>
			</div>
            <!-- /.navbar-collapse -->
        </div>
        <!-- /.container -->
    </nav>

	this.on('mount', () => {
		riot.mount('#login-tag', 'login')
	})
</navi>
