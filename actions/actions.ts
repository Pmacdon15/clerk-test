'use server'
import { clerkClient } from "@clerk/nextjs/server";

export async function testOrgSizeChange() {
    const clerk = await clerkClient();
    await clerk.organizations.updateOrganization("org_2yWRsnEJQysm938SY4FHeoWxQgX", {
        maxAllowedMemberships: 10
    })
}