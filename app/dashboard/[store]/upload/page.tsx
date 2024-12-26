'use client';

import React, { useEffect, useState } from 'react';

import DashboardSideBar from "@/app/components/DashboardSideBar";
import Image from "next/image";
import { fetchStores } from '@/app/lib/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import uploadIcon from '@/app/assets/images/upload.svg';
import crossIcon from '@/app/assets/images/cross.svg';



import Link from 'next/link';

const supabase = createClientComponentClient();

export default function UploadPage({ params }: { params: Promise<{ store: string }> }) {
  const param = React.use(params);
  const { store } = param;

  const [user, setUser] = useState<any>(null);
  const [_store, setStore] = useState<any>(null);
  const [name, setName] = useState<string>("");

  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [imgUrls, setimgUrls] = useState<string[] | null>(null);
  const [sizes, setSizes] = useState<string[] | null>(null);
  const [discount, setDiscount] = useState<string>("");
  
  const [isDraggingImage, setDraggingImage] = useState<boolean>(false);
  const [curTask, setCurTask] = useState<number>(0);


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
    console.log("imgUrls", imgUrls);
  })

  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null);
  const fileInputRef = React.createRef<HTMLInputElement>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; 
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      
      setimgUrls((prev: any) => [...(prev || []), fileUrl]);
      setSelectedFiles((prev: any) => [...(prev || []), file]);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setDraggingImage(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0]; 
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setimgUrls((prev: any) => [...(prev || []), fileUrl]);
      setSelectedFiles((prev: any) => [...(prev || []), file]);
    }

    setDraggingImage(false);
  };
  
  const resetFields = () => {
    setName("");
    setDescription("");
    setCategory("");
    setPrice("");
    setimgUrls(null);
    setSizes(null);
    setDiscount("");
    setimgUrls(null);
    setSelectedFiles(null);
  };
  

  const uploadImages = async (productId: number) => {
    if (!selectedFiles || selectedFiles.length === 0) return;
  
    let count = 0;
    let uploadList: string[] = [];
    const dir = _store.id as string;
  
    for (const file of selectedFiles) {
      const filePath = `${dir}/${productId}/${count}`;
  
      try {
        const { data: uploadData, error } = await supabase.storage
          .from('products')
          .upload(filePath, file);
  
        if (error) {
          throw error;
        }
  
        const { data: publicUrlData } = await supabase.storage
          .from('products')
          .getPublicUrl(filePath);
        
        let url = publicUrlData.publicUrl as string;
        uploadList.push(url);
      } catch (error: any) {
        console.error('Error uploading image:', error.message);
      }
  
      count++;
    }
  
    return uploadList;
  };
  


  const createProduct = async () => {
    const fetchStore = async () => {
      try {
        const { data: storeData, error } = await supabase
          .from('store')
          .select('prod_det, pricing')
          .eq('user_id', user.id);
  
        if (error) {
          throw error;
        }
  
        return storeData;
      } catch (error: any) {
        console.error('Error fetching store:', error.message);
        alert('Error fetching store data. Please try again.');
        return null;
      }
    };
  
    const storeData = await fetchStore();
  
    if (!storeData || storeData.length === 0) {
      console.error('No store found for the user');
      alert('No store found for the user.');
      return;
    }
  
    const store = storeData[0];
    const maxList = [10, 50, -1]; 
  
    if (!store.prod_det) {
      const updates = { prod_det: { max: maxList[store.pricing], cur_prod: 0 } };
  
      try {
        const { data, error } = await supabase
          .from('store')
          .update(updates)
          .eq('user_id', user.id);
  
        if (error) {
          throw error;
        }
      } catch (error: any) {
        console.error('Error saving product details:', error.message);
      }
    }
  
    let uploadList: string[] | undefined = [];
    if (selectedFiles) {
      try {
        uploadList = await uploadImages(store.prod_det.cur_prod);
      } catch (error) {
        console.error('Error uploading images:', error);
        alert('There was an issue uploading the images. Please try again.');
        return;
      }
    }
    
    try {
      const { data: insertData, error: insertError } = await supabase
        .from('products')
        .insert([{
          id: store.prod_det.cur_prod,
          store_id: _store.id,
          name: name,
          desc: description,
          category: 0,
          price: price,
          discdt: { simple: discount },
          imgs: uploadList,
          vardt: null,
          active: true
      }])
  
      if (insertError) {
        throw insertError;
      }
  
    } catch (error: any) {
      console.error('Error saving store changes:', error.message);
      alert(`Error saving store changes: ${error.message || 'Unknown error'}`);
    } finally {
      const updates = { prod_det: { cur_prod: (store.prod_det.cur_prod + 1)} };
  
      try {
        const { data, error } = await supabase
          .from('store')
          .update(updates)
          .eq('user_id', user.id);
  
        if (error) {
          throw error;
        }
      } catch (error: any) {
        console.error('Error saving product details:', error.message);
      }

      fetchStores(supabase, user.id as string, setStore);
      resetFields();
      alert('Changes saved successfully');
    }
  };
  


  return (
    <>
    { _store ? (
    <div className="flex h-screen w-screen justify-start items-center">
      <DashboardSideBar shopName={_store.store_name} currentPage="Product" logoUrl={_store.logo_url} domain={_store.subdomain}/>
      <div className="flex flex-col w-full h-full pt-10 pl-10 justify-start">
      <div className="flex flex-row w-full justify-between">
        <h1 className='font-work text-4xl font-semibold text-white '>Upload Product</h1>
      </div>
      {curTask == 0 &&
        <div className="flex flex-col p-5 ml-10 mt-5 w-11/12 h-4/6  border border-white/5 rounded-xl shadow-white/10 shadow-sm "> 
        <div className="flex flex-row w-full justify-between">
        <div className="fle">
          <h1 className='font-work font-medium text-2xl text-white'>Create Product</h1>
          <h1 className='font-work font-normal text-sm text-white/70 mb-4'>Design and create products with ease and efficency</h1>
        </div>
          <div className="flex flex-row">
            <button 
              onClick={() => createProduct()} 
              className='bg-[var(--bunting)] rounded-xl px-3 h-10 font-work font-medium text-sm
              hover:bg-[var(--dlunting)] transition ease-in-out duration-300'
            >
              Create Product
            </button>
          </div>  
        </div>
        <div className="flex flex-row h-full">
          <div className="flex flex-col w-1/2 h-full mr-6 rounded-xl border  border-white/15 p-4">
            <div className="flex flex-col justify-between items-start w-full mb-2">
              <span className="font-work font-light text-[0.8rem] w-full p-0 m-0 underline decoration-[0.15em] underline-offset-0 decoration-[var(--lunting)]">Name Product</span>
              <input
                type="text"
                placeholder="Super Cool Hoodie"
                className={`mt-2 h-10 w-full focus:border focus:border-[var(--bunting)] bg-stone-900/30 font-work text-sm rounded-md pl-2 m-0 focus:outline-none`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col justify-between items-start w-full mb-2">
              <span className="font-work font-light text-[0.8rem] w-full p-0 m-0 underline decoration-[0.15em] underline-offset-0 decoration-[var(--lunting)]">Description of your product</span>
              <textarea
                placeholder="A helpful and brief explanation of your business's operations"
                className={`mt-2 h-20 bg-stone-900/30 text-sm text-white font-work rounded-md w-full pl-2 pt-1 m-0 focus:outline-none`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex flex-col justify-between w-full">
              <span className="font-work font-light text-[0.8rem] w-full p-0 m-0 underline decoration-[0.15em] underline-offset-0 decoration-[var(--lunting)]">Category</span>
              <select
                className={`mt-2 h-10 w-full bg-stone-900/30 font-normal text-[0.85em] font-work rounded-md px-2 m-0 focus:outline-none`}
                value={category}
                onChange={(e) => (setCategory(e.target.value))}
              >
                <option value="" disabled className="bg-black text-white font-md">
                  Select a category
                </option>
                {Object.keys(_store.categories || []).map((province) => (
                  <option key={province} value={province} className="bg-black text-white font-light">
                    {province}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-row justify-between">
              <div className="w-8/12 mt-3 flex flex-col justify-between items-start mb-2">
                <span className="font-work font-light text-[0.8rem] w-full p-0 m-0 underline decoration-[0.15em] underline-offset-0 decoration-[var(--lunting)]">Pricing</span>
                <div className="mt-1 flex flex-row items-center w-full">
                  <input
                    type="text"
                    placeholder="xx xx xx"
                    className={`h-10 w-3/4 focus:border focus:border-[var(--bunting)] bg-stone-900/30 font-work rounded-l-md pl-2 m-0 focus:outline-none`}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  <div className="bg-stone-900/70  border-white/60 rounded-r-md h-10 w-1/4">
                    <h1 className={`flex flex-row justify-center items-center h-full w-full font-work font-bold text-md`}>NPR</h1>
                  </div>
                </div>
              </div>
              <div className="w-3/12 mt-3 flex flex-col justify-between items-start mb-2">
                <span className="font-work font-light text-[0.8rem] w-full p-0 m-0 underline decoration-[0.15em] underline-offset-0 decoration-[var(--lunting)]">Discount</span>
                <div className="mt-1 flex flex-row items-center w-full">
                  <input
                    type="text"
                    placeholder="xx"
                    className={`h-10 w-3/4 focus:border focus:border-[var(--bunting)] bg-stone-900/30 font-work rounded-l-md pl-2 m-0 focus:outline-none`}
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                  />
                  <div className="bg-stone-900/70 border-white/60 rounded-r-md h-10 w-1/4">
                    <h1 className={`flex flex-row justify-center items-center h-full w-full font-work font-bold text-md`}>%</h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 flex flex-col justify-between items-start mb-2">
              <span className="font-work font-light text-[0.8rem] w-full p-0 m-0 underline decoration-[0.15em] underline-offset-0 decoration-[var(--lunting)]">Advanced Options</span>
              <h1 className='font-work w-full'>TODO: IMPLEMENT COLOR WAYS</h1>
            </div>
          </div>
          <div className="flex flex-col w-1/2 h-full border rounded-xl border-white/15 p-3">
            <div className={`flex flex-col justify-center items-center h-3/6 w-12/12 border border-dashed border-white/30 rounded-3xl p-20
            hover:border-[var(--dlunting)] ${isDraggingImage ? 'hover:cursor-move' : 'hover:cursor-pointer'} transition ease-in-out duration-200`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            >
              <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden w-full h-full"
              onChange={handleFileChange} 
              />
              <Image
                src={uploadIcon}
                alt='upload'
                width={2000}
                height={2000}
                className='w-1/12 h-1/12 mb-5'
              />
              <h1 className='text-white font-work font-semibold text-xl'>Click to upload or drag and drop</h1>
              <h1 className='text-white/60 font-work font-light text-md'>Max 10MB and only png and jpeg files allowed</h1>
            </div>
            <div className="flex flex-row justify-start items-center w-full h-1/6 px-2">
            {imgUrls?.map((value, index) => (
              <div key={index} className="flex flex-col items-end justify-center m-0 pr-3 ">
                <button
                onClick={() => {
                  setimgUrls((prevUrls: any) => prevUrls.filter((_: any, i: any) => i !== index));
                  setSelectedFiles((prevFiles: any) => prevFiles.filter((_: any, i: any) => i !== index));

                }}
                className="flex flex-row items-center justify-center relative top-3 left-2 bg-white/40 w-5 h-5 font-bold rounded-full  transition ease-in-out duration-300"
                >
                <Image
                  src={crossIcon}
                  alt="X"
                  width={100} 
                  height={100}  
                  className="w-3 h-3 rounded-xl object-cover"  
                />
                  
                </button>
                <Image
                  src={value}
                  alt="Uploaded image"
                  width={100} 
                  height={100}  
                  className="w-14 h-14 bg-white/80 rounded-xl object-cover"  
                />
              </div>
            ))}

            </div>
          </div>
        </div>
        </div>
      }
      </div>
    </div>
    ) : (<></>)}
    </>
  );
}