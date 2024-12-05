'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const supabase = createClientComponentClient();

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: any, session: any) => {
        setUser(session?.user ?? null);
      }
    );


    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);


  return (
    <div>
      {user ? (
        <p>Welcome {user.email}</p>
      ) : (
        <p>Please log in to access the protected content.</p>
      )}
    </div>
  );
}
