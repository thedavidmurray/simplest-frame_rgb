const fetch = require('node-fetch');

// Public Farcaster Hub URL for signature validation and Airstack API details
const FARCASTER_HUB_URL = 'https://nemes.farcaster.xyz:2281/v1/validateMessage';
const AIRSTACK_API_ENDPOINT = 'https://api.airstack.xyz/gql';
const AIRSTACK_API_KEY = process.env.AIRSTACK_API_KEY;

exports.handler = async (event) => {
  const { untrustedData } = JSON.parse(event.body);
  const userAFid = untrustedData.fid;
  const buttonIndex = untrustedData.buttonIndex;

  // Check if the user is following you before showing RGB controls
  if (buttonIndex === '1') {
    const isFollowing = await checkFollowingStatus(userAFid, '18570'); // '18570' is your FID

    if (isFollowing) {
      // User is following, respond with RGB frame HTML
      return generateResponse(generateRgbFrameHtml(0, 0, 0)); // Starting RGB values
    } else {
      // User is not following, respond with an informational frame
      return generateResponse(`<p>Please follow to mint a canvas.</p>`);
    }
  } else if (['2', '3', '4'].includes(buttonIndex)) {
    // Assume r, g, b values are being stored and retrieved from a datastore or sent as part of the button click payload
    const { r, g, b } = await retrieveRgbValues(userAFid); // Retrieve current RGB values
    const updatedValues = updateRgbValues(buttonIndex, r, g, b);
    return generateResponse(generateRgbFrameHtml(updatedValues.r, updatedValues.g, updatedValues.b));
  } else if (buttonIndex === '5') {
    // The "MINT" action was triggered, respond with a confirmation message
    return generateResponse(`<p>Sorry, I'm not that competent, hehe</p>`);
  } else {
    // Fallback for unknown button clicks
    return generateResponse(`<p>Unknown action. Button index: ${buttonIndex}</p>`);
  }
};

// Dummy function for following status check - replace with your actual API call logic
async function checkFollowingStatus(userAFid, yourFid) {
  // This should be an API call to check if userAFid is following yourFid
  return true; // Stubbed as true for now
}

// Dummy function to retrieve RGB values - replace with actual logic to retrieve values
async function retrieveRgbValues(userAFid) {
  // This should retrieve RGB values for the user from your datastore
  return { r: 0, g: 0, b: 0 }; // Stubbed values
}

// Update RGB values based on the button clicked
function updateRgbValues(buttonIndex, r, g, b) {
  switch (buttonIndex) {
    case '2': return { r: (r + 1) % 256, g, b }; // R button
    case '3': return { r, g: (g + 1) % 256, b }; // G button
    case '4': return { r, g, b: (b + 1) % 256 }; // B button
    default: return { r, g, b };
  }
}

// Generate the response with the correct Content-Type
function generateResponse(html) {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body: html
  };
}

// Generate RGB frame HTML with updated RGB values
function generateRgbFrameHtml(r, g, b) {
  // Generate the HTML for the RGB frame
  // Include the OpenGraph tags and buttons as required by the frame spec
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="https://leafy-dusk-954649.netlify.app/.netlify/functions/generate-image?r=${r}&g=${g}&b=${b}" />
      <meta property="fc:frame:button:2" content="Increase Red" />
      <meta property="fc:frame:button:3" content="Increase Green" />
      <meta property="fc:frame:button:4" content="Increase Blue" />
      <meta property="fc:frame:button:5" content="MINT!" />
      <meta property="fc:frame:post_url" content="https://leafy-dusk-954649.netlify.app/.netlify/functions/check-follow?r=${r}&g=${g}&b=${b}" />
    </head>
    <body>
      <p>RGB: (${r}, ${g}, ${b})</p>
      <p>Adjust RGB values or MINT!</p>
    </body>
    </html>
  `;
}
