/*
 * This js file is for sign up function
 */

$( "form#signup" ).submit(function( event ) {
  event.preventDefault();

  var name = $("form#signup input.companyname").val();
  var email = $("form#signup input.email").val();
  var password = $("form#signup input.password").val();
  var password_confirm = $("form#signup input.password_confirm").val();

  if (password != password_confirm) {
      $('.password_validation').fadeIn()
      return false
  } else {
      $('.password_validation').fadeOut()
  }

  var method = "POST";
  var url = "api/company/register";
  var contentType = "application/x-www-form-urlencoded";
  // To enable object formatter for query string
  var processData = true;
  // This will be transformed into query string
  var data = {
    name: name,
    email: email,
    password: password,
  };
  var dataType = "json";

  // Only for testing
  console.log("Name: " + name);
  console.log("Email: " + email);
  console.log("Password: " + password);

  $.ajax({
    method: method,
    url: url,
    contentType: contentType,
    processData: processData,
    data: data,
    dataType: dataType,
  })
  .done(function (data) {
    console.log(data);
  })
  .fail(function (jqXHR) {
    // Invoke error pop-up
    $('.signup-container .error-bg').fadeIn(500)
    $('.error-bg .retry').click(function() {
      $('.signup-container .error-bg').fadeOut(500)
    })

    console.log(jqXHR.responseJSON);
  })
});
