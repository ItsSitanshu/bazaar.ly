'use client';

import React, { useEffect, useState } from 'react';
import DashboardSideBar from "@/app/components/DashboardSideBar";
import Image from "next/image";
import { fetchStores } from '@/app/lib/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { getMaxProducts, getStringPlan } from '@/app/lib/pricing';
import TT from '@/app/components/ToolTip';

import uploadIcon from '@/app/assets/images/upload.svg';
import crossIcon from '@/app/assets/images/cross.svg';
import createIcon from '@/app/assets/images/create.svg';
import archiveIcon from '@/app/assets/images/archive.svg';
import searchIcon from '@/app/assets/images/search.svg';
import plusIcon from '@/app/assets/images/plus.svg';
import discardIcon from '@/app/assets/images/discard.svg';
import filterIcon from '@/app/assets/images/filter.svg';
import categoryIcon from '@/app/assets/images/category.svg';
import discard_disIcon from '@/app/assets/images/discard_dis.svg';
import liveIcon from '@/app/assets/images/live.svg';
import live_disIcon from '@/app/assets/images/live_dis.svg';
import createIllustration from '@/app/assets/images/create_illustration.svg';
import ProductsTable from '@/app/components/ProductsTable';

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
  const [shakeCreateBTN, setshakeCreateBTN] = useState<boolean>(false);

  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [editProduct, setEditProduct] = useState<any | null>(null);
  const fileInputRef = React.createRef<HTMLInputElement>();

  const [editIsDraggingImage, seteditIsDraggingImage] = useState<boolean>(false);
  const [editSelectedFiles, setEditSelectedFiles] = useState<File[]>([]);
  const [editImgUrls, setEditImgUrls] = useState<string[]>([]);

  const editFileInputRef = React.createRef<HTMLInputElement>();



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
    setCategories(_store ? _store.prod_det.categories : []);
  }, [_store]);

  useEffect(() => {
    setshakeCreateBTN(products.length == 0);
    console.log(shakeCreateBTN);
  }, [products])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; 
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      
      setimgUrls((prev: any) => [...prev, fileUrl]);
      setSelectedFiles((prev: any) => [...prev, file]);
    }
  };

  const handleEditFileChange  = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; 
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      
      setEditImgUrls((prev: any) => [...prev, fileUrl]);
      setEditSelectedFiles((prev: any) => [...prev, file]);
    }
  };

  const editHandleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    seteditIsDraggingImage(true);
  };

  const editHandleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0]; 
    if (file) {
      const fileUrl = URL.createObjectURL(file);

      setEditImgUrls((prev: any) => [...prev, fileUrl]);
      setEditSelectedFiles((prev: any) => [...prev, file]);
    }

    seteditIsDraggingImage(false);
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

  const uploadImages = async (productId: number, fileArray: File[], isEdit: boolean) => {
    if (!fileArray || fileArray.length === 0) return;
  
    let count = 0;
    let uploadList: string[] = [];
    const dir = _store.id as string;
  
    const existingFileCounts: number[] = [];
    try {
      const { data: fileList, error: listError } = await supabase.storage
        .from('products')
        .list(`${dir}/${productId}/`, { limit: 10 }); 
      
      if (listError) throw listError;
  
      existingFileCounts.push(...fileList.map((file: any) => {
        const match = file.name.match(/(\d+)$/); 
        return match ? parseInt(match[1]) : -1; 
      }));
  
    } catch (error: any) {
      console.error('Error fetching existing files:', error.message);
    }
  
    const missingFiles = [];
    for (let i = 0; i <= Math.max(...existingFileCounts, 0); i++) {
      if (!existingFileCounts.includes(i)) {
        missingFiles.push(i);
      }
    }
  
    count = missingFiles.length > 0 ? missingFiles[0] : Math.max(...existingFileCounts, -1) + 1;
  
    console.log('Missing files:', missingFiles);
  
    const uniqueFiles = Array.from(
      new Map(fileArray.map((file) => [file.name, file])).values()
    ); 
  
    for (const file of uniqueFiles) {
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
  
        const url = publicUrlData.publicUrl as string;
        uploadList.push(url);
  
        count++;
  
      } catch (error: any) {
        console.error(`Error uploading image (${file.name}):`, error.message);
      }
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
      const updates = { prod_det: { ..._store.prod_det, max: getMaxProducts(store.pricing), cur_prod: 0 } };
  
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
        uploadList = await uploadImages(store.prod_det.cur_prod, selectedFiles, false);
      } catch (error) {
        console.error('Error uploading images:', error);
        alert('There was an issue uploading the images. Please try again.');
        return;
      }
    }
    
    const categoryIndex = (_store.prod_det.categories).indexOf(category);

    try {
      const { data: insertData, error: insertError } = await supabase
        .from('products')
        .insert([{
          id: store.prod_det.cur_prod,
          store_id: _store.id,
          name: name,
          desc: description,
          category: categoryIndex,
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
      const updates = { prod_det: { ..._store.prod_det, cur_prod: (store.prod_det.cur_prod + 1)} };
  
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
      setCurTask(0);
      alert('Changes saved successfully');
    }
  };

  const fetchProducts = async () => {
    try {
      const { data: productData, error } = await supabase
        .from('products')
        .select('id, active, name, price, imgs, category, salesdt, stockdt')
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
  };

  const [categories, setCategories] = useState<string[]>(_store ? _store.prod_det.categories : []);
  const [categoryPopupVisible, setcategoryPopupVisible] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    const updatedProdDet = {
      ..._store.prod_det,
      categories: [...(_store.prod_det.categories || []), newCategory],
    };

    const updates = {
      prod_det: updatedProdDet, 
    };

    try {
      const { data: updatedData, error: updateError } = await supabase
        .from('store')
        .update(updates)
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      setCategories((prevCategories) => [...(prevCategories || []), newCategory]);
      setNewCategory('');

      alert('Category added successfully');
    } catch (error: any) {
      console.error('Error saving changes:', error);
      alert(`Error saving category: ${error.message || 'Unknown error'}`);
    }
  };

  const liveSelectedProducts = async () => {  
    try {
      for (const productId of selectedProducts) {
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('id, active')
          .eq('id', productId)
          .single();
  
        if (productError) {
          throw productError;
        }
  
        if (productData && !productData.active) {
          const { error: updateError } = await supabase
            .from('products')
            .update({ active: true })
            .eq('id', productId);
  
          if (updateError) {
            throw updateError;
          }
        }
      }
  
    } catch (error: any) {
      console.error('Error saving product details:', error.message);
    } finally {
      fetchProducts();
      setSelectedProducts([]);
    }
  }

  useEffect (() => {
    if (editSelectedFiles[0]) {
      console.log("lamo", editSelectedFiles[0].name);
    } else {
      console.log("no edit selected fi")
    }
  })

  const [editPopupShown, seteditPopupShown] = useState(false);
  const [isSelectionEditable, setIsSelectionEditable] = useState(false);
  
  const editSelectedProduct = async () => {
    if (!editProduct || !editImgUrls) return;
    
    const storeId = _store.id as string;
    const productId = editProduct.id as string;

    try {
      const existingImages = editProduct.imgs || [];
      const updatedImages = editImgUrls || [];
  
      const removedImages = existingImages.filter((img: string) => !updatedImages.includes(img));
        
      const existingFileNames = existingImages.map((img: string) => img.split('/').pop());  // Extract just the filenames

      const newFiles = editSelectedFiles.filter((file: File) => {
        return !existingFileNames.includes(file.name); // Check if the selected file's name doesn't match any existing file
      });

      console.log("newfiles:", newFiles);
      console.log("removedimgs:", removedImages);

      if (removedImages && removedImages.length > 0) {

        const { error: deleteError } = await supabase.storage
        .from('products')
        .remove(
          removedImages.map((img: any) => {
            const fileName = img.replace(
              `https://blonmglhfntabwhwswez.supabase.co/storage/v1/object/public/products/${storeId}/${productId}/`,
              ''
            );
            return `${storeId}/${productId}/${fileName}`; 
          })
        );
        
        if (deleteError) {
          console.error('Error deleting images:', deleteError);
          throw new Error('Failed to delete removed images. Please try again.');
        }
      } 
  
      let uploadedImageUrls: string[] = [];
      if (newFiles && newFiles.length > 0) {
        try {
          const result = await uploadImages(editProduct.id, newFiles, true);
          uploadedImageUrls = result || []; 
        } catch (uploadError) {
          console.error('Error uploading images:', uploadError);
          alert('There was an issue uploading the new images. Please try again.');
          return;
        }
      }

      console.log("urls", uploadedImageUrls);
      
  
      const updatedImageUrls = [
        ...existingImages.filter((img: any) => !removedImages.includes(img)),
        ...uploadedImageUrls,
      ];
  
      const { error: updateError } = await supabase
        .from('products')
        .update({
          name: editProduct.name,
          price: editProduct.price,
          category: editProduct.category,
          active: editProduct.active,
          imgs: updatedImageUrls,
        })
        .eq('id', editProduct.id);
  
      if (updateError) {
        console.error('Error updating product:', updateError);
        throw new Error('Failed to update the product record. Please try again.');
      }
  
      // Step 5: Finalize the process
      alert('Product updated successfully.');
      seteditPopupShown(false);
      setEditProduct(null);
  
    } catch (error: any) {
      console.error('Error while saving the product:', error);
      alert(`Failed to update the product: ${error.message || 'Unknown error occurred'}`);
    }
  };
  
  
  
  const handleEditClick = () => {
    if (selectedProducts.length === 1) {
      const productToEdit = products.find((p) => p.id === selectedProducts[0]);
      console.log(productToEdit);
      if (productToEdit) {
        setEditProduct({ ...productToEdit });
        setEditImgUrls(productToEdit.imgs);
        seteditPopupShown(true);
      }
    } else {
      alert("Please select exactly one product to edit.");
    }
  };


  const deleteSelectedProducts = async () => {
    try {
      const { data: deleteData, error: deleteError } = await supabase
        .from('products')
        .delete()
        .in('id', selectedProducts)
        .eq('store_id', _store.id);
  
      if (deleteError) {
        throw deleteError;
      }
  
      const dir = _store.id as string;
      for (const productId of selectedProducts) {
        const folderPath = `${dir}/${productId}/`; 
        
        const { data: files, error: listError } = await supabase.storage
          .from('products')
          .list(folderPath, { limit: 100 }); 
        
        if (listError) {
          throw listError;
        }
        
        if (files && files.length > 0) {
          const pathsToDelete = files.map(file => `${folderPath}${file.name}`);
          
          const { error: deleteFilesError } = await supabase.storage
            .from('products')
            .remove(pathsToDelete);

          if (deleteFilesError) {
            throw deleteFilesError;
          }
        }
      }

  
      fetchProducts();
      alert('Selected products have been deleted successfully.');
    } catch (error: any) {
      console.error('Error deleting products:', error.message);
      alert('Error deleting products. Please try again.');
    } finally {
      setSelectedFiles([])
    }
  };
  

  return (
    <>
    { _store ? (
    <div className="flex h-screen w-screen justify-start items-center">
      <DashboardSideBar shopName={_store.store_name} currentPage="Product" logoUrl={_store.logo_url} domain={_store.subdomain}/>
      <div className="flex flex-col w-full h-full pt-10 pl-10 ">
        <div className="flex flex-row w-full justify-between">
          <h1 className='font-work text-4xl font-semibold text-white'>Manage Products</h1>
        </div>
        {curTask === 0 && products.length !== 0 ? (
          <ProductsTable 
            products={products}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            _store={_store}
            categories={categories}
            setshakeCreateBTN={setshakeCreateBTN}
            shakeCreateBTN={shakeCreateBTN}
            setCurTask={setCurTask}
            setNewCategory={setNewCategory}
            setcategoryPopupVisible={setcategoryPopupVisible}
            categoryPopupVisible={categoryPopupVisible}
            newCategory={newCategory}
            handleAddCategory={handleAddCategory}
            deleteSelectedProducts={deleteSelectedProducts}
            liveSelectedProducts={liveSelectedProducts}
            editPopupShown={editPopupShown}
            editSelectedProduct={editSelectedProduct}
            seteditPopupShown={seteditPopupShown}
            handleEditClick={handleEditClick}
            editProduct={editProduct}
            setEditProduct={setEditProduct}
            editFileInputRef={editFileInputRef}
            editHandleDragOver={editHandleDragOver}
            editHandleDrop={editHandleDrop}
            editIsDraggingImage={editIsDraggingImage}
            handleEditFileChange={handleEditFileChange}
            setEditSelectedFiles={setEditSelectedFiles}
            editImgUrls={editImgUrls}
            setEditImgUrls={setEditImgUrls}
          />

        ) : ( products.length === 0 && (
            <div className='flex w-full h-full flex-col items-center justify-center'>             
                <Image
                  src={createIllustration}
                  width={2000}
                  height={2000}
                  alt="?"
                  className='w-1/3'
                />
                <h1 className='font-work font-bold text-2xl mt-4'>
                  No products yet? <span className='text-[var(--dlunting)]'>Create some!</span>
                </h1>
            </div> )
          )
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
                onClick={() => {setCurTask(0); fetchProducts()}} 
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
                onClick={() => createProduct(false)} 
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
                  {_store.prod_det.categories.map((category: any, idx: any) => (
                    <option key={idx} value={category} className="bg-black text-white font-light">
                      {category}
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