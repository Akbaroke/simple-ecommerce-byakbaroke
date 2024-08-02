import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import LoadingRouteProvider from '@/components/molecules/LoadingBarProgress';
import Providers from '@/components/session-provider';
import AppShell from '@/components/layouts/AppShell';
import { Toaster } from 'sonner';
import { ReduxProvider } from '@/components/layouts/ReduxProvider';

export const metadata: Metadata = {
  title: 'Simple Ecommerce',
  description: 'The best ecommerce store in Indonesia',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxProvider>
      <html lang="en">
        <body className="min-h-screen bg-background font-sans antialiased">
          <Providers>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange>
              <LoadingRouteProvider>
                <Toaster
                  richColors
                  position="top-center"
                  expand={true}
                  closeButton
                  duration={2000}
                />
                <AppShell>{children}</AppShell>
              </LoadingRouteProvider>
            </ThemeProvider>
          </Providers>
        </body>
      </html>
    </ReduxProvider>
  );
}
