const LEMONSQUEEZY_API_KEY = process.env.VITE_LEMONSQUEEZY_API_KEY
const STORE_ID = process.env.VITE_LEMONSQUEEZY_STORE_ID
const VARIANT_ID = process.env.VITE_LEMONSQUEEZY_VARIANT_ID

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, userId } = req.body

  if (!email || !userId) {
    return res.status(400).json({ error: 'Missing email or userId' })
  }

  try {
    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${LEMONSQUEEZY_API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              email,
              custom: {
                user_id: userId,
              },
            },
            product_options: {
              redirect_url: `${req.headers.origin}/dashboard?upgraded=true`,
            },
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: STORE_ID,
              },
            },
            variant: {
              data: {
                type: 'variants',
                id: VARIANT_ID,
              },
            },
          },
        },
      }),
    })

    const json = await response.json()

    if (!response.ok) {
      console.error('Lemon Squeezy error:', json)
      return res.status(500).json({ error: 'Failed to create checkout' })
    }

    const checkoutUrl = json.data?.attributes?.url
    return res.status(200).json({ url: checkoutUrl })
  } catch (err) {
    console.error('Create checkout error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}