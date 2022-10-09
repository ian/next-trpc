import * as trpcNext from "@trpc/server/adapters/next"

type Opts = Parameters<typeof trpcNext.createNextApiHandler>[0]

export function nextTRPC(opts: Opts) {
  const { router, createContext } = opts
  return trpcNext.createNextApiHandler({
    router,
    createContext
  })
}

export { TRPCError } from "@trpc/server"
