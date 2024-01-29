const { createCanvas } = require('canvas');

exports.handler = async (event) => {
  const width = 200;
  const height = 200;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');

  // Extract RGB values from query parameters
  const r = parseInt(event.queryStringParameters.r, 10) || 0;
  const g = parseInt(event.queryStringParameters.g, 10) || 0;
  const b = parseInt(event.queryStringParameters.b, 10) || 0;

  // Log the RGB values for debugging
  console.log(`Received RGB values: r=${r}, g=${g}, b=${b}`);

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
