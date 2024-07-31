'use client';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

export default function LoadingRouteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ProgressBar
        height="4px"
        color="hsl(var(--foreground))"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
}
