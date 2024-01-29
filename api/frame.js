export default async (req, context) => {
  const url = new URL(req.url);
  const mode = url.searchParams.get('mode') || 'start';
  let r = parseInt(url.searchParams.get('r'), 10) || 0;
  let g = parseInt(url.searchParams.get('g'), 10) || 0;
  let b = parseInt(url.searchParams.get('b'), 10) || 0;

  let html;

  // Define the base URL
  const baseUrl = 'https://leafy-dusk-954649.netlify.app';

  if (mode === 'start') {
    html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta property="og:title" content="Start Frame" />
        <meta property="og:image" content="${baseUrl}/.netlify/functions/generate-image?r=${r}&g=${g}&b=${b}" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/.netlify/functions/generate-image?r=${r}&g=${g}&b=${b}" />
        <meta property="fc:frame:button:1" content="Follow to mint a canvas" />
        <meta property="fc:frame:post_url" content="${baseUrl}/.netlify/functions/check-follow" />
        <!-- Styles and scripts -->
      </head>
      <body>
        <p>Follow to mint a canvas</p>
        <!-- The button here should trigger the follow check -->
      </body>
      </html>
    `;
  } else if (mode === 'rgb') {
    html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta property="og:title" content="RGB Frame" />
        <meta property="og:image" content="${baseUrl}/.netlify/functions/generate-image?r=${r}&g=${g}&b=${b}" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/.netlify/functions/generate-image?r=${r}&g=${g}&b=${b}" />
        <meta property="fc:frame:button:1" content="Increase Red" />
        <meta property="fc:frame:button:2" content="Increase Green" />
        <meta property="fc:frame:button:3" content="Increase Blue" />
        <meta property="fc:frame:post_url" content="${baseUrl}/.netlify/functions/rgb-update" />
        <!-- Styles and scripts -->
      </head>
      <body>
        <p>RGB: (${r}, ${g}, ${b})</p>
        <button id="btn-r">Increase Red</button>
        <button id="btn-g">Increase Green</button>
        <button id="btn-b">Increase Blue</button>
        <script>
          document.getElementById('btn-r').addEventListener('click', function() { updateColor('r'); });
          document.getElementById('btn-g').addEventListener('click', function() { updateColor('g'); });
          document.getElementById('btn-b').addEventListener('click', function() { updateColor('b'); });

          function updateColor(channel) {
            const currentValue = parseInt(new URLSearchParams(window.location.search).get(channel), 10);
            const newValue = (currentValue + 1) % 256;
            const params = new URLSearchParams(window.location.search);
            params.set(channel, newValue);
            window.location.search = params.toString();
          }
        </script>
      </body>
      </html>
    `;
  } else if (mode === 'mint') {
    html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta property="og:title" content="Mint Frame" />
        <meta property="og:image" content="${baseUrl}/.netlify/functions/generate-image?r=${r}&g=${g}&b=${b}" />
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/.netlify/functions/generate-image?r=${r}&g=${g}&b=${b}" />
        <!-- No buttons needed here, just show the minted message -->
        <!-- Styles and scripts -->
      </head>
      <body>
        <p>Sorry, I'm not that competent, hehe</p>
        <!-- Display final RGB color -->
      </body>
      </html>
    `;
  }

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
};

export const config = {
  path: "/frame"
};
