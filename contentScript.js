const apiKey = "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";
const apiUrl = "https://api.openai.com/v1/completions";
var elems = document.getElementsByClassName("content [&>p:last-child]:mb-0");
let content = "";

for (let i = 0; i < elems[0].children.length; i++) {
  content = content + elems[0].children.item(i).firstChild.textContent + "\n";
}

const parent_div = document.getElementsByClassName("card mb-6 p-5 lg:p-8")
  ? document.getElementsByClassName("card mb-6 p-5 lg:p-8")
  : "";

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (msg) {
    if (port.name === "uiOps") {
      if (msg.content) {
        const data = {
          prompt: msg.content + "\n" + content,
          max_tokens: 1000,
          model: "text-davinci-003",
          temperature: 0.5,
        };

        try {
          fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + apiKey,
            },
            body: JSON.stringify(data),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(data.choices[0].text);
              port.postMessage({
                status: "done",
              });
            })
            .catch((error) =>
              port.postMessage({
                status: error,
              })
            );
        } catch (error) {
          port.postMessage({
            status: error,
          });
        }
      } else {
        port.postMessage({
          status: "Something went wrong.",
        });
      }
    }
  });
});
