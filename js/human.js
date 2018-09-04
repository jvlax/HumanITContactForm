function getWinners() {
  $.ajax({
    url: "/winners",
    cache: false,
    dataType: "text",
    success: function(result) {
      document.getElementById("winnerWrap").innerHTML = result;
    }
  });
}
