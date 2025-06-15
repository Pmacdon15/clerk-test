import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data
    const eventType = evt.type
    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
    console.log('Webhook payload:', evt.data)

    // You need to specify which organization to update
    // This example assumes you have the organization ID from the webhook data
    if (evt.type === 'organization.created' || evt.type === 'organization.updated') {
      const clerk = await clerkClient();
      await clerk.organizations.updateOrganization(evt.data.id, { 
        maxAllowedMemberships: 10 
      })
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}