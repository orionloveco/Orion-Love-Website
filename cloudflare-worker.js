// Cloudflare Worker for FollowUpBoss API Integration
// This worker acts as a secure proxy to hide your API key from the client

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  // CORS headers for your domain
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Change to your domain: 'https://yourdomain.com'
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the form data from the request
    const formData = await request.json()

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // YOUR FOLLOWUPBOSS API KEY - Set this as an environment variable in Cloudflare
    const FUB_API_KEY = FUB_API_KEY_SECRET // This will be set in Cloudflare dashboard

    // Prepare the data for FollowUpBoss
    const fubData = {
      source: 'Website Contact Form',
      person: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        emails: [{ value: formData.email }],
        phones: [{ value: formData.phone }]
      },
      message: `Inquiry Type: ${formData.inquiry || 'General Inquiry'}\n\nMessage: ${formData.message}`
    }

    // Send to FollowUpBoss API
    const fubResponse = await fetch('https://api.followupboss.com/v1/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(FUB_API_KEY + ':')
      },
      body: JSON.stringify(fubData)
    })

    if (fubResponse.ok) {
      return new Response(
        JSON.stringify({ success: true, message: 'Form submitted successfully' }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    } else {
      const error = await fubResponse.text()
      console.error('FollowUpBoss API Error:', error)
      
      return new Response(
        JSON.stringify({ error: 'Failed to submit form' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

  } catch (error) {
    console.error('Worker Error:', error)
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}