import satori from "satori";
import sharp from "sharp";
import { html } from "satori-html";

export default async (req, context) => {
    const url = new URL(req.url);
    // Fetch RGB values instead of count
    const r = url.searchParams.get('r') || '0';
    const g = url.searchParams.get('g') || '0';
    const b = url.searchParams.get('b') || '0';

    const host = process.env.URL;
    // Modify the fetch URL to include RGB values and the correct mode
    const htmlResponse = await fetch(`${host}/frame?mode=rgb&r=${r}&g=${g}&b=${b}`);
    const markup = await htmlResponse.text();

    const font = {
        fileName: 'Redaction-Regular.otf',
        cssName: 'Redaction'
    };
    const fontResponse = await fetch(`${host}/fonts/${font.fileName}`);
    const fontData = await fontResponse.arrayBuffer();

    // Generate the SVG with the current RGB background color
    const svg = await satori(html(markup), {
        width: 1200,
        height: 800,
        fonts: [
            {
                name: font.cssName,
                data: fontData,
                weight: 400,
                style: "normal",
            },
        ],
    });
    const svgBuffer = Buffer.from(svg);
    const png = sharp(svgBuffer).png();
    const response = await png.toBuffer();

    return new Response(response, {
        status: 200,
        headers: { 'Content-Type': 'image/png' }
    });
}

export const config = {
    path: "/rgb-image"
};
