const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Configure multer to handle multipart/form-data
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage });

app.use(express.json());

// Route to handle image upload
app.post('/createimage', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  // Get the image data
  const imageData = req.file.buffer.toString('base64');

  // Save image data to a file or database (optional)
  const imagePath = path.join(__dirname, 'uploaded_image.png');
  fs.writeFile(imagePath, Buffer.from(imageData, 'base64'), (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to save image' });
    }
    res.status(200).json({ message: 'Image uploaded successfully', imagePath });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
