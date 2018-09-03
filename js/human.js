function getWinners() {
  $.ajax({
    url: "/winners",
    cache: false,
    dataType: "text",
    success: function(result) {
      console.log(result);
      for (var i = 0; i < result.length; i++) {
        console.log(result[i].email);
      }
    }
  });
}
