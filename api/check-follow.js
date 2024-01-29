const fetch = require('node-fetch');

const HUB_VALIDATE_ENDPOINT = 'https://hub.farcaster.xyz/v1/validateMessage';
const AIRSTACK_API_ENDPOINT = 'https://api.airstack.xyz/gql';
const AIRSTACK_API_KEY = process.env.AIRSTACK_API_KEY; // Your API key stored in Netlify environment variables

exports.handler = async (event) => {
  const { trustedData } = JSON.parse(event.body);

  // Validate the trustedData with the Farcaster Hub
  const validationResponse = await fetch(HUB_VALIDATE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    body: Buffer.from(trustedData.messageBytes, 'hex'), // Assuming messageBytes is a hex string
  });

  if (!validationResponse.ok) {
    // Handle validation error
    return { statusCode: 400, body: 'Invalid signature.' };
  }

  const validationData = await validationResponse.json();
  if (!validationData.valid) {
    // If the message is not valid, return an error
    return { statusCode: 400, body: 'Invalid message.' };
  }

  // Extract user FID from the validated message
  const userAFid = validationData.message.data.frameActionBody.url; // Replace with correct property path

  // GraphQL query to check if the user is following you
  const query = `
    query isFollowing {
      Wallet(input: {identity: "${userAFid}", blockchain: ethereum}) {
        socialFollowers(input: {filter: {identity: {_in: ["18570"]}}}) { // Replace "18570" with your FID
          Follower {
            dappName
            dappSlug
            followingProfileId
            followerProfileId
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(AIRSTACK_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AIRSTACK_API_KEY}`
      },
      body: JSON.stringify({ query })
    });

    const data = await response.json();
    const isFollowing = data.data.Wallet.socialFollowers.Follower.length > 0;

    // Respond with the appropriate HTML and OpenGraph tags for the next frame
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: `
        <!DOCTYPE html>
        <html>
          <head>
            <!-- Insert your OpenGraph tags here -->
            <!-- Make sure to use the correct URL for the image and button actions -->
          </head>
          <body>
            <!-- Your body content here -->
          </body>
        </html>
      `,
    };
  } catch (error) {
    console.error('Error checking follow status:', error);
    return {
      statusCode: 500,
      body: 'Internal Server Error'
    };
  }
};
