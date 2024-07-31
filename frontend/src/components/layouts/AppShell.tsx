'use client';

import { authRoutes } from '@/routes';
import { usePathname } from 'next/navigation';
import UserShell from './UserShell';
import AdminShell from './AdminShell';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAuthRoute = authRoutes.includes(pathname);
  const isAdminRoute = pathname.startsWith('/admin');

  return isAuthRoute ? (
    children
  ) : isAdminRoute ? (
    <AdminShell>{children}</AdminShell>
  ) : (
    <UserShell>{children}</UserShell>
  );
}
