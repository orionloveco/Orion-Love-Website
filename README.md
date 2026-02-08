# Orion Love Real Estate Website

A professional real estate website built with clean HTML, CSS, and JavaScript. Brand-aligned, conversion-focused, and ready for IDX integration.

## Features

✓ **Homepage** - Strong USP, hero search, featured listings, CTAs
✓ **Property Search** - IDX-ready with filters, map view, and advanced search
✓ **Services Page** - Clear breakdown of what's included
✓ **About Page** - Professional bio and brand story
✓ **Contact Page** - Form with FollowUpBoss API integration
✓ **Privacy Policy** - Complete privacy and consent documentation
✓ **Mobile Responsive** - Works on all devices
✓ **Brand Compliant** - Follows Orion Love brand guidelines

## Brand Fonts

The website uses the following fonts (via Google Fonts):
- **Cinzel** - Headers (serif)
- **Raleway** - Body text (sans-serif)

Note: Sloop Script Pro is a premium font not available via Google Fonts. To use it:
1. Purchase and download Sloop Script Pro
2. Add the font files to a `/fonts` directory
3. Update `styles.css` with `@font-face` declarations

## File Structure

```
orion-love-site/
├── index.html          # Homepage
├── listings.html       # Property search page
├── services.html       # Services breakdown
├── about.html          # About/bio page
├── contact.html        # Contact form
├── privacy.html        # Privacy policy
├── styles.css          # Main stylesheet
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Setup Instructions

### 1. Basic Setup
Upload all files to your web hosting service. Ensure files maintain the same directory structure.

### 2. FollowUpBoss Integration

In `contact.html`, replace `YOUR_API_KEY` with your actual FollowUpBoss API key:

```javascript
// Line 181 in contact.html
'Authorization': 'Basic ' + btoa('YOUR_API_KEY:')
```

To get your API key:
1. Log into FollowUpBoss
2. Go to Settings > API
3. Generate or copy your API key
4. Replace `YOUR_API_KEY` in the code

### 3. IDX Integration

The `listings.html` page is structured for IDX integration. Connect with your IDX provider:

**Popular IDX Providers:**
- IDX Broker
- Showcase IDX
- iHomefinder
- Diverse Solutions
- Cloud CMA

**Integration Steps:**
1. Sign up with an IDX provider
2. Get your JavaScript embed code
3. Replace the placeholder listings grid in `listings.html` with your IDX widget
4. Add the IDX map widget to the map container

Example for IDX Broker:
```html
<!-- Replace the listings grid section with: -->
<div id="idxStart"></div>
<script src="https://your-idx-domain.idxbroker.com/idx/yourwidget.js"></script>
<div id="idxStop"></div>
```

### 4. Update Contact Information

Update the following throughout all pages:
- Email: `orion.love.co@gmail.com`
- Phone: `(970) 644-6781`
- Website: `orionloveco.kw.com`

Search and replace these values if any information changes.

### 5. Add Professional Photos

Replace placeholder images:
- About page: Add professional headshot
- Listings: Will populate via IDX
- Hero images: Update hero background URLs in `styles.css`

## Customization

### Colors
Update brand colors in `styles.css` (lines 1-7):
```css
:root {
    --primary: #020C45;
    --accent: #CD9703;
    --gray: #606060;
    --black: #000000;
    --white: #FFFFFF;
    --off-white: #F8F8F8;
}
```

### Content
All content can be edited directly in the HTML files. Text follows the Orion Love brand voice:
- Direct and honest
- Clear over clever
- No hype or fluff
- Confident without being loud

## Technical Notes

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive (tested on iOS and Android)
- Progressive enhancement for older browsers

### Performance
- Minimal JavaScript for fast loading
- CSS animations for smooth interactions
- Lazy loading ready for images
- Optimized for Google PageSpeed

### SEO Considerations
Add to `<head>` of each page:
```html
<meta name="description" content="Your page description">
<meta name="keywords" content="Grand Junction real estate, Colorado homes">
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Description">
<meta property="og:image" content="URL to image">
```

## Next Steps

1. **Upload to hosting** - Use cPanel, FTP, or your hosting's file manager
2. **Configure FollowUpBoss API** - Add your API key
3. **Integrate IDX** - Connect property search functionality
4. **Add analytics** - Install Google Analytics tracking code
5. **Test forms** - Submit test inquiries to verify email delivery
6. **Mobile test** - Check all pages on mobile devices
7. **SSL Certificate** - Ensure HTTPS is enabled

## Support & Customization

For technical assistance or custom modifications, consult with a web developer familiar with:
- HTML/CSS/JavaScript
- IDX integrations
- CRM API integrations
- Real estate website best practices

## License

This website is proprietary to Orion Love Real Estate. All rights reserved.

---

**Contact:**
Orion Love
Email: orion.love.co@gmail.com
Phone: (970) 644-6781
Website: orionloveco.kw.com