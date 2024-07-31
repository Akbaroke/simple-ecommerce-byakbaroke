import { Button } from '@/components/ui/button';
import { Spotlight } from '@/components/ui/Spotlight';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center mt-[20%] gap-5">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20 z-0" />
      <h2 className="text-7xl font-bold">404</h2>
      <div className="flex flex-col gap-2 items-center justify-center">
        <p>Don`t worry - the stock market hasn`t crashed.</p>
        <p>It`s just the page that`s run into problems.</p>
      </div>
      <Link href="/" className="mt-5">
        <Button>Back to Home Page</Button>
      </Link>
    </div>
  );
}
