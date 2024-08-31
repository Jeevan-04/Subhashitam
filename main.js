const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// Register the Jaini font
registerFont(path.join(__dirname, 'Jaini/Jaini.ttf'), { family: 'Jaini' });

const quotes = require('./quotes.json');

function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}

const canvasWidth = 800;
const canvasHeight = 300; // Adjusted height for better fit
const padding = 20; // Padding around the text
const quotePadding = 10; // Padding between quote and meaning/source

const canvas = createCanvas(canvasWidth, canvasHeight);
const ctx = canvas.getContext('2d');

const quote = getRandomQuote();

// Set background color and border
ctx.fillStyle = '#fffbe6'; // Background color
ctx.fillRect(0, 0, canvasWidth, canvasHeight);
ctx.strokeStyle = '#ff9800'; // Saffron border
ctx.lineWidth = 8; // Border width
ctx.strokeRect(padding, padding, canvasWidth - 2 * padding, canvasHeight - 2 * padding);

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

let y = padding + 10; // Start drawing text

// Draw quote
ctx.font = '24px Jaini';
quoteLines.forEach(line => {
    ctx.fillText(line, canvasWidth / 2, y);
    y += 30; // Line height
});

// Add space between quote and meaning
y += quotePadding;

// Draw meaning
ctx.fillStyle = '#000'; // Default color for meaning
ctx.font = '18px Arial'; // Standard font for meaning
meaningLines.forEach(line => {
    ctx.fillText(line, canvasWidth / 2, y);
    y += 24; // Line height
});

// Add space between meaning and source
y += quotePadding;

// Draw source
ctx.font = '16px Arial'; // Smaller font for source
sourceLines.forEach(line => {
    ctx.fillText(line, canvasWidth / 2, y);
    y += 20; // Line height
});

// Save the image
const out = fs.createWriteStream('./quote.png');
const stream = canvas.createPNGStream();
stream.pipe(out);
out.on('finish', () => console.log('Quote image created!'));

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
