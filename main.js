const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// Register the Jaini font
registerFont(path.join(__dirname, 'Jaini/Jaini.ttf'), { family: 'Jaini' });

const quotes = require('./quotes.json');

function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}

// Canvas settings
const canvasWidth = 800;
const padding = 20; // Padding around the text
const quotePadding = 10; // Padding between quote and meaning/source

const quote = getRandomQuote();

// Helper function to split text into lines
function splitTextIntoLines(ctx, text, maxWidth) {
    const words = text.split(' ');
    let line = '';
    const lines = [];

    words.forEach(word => {
        const testLine = line + word + ' ';
        const testWidth = ctx.measureText(testLine).width;
        if (testWidth > maxWidth) {
            lines.push(line.trim());
            line = word + ' ';
        } else {
            line = testLine;
        }
    });

    lines.push(line.trim());
    return lines;
}

const canvas = createCanvas(canvasWidth, 100); // Initial height
const ctx = canvas.getContext('2d');

// Set background color and border
ctx.fillStyle = '#fffbe6'; // Background color
ctx.fillRect(0, 0, canvasWidth, 1); // Dummy fill to calculate height later

ctx.strokeStyle = '#ff9800'; // Saffron border
ctx.lineWidth = 8; // Border width

// Draw quote text
ctx.fillStyle = '#ff9800'; // Saffron color for quote
ctx.font = '24px Jaini'; // Jaini font for Sanskrit text
ctx.textAlign = 'center';
ctx.textBaseline = 'top';

const quoteText = quote.quote;
const meaningText = quote.meaning;
const sourceText = `- ${quote.source}`;

const quoteLines = splitTextIntoLines(ctx, quoteText, canvasWidth - 2 * padding);
const meaningLines = splitTextIntoLines(ctx, meaningText, canvasWidth - 2 * padding);
const sourceLines = splitTextIntoLines(ctx, sourceText, canvasWidth - 2 * padding);

// Calculate the total height needed
const lineHeight = 30; // Line height for quote
const meaningLineHeight = 24; // Line height for meaning
const sourceLineHeight = 20; // Line height for source

const totalHeight = padding * 2 + quoteLines.length * lineHeight +
                    quotePadding +
                    meaningLines.length * meaningLineHeight +
                    quotePadding +
                    sourceLines.length * sourceLineHeight;

canvas.height = totalHeight; // Set the canvas height

// Redraw with new canvas height
ctx.fillStyle = '#fffbe6'; // Background color
ctx.fillRect(0, 0, canvasWidth, canvas.height);

ctx.strokeStyle = '#ff9800'; // Saffron border
ctx.lineWidth = 8; // Border width
ctx.strokeRect(padding, padding, canvasWidth - 2 * padding, canvas.height - 2 * padding);

// Draw quote text
ctx.fillStyle = '#ff9800'; // Saffron color for quote
ctx.font = '24px Jaini';
ctx.textAlign = 'center';
ctx.textBaseline = 'top';

let y = padding + 10; // Start drawing text

// Draw quote
quoteLines.forEach(line => {
    ctx.fillText(line, canvasWidth / 2, y);
    y += lineHeight;
});

// Add space between quote and meaning
y += quotePadding;

// Draw meaning
ctx.fillStyle = '#000'; // Default color for meaning
ctx.font = '18px Arial'; // Standard font for meaning
meaningLines.forEach(line => {
    ctx.fillText(line, canvasWidth / 2, y);
    y += meaningLineHeight;
});

// Add space between meaning and source
y += quotePadding;

// Draw source
ctx.font = '16px Arial'; // Smaller font for source
sourceLines.forEach(line => {
    ctx.fillText(line, canvasWidth / 2, y);
    y += sourceLineHeight;
});

// Save the image
const out = fs.createWriteStream('./quote.png');
const stream = canvas.createPNGStream();
stream.pipe(out);
out.on('finish', () => console.log('Quote image created!'));
