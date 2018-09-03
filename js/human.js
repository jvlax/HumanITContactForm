function getWinners() {
  $.ajax({
    url: "/winners",
    cache: false,
    dataType: "text",
    success: function(result) {
      for (var i = 0; i < result.length; i++) {
        console.log(result[i].email);
        document.getElementById("winnerWrap").innerHTML +=
          '<div class="winners text-center">' +
          result[i].name + " " + result[i].company + '</div>';
      }
    }
  });
}
