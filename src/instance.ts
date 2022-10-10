import { initTRPC } from "@trpc/server"

export const trpc = initTRPC.context().create({
  errorFormatter({ error, shape }) {
    console.error(error)
    return shape
  }
})
