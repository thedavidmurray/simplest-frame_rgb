export default async (req, context) => {
    const url = new URL(req.url);
    const mode = url.searchParams.get('mode') || 'start';
    const r = url.searchParams.get('r') || 0;
    const g = url.searchParams.get('g') || 0;
    const b = url.searchParams.get('b') || 0;
    const host = process.env.URL; // Your Netlify URL

    let html;

    if (mode === 'start') {
        // The start frame should instruct the user to follow you
        html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta property="og:title" content="Follow to Mint" />
                <meta property="og:image" content="https://leafy-dusk-954649.netlify.app/.netlify/functions/generate-image?r=128&g=128&b=128" />
                <meta property="fc:frame" content="vNext" />
                <meta property="fc:frame:image" content="https://leafy-dusk-954649.netlify.app/.netlify/functions/generate-image?r=128&g=128&b=128" />
                <meta property="fc:frame:button:1" content="Follow to mint a canvas" />
                <meta property="fc:frame:post_url" content="https://leafy-dusk-954649.netlify.app/.netlify/functions/check-follow" />
                <!-- Styles and other HTML -->
            </head>
            <body>
                <p>Follow to mint a canvas</p>
            </body>
            </html>
        `;
    } else if (mode === 'rgb') {
        // The RGB frame should show RGB values and buttons to adjust them
        html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta property="og:title" content="Adjust RGB" />
                <meta property="og:image" content="https://leafy-dusk-954649.netlify.app/.netlify/functions/generate-image?r=${r}&g=${g}&b=${b}" />
                <meta property="fc:frame" content="vNext" />
                <meta property="fc:frame:image" content="https://leafy-dusk-954649.netlify.app/.netlify/functions/generate-image?r=${r}&g=${g}&b=${b}" />
                <meta property="fc:frame:button:1" content="Increase Red" />
                <meta property="fc:frame:button:2" content="Increase Green" />
                <meta property="fc:frame:button:3" content="Increase Blue" />
                <meta property="fc:frame:button:4" content="MINT!" />
                <meta property="fc:frame:post_url" content="https://leafy-dusk-954649.netlify.app/.netlify/functions/check-follow" />
                <!-- Styles and other HTML -->
            </head>
            <body>
                <p>RGB: (${r}, ${g}, ${b})</p>
                <!-- Display for RGB values -->
            </body>
            </html>
        `;
    } else if (mode === 'mint') {
        // The mint frame should confirm the minting action
        html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta property="og:title" content="Minted!" />
                <meta property="og:image" content="https://leafy-dusk-954649.netlify.app/.netlify/functions/generate-image?r=${r}&g=${g}&b=${b}" />
                <meta property="fc:frame" content="vNext" />
                <meta property="fc:frame:image" content="https://leafy-dusk-954649.netlify.app/.netlify/functions/generate-image?r=${r}&g=${g}&b=${b}" />
                <!-- No buttons needed here, just show the minted message -->
                <!-- Styles and other HTML -->
            </head>
            <body>
                <p>Sorry, I'm not that competent, hehe</p>
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
