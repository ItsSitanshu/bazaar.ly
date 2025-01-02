'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardSideBar from './components/DashboardSideBar';

const supabase = createClientComponentClient();

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error: any) {
        console.error('Error fetching session:', error.message);
      }
    };

    fetchSession();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    
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
        </div>
      )}
    </div>
  );
}
