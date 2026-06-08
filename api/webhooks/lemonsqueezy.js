import crypto from 'crypto'

const WEBHOOK_SECRET = process.env.VITE_LEMONSQUEEZY_WEBHOOK_SECRET
const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.VITE_SUPABASE_SERVICE_KEY

async function updateUserPlan(email, plan, subscriptionData = {}) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(email)}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        plan,
        plan_granted_by: plan === 'pro' ? 'payment' : null,
        plan_granted_at: plan === 'pro' ? new Date().toISOString() : null,
        ls_customer_id: subscriptionData.customer_id ?? null,
        ls_subscription_id: subscriptionData.subscription_id ?? null,
        ls_subscription_status: subscriptionData.status ?? null,
      }),
    }
  )

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Supabase update failed: ${text}`)
  }
}

async function logPayment(email, providerOrderId, subscriptionId, status) {
  // Find user id first
  const userRes = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(email)}&select=id`,
    {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    }
  )
  const users = await userRes.json()
  if (!users || users.length === 0) return

  const userId = users[0].id

  await fetch(`${SUPABASE_URL}/rest/v1/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
    body: JSON.stringify({
      user_id: userId,
      provider: 'lemonsqueezy',
      provider_order_id: providerOrderId,
      provider_subscription_id: subscriptionId,
      status,
    }),
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Get raw body for signature verification
  export const config = {
  api: {
    bodyParser: false,
  },
  }

  export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const rawBody = await new Promise((resolve, reject) => {
    let data = ''
    req.on('data', chunk => { data += chunk })
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })

  // Verify webhook signature
  const signature = req.headers['x-signature']
  if (!signature || !WEBHOOK_SECRET) {
    console.error('Missing signature or webhook secret')
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET)
  hmac.update(rawBody)
  const digest = hmac.digest('hex')

  if (digest !== signature) {
    console.error('Invalid webhook signature')
    return res.status(401).json({ error: 'Invalid signature' })
  }

  let payload
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' })
  }

  const eventName = payload.meta?.event_name
  const data = payload.data?.attributes
  const email = data?.user_email

  console.log('Webhook received:', eventName, email)

  if (!email) {
    return res.status(400).json({ error: 'No email in payload' })
  }

  try {
    switch (eventName) {
      case 'order_created':
        // One-time order completed
        if (data?.status === 'paid') {
          await updateUserPlan(email, 'pro', {
            customer_id: data?.customer_id?.toString(),
            status: 'active',
          })
          await logPayment(
            email,
            payload.data?.id?.toString(),
            null,
            'paid'
          )
        }
        break

      case 'subscription_created':
        // New subscription started
        await updateUserPlan(email, 'pro', {
          customer_id: data?.customer_id?.toString(),
          subscription_id: payload.data?.id?.toString(),
          status: data?.status,
        })
        await logPayment(
          email,
          null,
          payload.data?.id?.toString(),
          'paid'
        )
        break

      case 'subscription_updated':
        // Subscription changed
        if (data?.status === 'active') {
          await updateUserPlan(email, 'pro', {
            customer_id: data?.customer_id?.toString(),
            subscription_id: payload.data?.id?.toString(),
            status: data?.status,
          })
        } else if (
          data?.status === 'cancelled' ||
          data?.status === 'expired' ||
          data?.status === 'unpaid'
        ) {
          await updateUserPlan(email, 'free', {
            customer_id: data?.customer_id?.toString(),
            subscription_id: payload.data?.id?.toString(),
            status: data?.status,
          })
          await logPayment(
            email,
            null,
            payload.data?.id?.toString(),
            'cancelled'
          )
        }
        break

      case 'subscription_cancelled':
        // Subscription cancelled
        await updateUserPlan(email, 'free', {
          customer_id: data?.customer_id?.toString(),
          subscription_id: payload.data?.id?.toString(),
          status: 'cancelled',
        })
        await logPayment(
          email,
          null,
          payload.data?.id?.toString(),
          'cancelled'
        )
        break

      default:
        console.log('Unhandled event:', eventName)
    }

    return res.status(200).json({ received: true })
  } catch (err) {
    console.error('Webhook handler error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
}