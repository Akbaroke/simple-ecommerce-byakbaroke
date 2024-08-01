'use client';

import { authRoutes } from '@/routes';
import { usePathname } from 'next/navigation';
import UserShell from './UserShell';
import AdminShell from './AdminShell';
import { useCurrentToken } from '@/hooks/use-current-token';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { restoreCart } from '@/redux/slices/cartSlice';
import { getCart } from '@/service/cart';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const token = useCurrentToken();
  const dispatch = useDispatch();

  const isAuthRoute = authRoutes.includes(pathname);
  const isAdminRoute = pathname.startsWith('/admin');

  useEffect(() => {
    if (token) {
      getCart(token.token).then((response) => {
        if (response) {
          dispatch(restoreCart(response));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return isAuthRoute ? (
    children
  ) : isAdminRoute ? (
    <AdminShell>{children}</AdminShell>
  ) : (
    <UserShell>{children}</UserShell>
  );
}
