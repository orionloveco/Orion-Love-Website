# Cloudflare Worker Setup Guide for FollowUpBoss Integration

This guide will walk you through setting up a Cloudflare Worker to securely handle your FollowUpBoss API integration.

## Why Use a Cloudflare Worker?

Instead of exposing your FollowUpBoss API key in the browser (client-side), the worker acts as a secure proxy:
- Your API key stays hidden server-side
- Prevents unauthorized API usage
- Adds rate limiting and security
- Free tier includes 100,000 requests/day

## Step-by-Step Setup

### 1. Create a Cloudflare Account

1. Go to https://dash.cloudflare.com/sign-up
2. Create a free account
3. Verify your email

### 2. Create a New Worker

1. Log into Cloudflare Dashboard
2. Click "Workers & Pages" in the left sidebar
3. Click "Create Application"
4. Select "Create Worker"
5. Give it a name (e.g., `followupboss-api`)
6. Click "Deploy"

### 3. Add Your Worker Code

1. After deployment, click "Edit Code"
2. Delete the default code
3. Copy and paste the entire contents of `cloudflare-worker.js`
4. Click "Save and Deploy"

### 4. Set Up Your API Key as a Secret

**Important:** Never hardcode your API key in the worker code!

1. In your worker dashboard, click "Settings"
2. Scroll to "Variables and Secrets"
3. Under "Environment Variables", click "Add Variable"
4. Set:
   - **Variable name:** `FUB_API_KEY_SECRET`
   - **Value:** Your FollowUpBoss API key
   - **Type:** Select "Secret" (encrypted)
5. Click "Save"

**To get your FollowUpBoss API key:**
1. Log into FollowUpBoss
2. Go to Settings → API
3. Generate or copy your API key

### 5. Get Your Worker URL

After deploying, Cloudflare gives you a worker URL:
```
https://followupboss-api.YOUR-SUBDOMAIN.workers.dev
```

Copy this URL - you'll need it for your website.

### 6. Update Your Contact Form

In `contact.html`, replace the fetch URL with your worker URL:

**Find this line (around line 181):**
```javascript
const response = await fetch('https://api.followupboss.com/v1/events', {
```

**Replace with:**
```javascript
const response = await fetch('https://followupboss-api.YOUR-SUBDOMAIN.workers.dev', {
```

**Then remove the Authorization header entirely** since the worker handles that:

**Change from:**
```javascript
const response = await fetch('https://followupboss-api.YOUR-SUBDOMAIN.workers.dev', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa('YOUR_API_KEY:')  // DELETE THIS LINE
    },
    body: JSON.stringify({
        source: formData.source,
        person: formData.person,
        message: `Inquiry Type: ${formData.inquiry}\n\nMessage: ${formData.message}`
    })
});
```

**To:**
```javascript
const response = await fetch('https://followupboss-api.YOUR-SUBDOMAIN.workers.dev', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
});
```

### 7. Optional: Add Your Domain (Recommended for Production)

Instead of using the `.workers.dev` subdomain, route the worker through your own domain:

1. Add your domain to Cloudflare (if not already)
2. In Workers dashboard, go to "Triggers"
3. Click "Add Custom Domain"
4. Enter something like: `api.yourdomain.com`
5. Cloudflare automatically creates DNS records
6. Update your contact form URL to use this custom domain

### 8. Optional: Restrict CORS to Your Domain

For added security, update the worker to only allow requests from your website:

**Change this line in the worker:**
```javascript
'Access-Control-Allow-Origin': '*',
```

**To:**
```javascript
'Access-Control-Allow-Origin': 'https://yourdomain.com',
```

### 9. Test Your Setup

1. Upload your updated `contact.html` to your website
2. Submit a test form
3. Check FollowUpBoss to confirm the lead was created
4. Check Cloudflare Worker logs (in the dashboard) to see the request

## Security Best Practices

✓ **Never commit your API key to code**
✓ **Use Cloudflare secrets for sensitive data**
✓ **Restrict CORS to your domain only**
✓ **Enable rate limiting if needed**
✓ **Monitor worker logs for suspicious activity**

## Troubleshooting

### "Worker not found" error
- Make sure you saved and deployed the worker
- Check the worker URL is correct in your contact form

### "Missing required fields" error
- Verify all form fields are being sent
- Check browser console for JavaScript errors

### "Failed to submit form" error
- Verify your FollowUpBoss API key is correct
- Check worker logs in Cloudflare dashboard for detailed errors

### CORS errors
- Ensure CORS headers are set correctly in worker
- If using a custom domain, verify DNS is propagated

## Rate Limiting (Optional)

To prevent abuse, add rate limiting to your worker:

1. In Cloudflare dashboard, go to your worker
2. Click "Settings" → "Add Rate Limiting"
3. Set rules (e.g., max 10 requests per minute per IP)

## Monitoring

View worker analytics:
1. Go to your worker in Cloudflare dashboard
2. Click "Metrics" tab
3. Monitor requests, errors, and CPU time

## Cost

Cloudflare Workers Free Tier includes:
- 100,000 requests per day
- Sufficient for most small to medium real estate sites
- Upgrade to Paid plan ($5/month) for 10 million requests

## Support

If you encounter issues:
1. Check Cloudflare Worker logs for errors
2. Verify your FollowUpBoss API key is valid
3. Test the worker directly using Postman or curl
4. Contact Cloudflare support or a web developer

---

**Your Setup Checklist:**
- [ ] Create Cloudflare account
- [ ] Deploy worker with code from cloudflare-worker.js
- [ ] Add FUB_API_KEY_SECRET as environment variable
- [ ] Copy worker URL
- [ ] Update contact.html with worker URL
- [ ] Remove API key from contact.html
- [ ] Test form submission
- [ ] (Optional) Add custom domain
- [ ] (Optional) Restrict CORS to your domain