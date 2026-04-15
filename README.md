# Orion Love Real Estate Website

A professional real estate website built with clean HTML, CSS, and JavaScript. Brand-aligned, conversion-focused, with secure FollowUpBoss integration via Cloudflare Worker.

## Features

✓ **Homepage** - Strong USP, seller/buyer CTAs, process overview
✓ **Seller Services Page** - Clear breakdown of services for sellers
✓ **Buyer Services Page** - Detailed buyer representation services
✓ **About Page** - Professional bio and brand story
✓ **Contact Page** - Form with secure Cloudflare Worker → FollowUpBoss integration
✓ **Privacy Policy** - Complete privacy and consent documentation
✓ **Mobile Responsive** - Works on all devices
✓ **Brand Compliant** - Follows Orion Love brand guidelines
✓ **Secure API** - FollowUpBoss API key hidden via Cloudflare Worker

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
├── index.html               # Homepage
├── services.html            # Seller services page
├── buyers.html              # Buyer services page
├── about.html               # About/bio page
├── contact.html             # Contact form (uses Cloudflare Worker)
├── privacy.html             # Privacy policy
├── styles.css               # Main stylesheet
├── script.js                # JavaScript functionality
├── cloudflare-worker.js     # Cloudflare Worker for API proxy
├── CLOUDFLARE-SETUP.md      # Detailed Cloudflare setup instructions
└── README.md                # This file
```

## Setup Instructions

### 1. Basic Website Setup
Upload all HTML, CSS, and JS files to your web hosting service. Ensure files maintain the same directory structure.

### 2. Cloudflare Worker Setup (REQUIRED for Contact Form)

The contact form uses a Cloudflare Worker to securely proxy requests to FollowUpBoss, keeping your API key hidden from the client.

**Follow the detailed instructions in `CLOUDFLARE-SETUP.md`**

Quick summary:
1. Create a free Cloudflare account
2. Create a new Worker
3. Copy the code from `cloudflare-worker.js`
4. Set your FollowUpBoss API key as a secret environment variable
5. Get your Worker URL
6. Update `contact.html` with your Worker URL (replace `YOUR-WORKER-URL`)

### 3. Update Contact Information

Your current contact information is already set:
- Email: `orion.love.co@gmail.com`
- Phone: `(970) 644-6781`
- Service Area: Grand Junction, Colorado

If any of this changes, search and replace across all files.

### 4. Add Professional Photos

Replace placeholder images:
- About page: Add your professional headshot (line 94 in about.html)
- Hero images: Update hero background URLs in the HTML files

## Navigation Structure

- **Home** - Overview and CTAs
- **Sellers** - Services for sellers (services.html)
- **Buyers** - Services for buyers (buyers.html)
- **About** - Your bio and approach
- **Contact** - Contact form and info

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

### Security
- FollowUpBoss API key hidden server-side via Cloudflare Worker
- CORS protection available
- Form validation client and server-side
- Privacy-compliant data handling

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

1. ✅ **Upload website files** - Use cPanel, FTP, or your hosting's file manager
2. ✅ **Set up Cloudflare Worker** - Follow CLOUDFLARE-SETUP.md instructions
3. ✅ **Update contact.html** - Replace `YOUR-WORKER-URL` with your Worker URL
4. ✅ **Add professional photo** - Update about.html with your headshot
5. ✅ **Test contact form** - Submit a test inquiry
6. ✅ **Mobile test** - Check all pages on mobile devices
7. ✅ **SSL Certificate** - Ensure HTTPS is enabled
8. ✅ **Add analytics** - Install Google Analytics tracking code

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

## Troubleshooting

### Contact Form Not Working
1. Verify Cloudflare Worker is deployed
2. Check Worker URL in contact.html is correct
3. Confirm FollowUpBoss API key is set as environment variable
4. Check browser console for errors
5. Review Cloudflare Worker logs

### Navigation Issues
- Ensure all internal links point to the correct files
- Check that all HTML files are in the same directory

### Styling Issues
- Verify styles.css is being loaded
- Check for CSS conflicts with browser extensions
- Clear browser cache

## Support & Customization

For technical assistance or custom modifications, consult with a web developer familiar with:
- HTML/CSS/JavaScript
- Cloudflare Workers
- CRM API integrations
- Real estate website best practices

## License

This website is proprietary to Orion Love Real Estate. All rights reserved.

---

**Contact:**
Orion Love  
Email: orion.love.co@gmail.com  
Phone: (970) 644-6781  
Serving Grand Junction, Colorado and surrounding areas