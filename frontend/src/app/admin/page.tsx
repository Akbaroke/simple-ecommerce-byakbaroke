'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentToken } from '@/hooks/use-current-token';
import { formatRupiah } from '@/lib/formatCurrency';
import { getProducts } from '@/service/product';
import { getUsers } from '@/service/user';
import { Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { BsBox } from 'react-icons/bs';

export default function AdminPage() {
  const token = useCurrentToken();
  const [totalProduct, setTotalProduct] = useState(0);
  const [totalUser, setTotalUser] = useState(0);

  useEffect(() => {
    getProducts().then((res) => {
      if (res) {
        setTotalProduct(res.length);
      }
    });
    if (!token?.token) return;
    getUsers(token?.token).then((res) => {
      if (res) {
        setTotalUser(res.length);
      }
    });
  }, [token?.token]);

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard Admin</h1>
      </div>
      <div className="flex gap-5">
        <Card x-chunk="dashboard-01-chunk-0" className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Product</CardTitle>
            <BsBox className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex gap-3 item-center">
              <BsBox />
              <p> {formatRupiah(totalProduct)}</p>
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-1" className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex gap-3 item-center">
              <Users />
              <p>{formatRupiah(totalUser)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
