# next-trpc

A drop-in version of [tRPC](https://github.com/trpc/trpc) + [Next.js](https://github.com/vercel/next.js).

If you haven't seen tRPC before, it's an excellent Next.js-native solution vs a traditional REST or GraphQL interface.

Fast, easy and fully-typed - it's hard to beat for an all-Javascript stack.

## Quickstart

Install next-trpc and dependencies:

```sh
npm i next-trpc
```

Create the tRPC endpoint at `./pages/api/trpc/[trpc].ts`

```ts
import { createInstance, nextTRPC } from "next-trpc"

const trpc = createInstance()

export const router = trpc.router({
  hello: trpc.procedure
    .input(
      object({
        name: string().required()
      })
    )
    .query(async ({ input }) => {
      return `Hello, ${input.name}`
    })
})

// this needs to be exported so your client can extend type defs
export type Router = typeof router

export default nextTRPC({
  router
})
```

Use tRPC in your pages/components:

```tsx
import { Router } from "../pages/api/trpc/[trpc]"
import { createClient, withTRPC } from "next-trpc/client"

const client = createClient<Router>()

const Component = () => {
  const { data: msg } = client.hello.useQuery({
    name: "Ian H"
  })

  return <div>{msg}</div>
}

export default withTRPC(Component)
```

And you're done! Read more on how to use tRPC at [https://trpc.io/](https://trpc.io/).

# Examples

## With Authentication

Add the context handler to your API endpoint in `./pages/api/trpc/[trpc].ts`

```ts
import { nextTRPC } from "next-trpc"

export type Context = {
  auth?: {
    email: string
  }
}

export const context = async ({ req }): Promise<Context> => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1]
    const auth = // do something with your auth header
    return {
      auth
    }
  }

  return {}
}

const trpc = createInstance<Context>()

export const router = trpc.router({
  hello: trpc.procedure
    .input(
      object({
        name: string().required()
      })
    )
    .query(async ({ input }) => {
      return `Hello, ${input.name}`
    })
})

export default nextTRPC({
  createContext: context,
  router
})
```

Then set the Authorization header in your client:

```ts
import { createClient } from "next-trpc/client"
import { Router } from "../pages/api/trpc/[trpc]"
import { getToken } from "../your/token/utils"

const client = createClient<Router>({
  headers: () => {
    const token = getToken()
    return {
      Authorization: token ? `Bearer ${token}` : ""
    }
  }
})
```

## Split routers into multiple files

You can use the exported `{ trpc }` however you would with a standalone tRPC setup:

```ts
const hello = trpc.router({
  get: trpc.procedure
    .input(
      object({
        name: string().required()
      })
    )
    .query(async ({ input }) => {
      return `Hello, ${input.name}`
    })
})

const another = trpc.router({
  get: trpc.procedure.query(async ({ input }) => {
    return `I'm another endpoint`
  })
})

const router = trpc.router({
  hello,
  another
})

export default nextTRPC({
  router
})
```
