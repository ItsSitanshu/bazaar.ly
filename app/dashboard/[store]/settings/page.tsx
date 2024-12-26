'use client';

import React, { useEffect, useState } from 'react';

import DashboardSideBar from "@/app/components/DashboardSideBar";
import Image from "next/image";
import { fetchStores } from '@/app/lib/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import storeIcon from '@/app/assets/images/store.svg'
import billingIcon from '@/app/assets/images/billing.svg'
import websiteIcon from '@/app/assets/images/website.svg'
import shareIcon from '@/app/assets/images/share.svg'

import { locationInfo, Province } from "@/app/lib/location";

import Link from 'next/link';

const supabase = createClientComponentClient();

const Options: Record<string, {option: number, icon: any, color: string}> = {
  'Store': { option: 0, icon:   storeIcon , color: '#FF8800'},
  'Billing': { option: 1, icon: billingIcon, color: '#F2453F'},
  'Website': { option: 2, icon: websiteIcon, color: '#69A744' },
  'Sharing': { option: 3, icon: shareIcon, color: '#6C71FF' },
};


export default function SettingsPage({ params }: { params: Promise<{ store: string }> }) {
  const param = React.use(params);
  const { store } = param;

  const [user, setUser] = useState<any>(null);
  const [_store, setStore] = useState<any>(null);
  const [curOption, setOption] = useState(0);
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<{province: Province; district: string; city: string}>({
    province: "Bagmati",
    district: "",
    city: ""
  }); 
  const [logo_url, setLogoUrl] = useState<string>(""); 
  const [instagram, setInstagram] = useState<string>("");
  const [facebook, setFacebook] = useState<string>("");
  const [tiktok, setTiktok] = useState<string>("");

  const [description, setDescription] = useState<string>("");
  const [subdomain, setSubDomain] = useState<string>("");

  const [hasChanged, setHasChanged] = useState<boolean>(false);

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
    if (_store) {
      setName(_store.store_name || ""); 
      setPhone(_store.store_phone || 0);
      setAddress(_store.address || "");
      setLogoUrl(_store.logo_url);
      setInstagram(_store.instagram || "");
      setFacebook(_store.facebook || "");
      setTiktok(_store.tiktok || "");
    }
  }, [_store]);

  useEffect(() => {
    if (_store) {
      console.log("xyz", _store.store_name == name, _store.store_phone == phone, _store.address == address, _store.logo_url == logo_url);
      if (
        _store.store_name  !== name ||
        _store.store_phone !== phone ||
        _store.address !== address ||
        _store.logo_url !== logo_url
      ) {
        setHasChanged(true);
      } else {
        setHasChanged(false);
      }
    }

    console.log("useff: ", logo_url);
  })


  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = React.createRef<HTMLInputElement>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; 
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      
      setLogoUrl(fileUrl);
      setSelectedFile(file);
    }
  };

  

  const uploadLogo = async () => {
    if (!selectedFile) return;
  
    const filePath = `logos/${_store.store_name}`;
  
    try {
      const { data: uploadData, error } = await supabase.storage
        .from('logos')
        .upload(filePath, selectedFile, { upsert: true});
  
      if (error) {
        throw error;
      }
  
      const { data: publicUrlData } = supabase.storage
        .from('logos')
        .getPublicUrl(filePath);
      

      return publicUrlData.publicUrl as string;
    } catch (error: any) {
      console.error('Error uploading logo:', error.message);
    }
  };
  

  const useDefaultLogo = () => {}


  const saveChanges = async () => {
    const { data, error: selectError } = await supabase
      .from('store')
      .select('*')
      .eq('user_id', user.id);
  
    if (selectError) {
      console.error('Error checking for existing store:', selectError);
      alert('Error checking for existing store');
      return;
    }
    
    let logoURL: string | undefined = "";

    if (data && data.length > 0) {
      console.log('Existing store:', data);
  
      if (selectedFile) {
        try {
          logoURL = await uploadLogo();
        } catch (error) {
          console.error('Error uploading logo:', error);
          alert('There was an issue uploading the logo. Please try again.');
          return; 
        }
      }
  
      const updates = {
        id: _store.id,
        user_id: user.id,
        subdomain: _store.subdomain,
        store_name: name,
        store_phone: phone,
        address: address,
        logo_url: logoURL,
      };
  
      try {
        const { data: updatedData, error: updateError } = await supabase
          .from('store')
          .update(updates)  
          .eq('user_id', user.id); 
  
        if (updateError) {
          throw updateError;
        }
  
        alert('Changes saved successfully');
        setHasChanged(false);
      } catch (error: any) {
        console.error('Error saving changes:', error);
        alert(`Error saving changes: ${error.message || 'Unknown error'}`);
      } finally {
        fetchStores(supabase, user.id as string, setStore);
      }
  
    } 
  };
  


  return (
    <>
    { _store ? (
    <div className="flex h-screen w-screen justify-start items-center">
      <DashboardSideBar shopName={_store.store_name} currentPage="Settings" logoUrl={_store.logo_url} domain={_store.subdomain}/>
      <div className="flex flex-col w-full h-full pt-10 justify-start items-center">
        <div className='flex flex-row items-center w-full pl-10 h-12 mt-6'>
          <div className="flex flex-col items-start mr-20">
            <h1 className='font-bold font-work text-3xl'>Settings</h1>
            <span className='font-normal font-work text-md text-white/50'>Manage your store setting and preferences</span>
          </div>
          {Object.entries(Options).map(([label, { option, icon, color }]) => (
            <div
              key={option}
              className={`flex flex-row justify-center items-center rounded-full p-2 border-[0.5px] border-white/20
              hover:bg-white/10 hover:cursor-pointer transition ease-in-out duration-200
              ${option != 0 ? 'ml-5' : ''}`}
              style={
                curOption === option
                  ? {
                      background: `${color}1f`,
                    }
                  : {}
              }
            >
              <Image src={icon} alt={`${label} icon`} width={32} height={32} className='h-3/5 ' />
            </div>
          ))}
        </div>
        <div className="flex flex-row items-center h-1/6 w-full mt-12 pl-12">
          <div className="flex flex-col h-full w-1/5">
            <h1 className='font-work font-medium text-xl text-white'>General Information</h1>
            <span className='font-cutive font-thin text-xs text-white/60 mt-2'>Basic information</span>
          </div>
          <div className="flex flex-row h-full w-4/5">
          <div className="flex flex-col ml-32 h-full w-3/5">
            <div className="flex flex-row w-full h-2/5 mt-2">
              <div className="flex flex-col w-1/2 h-full">
                <span className="font-cutive text-[0.7rem] ml-1">Name</span>
                <input
                  type="text"
                  placeholder="e.g. Hari"
                  className="bg-black caret-[var(--lunting)] focus:border-[var(--lunting)] h-full font-work text-md rounded-lg pl-2 m-0 w-full focus:outline-none border border-white/40"
                  value={name}
                  onChange={(e: any) => setName(e.target.value)}
                />
              </div>
              <div className="flex flex-col w-1/2 h-full ml-5">
                <span className="font-cutive text-[0.7rem] ml-1">Phone</span>
                <div className='flex flex-row h-full'>
                  <div className="bg-black/80 rounded-l-md h-full w-1/4 border border-white/40">
                    <h1 className={`flex flex-row justify-center items-center h-full w-full font-work font-bold text-md`}>+977 </h1>
                  </div>
                  <input
                  type="tel"
                  placeholder="xx xx xx xx xx"
                  pattern="[0-9]{10}"
                  className={`h-full w-3/4 caret-[var(--lunting)] bg-stone-900/30 text-md font-work rounded-r-md pl-2 m-0 focus:border-[var(--lunting)] focus:outline-none border border-white/40`}
                  value={phone == '0' ? '' : phone}
                  onChange={(e) => setPhone(e.target.value)}
                  />    
                </div>
              </div>
              
            </div>
            <div className="flex flex-col w-full h-2/5 mt-3">
              <span className="font-cutive text-[0.7rem] ml-1">Email</span>
              <div className="flex flex-row items-center bg-black hover:cursor-not-allowed h-full font-work text-md rounded-lg pl-2 m-0 w-full focus:outline-none border border-white/40" >
              <h1>{user.email}</h1>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center h-full w-1/5">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden w-full h-full"
              onChange={handleFileChange} 
            />
            <Image src={logo_url || _store.logo_url} 
              width={2000}
              height={2000}
              alt='?' 
              className='w-auto h-full hover:cursor-pointer rounded-full border border-white' 
              onClick={() => fileInputRef.current?.click()}
            />
          </div>
        </div>
        </div>
        <div className="w-full h-[0.5] mt-10 bg-white/20"/>
        <div className="flex flex-row items-center h-20 w-full mt-10 pl-12">
          <div className="flex flex-col h-full w-1/5">
            <h1 className='font-work font-medium text-xl text-white'>Location Information</h1>
            <span className='font-cutive font-thin text-xs text-white/60 mt-2'>Let us know where you're based, locate your <span className='font-bold text-white/85'>headqurater</span></span>
          </div>
          <div className="flex flex-row justify-center items-center ml-32 h-full w-3/5 "> 
            <div className="flex flex-col w-full  h-full ml-5">
              <span className="font-cutive text-[0.7rem] ml-1">Province</span>
              <select
                className={`h-10 w-full bg-stone-900/30 font-normal text-[0.85em] font-work rounded-md px-2 m-0 focus:outline-none`}
                value={address.province}
                onChange={(e) =>
                  setAddress((prev: any) => ({
                    ...prev,
                    province: e.target.value,
                    district: "",
                    city: "", 
                  }))
                }
              >
                <option value="" disabled className="bg-black text-white font-md">
                  Select Province
                </option>
                {Object.keys(locationInfo).map((province) => (
                  <option key={province} value={province} className="bg-black text-white font-light">
                    {province}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col w-full h-full ml-5">
              <span className="font-cutive text-[0.7rem] ml-1">District</span>
              <select
                className={`h-10 w-full bg-stone-900/30 ${
                  address.district === "" ? 'font-extralight text-[0.75em]' : 'font-normal text-[0.85em]'
                } font-work rounded-md pl-2 m-0 focus:outline-none`}
                value={address.district}
                onChange={(e) =>
                  setAddress((prev: any) => ({
                    ...prev,
                    district: e.target.value,
                    city: "",
                  }))
                }
                disabled={!address.province}
              >
                <option value="" disabled className="bg-black text-white font-md">
                  {address.province ? "Select District" : "Select Province First"}
                </option>
                {address.province &&
                  Object.keys(locationInfo[address.province]).map((district) => (
                    <option key={district} value={district} className="bg-black text-white font-light">
                      {district}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex flex-col w-full h-full ml-5">
              <span className="font-cutive text-[0.7rem] ml-1">City</span>
              <select
                className={`h-10 w-full bg-stone-900/30 ${
                  address.city === "" ? 'font-extralight text-[0.75em]' : 'font-normal text-[0.85em]'
                } font-work rounded-md pl-2 m-0 focus:outline-none`}
                value={address.city}
                onChange={(e) =>
                  setAddress((prev: any) => ({
                    ...prev,
                    city: e.target.value,
                  }))
                }
                disabled={!address.district}
              >
                <option value="" disabled className="bg-black text-white font-md">
                  {address.district ? "Select City" : "Select District First"}
                </option>
                {address.district &&
                  locationInfo[address.province][address.district]?.map((municipality: any) => (
                    <option key={municipality} value={municipality} className="bg-black text-white font-light">
                      {municipality}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>
        <button
          className={`${
            hasChanged
              ? 'bg-green-500 hover:bg-green-600 opacity-100'
              : 'bg-gray-400 cursor-not-allowed'
          } text-white py-2 px-4 rounded-md transition-opacity duration-300 ease-in-out`}
          onClick={saveChanges}
          disabled={!hasChanged}
        >
          Save Changes
        </button>
        <div className="w-full h-[0.5] mt-10 bg-white/20"/>
      </div> 
    </div>
    ) : (<></>)}
    </>
  );
}