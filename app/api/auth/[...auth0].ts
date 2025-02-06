import { handleAuth, handleLogin } from "@auth0/nextjs-auth0"

export const GET = handleAuth({
  login: handleLogin({
    authorizationParams: {
      audience: process.env.AUTH0_AUDIENCE, // Make sure this is set in your .env.local
      // Add any other parameters you need
    },
  }),
})
export const POST = handleAuth()

