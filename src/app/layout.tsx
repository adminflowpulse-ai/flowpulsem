import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Link from 'next/link';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlowPulseM - La Nuova Era dell'Industria Musicale",
  description: "La prima piattaforma Web3 che connette i DJ ai loro super-fan attraverso NFT musicali, royalty condivise e live room. Partecipa alla rivoluzione musicale decentralizzata.",
  openGraph: {
    title: "FlowPulseM - La Nuova Era dell'Industria Musicale",
    description: "La prima piattaforma Web3 che connette DJ e Fan tramite NFT musicali e royalty.",
    images: ['/logo.png'],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={${geistSans.variable} }>
        <Providers>
          {children}
          
          <footer style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '40px 20px', textAlign: 'center', backgroundColor: '#0a0a0a', color: 'var(--text-muted)' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
                <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</a>
                <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Cookie Policy</a>
                <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Termini di Servizio</a>
                <a href="mailto:info@flowpulsemusic.com" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Contattaci</a>
              </div>
              <p style={{ fontSize: '0.9rem' }}>© 2026 FlowPulseM. Tutti i diritti riservati.</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
