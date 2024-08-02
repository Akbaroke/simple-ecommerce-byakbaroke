import Link from 'next/link';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-svh grid place-items-center">
      <div className="flex items-center gap-8 flex-col px-5">
        <Link href="/" className="text-xl font-semibold">
          Simple Ecommerce
        </Link>
        {children}
      </div>
    </div>
  );
}
