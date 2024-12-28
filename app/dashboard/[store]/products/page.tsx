'use client';

import React, { useEffect, useState } from 'react';

import DashboardSideBar from "@/app/components/DashboardSideBar";
import Image from "next/image";
import { fetchStores } from '@/app/lib/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import uploadIcon from '@/app/assets/images/upload.svg';
import crossIcon from '@/app/assets/images/cross.svg';
import createIcon from '@/app/assets/images/create.svg';
import archiveIcon from '@/app/assets/images/archive.svg';
import searchIcon from '@/app/assets/images/search.svg';
import plusIcon from '@/app/assets/images/plus.svg';
import discardIcon from '@/app/assets/images/discard.svg';
import filterIcon from '@/app/assets/images/filter.svg';
import categoryIcon from '@/app/assets/images/category.svg';




import Link from 'next/link';
import { getMaxProducts, getStringPlan } from '@/app/lib/pricing';

const supabase = createClientComponentClient();

export default function ProductsPage({ params }: { params: Promise<{ store: string }> }) {
  const param = React.use(params);
  const { store } = param;

  const [user, setUser] = useState<any>(null);
  const [_store, setStore] = useState<any>(null);
  const [name, setName] = useState<string>("");

  const [curTask, setCurTask] = useState<number>(0);

  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [imgUrls, setimgUrls] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [discount, setDiscount] = useState<string>("");
  
  const [isDraggingImage, setDraggingImage] = useState<boolean>(false);

  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = React.createRef<HTMLInputElement>();

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
      fetchProducts();
    }
  }, [_store]);



  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; 
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      
      setimgUrls((prev: any) => [...prev, fileUrl]);
      setSelectedFiles((prev: any) => [...prev, file]);
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
      setimgUrls((prev: any) => [...prev, fileUrl]);
      setSelectedFiles((prev: any) => [...prev, file]);
    }

    setDraggingImage(false);
  };

  const resetCeatePromptFields = () => {
    setName("");
    setDescription("");
    setCategory("");
    setPrice("");
    setimgUrls([]);
    setSizes([]);
    setDiscount("");
    setimgUrls([]);
    setSelectedFiles([]);
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
  
  const createProduct = async (isActive: boolean) => {
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
  
    if (!store.prod_det) {
      const updates = { prod_det: { max: getMaxProducts(store.pricing), cur_prod: 0 } };
  
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
          active: isActive
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
      resetCeatePromptFields();
      alert('Changes saved successfully');
    }
  };

  const fetchProducts = async () => {
    try {
      const { data: productData, error } = await supabase
        .from('products')
        .select('name, price, imgs, category, salesdt, stockdt')
        .eq('store_id', _store.id);

      if (error) {
        throw error;
      }

      setProducts(productData);
    } catch (error: any) {
      console.error('Error fetching products:', error.message);
      alert('Error fetching prodcuts data. Please try again.');
      return null;
    }
  }



  return (
    <>
    { _store ? (
    <div className="flex h-screen w-screen justify-start items-center">
      <DashboardSideBar shopName={_store.store_name} currentPage="Product" logoUrl={_store.logo_url} domain={_store.subdomain}/>
      <div className="flex flex-col w-full h-full pt-10 pl-10 justify-start">
        <div className="flex flex-row w-full justify-between">
          <h1 className='font-work text-4xl font-semibold text-white'>Manage Products</h1>
        </div>
        { curTask == 0 &&
        <div className="flex flex-col w-full h-full">
          <div className='flex flex-row h-16 w-full'>
            <div className="flex flex-row w-2/3 h-10 items-center">
              <input
                type='text'
                className='w-full h-full focus:border focus:border-[var(--bunting)] bg-stone-900/30 font-work text-sm rounded-md pl-2 m-0 focus:outline-none'
                placeholder='Search'
              />
              <Image src={searchIcon}
                width={24}
                height={24}
                alt='->'
                className='relative h-2/3 right-10'  
              />
            </div>
            <div className="flex flex-row">
              <button 
                onClick={() => setCurTask(1)} 
                className='flex flex-row justify-center items-center bg-[var(--bunting)] rounded-xl px-2 h-10 font-work font-medium text-md
                hover:bg-[var(--dlunting)] transition ease-in-out duration-300 mr-2'
              >
                <Image
                  src={filterIcon}
                  width={20}
                  height={20}
                  alt='/\'
                  className='w-6 h-6'
                />
              </button>
              <button 
                onClick={() => setCurTask(1)} 
                className='flex flex-row justify-center items-center bg-[var(--bunting)] rounded-xl px-2 h-10 font-work font-medium text-md
                hover:bg-[var(--dlunting)] transition ease-in-out duration-300 mr-2'
              >
                <Image
                  src={plusIcon}
                  width={20}
                  height={20}
                  alt='+'
                  className='w-6 h-6 mr-1'
                />
                <span>Add Product</span>
              </button>
              <button 
                onClick={() => setCurTask(1)} 
                className='flex flex-row justify-center items-center bg-[var(--bunting)] rounded-xl px-2 h-10 font-work font-medium text-md
                hover:bg-[var(--dlunting)] transition ease-in-out duration-300'
              >
                <Image
                  src={categoryIcon}
                  width={20}
                  height={20}
                  alt='/\'
                  className='w-6 h-6 mr-1'
                />
                <span>Categories</span>
              </button>
            </div>
          </div>
          <div className="flex flex-col bg-stone-900/30 w-11/12 h-full rounded-2xl border border-white/10 p-2">
            <div className="flex flex-row px-2 mt-2">
              <h1 className='font-work font-medium text-2xl text-white'>{selectedProducts.length != 0 ? `${selectedProducts?.length } selected` : `${products?.length == 0 ? 'No' : products?.length} Items`}</h1>
            </div>
            <div className="flex flex-col border border-white/20 h-full rounded-xl">
              <div className="flex flex-row items-center w-full pl-2 h-10 ">
                <div className="flex flex-row items-center border-r border-r-white/20 w-6 h-full">
                  <input
                    type="checkbox"
                    id="custom-checkbox"
                    className="peer hidden"
                  />
                  
                  <label
                    htmlFor="custom-checkbox"
                    className="text-[#ffffff00] w-4 h-4 border border-[var(--bunting)] rounded peer-checked:text-white peer-checked:flex items-center justify-center cursor-pointer
                              peer-checked:bg-[var(--dlunting)]"
                  >
                    <span className="font-bold">-</span>
                  </label>

                </div>
                <h1 className='w-3/12 pl-2 font-work font-light text-md'>Product Name</h1>
                <h1 className='w-1/12 pl-2 font-work font-light text-md'>Price</h1>
                <h1 className='w-1/12 pl-2 font-work font-light text-md'>Sales</h1>
                <h1 className='w-2/12 pl-2 font-work font-light text-md'>Sale Volume</h1>
                <h1 className='w-1/12 pl-2 font-work font-light text-md'>Stock</h1>
                <h1 className='w-1/12 pl-2 font-work font-light text-md'>Catgeory</h1>
                <h1 className='w-2/12 pl-2 font-work font-light text-md'>Action</h1>
              </div>
              {products?.map((element: any, index: number) => (
                <div key={index} className={`flex flex-row w-full pl-2 h-13 border-t border-t-white/10 ${index == (products.length - 1) && 'border-b border-b-white/10'}`}>
                  <div className="flex flex-row items-center border-r border-r-white/20 w-6 h-full">
                    <input
                      type="checkbox"
                      id={`custom-checkbox-${index}`}
                      className="peer hidden"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts((prev: any) => [...prev, index]);
                        } else {
                          setSelectedProducts((prev: any) => prev.filter((item: any) => item !== index));
                        }
                      }}
                    />
                    <label
                      htmlFor={`custom-checkbox-${index}`}
                      className={`text-[#ffffff00] w-4 h-4 border border-[var(--bunting)] rounded peer-checked:text-white peer-checked:flex items-center justify-center cursor-pointer
                                peer-checked:bg-[var(--dlunting)]`}
                    >
                      <span className="font-bold">-</span>
                    </label>
                  </div>
                  <div className='flex flex-row py-2 w-3/12 pl-2 font-work'>
                    <Image src={products[index].imgs[0]}
                      width={2000}
                      height={2000}
                      alt={`${products[index].name}`}
                      className='w-9 h-9 rounded-xl'
                    />
                    <div className="flex flex-col pl-2">
                      <h1 className='font-work text-sm font-medium'>{products[index].name.length > 40 ? products[index].name.substring(0, 32) + '..' : products[index].name}</h1>
                      <h1 className='font-work text-xs font-light'>{products[index].vardt ? products[index].vardt.n_variations + 'variations' : 'One Variant'}</h1>
                    </div>
                  </div>
                  <h1 className='w-1/12 py-2 pl-2 font-work'>{products[index].price}<span className='font-cutive text-[0.1em] text-white/20'>NPR</span></h1>
                  <h1 className='w-1/12 py-2 pl-2 font-work'>{products[index].salesdt ? products[index].salesdt.n_sales : 0}</h1>
                  <h1 className='w-2/12 py-2 pl-2 font-work'>{products[index].price * (products[index].salesdt ? products[index].salesdt.n_sales : 0)}<span className='font-cutive text-[0.1em] text-white/20'>NPR</span></h1>
                  <h1 className='w-1/12 py-2 pl-2 font-work'>{products[index].stockdt ? products[index].stockdt.cur : 0}</h1>
                  <h1 className='w-1/12 py-2 pl-2 font-work'>Catgeory</h1>
                  <h1 className='w-2/12 py-2 pl-2 font-work'>Action</h1>
                </div>
              ))}
            </div>
          </div>

        </div>
        }
        { curTask == 1 ? (
        <div className="flex flex-col p-5 ml-10 mt-5 w-11/12 h-4/6  border border-white/5 rounded-xl shadow-white/10 shadow-sm "> 
        <div className="flex flex-row w-full justify-between">
          <div className="flex flex-col">
            <div className="flex flex-row items-center">
              <h1 className='font-work font-medium text-2xl text-white'>Create Product</h1>
            </div>
            <h1 className='font-work font-normal text-sm text-white/70 mb-4'>Design and create products with ease and efficency</h1>
          </div>
            <div className="flex flex-row">
              <button 
                onClick={() => setCurTask(0)} 
                className='flex flex-row justify-center items-center bg-transparent rounded-xl px-2 h-10 font-work font-medium text-md
                hover:bg-red-500/20 transition ease-in-out duration-300 mr-3'
              > 
                <Image
                  src={discardIcon}
                  width={20}
                  height={20}
                  alt='/\'
                  className='w-6 h-6'
                />
              </button>
              <button 
                onClick={() => createProduct(true)} 
                className='flex flex-row justify-center items-center bg-[var(--bunting)] rounded-xl px-2 h-10 font-work font-medium text-md
                hover:bg-[var(--dlunting)] transition ease-in-out duration-300 mr-3'
              > 
                <Image
                  src={archiveIcon}
                  width={20}
                  height={20}
                  alt='/\'
                  className='w-6 h-6 mr-1'
                />
                <span>Archive</span>
              </button>
              <button 
                onClick={() => createProduct(true)} 
                className='flex flex-row justify-center items-center bg-[var(--bunting)] rounded-xl px-2 h-10 font-work font-medium text-md
                hover:bg-[var(--dlunting)] transition ease-in-out duration-300'
              >
                
                <Image
                  src={createIcon}
                  width={20}
                  height={20}
                  alt='/\'
                  className='w-6 h-6 mr-1'
                />
                <span>Create</span>
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
                  placeholder={`Describe ${name != "" ? name : 'your product'}`}
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
          <div className="flex flex-row justify-end w-full mt-2">
            <h1 className='ml-4 font-work font-medium text-xs text-white'>{getMaxProducts(_store.pricing) - (_store.prod_det.cur_prod | 0)} / {getMaxProducts(_store.pricing)} remaining from <span className='text-[var(--dlunting)]'>{getStringPlan(_store.pricing)}</span></h1>
          </div>
        </div>
        ) : <></>}
      </div>
    </div>
    ) : (<></>)}
    </>
  );
}