"use client"

import { ThirdwebProvider } from "@/utils/thirdweb/thirdweb"
import { ApolloProvider } from "@apollo/client"
import { apollo } from "@/lib/apollo"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider>
      <ApolloProvider client={apollo}>
        {children}
      </ApolloProvider>
    </ThirdwebProvider>
  )
}