'use client';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useTransition } from 'react';
import { Search } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Image from 'next/image';
import Link from 'next/link';
import moment from 'moment';
import { Input } from '@/components/ui/input';
import DialogConfirm from '@/components/molecules/DialogConfirm';
import { IoTrashOutline } from 'react-icons/io5';
import { FaPen } from 'react-icons/fa6';
import { useCurrentToken } from '@/hooks/use-current-token';
import Notify from '@/components/molecules/Notify';
import { UserModel } from '@/interfaces/user';
import { deleteUser, getUsers } from '@/service/user';
import LazyLoad from 'react-lazy-load';

export default function UserPage() {
  const token = useCurrentToken();
  const [isPending, startTransition] = useTransition();
  const [users, setUsers] = useState<UserModel[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserModel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const itemsPerPage = 10;

  const fetchUsers = async () => {
    if (!token?.token) return;
    const response = await getUsers(token?.token);
    setUsers(response ?? []);
    setFilteredUsers(response ?? []);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle search by name
  useEffect(() => {
    const searchResults = users.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(searchResults);
    setCurrentPage(1);
  }, [searchQuery, users]);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < filteredUsers.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleDeleteUser = async (id: string) => {
    startTransition(() => {
      if (token?.token) {
        Notify({
          type: 'loading',
          message: 'Deleting user...',
          id: 'delete-user-' + id,
        });
        deleteUser(token.token, id).then((res) => {
          if (res.error) {
            Notify({
              type: 'error',
              message: res.error,
              id: 'delete-user-' + id,
            });
          }
          if (res.success) {
            Notify({
              type: 'success',
              message: res.success,
              id: 'delete-user-' + id,
            });
            fetchUsers();
          }
        });
      }
    });
  };

  return (
    <div>
      <div className="relative mb-3">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full appearance-none bg-background pl-8 shadow-none"
        />
      </div>
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Customer Account</CardTitle>
          <CardDescription>Manage your users.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">
                  Updated At
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user, index) => (
                <TableRow key={index}>
                  <TableCell className="hidden sm:table-cell">
                    <LazyLoad className="w-full">
                      <Image
                        alt="user image"
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={user.imgUrl}
                        width="64"
                      />
                    </LazyLoad>
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {moment(user.updatedAt).format('DD MMM YYYY - HH:mm')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-5 justify-center">
                      <Link href={`/admin/customer/${user.id}`}>
                        <Button size="icon" variant="ghost" className="w-7 h-7">
                          <FaPen size={18} className="text-blue-500" />
                        </Button>
                      </Link>
                      <DialogConfirm
                        title="Delete User"
                        handleConfirm={() =>
                          handleDeleteUser(user.id as string)
                        }
                        dialogText={`Are you sure you want to delete this user "${user.name}" ?`}>
                        <Button size="icon" variant="ghost" className="w-7 h-7">
                          <IoTrashOutline size={18} className="text-red-500" />
                        </Button>
                      </DialogConfirm>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong>-
            <strong>
              {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
            </strong>{' '}
            of <strong>{filteredUsers.length}</strong> users
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrevPage}
              disabled={currentPage === 1}>
              Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleNextPage}
              disabled={currentPage * itemsPerPage >= filteredUsers.length}>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
