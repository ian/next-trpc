import { createTRPCProxyClient, httpBatchLink, HTTPHeaders } from "@trpc/client"
import { getBaseUrl } from "./helpers"

type Opts = {
  url?: string
  headers?: HTTPHeaders | (() => HTTPHeaders | Promise<HTTPHeaders>)
}

export function createClient<Router>(opts: Opts = {}) {
  const { headers, url = `${getBaseUrl()}/api/trpc` } = opts

  // @ts-ignore TODO fix - ts complains about this Router line but it works in nextjs.
  return createTRPCProxyClient<Router>({
    links: [
      httpBatchLink({
        url,
        headers
      })
    ]
  })
}
