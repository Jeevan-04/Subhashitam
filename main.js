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

const canvas = createCanvas(800, 600);
const ctx = canvas.getContext('2d');

// Set background color and border
ctx.fillStyle = '#fffbe6';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = '#ff9800';  // Saffron border
ctx.lineWidth = 10;
ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

// Draw quote text
ctx.fillStyle = '#ff9800';  // Saffron color
ctx.font = '30px Jaini';  // Jaini font for Sanskrit text
ctx.textAlign = 'center';
ctx.textBaseline = 'top';
ctx.fillText(quotes[0].quote, canvas.width / 2, 50);  // Example index

// Draw meaning text
ctx.fillStyle = '#000';  // Default color for meaning
ctx.font = '20px Arial';  // Standard font for meaning
ctx.fillText(quotes[0].meaning, canvas.width / 2, 100);

// Draw source text
ctx.font = '16px Arial';  // Smaller font for source
ctx.fillText(`- ${quotes[0].source}`, canvas.width / 2, canvas.height - 50);

// Save the image
const out = fs.createWriteStream('./quote.png');
const stream = canvas.createPNGStream();
stream.pipe(out);
out.on('finish', () => console.log('Quote image created!'));
