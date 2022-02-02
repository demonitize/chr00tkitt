
function getQueryVariable(variable) {
  try {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return false;
  } catch (err) {
    console.warn(err);
  }
}

if (typeof getQueryVariable("success") == "string") {
  if (getQueryVariable("success") == "false"){
    $("#token-text").text(
        "Failed to verify. Please try again. You can now close this window."
      );
          $("#token-modal").modal();
  } else {
          $("#token-text").text(
        "Thank you for Verifying! You can now close this window"
      );
          $("#token-modal").modal();

  }
}
