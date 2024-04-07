const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const upload = multer({ dest: 'uploads/' }); // Files will be temporarily saved in 'uploads/'

app.use(cors({
  origin: 'http://localhost:3000', // Allows requests from your frontend
}));

// Endpoint to handle the file upload and test execution
app.post('/run-test', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  // Assuming the uploaded file is a JavaScript file for execution
  const uploadedFilePath = req.file.path;
  const targetPath = path.join(__dirname, 'uploads', req.file.originalname);

  // Move the file from the temp location to a more permanent one
  await fs.rename(uploadedFilePath, targetPath);

  exec(`node ${targetPath}`, async (error, stdout, stderr) => {
    // Clean up the uploaded file after execution
    await fs.unlink(targetPath);

    if (error) {
      console.error('Execution error:', error);
      return res.status(500).json({ status: 'error', message: error.message });
    }
    res.status(200).json({ status: 'success', message: stdout || 'Test passed' });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});