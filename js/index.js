function uploadFile() {
  var formData = new FormData();
  var fileField = document.getElementById("fileInput");

  formData.append("file", fileField.files[0]);

  fetch("http://localhost:3000/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Success:", result);
      document.getElementById("results").innerHTML =
        result.status === "found"
          ? "Vulnerabilities found:<br>" + result.vulnerabilities.join("<br>")
          : result.message;
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("results").innerHTML =
        "An error occurred while processing your file.";
    });
}
