import * as trpcNext from "@trpc/server/adapters/next"

type Opts = Parameters<typeof trpcNext.createNextApiHandler>[0]

export function nextTRPC(opts: Opts) {
  return trpcNext.createNextApiHandler(opts)
}

export { TRPCError } from "@trpc/server"
