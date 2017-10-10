/*
 * This js file is for profile function
 */
$(document).ready(function() {
  console.log("Profile page ready. Start loading data from API");
  console.log("TOKEN " + localStorage.getItem('token'));
  var token = localStorage.getItem('token');
  var method = "GET";
  var url = "/api/user";
  var headers = {
    "x-access-token": token,
  };
  var contentType = "application/x-www-form-urlencoded";
  // To enable object formatter for query string
  var processData = true;
  // This will be transformed into query string
  var dataType = "json";
  $.ajax({
    method: method,
    url: url,
    contentType: contentType,
    beforeSend: function (xhr) {
      xhr.setRequestHeader("x-access-token", token);
    },
    processData: processData,
    dataType: dataType,
  })
  /*
   * Excecuted when success
   */
    .done(function (data) {
      console.log(data);

      $('.profile .profile-info .name').html(`${data.firstName} ${data.lastName}`)
      $('.profile .contact-info .email').html(data.email)
      // Store the token in localStorage
  })
  /*
   * Excecuted when unsuccessful
   */
  .fail(function (jqXHR) {
    console.log(jqXHR.responseJSON);
  });
});

