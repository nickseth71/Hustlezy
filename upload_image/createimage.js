const sharp = require('sharp');
const multer = require('multer');
const axios = require('axios');
const path = require('path');

// Environment variables
const api_key = process.env.api_key;
const api_access_token = process.env.api_access_token;
const theme_id = 141618938108; // Make sure this is correct

// Multer configuration for file storage
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

const createimage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.file; // File uploaded through multer

    try {
        // Convert SVG to PNG using sharp
        const pngBuffer = await sharp(file.buffer)
            .png()
            .toBuffer();

        // Base64 encode the PNG buffer
        const base64Image = pngBuffer.toString('base64');

        // Generate a unique filename with a timestamp
        const uniqueFilename = `${path.parse(file.originalname).name}_${Date.now()}.png`;

        // Define the asset key (the file path in the theme's assets directory)
        const assetKey = `assets/${uniqueFilename}`;

        // Define the payload for the PUT request to upload the PNG image
        const assetPayload = {
            asset: {
                key: assetKey, // The file path in the theme's assets directory
                attachment: base64Image, // Base64 encoded image data
            },
        };

        // Shopify API endpoint URL for the PUT request
        const shopifyUrl = `https://hustlezy.myshopify.com/admin/api/2024-07/themes/${theme_id}/assets.json`;

        // Make PUT request to upload the image to the theme assets in Shopify
        const response = await axios.put(shopifyUrl, assetPayload, {
            headers: {
                'X-Shopify-Access-Token': api_access_token, // Shopify auth token
                'Content-Type': 'application/json', // Content-Type for JSON payload
            },
        });

        // Success response
        return res.json({ data: response.data, message: "Image successfully uploaded to Shopify theme assets." });

    } catch (err) {
        // Log detailed error information
        console.error("Error uploading image:", {
            message: err.message,  // Error message
            status: err.response ? err.response.status : null,  // HTTP status code, if available
            data: err.response ? err.response.data : null,  // Response data from Shopify, if available
            headers: err.response ? err.response.headers : null,  // Response headers, if available
        });

        res.status(500).json({ message: "Error", details: err.message });
    }
};

module.exports = { upload, createimage };
