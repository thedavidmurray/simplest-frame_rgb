import { getStore } from "@netlify/blobs";
import { URLSearchParams } from 'url';

export default async (req, context) => {
    const url = new URL(req.url);
    const mode = url.searchParams.get('mode') || 'start'; // 'start', 'rgb', or 'mint'
    const store = getStore('frameState');

    let html;

    if (mode === 'start') {
        // Initial gradient background and "Follow to mint a canvas" button
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
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                    }
                    button {
                        padding: 10px 20px;
                        font-size: 1.5rem;
                        cursor: pointer;
                    }
                </style>
            </head>
            <body>
                <button onclick="location.href='/?mode=rgb'">Follow to mint a canvas</button>
            </body>
            </html>
        `;
    } else if (mode === 'rgb') {
        // RGB manipulation and canvas rendering
        const r = parseInt(url.searchParams.get('r') || 0);
        const g = parseInt(url.searchParams.get('g') || 0);
        const b = parseInt(url.searchParams.get('b') || 0);

        html = `
            <html>
            <head>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        background-color: rgb(${r},${g},${b});
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-direction: column;
                        height: 100vh;
                    }
                    button {
                        margin: 5px;
                        padding: 10px;
                        font-size: 16px;
                    }
                    .color-display {
                        margin: 20px;
                        padding: 10px;
                        background-color: rgb(${r},${g},${b});
                        width: 100px;
                        height: 100px;
                    }
                </style>
            </head>
            <body>
                <p>RGB: (${r}, ${g}, ${b})</p>
                <div class="color-display"></div>
                <button onclick="updateColor('r')">R</button>
                <button onclick="updateColor('g')">G</button>
                <button onclick="updateColor('b')">B</button>
                <button onclick="location.href='/?mode=mint&r=${r}&g=${g}&b=${b}'">MINT!</button>

                <script>
                    function updateColor(channel) {
                        const params = new URLSearchParams(window.location.search);
                        let value = parseInt(params.get(channel) || 0);
                        value = (value + 1) % 256;
                        params.set(channel, value);
                        window.location.search = params.toString();
                    }
                </script>
            </body>
            </html>
        `;
    } else if (mode === 'mint') {
        // Playful minting action
        const r = url.searchParams.get('r');
        const g = url.searchParams.get('g');
        const b = url.searchParams.get('b');

        html = `
            <html>
            <head>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        background-color: rgb(${r},${g},${b});
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                    }
                    p {
                        color: white;
                        font-size: 2rem;
                    }
                </style>
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
    path: "/"
};
