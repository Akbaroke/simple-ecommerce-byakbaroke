import { useSession } from 'next-auth/react';

export const useCurrentToken = () => {
  const { data: session } = useSession();
  return session?.backendTokens;
};
