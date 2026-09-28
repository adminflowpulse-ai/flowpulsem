import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Wallet o Demo Account",
      credentials: {
        username: { label: "Username (fan/dj)", type: "text", placeholder: "dj" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (credentials?.username === 'dj') {
          return { id: "1", name: "FlowPulse DJ", email: "dj@flowpulse.io", role: "DJ" }
        }
        if (credentials?.username === 'fan') {
          return { id: "2", name: "Super Fan", email: "fan@flowpulse.io", role: "FAN" }
        }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role
      }
      return session
    }
  },
  pages: {
    signIn: '/login', // se vogliamo fare una pagina custom
  }
})

export { handler as GET, handler as POST }
