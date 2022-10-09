import { initTRPC } from "@trpc/server"

export const trpc = initTRPC.context().create({
  // transformer: superjson,
  errorFormatter({ error, shape }) {
    console.error(error)
    return shape
  }
})
