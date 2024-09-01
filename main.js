const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// Register the Jaini font
registerFont(path.join(__dirname, 'Jaini/Jaini.ttf'), { family: 'Jaini' });

// Load quotes from JSON file
const quotes = require('./quotes.json');

// Function to get a random quote
function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}

const canvas = createCanvas(800, 600);
const ctx = canvas.getContext('2d');

const quote = getRandomQuote();

// Set font styles
const saffronColor = '#ff9800';
const backgroundColor = '#fffbe6';

// Function to draw text and return the height
function drawText(text, font, color, x, y, maxWidth) {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const words = text.split(' ');
    let line = '';
    let lineHeight = 0;
    let height = 0;
    
    words.forEach(word => {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && line !== '') {
            ctx.fillText(line, x, y);
            line = word + ' ';
            y += lineHeight;
            lineHeight = 0;
        } else {
            line = testLine;
        }
        lineHeight = Math.max(lineHeight, 30); // Adjust lineHeight as needed
    });
    ctx.fillText(line, x, y);
    height += lineHeight;
    
    return height;
}

// Calculate dynamic height for the text
const maxWidth = 760; // Maximum width for text
const padding = 20;   // Padding around the text
let currentY = 30;    // Initial y position for the text

// Draw the quote on the canvas
const quoteHeight = drawText(quote, '30px Jaini', saffronColor, canvas.width / 2, currentY, maxWidth);
currentY += quoteHeight + padding;

// Update canvas height to fit the content
canvas.height = currentY + padding;

// Draw background and border
ctx.fillStyle = backgroundColor;
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = saffronColor;  // Saffron border
ctx.lineWidth = 10;
ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

// Save the image
const out = fs.createWriteStream('./quote.png');
const stream = canvas.createPNGStream();
stream.pipe(out);
out.on('finish', () => console.log('Quote image created!'));
