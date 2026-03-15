import NextAuth from "next-auth"
import "next-auth/jwt"
import Credentials from "next-auth/providers/credentials"
import { api } from "@/lib/api"
import type { AuthResponse, User } from "@/features/auth"

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          return null
        }

        try {
          const response = await api.post<AuthResponse>(
            "/auth/login",
            {
              identifier: credentials.identifier,
              password: credentials.password,
            },
            { skipAuth: true }
          )

          if (response.success && response.data) {
            const userData = response.data.user as User & {
              image_url?: string | null
            }
            return {
              id: String(response.data.user.id),
              name: response.data.user.name,
              email: response.data.user.email,
              token: response.data.token,
              image_url: userData.image_url ?? null,
              user_permissions: userData.user_permissions || [],
            }
          }

          return null
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.token = user.token
        token.id = user.id
        token.user_permissions = user.user_permissions
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.token = token.token as string
        session.user.user_permissions =
          (token.user_permissions as string[]) || []
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
})

declare module "next-auth" {
  interface User {
    token?: string
    image_url?: string | null
    user_permissions?: string[]
  }

  interface Session {
    user: {
      id: string
      name: string
      email: string
      image_url?: string | null
      token?: string
      user_permissions: string[]
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user_permissions?: string[]
  }
}
