// This would be in a Netlify Function, e.g., generate-image.js
const { createCanvas } = require('canvas');

exports.handler = async (event) => {
  const width = 200;
  const height = 200;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');

  // Extract RGB values from query parameters
  const { r, g, b } = event.queryStringParameters;

  // Set canvas background to the specified RGB color
  context.fillStyle = `rgb(${r},${g},${b})`;
  context.fillRect(0, 0, width, height);

  // Convert canvas to an image
  const buffer = canvas.toBuffer('image/png');
  const base64Image = buffer.toString('base64');

  // Return the image directly in the response
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'image/png',
    },
    body: base64Image,
    isBase64Encoded: true,
  };
};
