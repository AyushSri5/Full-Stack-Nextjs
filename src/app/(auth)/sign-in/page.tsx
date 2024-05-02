'use client'
import { useSession, signIn, signOut } from "next-auth/react"
export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user} <br />
        <button onClick={() => signOut()}>Sign out</button>

      </>
    )
  }
  else
  return (
    <>
      Not signed in <br />
      <time dateTime="2016-10-25" suppressHydrationWarning />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}