/*
 * This js file is for sign up function
 */

console.log('Test')
$( "form#signup" ).submit(function( event ) {
  event.preventDefault();
  console.log($("form#signup input.firstname").val())
});
