<LogOut>
  <h1>Log Out</h1>

	<input onclick={ submit } type="submit" value="Log Out">
  
  <script type='es6'>
    const self = this;
    this.submit = () => {
      console.log('Log Out clicked')
      localStorage.removeItem('token');
      riot.update();
    }
  </script>
</LogOut>
