import { QueryClientProviderProps } from "@tanstack/react-query"
import { httpBatchLink, HTTPHeaders } from "@trpc/client"
import { createTRPCNext } from "@trpc/next"
import { AnyRouter } from "@trpc/server"
import { NextPageContext } from "next"
import { getBaseUrl } from "./helpers"

export type {
  DecorateProcedure,
  DecoratedProcedureRecord
} from "@trpc/react-query/shared"
export type { CreateTRPCReactQueryClientConfig } from "@trpc/react-query/shared"
export * from "@trpc/server"

type Opts = {
  url?: string
  headers?: HTTPHeaders | (() => HTTPHeaders | Promise<HTTPHeaders>)

  /**
   * @link https://trpc.io/docs/ssr
   **/
  ssr?: boolean

  /**
   * Example:
   * { defaultOptions: { queries: { staleTime: 60 } } }
   *
   * @link https://react-query-v3.tanstack.com/reference/QueryClient
   **/
  queryClientConfig?: QueryClientProviderProps
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

export function createClient<Router extends AnyRouter>(opts: Opts = {}) {
  const {
    headers,
    url = `${getBaseUrl()}/api/trpc`,
    ssr = true,
    queryClientConfig
  } = opts

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

export * from "@trpc/server"
export * from "@trpc/react-query/shared"
