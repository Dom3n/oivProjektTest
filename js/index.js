// function uploadFile() {
//   var formData = new FormData();
//   var fileField = document.getElementById("fileInput");

//   formData.append("file", fileField.files[0]);

//   fetch("http://localhost:3000/upload", {
//     method: "POST",
//     body: formData,
//   })
//     .then((response) => response.json())
//     .then((result) => {
//       console.log("Success:", result);
//       document.getElementById("results").innerHTML =
//         result.status === "found"
//           ? "Vulnerabilities found:<br>" + result.vulnerabilities.join("<br>")
//           : result.message;
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//       document.getElementById("results").innerHTML =
//         "An error occurred while processing your file.";
//     });
// }

function uploadFile() {
  document.getElementById("codeDisplay").innerHTML = "";
  const fileInput = document.getElementById("fileInput");
  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  fetch("http://localhost:3000/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      const count = data.vulnerabilities.length;
      const vulnerabilities = data.vulnerabilities;
      const risk = data.risk;
      console.log(risk);
      //--------------------------------
      document.getElementById("results").innerHTML =
        "<div class='numVul'>Number of vulnerabilities: " +
        count +
        "</div><div>Lines with vulnerabilities: " +
        vulnerabilities +
        "</div>" +
        "<div>Risk level: <p id='risk'>" +
        risk +
        "</p></div>";
      //-------------------------------------------
      const codeDisplay = document.getElementById("codeDisplay");
      const riskDisplay = document.getElementById("risk");
      if (risk == "None") {
        riskDisplay.style.color = "black";
      }
      codeDisplay.style.padding = "1rem 0";
      const lines = data.content.split("\n");

      lines.forEach((line, index) => {
        const lineNumber = index + 1;
        const lineElement = document.createElement("p");
        lineElement.textContent = "    " + lineNumber + "   " + line;
        // lineElement.textContent = line;
        if (data.vulnerabilities.includes(index + 1)) {
          lineElement.className = "vulnerable";
        }
        codeDisplay.appendChild(lineElement);
      });
    })
    .catch((error) => console.error("Error:", error));
}
