import { hc } from "hono/client"
import { App } from "opencontrol"
import { createSignal } from "solid-js"

export const [password, setPassword] = createSignal()
// Get the base endpoint from the env var or empty string if undefined
const baseEndpoint = import.meta.env.VITE_OPENCONTROL_ENDPOINT || ""

// Append your hardcoded stage segment to the URL here
const fullEndpoint = `${baseEndpoint}/r389153`
export const client = hc<App>(fullEndpoint, {
  async fetch(...args: Parameters<typeof fetch>): Promise<Response> {
    const [input, init] = args
    const request = input instanceof Request ? input : new Request(input, init)

    // Only add authorization header if password is set
    if (password()) {
      const headers = new Headers(request.headers)
      headers.set("authorization", `Bearer ${password()}`)
      return fetch(
        new Request(request, {
          ...init,
          headers,
        }),
      )
    }

    // Otherwise, just pass through the request without auth
    return fetch(request, init)
  },
})
