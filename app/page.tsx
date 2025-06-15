// import { OrganizationProfile } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
// import Image from "next/image";

export default async function Home() {
  const { userId, sessionClaims, has } = await auth()

  // Protect the route by checking if the user is signed in
  if (!userId) {
    return <div>Sign in to view this page</div>
  }

  // Get the Backend API User object when you need access to the user's information
  const user = await currentUser()
  console.log(sessionClaims)

  console.log("user has plan: ", has({ plan: 'Basic 10 people org' }))

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div>Welcome, {user?.firstName}!</div>
      {/* <CreateOrganization /> */}
      {/* <PricingTable routing="hash"/> */}
      {/* <UserProfile routing="hash"/>  */}

      {/* <OrganizationProfile  routing="hash"/> */}
    </div>
  );
}
