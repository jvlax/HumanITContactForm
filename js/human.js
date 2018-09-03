function getWinners() {
  $.ajax({
    url: "/winner",
    cache: false,
    dataType: "text",
    success: function(result) {
      console.log(result);
      for (var i = 0; i < result.length; i++) {
        console.log(result.email);
      }
    }
  });
}
