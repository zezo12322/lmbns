import NextAuth, { type DefaultSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/db"
import { compare, hash } from "bcryptjs"

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      branchId?: string | null
    } & DefaultSession["user"]
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const email = String(credentials.email)
        const password = String(credentials.password)

        const user = await prisma.user.findUnique({
          where: { email }
        })

        if (!user || !user.hashedPassword) {
          return null
        }

        const storedPassword = user.hashedPassword
        const isBcryptHash = /^\$2[aby]?\$/.test(storedPassword)

        let isValidPassword = false

        if (isBcryptHash) {
          isValidPassword = await compare(password, storedPassword)
        } else {
          // Legacy compatibility path for old plaintext records.
          // If valid, auto-upgrade in-place to bcrypt hash.
          isValidPassword = storedPassword === password

          if (isValidPassword) {
            try {
              const upgradedHash = await hash(password, 12)
              await prisma.user.update({
                where: { id: user.id },
                data: { hashedPassword: upgradedHash },
              })
            } catch (error) {
              console.error("Failed to upgrade legacy plaintext password:", error)
            }
          }
        }

        if (!isValidPassword) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          branchId: user.branchId,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = user.id
        token.branchId = (user as any).branchId
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
        session.user.branchId = token.branchId as string | null
      }
      return session
    }
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: '/login',
  }
})
