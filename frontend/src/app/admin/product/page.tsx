'use client';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useTransition } from 'react';
import { ListFilter, MoreHorizontal, PlusCircle, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { deleteProduct, getProducts } from '@/service/product';
import { ProductModel } from '@/interfaces/product';
import { formatRupiah } from '@/lib/formatCurrency';
import Link from 'next/link';
import moment from 'moment';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import DialogConfirm from '@/components/molecules/DialogConfirm';
import { IoTrashOutline } from 'react-icons/io5';
import { FaPen } from 'react-icons/fa6';
import { useCurrentToken } from '@/hooks/use-current-token';
import Notify from '@/components/molecules/Notify';

export default function ProductPage() {
  const token = useCurrentToken();
  const [isPending, startTransition] = useTransition();
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductModel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterChecked, setFilterChecked] = useState('Updated At');

  const itemsPerPage = 10;

  const fetchProducts = async () => {
    const response = await getProducts();
    setProducts(response ?? []);
    setFilteredProducts(response ?? []);
  };

  useEffect(() => {
    fetchProducts();
    handleFilter(filterChecked);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle search by name
  useEffect(() => {
    const searchResults = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(searchResults);
    setCurrentPage(1);
  }, [searchQuery, products]);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < filteredProducts.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleFilter = (filterType: string) => {
    setFilterChecked(filterType);
    let sortedProducts = [...products];
    if (filterType === 'Updated At') {
      sortedProducts = sortedProducts.sort(
        (a, b) =>
          new Date(b.updatedAt as Date).getTime() -
          new Date(a.updatedAt as Date).getTime()
      );
    } else if (filterType === 'High price') {
      sortedProducts = sortedProducts.sort((a, b) => b.price - a.price);
    } else if (filterType === 'Low price') {
      sortedProducts = sortedProducts.sort((a, b) => a.price - b.price);
    }
    setFilteredProducts(sortedProducts);
    setCurrentPage(1);
  };

  const handleDeleteProduct = async (id: string) => {
    startTransition(() => {
      if (token?.token) {
        Notify({
          type: 'loading',
          message: 'Deleting product...',
          id: 'delete-product-' + id,
        });
        deleteProduct(token.token, id).then((res) => {
          if (res.error) {
            Notify({
              type: 'error',
              message: res.error,
              id: 'delete-product-' + id,
            });
          }
          if (res.success) {
            Notify({
              type: 'success',
              message: res.success,
              id: 'delete-product-' + id,
            });
            fetchProducts();
          }
        });
      }
    });
  };

  return products.length === 0 ? (
    <div
      className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
      x-chunk="dashboard-02-chunk-1">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">
          You have no products
        </h3>
        <p className="text-sm text-muted-foreground">
          You can start selling as soon as you add a product.
        </p>
        <Link href="/admin/product/add" className="mt-4">
          <Button>Add Product</Button>
        </Link>
      </div>
    </div>
  ) : (
    <div>
      <div className="justify-between mb-3 flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full appearance-none bg-background pl-8 shadow-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={filterChecked === 'Updated At'}
                onSelect={() => handleFilter('Updated At')}>
                Updated At
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filterChecked === 'High price'}
                onSelect={() => handleFilter('High price')}>
                High price
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filterChecked === 'Low price'}
                onSelect={() => handleFilter('Low price')}>
                Low price
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/admin/product/add">
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Product
              </span>
            </Button>
          </Link>
        </div>
      </div>
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>Manage your products.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="hidden md:table-cell">
                  Updated At
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.map((product, index) => (
                <TableRow key={index}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt="product image"
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={product.image}
                      width="64"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.brand}</Badge>
                  </TableCell>
                  <TableCell>Rp {formatRupiah(product.price)}</TableCell>
                  <TableCell
                    className={cn('font-medium', {
                      'text-red-500': product.stock === 0,
                    })}>
                    {formatRupiah(product.stock)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {moment(product.updatedAt).format('DD MMM YYYY - HH:mm')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-5 justify-center">
                      <Link href={`/admin/product/${product.id}`}>
                        <Button size="icon" variant="ghost" className="w-7 h-7">
                          <FaPen size={18} className="text-blue-500" />
                        </Button>
                      </Link>
                      <DialogConfirm
                        title="Delete Product"
                        handleConfirm={() =>
                          handleDeleteProduct(product.id as string)
                        }
                        dialogText={`Are you sure you want to delete this product "${product.name}" ?`}>
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
              {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
            </strong>{' '}
            of <strong>{filteredProducts.length}</strong> products
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
              disabled={currentPage * itemsPerPage >= filteredProducts.length}>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
