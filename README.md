# Rinku Arts Website

Static single-page website (hash-based routing) for Rinku Arts, built with plain HTML/CSS/JavaScript.

## Pages

- Home: hero + service preview
- Services: full services list
- About: business overview + highlights
- Contact: contact details + WhatsApp QR (email form removed)

## Project Structure

- `index.html`: app shell (header, footer, route outlet)
- `styles.css`: all styling
- `data.js`: business content (brand, services, contact details)
- `app.js`: routing + page rendering
- `images/`: local images used by the site

## Run Locally

You can open `index.html` directly, but using a local server is recommended.

### Option A: VS Code Live Server

- Open the folder in VS Code
- Right-click `index.html` → “Open with Live Server”

### Option B: Python

- `python -m http.server 8000`
- Open `http://localhost:8000/`

## Update Content

Edit `data.js` to change:

- Brand name, tagline, logo: `window.BUSINESS_DATA.brand`
- Contact details: `window.BUSINESS_DATA.contact`
- About text: `window.BUSINESS_DATA.about`
- Services list: `window.BUSINESS_DATA.services`

## Contact Page QR Image

The WhatsApp QR displayed on the Contact page is controlled by:

- `window.BUSINESS_DATA.contact.whatsappQrImage` in `data.js`
- Default file in this repo: `images/WhatsApp Image 2025-12-20 at 08.38.10.jpeg`

## Deploy

This site can be deployed on any static hosting (GitHub Pages, Netlify, Vercel static, etc.) by uploading the project folder contents.
