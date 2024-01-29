const fetch = require('node-fetch');

// Public Farcaster Hub URL for signature validation and Airstack API details
const FARCASTER_HUB_URL = 'https://nemes.farcaster.xyz:2281/v1/submitMessage';
const AIRSTACK_API_ENDPOINT = 'https://api.airstack.xyz/gql';
const AIRSTACK_API_KEY = process.env.AIRSTACK_API_KEY;

exports.handler = async (event) => {
  const { untrustedData } = JSON.parse(event.body); // Using untrustedData for simplicity
  const userAFid = untrustedData.fid; // User's FID from the frame interaction
  const buttonIndex = untrustedData.buttonIndex; // Button index that was clicked

  // Check if the user is following you before showing RGB controls
  if (buttonIndex === '1') {
    const isFollowing = await checkFollowingStatus(userAFid, '18570'); // '18570' is your FID

    if (isFollowing) {
      // User is following, respond with RGB frame HTML
      return generateResponse(rgbFrameHtml(0, 0, 0)); // Starting RGB values
    } else {
      // User is not following, respond with an informational frame
      return generateResponse(notFollowingHtml);
    }
  } else if (['2', '3', '4'].includes(buttonIndex)) {
    // Handle RGB adjustments based on buttonIndex (R, G, B)
    const { r, g, b } = extractRgbValues(untrustedData.url); // Extract RGB values from the URL
    const updatedColors = updateRgbValues(buttonIndex, r, g, b);
    return generateResponse(rgbFrameHtml(updatedColors.r, updatedColors.g, updatedColors.b));
  } else if (buttonIndex === '5') {
    // Handle the "MINT" action
    return generateResponse(mintFrameHtml);
  } else {
    // Fallback for unknown button clicks
    return generateResponse(`<p>Unknown action. Button index: ${buttonIndex}</p>`);
  }
};

// Helper functions (checkFollowingStatus, generateResponse) remain the same

// Extract RGB values from the URL
function extractRgbValues(url) {
  const params = new URL(url).searchParams;
  return {
    r: parseInt(params.get('r'), 10) || 0,
    g: parseInt(params.get('g'), 10) || 0,
    b: parseInt(params.get('b'), 10) || 0,
  };
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

// Generate RGB frame HTML with updated RGB values
function rgbFrameHtml(r, g, b) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="https://path-to-dynamic-image.com/rgb?r=${r}&g=${g}&b=${b}" />
      <meta property="fc:frame:button:2" content="R" />
      <meta property="fc:frame:button:3" content="G" />
      <meta property="fc:frame:button:4" content="B" />
      <meta property="fc:frame:button:5" content="MINT!" />
      <meta property="fc:frame:post_url" content="https://leafy-dusk-954649.netlify.app/.netlify/functions/check-follow?r=${r}&g=${g}&b=${b}" />
    </head>
    <body>
      <p>Adjust RGB values or MINT!</p>
    </body>
    </html>
  `;
}

// Mint frame HTML
const mintFrameHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="https://path-to-your-mint-confirmation-image.png" />
  </head>
  <body>
    <p>Sorry, I'm not that competent, hehe</p>
  </body>
  </html>
`;

// Informational frame for non-followers
const notFollowingHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta property="fc:frame" content="vNext" />
  </head>
  <body>
    <p>Please follow to proceed.</p>
  </body>
  </html>
`;
