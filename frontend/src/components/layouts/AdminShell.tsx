'use client';

import Link from 'next/link';
import {
  Bell,
  Home,
  LineChart,
  LogIn,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { usePathname, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import getInitials from '@/lib/initials-name';
import { useCurrentUser } from '@/hooks/use-current-user';
import { signOut } from 'next-auth/react';
import { ModeToggle } from '../molecules/ModeToggle';
import { LinkData } from '@/interfaces/props';
import { cn } from '@/lib/utils';

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();
  const isActivePage = (href: string) => pathname === href;

  const navLinkData: LinkData[] = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: Home,
    },
    {
      label: 'Orders',
      href: '/admin/order',
      icon: ShoppingCart,
    },
    {
      label: 'Products',
      href: '/admin/product',
      icon: Package,
    },
    {
      label: 'Customers',
      href: '/admin/customer',
      icon: Users,
    },
  ];

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted md:block">
        <div className="flex h-full max-h-screen flex-col gap-2 sticky top-0">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className=""></span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navLinkData.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                    {
                      'bg-background text-primary font-medium': isActivePage(
                        link.href
                      ),
                    }
                  )}>
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col relative">
        <header className="flex h-14 items-center gap-4 border-b bg-muted px-4 lg:h-[60px] lg:px-6 sticky top-0 z-50">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-semibold w-max mb-5">
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                {navLinkData.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className={cn(
                      'mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground',
                      {
                        'bg-muted text-foreground': isActivePage(link.href),
                      }
                    )}>
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <ModeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full">
                  <Avatar>
                    <AvatarImage src={user?.imgUrl} alt="avatar" />
                    <AvatarFallback>
                      {getInitials(user?.name!).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <div className="p-3 flex flex-col items-center justify-center text-center gap-3">
                  <Avatar className="w-11 h-11">
                    <AvatarImage src={user?.imgUrl} alt="avatar" />
                    <AvatarFallback>
                      {getInitials(user?.name!).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="line-clamp-1 text-sm">{user?.name}</h1>
                    <p className="line-clamp-1 text-xs text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => router.push('/profile')}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => router.push('/')}>
                  Landing Page
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => signOut()}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              onClick={() => router.push('/auth')}
              className="flex items-center justify-center gap-2">
              <LogIn size={16} />
              Login
            </Button>
          )}
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
