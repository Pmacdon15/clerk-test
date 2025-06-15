import { clerkClient, clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isOrgRoute = createRouteMatcher(['/(.*)'])
const isProtectedRoute = createRouteMatcher(['/protected(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { has, orgId, userId } = await auth()
  console.log(userId)
  if (isProtectedRoute(req) && !userId) {
    const url = req.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  if (isOrgRoute(req)) {

    if (orgId) {
      // Check which plan the org has and set appropriate limit
      if (has({ plan: 'basic_10_people_org' })) {
        // Set limit for basic plan (e.g., 10 users)
        const clerk = await clerkClient()
        await clerk.organizations.updateOrganization(orgId, {
          maxAllowedMemberships: 10
        })
      }
      else if (has({ plan: 'pro_25_people_org' })) {
        // Set limit for pro plan (e.g., 25 users)
        const clerk = await clerkClient()
        await clerk.organizations.updateOrganization(orgId, {
          maxAllowedMemberships: 25
        })
      }
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/(protected)(.*)',
  ],
}