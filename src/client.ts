import { QueryClientProviderProps } from "@tanstack/react-query"
import { httpBatchLink, HTTPHeaders } from "@trpc/client"
import { createTRPCNext } from "@trpc/next"
import { NextPageContext } from "next"

function getBaseUrl() {
  if (typeof window !== "undefined")
    // browser should use relative path
    return ""
  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`
  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`
  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export interface SSRContext extends NextPageContext {
  /**
   * Set HTTP Status code
   * @example
   * const utils = trpc.useContext();
   * if (utils.ssrContext) {
   *   utils.ssrContext.status = 404;
   * }
   */
  status?: number
}

type Opts = {
  /**
   * If you want to use SSR, you need to use the server's full URL
   * @link https://trpc.io/docs/ssr
   **/
  url?: string
  /**
   * @link https://trpc.io/docs/ssr
   **/
  ssr?: boolean
  headers?: HTTPHeaders | (() => HTTPHeaders | Promise<HTTPHeaders>)
  /**
   * Example:
   * { defaultOptions: { queries: { staleTime: 60 } } }
   *
   * @link https://react-query-v3.tanstack.com/reference/QueryClient
   **/

  queryClientConfig?: QueryClientProviderProps
}

export function createClient<Router>(opts: Opts = {}) {
  const {
    headers,
    url = `${getBaseUrl()}/api/trpc`,
    ssr = true,
    queryClientConfig
  } = opts

  // @ts-ignore TODO fix - ts complains about this Router line but it works in nextjs.
  return createTRPCNext<Router, SSRContext>({
    config({ ctx }) {
      return {
        links: [
          httpBatchLink({
            url,
            headers
          })
        ],
        queryClientConfig
      }
    },
    ssr
  })
}
