"use client"

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

export const apollo = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_SUBGRAPH_URL,
  }),
  cache: new InMemoryCache(),
})
