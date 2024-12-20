'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react';
import DashboardSideBar from '../components/DashboardSideBar';
import Link from 'next/link';
import Image from 'next/image';

import check from '@/app/assets/images/check.svg';
import not_check from '@/app/assets/images/not_check.svg';
import current from '@/app/assets/images/current_check.svg';

import { fetchStores } from '@/app/lib/supabase';
import StoreForm from '../components/StoreForm';

const supabase = createClientComponentClient();


export default function Dashboard() {
  const [step, setStep] = useState(0);
  const [canContinue, setCanContinue] = useState<boolean>(false);

  const steps = ["Create an Account", "Build a Business Profile", "Watch a video",
  "Set your theme", "Pick a plan", "Billing"];


  const [user, setUser] = useState<any>(null);
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const determineStep = () => {
    if (!user) {
      setStep(1);
      return;
    }

    if (!store) {
      setStep(2);
      return
    }

    setStep(3);

    if (store.theme) {
      setStep(4);
      return;
    }

    if (store.pricing) {
      setStep(5);
    }

    if (user.billing) {
      setStep(6);
    }
  }

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

  useEffect(() => {
    determineStep();
  })



  return (
    <>
      {user ? (
        <div className="flex h-screen w-screen justify-start items-center">
          {canContinue ? (
            <>
            <DashboardSideBar shopName={store.store_name} currentPage="Home" logoUrl={''}/>
            <h1>{store.store_name}</h1>
            </>
          ) : (
            <>
            <DashboardSideBar shopName={store ? store.store_name : user.id} currentPage="Home" logoUrl={store ? store.logo_url : ''}/>
            <div className="flex flex-col w-full h-full justify-center items-center">
              <div className="flex flex-col w-3/5 h-4/6 pl-8 bg-stone-950 rounded-lg">
              <div className="flex flex-row justify-between items-center h-full w-full">
                <div className="flex flex-row w-3/12 h-full pt-16">
                  <div className="flex flex-col items-start w-1/4 h-full">
                    {steps.map((description, index) => (
                      <div key={index} className="flex flex-col items-center justify-center m-0 p-o w-full">
                        {index > 0 && (
                          <div className="flex h-7 w-0.5 bg-[var(--lunting)] m-0 p-0"></div>
                        )}

                        <Image
                          src={(index + 1) < step ? check : (index + 1) == step ? current : not_check}
                          alt="Random icon"
                          className="w-10 h-5 rounded-full p-0 m-0"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col items-start w-3/4 h-full">
                  {steps.map((description, index) => (
                    <div key={index}>
                    {index == 0 ? (
                      <div className="text-[0.7rem] font-work pt-[0.10rem] font-light">{description}</div>
                    ) : <div className="flex items-end w-full h-12 text-[0.7rem] font-work font-light">{description}</div>}
                    </div>
                  ))}
                  </div>
                </div>
                {
                  (step == 2) ?
                  <StoreForm user={user} setStore={setStore}/>
                  : (step == 3) ?
                  <video width="640" height="480" controls>
                    <source src="video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  : (step == 4) ?
                  <></>
                  : (step == 5) ?
                  <></> 
                  : <></>
                }
              </div>
              </div>
            </div>
            </>
          )}
        </div>
      ) : (
        <>FUCKING HERE?</>
      )}      
    </>
  );
}
