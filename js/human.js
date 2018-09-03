function getWinners() {
  $.ajax({
    url: "/winners",
    cache: false,
    dataType: "text",
    success: function(result) {
      for (var i = 0; i < result.length; i++) {
        document.getElementById("winnerWrap").innerHTML = result;
      }
    }
  });
}
