'use client';
import Link from 'next/link';
import { LogIn, Package2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ModeToggle } from '../molecules/ModeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import getInitials from '@/lib/initials-name';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useRouter } from 'next-nprogress-bar';
import { signOut } from 'next-auth/react';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { FaRegHeart } from 'react-icons/fa';
import TooltipFrag from '../molecules/TooltipFrag';
import { Badge } from '../ui/badge';
import { useDispatch, useSelector } from 'react-redux';
import { StoreModel } from '@/interfaces/redux-model';
import { usePathname } from 'next/navigation';
import { setSearchSlice } from '@/redux/slices/searchSlice';
import { useCurrentRole } from '@/hooks/use-current-role';

export default function UserShell({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const cart = useSelector((state: StoreModel) => state.cart);
  const favorite = useSelector((state: StoreModel) => state.favorite);
  const search = useSelector((state: StoreModel) => state.search);
  const user = useCurrentUser();
  const role = useCurrentRole();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-40">
        <nav className="flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <Package2 className="h-6 w-6" />
            <span className="sr-only"></span>
          </Link>
        </nav>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            {['/', '/favorite'].includes(pathname) && (
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                  value={search.value}
                  onChange={(e) => {
                    dispatch(setSearchSlice(e.target.value));
                  }}
                />
              </div>
            )}
          </form>
          <TooltipFrag content="View Favorites">
            <Button
              size="icon"
              variant="ghost"
              className="relative"
              onClick={() => router.push('/favorite')}>
              <FaRegHeart size={20} />
              {favorite.total_item > 0 && (
                <Badge
                  className="px-1.5 py-0 text-[12px] absolute top-0 right-0"
                  variant="destructive">
                  {favorite.total_item === 100 ? '99+' : favorite.total_item}
                </Badge>
              )}
            </Button>
          </TooltipFrag>
          <TooltipFrag content="View Cart">
            <Button
              size="icon"
              variant="ghost"
              className="relative"
              onClick={() => router.push('/cart')}>
              <MdOutlineShoppingCart size={20} />
              {cart.total_item > 0 && (
                <Badge
                  className="px-1.5 py-0 text-[12px] absolute top-0 right-0"
                  variant="destructive">
                  {cart.total_item === 100 ? '99+' : cart.total_item}
                </Badge>
              )}
            </Button>
          </TooltipFrag>
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
                {role === 'ADMIN' && (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => router.push('/admin')}>
                    Dashboard Admin
                  </DropdownMenuItem>
                )}
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
        </div>
      </header>
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        {children}
      </main>
    </div>
  );
}
