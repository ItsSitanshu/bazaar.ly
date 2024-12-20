'use client';

import React, { useEffect, useState } from 'react';

import DashboardSideBar from "@/app/components/DashboardSideBar";
import Image from "next/image";
import { fetchStores } from '@/app/lib/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import questionMark from '@/app/assets/images/question_mark.svg'

const supabase = createClientComponentClient();

export default function SettingsPage({ params }: { params: Promise<{ store: string }> }) {
  const param = React.use(params);
  const { store } = param;

  const [user, setUser] = useState<any>(null);
  const [_store, setStore] = useState<any>(null);

  const [hasChanged, setHasChanged] = useState<boolean>(true);

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

  const saveChanges = () => {

  }

  return (
    <>
    { _store ? (
    <div className="flex h-screen w-screen justify-start items-center">
      <DashboardSideBar shopName={store} currentPage="Settings" logoUrl={_store.logo_url} domain={_store.subdomain}/>
      <div className="flex flex-col w-full h-full justify-start items-center">
        <div className="flex w-full h-1/6 bg-stone-700/20"/>
        <div className="flex flex-row justify-between items-end w-full h-16 pl-[3em] pr-[3em]">
          <div className='flex flex-row justify-center items-center h-full'><div className="relative">
            <div className="flex justify-center items-center w-[12em] h-[12em] p-1 rounded-full bg-trasparent border-2 border-white">
            <Image src={_store.logo_url} width={32} height={32} alt='?' className='w-[12em] h-[12em]'/>
            </div>
          </div>
          <div className="flex flex-col pl-3 pt-2">
            <h1 className='font-work font-bold text-3xl text-white'>{_store.store_name}</h1>
            <h1 className='font-work font-light text-lg text-white'>{_store.subdomain}.bazaar.ly</h1>
          </div></div>
          <div className={`${hasChanged ? 'hover:cursor-pointer hover:bg-white hover:bg-[var(--white)] border-[0.5px] border-white/20 bg-white/70 text-black' : ' border-[0.5px] border-white/20 bg-transparent text-white'} 
            transition duration-300 ease-in-out flex flex-row justify-center items-center px-3 h-7 rounded-lg`}>
            <h1 className="font-work text-sm">Save Changes</h1>
          </div>
        </div>
      </div>
    </div>
    ) : (<></>)}
    </>
  );
}