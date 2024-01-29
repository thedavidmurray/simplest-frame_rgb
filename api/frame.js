// frame.js
export default async (req, context) => {
    const url = new URL(req.url);
    const mode = url.searchParams.get('mode');
    const r = url.searchParams.get('r') || 0;
    const g = url.searchParams.get('g') || 0;
    const b = url.searchParams.get('b') || 0;

    let html;

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
                <meta property="og:title" content="Adjust RGB" />
                <meta property="og:image" content="${host}/.netlify/functions/generate-image?r=${r}&g=${g}&b=${b}" />
                <meta property="fc:frame" content="vNext" />
                <meta property="fc:frame:image" content="${host}/.netlify/functions/generate-image?r=${r}&g=${g}&b=${b}" />
                <meta property="fc:frame:button:1" content="Increase Red" />
                <meta property="fc:frame:button:2" content="Increase Green" />
                <meta property="fc:frame:button:3" content="Increase Blue" />
                <meta property="fc:frame:button:4" content="MINT!" />
                <meta property="fc:frame:post_url" content="${host}/.netlify/functions/check-follow" />
                <!-- Additional meta tags and HTML -->
            </head>
            <body>
                <!-- HTML content including script to handle button clicks -->
            </body>
            </html>
        `;
    } else if (mode === 'mint') {
        html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta property="og:title" content="Minted!" />
                <meta property="og:image" content="${host}/.netlify/functions/generate-image?r=${r}&g=${g}&b=${b}" />
                <meta property="fc:frame" content="vNext" />
                <meta property="fc:frame:image" content="${host}/.netlify/functions/generate-image?r=${r}&g=${g}&b=${b}" />
                <!-- No buttons as this is the final frame -->
                <!-- Additional meta tags and HTML -->
            </head>
            <body>
                <p>Your custom canvas with RGB (${r}, ${g}, ${b}) has been minted!</p>
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
    path: "/"
};

export const config = {
  path: "/frame"
};
