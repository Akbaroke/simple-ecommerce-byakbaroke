import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import LoadingRouteProvider from '@/components/molecules/LoadingBarProgress';
import Providers from '@/components/session-provider';
import AppShell from '@/components/layouts/AppShell';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Indo Phone',
  description: 'Indo Phone - The best phone store in Indonesia',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <LoadingRouteProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange>
              <Toaster
                richColors
                position="top-center"
                expand={true}
                closeButton
                duration={2000}
              />
              <AppShell>{children}</AppShell>
            </ThemeProvider>
          </LoadingRouteProvider>
        </Providers>
      </body>
    </html>
  );
}
