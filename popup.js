const submitButton = document.getElementById("submit");
let query_cotent = "";

submitButton.onclick = async function (e) {
  // Query tab
  let queryOptions = { active: true, currentWindow: true };
  let tabs = await chrome.tabs.query(queryOptions);

  // Open up connection
  const port = chrome.tabs.connect(tabs[0].id, {
    name: "uiOps",
  });

  // Get input value
  query_cotent = document.getElementById("query").value;

  if (query_cotent == "") {
    alert("Please fill the Query filed.");
    return;
  } else {
    this.innerHTML = "Loading";
    this.setAttribute("disabled", true);
    port.postMessage({
      content: query_cotent,
    });
  }

  port.onMessage.addListener(function (msg) {
    if (msg.status == "done") {
      console.log(this);
      document.getElementById("submit").innerHTML = "Submit";
      document.getElementById("submit").setAttribute("disabled", undefined);
      document.getElementById("query").value = "";
    } else {
      alert(msg.status);
    }
  });
};
