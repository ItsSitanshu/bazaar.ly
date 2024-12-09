'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardSideBar from './components/DashboardSideBar';

const supabaseAuth = createClientComponentClient();

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabaseAuth.auth.getSession();
      setUser(session?.user ?? null);
    };

    fetchSession();

    const { data: authListener } = supabaseAuth.auth.onAuthStateChange(
      (event: any, session: any) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);


  return (
    <div className='flex w-screen h-screen'>
      {user ? (
        <p>Welcome {user.email}</p>
      ) : (
        <div className='flex w-screen h-screen'>
        <DashboardSideBar name={user.id}/>
        </div>
      )}
    </div>
  );
}
