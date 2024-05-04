const express = require("express");
const multer = require("multer");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());

// Setup multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Regex to detect SQL injections
const riskyPatterns =
  /(\$[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*['\"]?(SELECT|INSERT INTO|UPDATE|DELETE FROM)\s+.*\$\w+.*['\"]\s*;)|\/\/.*\$.*=\s*['\"].*(SELECT|INSERT INTO|UPDATE|DELETE FROM)\s+.*['\"]\s*\.\s*\$.*['\"].*\s*;|(\$[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*mysqli_query\(\$conn,\s*['\"].*(SELECT|INSERT INTO|UPDATE|DELETE FROM)\s+.*\$\w+.*['\"]\);)/gi;

// Route to upload files
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const content = req.file.buffer.toString("utf-8");
  const lines = content.split("\n");
  let vulnerabilities = [];

  lines.forEach((line, index) => {
    if (riskyPatterns.test(line)) {
      vulnerabilities.push(`Line ${index + 1}: ${line.trim()}`);
    }
  });

  if (vulnerabilities.length > 0) {
    res.json({ status: "found", vulnerabilities: vulnerabilities });
  } else {
    res.json({
      status: "clean",
      message: "No obvious SQL injection risks found.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
