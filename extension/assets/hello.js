$(function () {
  $("#submit").click(function (e) {
    e.preventDefault()
    var name = $("#name").val();
    console.log(name);
  });
});
