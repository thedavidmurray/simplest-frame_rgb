export default async (req, context) => {
    const url = new URL(req.url);
    const mode = url.searchParams.get('mode') || 'start'; // 'start', 'rgb', or 'mint'

    let html;

    if (mode === 'start') {
        html = `
            <html>
            <head>
                <style>
                    @keyframes gradient {
                        0% { background-color: #ff0000; }
                        33% { background-color: #00ff00; }
                        66% { background-color: #0000ff; }
                        100% { background-color: #ff0000; }
                    }
                    body {
                        margin: 0;
                        padding: 0;
                        animation: gradient 5s infinite;
                    }
                    .centered {
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        text-align: center;
                    }
                    button {
                        padding: 10px 20px;
                        font-size: 1.5rem;
                        cursor: pointer;
                    }
                </style>
            </head>
            <body>
                <div class="centered">
                    <p>Gradient Magic</p>
                    <button onclick="location.href='/?mode=rgb'">Follow to mint a canvas</button>
                </div>
            </body>
            </html>
        `;
    } else if (mode === 'rgb') {
        // We will fill this in the next step
    } else if (mode === 'mint') {
        // We will fill this in a later step
    }

    return new Response(html, {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
    });
};

export const config = {
    path: "/frame"
};
