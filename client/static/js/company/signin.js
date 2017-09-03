/*
 * This js file is for sign in function for companies
 */

$( "form#signin" ).submit(function( event ) {
  event.preventDefault();

  var email = $("form#signin input.email").val();
  var password = $("form#signin input.password").val();

  var method = "POST";
  var url = "api/company/authenticate";
  var contentType = "application/x-www-form-urlencoded";
  // To enable object formatter for query string
  var processData = true;
  // This will be transformed into query string
  var data = {
    email: email,
    password: password,
  };
  var dataType = "json";

  // Only for testing
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
  /*
   * Excecuted when success
   */
  .done(function (data) {
    console.log(data.token);
    // Store the token in localStorage
    localStorage.setItem('token', data.token);
  })
  /*
   * Excecuted when unsuccessful
   */
  .fail(function (jqXHR) {
    console.log(jqXHR.responseJSON);
  })
});
