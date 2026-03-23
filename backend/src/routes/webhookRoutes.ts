import { Router, Request, Response } from 'express';

const router = Router();

/**
 * RevenueCat server-to-server webhook endpoint.
 * RevenueCat sends subscription events here so the backend can update user records.
 *
 * The webhook secret should be configured in RevenueCat dashboard to match
 * the REVENUECAT_WEBHOOK_SECRET environment variable.
 *
 * Docs: https://www.revenuecat.com/docs/integrations/webhooks
 */

interface RevenueCatEvent {
  type: string;
  app_user_id: string;
  product_id: string;
  event_timestamp_ms: number;
  expiration_at_ms?: number;
  store: string;
  environment: string;
  is_family_share?: boolean;
  original_app_user_id: string;
  period_type?: string;
  purchased_at_ms?: number;
  takehome_percentage?: number;
  price?: number;
  currency?: string;
}

interface RevenueCatWebhookBody {
  api_version: string;
  event: RevenueCatEvent;
}

// Supported RevenueCat event types
const SUBSCRIPTION_EVENTS = [
  'INITIAL_PURCHASE',
  'RENEWAL',
  'CANCELLATION',
  'UNCANCELLATION',
  'NON_RENEWING_PURCHASE',
  'SUBSCRIPTION_PAUSED',
  'EXPIRATION',
  'BILLING_ISSUE',
  'PRODUCT_CHANGE',
] as const;

/**
 * POST /api/v1/webhooks/revenuecat
 *
 * Handles RevenueCat subscription lifecycle events.
 */
router.post('/revenuecat', async (req: Request, res: Response) => {
  try {
    // Verify webhook authenticity via shared secret
    const webhookSecret = process.env.REVENUECAT_WEBHOOK_SECRET;
    const authHeader = req.headers['authorization'];

    if (webhookSecret && authHeader !== `Bearer ${webhookSecret}`) {
      console.warn('[Webhook] Unauthorized RevenueCat webhook attempt');
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const body = req.body as RevenueCatWebhookBody;
    const event = body.event;

    if (!event || !event.type) {
      res.status(400).json({ error: 'Invalid webhook payload' });
      return;
    }

    console.log(`[Webhook] RevenueCat event: ${event.type} for user ${event.app_user_id}`);

    switch (event.type) {
      case 'INITIAL_PURCHASE':
      case 'RENEWAL':
      case 'NON_RENEWING_PURCHASE':
      case 'UNCANCELLATION':
        await handleSubscriptionActive(event);
        break;

      case 'CANCELLATION':
      case 'EXPIRATION':
        await handleSubscriptionEnded(event);
        break;

      case 'BILLING_ISSUE':
        await handleBillingIssue(event);
        break;

      case 'PRODUCT_CHANGE':
        await handleProductChange(event);
        break;

      case 'SUBSCRIPTION_PAUSED':
        await handleSubscriptionPaused(event);
        break;

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    // Always return 200 to acknowledge receipt
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('[Webhook] Error processing RevenueCat webhook:', error);
    // Still return 200 to prevent retries on non-transient errors
    res.status(200).json({ received: true, error: 'Processing error' });
  }
});

/**
 * Stripe webhook endpoint for direct Stripe events (if needed).
 * Uses raw body parsing for signature verification.
 */
router.post('/stripe', async (req: Request, res: Response) => {
  try {
    const sig = req.headers['stripe-signature'];
    const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !stripeWebhookSecret) {
      console.warn('[Webhook] Missing Stripe signature or webhook secret');
      res.status(400).json({ error: 'Missing signature' });
      return;
    }

    // NOTE: For production, you should use the Stripe SDK to verify the signature:
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const event = stripe.webhooks.constructEvent(req.body, sig, stripeWebhookSecret);
    //
    // For now, we log the event type for monitoring:
    const event = req.body;
    console.log(`[Webhook] Stripe event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed':
        console.log('[Webhook] Stripe checkout completed:', event.data?.object?.id);
        break;

      case 'customer.subscription.updated':
        console.log('[Webhook] Stripe subscription updated:', event.data?.object?.id);
        break;

      case 'customer.subscription.deleted':
        console.log('[Webhook] Stripe subscription deleted:', event.data?.object?.id);
        break;

      case 'invoice.payment_failed':
        console.log('[Webhook] Stripe payment failed:', event.data?.object?.id);
        break;

      default:
        console.log(`[Webhook] Unhandled Stripe event: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('[Webhook] Stripe webhook error:', error);
    res.status(400).json({ error: 'Webhook processing failed' });
  }
});

// ---------- Handler Functions ----------

async function handleSubscriptionActive(event: RevenueCatEvent): Promise<void> {
  const userId = event.app_user_id;
  const productId = event.product_id;
  const expiresAt = event.expiration_at_ms
    ? new Date(event.expiration_at_ms).toISOString()
    : null;

  console.log(`[Webhook] Activating subscription for user ${userId}, product: ${productId}`);

  // TODO: Update user record in database
  // await db.query(
  //   'UPDATE users SET subscription_status = $1, subscription_product = $2, subscription_expires_at = $3 WHERE revenuecat_id = $4',
  //   ['active', productId, expiresAt, userId]
  // );
}

async function handleSubscriptionEnded(event: RevenueCatEvent): Promise<void> {
  const userId = event.app_user_id;

  console.log(`[Webhook] Subscription ended for user ${userId}, type: ${event.type}`);

  // TODO: Update user record in database
  // await db.query(
  //   'UPDATE users SET subscription_status = $1 WHERE revenuecat_id = $2',
  //   ['expired', userId]
  // );
}

async function handleBillingIssue(event: RevenueCatEvent): Promise<void> {
  const userId = event.app_user_id;

  console.log(`[Webhook] Billing issue for user ${userId}`);

  // TODO: Send user a notification about the billing issue
  // TODO: Update user record to grace period status
}

async function handleProductChange(event: RevenueCatEvent): Promise<void> {
  const userId = event.app_user_id;
  const newProduct = event.product_id;

  console.log(`[Webhook] Product change for user ${userId}, new product: ${newProduct}`);

  // TODO: Update user's subscription tier in database
}

async function handleSubscriptionPaused(event: RevenueCatEvent): Promise<void> {
  const userId = event.app_user_id;

  console.log(`[Webhook] Subscription paused for user ${userId}`);

  // TODO: Update user record to paused status
}

export default router;
