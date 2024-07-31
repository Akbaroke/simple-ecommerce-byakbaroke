import { LucideProps } from 'lucide-react';

export interface LinkData {
  label: string;
  href: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'>>;
}
