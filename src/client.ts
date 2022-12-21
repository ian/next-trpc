import fetch from "cross-fetch"
import superjson from "superjson"
import { createTRPCProxyClient, httpBatchLink, HTTPHeaders } from "@trpc/client"
import { AnyRouter } from "@trpc/server"
import { getBaseUrl } from "./helpers"

type Opts = {
  url?: string
  headers?: HTTPHeaders | (() => HTTPHeaders | Promise<HTTPHeaders>)
}

export function createClient<Router extends AnyRouter>(opts: Opts = {}) {
  const { headers, url = `${getBaseUrl()}/api/trpc` } = opts

  return createTRPCProxyClient<Router>({
    transformer: superjson,
    links: [
      httpBatchLink({
        fetch,
        url,
        headers
      })
    ]
  })
}

export * from "@trpc/server"
