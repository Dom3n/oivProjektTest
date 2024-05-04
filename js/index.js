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
      console.log(count);
      //--------------------------------
      document.getElementById("results").innerHTML =
        "<div>Number of vulnerabilities: " +
        count +
        "</div><div>Lines with vulnerabilities: " +
        "</div>";
      //-------------------------------------------
      const codeDisplay = document.getElementById("codeDisplay");
      //   codeDisplay.style.padding = "2rem";
      const lines = data.content.split("\n");
      lines.forEach((line, index) => {
        const lineElement = document.createElement("div");
        lineElement.textContent = line;
        if (data.vulnerabilities.includes(index + 1)) {
          lineElement.className = "vulnerable";
        }
        codeDisplay.appendChild(lineElement);
      });
    })
    .catch((error) => console.error("Error:", error));
}
