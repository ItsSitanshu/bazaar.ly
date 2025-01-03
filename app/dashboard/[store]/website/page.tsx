'use client';

import React, { useEffect, useState } from 'react';

import DashboardSideBar from "@/app/components/DashboardSideBar";
import Image from "next/image";
import { fetchStores } from '@/app/lib/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import Link from 'next/link';
import Sidebar from '@/app/components/website/Sidebar';
import DraggableEditor from '@/app/components/website/DraggableEditor';

const supabase = createClientComponentClient();

export default function WebsitePage({ params }: { params: Promise<{ store: string }> }) {
  const param = React.use(params);
  const { store } = param;

  const [user, setUser] = useState<any>(null);
  const [_store, setStore] = useState<any>(null);
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        fetchStores(supabase, session?.user?.id as string, setStore);
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

  useEffect(() => {
    if (user) {
      fetchStores(supabase, user.id as string, setStore);
    } else {
      setStore(null);
    }
  }, [user]);

  


  return (
    <>
    { _store ? (
    <div className="flex h-screen w-screen justify-start items-center">
      <Sidebar/>
      <DraggableEditor/>
    </div>
    ) : (<></>)}
    </>
  );
}