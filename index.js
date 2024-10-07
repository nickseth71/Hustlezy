require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { upload, createimage } = require("./upload_image/createimage");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());


app.post('/createimage', upload.single('file'), createimage);

console.log("check prort===", process.env.PORT);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
