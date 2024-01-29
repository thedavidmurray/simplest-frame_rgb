const fetch = require('node-fetch');

const FARCASTER_HUB_URL = 'https://nemes.farcaster.xyz:2281/v1/submitMessage';
const AIRSTACK_API_ENDPOINT = 'https://api.airstack.xyz/gql';
const AIRSTACK_API_KEY = process.env.AIRSTACK_API_KEY;

exports.handler = async (event) => {
  const { untrustedData } = JSON.parse(event.body); // Using untrustedData for demonstration. In production, use trustedData and verify it.
  const userAFid = untrustedData.fid; // User's FID from the frame interaction

  // Assuming the button click is to check following status before showing RGB controls
  if (untrustedData.buttonIndex === '1') {
    // Check if the user is following you
    const isFollowing = await checkFollowingStatus(userAFid, '18570'); // '18570' is your FID

    if (isFollowing) {
      // User is following, respond with RGB frame HTML
      return generateResponse(rgbFrameHtml);
    } else {
      // User is not following, respond with an error or informational frame
      return generateResponse(notFollowingHtml);
    }
  } else {
    // Handle other button clicks (e.g., R, G, B, MINT) and respond with appropriate frames
    // This part needs to be customized based on your application logic and how you want to handle different button clicks
    // For example, adjusting RGB values, showing the minting frame, etc.

    // Placeholder response for demonstration
    return generateResponse(`<p>Button ${untrustedData.buttonIndex} clicked. Implement handling logic.</p>`);
  }
};

// Helper function to check if a user is following another user
async function checkFollowingStatus(userAFid, userBFid) {
  const query = `{ Wallet(input: {identity: "${userBFid}", blockchain: ethereum}) { socialFollowers(input: {filter: {identity: {_in: ["${userAFid}"]}}}) { Follower { dappName } } } } }`;
  const response = await fetch(AIRSTACK_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AIRSTACK_API_KEY}`,
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();
  return data.data.Wallet.socialFollowers.Follower.length > 0;
}

// Helper function to generate an HTTP response
function generateResponse(htmlContent) {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body: htmlContent,
  };
}

// Define your HTML frames here. For demonstration, simple placeholders are provided.
const rgbFrameHtml = `<!DOCTYPE html><html><head><meta property="fc:frame" content="vNext" /><meta property="fc:frame:button:1" content="R" /><meta property="fc:frame:button:2" content="G" /><meta property="fc:frame:button:3" content="B" /><meta property="fc:frame:button:4" content="MINT!" /></head><body><p>RGB Frame</p></body></html>`;

const notFollowingHtml = `<!DOCTYPE html><html><head><meta property="fc:frame" content="vNext" /></head><body><p>Please follow to proceed.</p></body></html>`;
