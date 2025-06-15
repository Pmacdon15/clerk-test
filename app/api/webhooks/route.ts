import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req, {
      signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
    })

    console.log(`Received webhook with event type: ${evt.type}`)
    console.log('Webhook payload:', evt.data)

    if (evt.type === 'session.created') {
      // Get user ID from session data
      const userId = evt.data.user_id
      
      if (userId) {
        const clerk = await clerkClient()
        
        // Fetch user's organization memberships
        const organizationMemberships = await clerk.users.getOrganizationMembershipList({
          userId: userId
        })
        
        // Get the organization ID from the first membership (or handle multiple orgs)
        if (organizationMemberships.data.length > 0) {
          const orgId = organizationMemberships.data[0].organization.id
          console.log('Organization ID:', orgId)
          
          // Now you can update the organization
          await clerk.organizations.updateOrganization(orgId, {
            maxAllowedMemberships: 10
          })
        }
      }
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}