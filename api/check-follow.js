const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { userA, userB } = JSON.parse(event.body);

  const query = `
    query isFollowing {
      Wallet(input: {identity: "${userB}", blockchain: ethereum}) {
        socialFollowers(input: {filter: {identity: {_in: ["${userA}"]}}}) {
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
    const response = await fetch('https://api.airstack.xyz/gql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AIRSTACK_API_KEY}`
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const isFollowing = data.data.Wallet.socialFollowers.Follower.length > 0;

    return {
      statusCode: 200,
      body: JSON.stringify({ isFollowing })
    };
  } catch (error) {
    console.error('Error checking follow status:', error);
    return {
      statusCode: 500,
      body: 'Internal Server Error'
    };
  }
};
