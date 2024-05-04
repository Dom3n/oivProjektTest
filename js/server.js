const express = require("express");
const multer = require("multer");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all incoming requests

// Setup multer for file handling with in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Array of regex patterns to detect SQL injections
const riskyPatterns = [
  /(\$[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*['\"]?(SELECT|INSERT INTO|UPDATE|DELETE FROM)\s+.*\$\w+.*['\"]\s*;)|\/\/.*\$.*=\s*['\"].*(SELECT|INSERT INTO|UPDATE|DELETE FROM)\s+.*['\"]\s*\.\s*\$.*['\"].*\s*;|(\$[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*mysqli_query\(\$conn,\s*['\"].*(SELECT|INSERT INTO|UPDATE|DELETE FROM)\s+.*\$\w+.*['\"]\);)/gi,
  /(\$[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*["']?(SELECT|INSERT INTO|UPDATE|DELETE FROM)\s+.*['"]\s*\.\s*\$.*['"];)/gi,
  /(\$[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*["'].+\s+(OR|AND)\s+.+['"]\s*\.\s*\$.*['"];)/gi,
  /(\$[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*["'].+(--|#).*)/gi,
  /(\$[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*["'].+UNION\s+SELECT\s+.+['"]\s*\.\s*\$.*['"];)/gi,
  /(\$[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*["'].*(CAST|EXEC|EXECUTE|GROUP_CONCAT|HAVING|MERGE|THEN|WHEN|CASE|DECLARE|WAITFOR|PG_SLEEP|SLEEP).+['"]\s*\.\s*\$.*['"];)/gi,
];

// Route to upload files and check for SQL injections
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const content = req.file.buffer.toString("utf-8");
  const lines = content.split("\n");
  let vulnerabilities = [];

  lines.forEach((line, index) => {
    for (let pattern of riskyPatterns) {
      if (pattern.test(line)) {
        // vulnerabilities.push(`Line ${index + 1}: ${line.trim()}`);
        vulnerabilities.push(index + 1);
        pattern.lastIndex = 0; // Reset the regex pattern's lastIndex
        break; // Break the loop after finding the first vulnerability in the line
      }
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

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
