import {
  ClerkProvider,
} from '@clerk/nextjs'
import localFont from "next/font/local";
import './globals.css'
import { SidebarProvider } from '@/context/SidebarContext'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
