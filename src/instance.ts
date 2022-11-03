import { initTRPC } from "@trpc/server"
import {
  type RootConfigTypes,
  type RuntimeConfig,
  type CreateRootConfigTypes,
  type RootConfig,
  type AnyRootConfig
} from "@trpc/server/dist/core/internals/config"

export function createInstance<Context extends Record<string, any>>() {
  return initTRPC.context<Context>().create({
    errorFormatter({ error, shape }) {
      console.error(error)
      return shape
    }
  })
}

export {
  type RootConfigTypes,
  type RuntimeConfig,
  type CreateRootConfigTypes,
  type RootConfig,
  type AnyRootConfig
}

// export * from "@trpc/server"
