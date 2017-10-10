/*
 * This js file is for profile function
 */
$( "form#update-form" ).submit(function( event ) {
  event.preventDefault();
  console.log("Update button fired");

  var method = "PUT";
  var url = "api/users";
  var token = localStorage.getItem("token");
  var contentType = "application/json";
  // To enable object formatter for query string
  var processData = true;
  // This will be transformed into query string
  var DATA = {
    user: {
      firstName: "TEST",
    }
  };
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
    data: JSON.stringify(DATA),
  })
  /*
   * Excecuted when success
   */
    .done(function (data) {
      console.log(data);
    })
  /*
   * Excecuted when success
   */
    .fail(function (jqXHR) {
      console.log(jqXHR.responseJSON);
    });
});
