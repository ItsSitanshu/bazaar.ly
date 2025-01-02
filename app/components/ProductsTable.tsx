import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import TT from "@/app/components/ToolTip";

import searchIcon from '@/app/assets/images/search.svg';
import plusIcon from '@/app/assets/images/plus.svg';
import discardIcon from '@/app/assets/images/discard.svg';
import filterIcon from '@/app/assets/images/filter.svg';
import categoryIcon from '@/app/assets/images/category.svg';
import trashIcon from '@/app/assets/images/trash.svg';
import liveIcon from '@/app/assets/images/live.svg';
import editIcon from '@/app/assets/images/edit.svg';
import createIllustration from '@/app/assets/images/create_illustration.svg';

import uploadIcon from '@/app/assets/images/upload.svg';
import crossIcon from '@/app/assets/images/cross.svg';

import{ validateNumber, validatePercentage, validateText, validateTextPara } from '@/app/lib/products';

type Product = {
  id: string;
  name: string;
  imgs: string[];
  price: number;
  salesdt?: { cur: number };
  stockdt?: { cur: number };
  category: string;
  active: boolean;
  vardt?: { n_variations: number };
};

type StoreDetails = {
  prod_det: {
    categories: Record<string, string>;
  };
};

interface ProductsTableProps {
  products: Product[];
  selectedProducts: any[];
  categories: any[];
  setSelectedProducts: (products: any) => void;
  setCurTask: (task: any) => void;
  setshakeCreateBTN: (shake: boolean) => void;
  shakeCreateBTN: boolean;
  setcategoryPopupVisible: (visible: boolean) => void;
  categoryPopupVisible: boolean;
  setNewCategory: (category: any) => void;
  newCategory: any;
  handleAddCategory: () => void;
  deleteSelectedProducts: () => void;
  liveSelectedProducts: any;
  handleEditClick: () => void;
  editPopupShown: boolean;
  editSelectedProduct: any;
  editProduct: any;
  setEditProduct: (product: any) => void;
  editFileInputRef: React.RefObject<HTMLInputElement>;
  editHandleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  setEditSelectedFiles: (files: any) => void;
  editHandleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  editIsDraggingImage: boolean;
  seteditPopupShown: (shown: boolean) => void;
  handleEditFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editImgUrls: string[];
  setEditImgUrls: (urls: any) => void;
  _store: any;
}

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  selectedProducts,
  categories,
  setSelectedProducts,
  setCurTask,
  setshakeCreateBTN,
  shakeCreateBTN,
  setcategoryPopupVisible,
  categoryPopupVisible,
  setNewCategory,
  newCategory,
  handleAddCategory,
  deleteSelectedProducts,
  liveSelectedProducts,
  handleEditClick,
  editPopupShown,
  editSelectedProduct,
  setEditProduct,
  editProduct,
  editFileInputRef,
  editHandleDragOver,
  setEditSelectedFiles,
  editHandleDrop,
  editIsDraggingImage,
  seteditPopupShown,
  handleEditFileChange,
  editImgUrls,
  setEditImgUrls,
  _store,
}) => {
  const [editProductError, seteditProductError] = useState<string | null>('');

  useEffect(() => {
    if (editProduct == null) return;
    const error = validateText(editProduct.name, 'Name', 3, 80)
      || validateTextPara(editProduct.desc, 'Description', 10, 50)
      || validateText(editProduct.desc, 'Description', 10, 310)
      || (editProduct.category === undefined && 'Please select a category')
      || validateNumber(editProduct.price, 'Price')
      || ''

    seteditProductError(error);
  }, [editProduct]);
  
  return (
    <div className="flex flex-col w-full h-full">
      <div className='flex flex-row h-16 w-full'>
        <div className="flex flex-row w-2/3 h-10 items-center">
          <input
            type='text'
            className='w-full h-full focus:border focus:border-[var(--bunting)] bg-stone-900/30 font-work text-md rounded-md pl-2 m-0 focus:outline-none'
            placeholder='Search'
            aria-label="Search products"
          />
          <Image src={searchIcon}
            width={24}
            height={24}
            alt='Search'
            className='relative h-2/3 right-10'
          />
        </div>
        <div className="flex flex-row">
          <TT text='Filter your products' position='top'>
            <button
              onClick={() => setCurTask(1)}
              className='flex flex-row justify-center items-center bg-[var(--bunting)] rounded-xl px-2 h-10 font-work font-medium text-md
              hover:bg-[var(--dlunting)] transition ease-in-out duration-300 mr-2'
              aria-label="Filter products"
            >
              <Image
                src={filterIcon}
                width={20}
                height={20}
                alt='Filter'
                className='w-6 h-6'
              />
            </button>
          </TT>
          <TT text='Add a product' position='top'>
            <button
              onClick={() => {
                setCurTask(1);
                setshakeCreateBTN(true);
              }}
              className={`flex flex-row justify-center items-center bg-[var(--bunting)] rounded-xl px-2 h-10 font-work font-medium text-md
              hover:bg-[var(--dlunting)] transition ease-in-out duration-300 mr-2
              ${shakeCreateBTN ? 'shimmy bg-[var(--lunting)]' : ''}`}
              aria-label="Add product"
            >
              <Image
                src={plusIcon}
                width={20}
                height={20}
                alt='Add'
                className='w-6 h-6 mr-1'
              />
              <span>Add Product</span>
            </button>
          </TT>
          <div>
            {
              !categoryPopupVisible ? <TT text='Manage Categories' position='right'>
                <button
                  onClick={() => setcategoryPopupVisible(!categoryPopupVisible)}
                  className='flex flex-row justify-center items-center bg-[var(--bunting)] rounded-xl px-2 h-10 font-work font-medium text-md hover:bg-[var(--dlunting)] transition ease-in-out duration-300'
                  aria-label="Manage categories"
                >
                  <Image
                    src={categoryIcon}
                    width={20}
                    height={20}
                    alt='Categories'
                    className='w-6 h-6 mr-1'
                  />
                  <span>Categories</span>
                </button>
              </TT> : <button
                onClick={() => setcategoryPopupVisible(!categoryPopupVisible)}
                className='flex flex-row justify-center items-center bg-[var(--bunting)] rounded-xl px-2 h-10 font-work font-medium text-md hover:bg-[var(--dlunting)] transition ease-in-out duration-300'
                aria-label="Manage categories"
              >
                <Image
                  src={categoryIcon}
                  width={20}
                  height={20}
                  alt='Categories'
                  className='w-6 h-6 mr-1'
                />
                <span>Categories</span>
              </button>
            }
            {categoryPopupVisible && (
              <div className="tooltip-dropdown relative bg-stone-950 text-white rounded-xl p-4 top-2 right-32 w-64 shadow-lg z-50">
                <h3 className="text-lg font-semibold font-work mb-4">Categories</h3>
                {categories?.length > 0 ? (
                  <div className="mb-4">
                    {categories.map((category, index) => (
                      <li key={index} className="font-work text-md">{category}</li>
                    ))}
                  </div>
                ) : (
                  <p className="mb-4 font-work">No categories available</p>
                )}

                <div className="mb-4">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter new category"
                    className="mt-2 h-10 w-full focus:border focus:border-[var(--bunting)] bg-stone-900/30 font-work text-md rounded-md pl-2 m-0 focus:outline-none"
                  />
                </div>

                <div className="flex">
                  <button
                    onClick={() => setcategoryPopupVisible(false)}
                    className='flex flex-row justify-center items-center bg-transparent rounded-xl px-2 h-10 font-work font-medium text-md
                    hover:bg-red-500/20 transition ease-in-out duration-300 mr-3'
                    aria-label="Cancel"
                  >
                    <Image
                      src={discardIcon}
                      width={20}
                      height={20}
                      alt='Cancel'
                      className='w-6 h-6'
                    />
                  </button>

                  <button
                    onClick={handleAddCategory}
                    className='flex flex-row w-10/12 justify-center items-center bg-[var(--bunting)] rounded-xl px-2 h-10 font-work font-medium text-md hover:bg-[var(--dlunting)] transition ease-in-out duration-300'
                    aria-label="Add category"
                  >
                    Add Category
                  </button>
                </div>

                <div
                  className="absolute top-full right-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-b-stone-950"
                  style={{
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col bg-stone-900/30 w-11/12 h-5/6 rounded-2xl border border-white/10 p-2">
        {products.length !== 0 ? (
          <>
            <div className="flex flex-row items-center justify-between px-2 mt-2 w-full h-10 mb-3">
              <h1 className='font-work font-medium text-2xl text-white'>
                {selectedProducts.length !== 0 ? `${selectedProducts.length} selected` : `${products.length} Items`}
              </h1>
              <div className="flex flex-row">
                <TT text={`Edit selected product ${selectedProducts.length != 1 ? '(disabled)' : ''}`} position='top'>
                  <button
                    disabled={selectedProducts.length != 1}
                    onClick={handleEditClick}
                    className={`flex flex-row justify-center items-center bg-transparent rounded-xl px-2 h-10 font-work font-medium text-md
                    transition ease-in-out duration-300 mr-3 border
                    ${selectedProducts.length != 1 ? 'border-white' : 'border-[var(--dlunting)] hover:bg-[var(--lunting)]'}`}
                    aria-label="Make selected products go live"
                  >
                    <Image
                      src={editIcon}
                      width={20}
                      height={20}
                      alt='Edit'
                      className='w-6 h-6'
                    />
                  </button>
                </TT>
                <TT text={`Delete Selected items ${selectedProducts.length === 0 ? '(disabled)' : ''}`} position='top'>
                  <button
                    disabled={selectedProducts.length === 0}
                    onClick={deleteSelectedProducts}
                    className={`flex flex-row justify-center items-center bg-transparent rounded-xl px-2 h-10 font-work font-medium text-md
                    transition ease-in-out duration-300 mr-3 border
                    ${selectedProducts.length === 0 ? 'border-white' : 'border-[var(--dlunting)] hover:bg-[var(--lunting)]'}`}
                    aria-label="Delete selected items"
                  >
                    <Image
                      src={trashIcon}
                      width={20}
                      height={20}
                      alt='Delete'
                      className='w-6 h-6'
                    />
                  </button>
                </TT>
                <TT
                  text={`Make selected products go live ${
                    selectedProducts.length === 0 ||
                    !selectedProducts.every(id => products.find(p => p.id === id && !p.active))
                      ? '(disabled)'
                      : ''
                  }`}
                  position="top"
                >
                  <button
                    disabled={
                      selectedProducts.length === 0 ||
                      !selectedProducts.every(id => products.find(p => p.id === id && !p.active))
                    }
                    onClick={liveSelectedProducts}
                    className={`flex flex-row justify-center items-center bg-transparent rounded-xl px-2 h-10 font-work font-medium text-md
                      transition ease-in-out duration-300 mr-3 border ${
                        selectedProducts.length === 0 ||
                        !selectedProducts.every(id => products.find(p => p.id === id && !p.active))
                          ? 'border-white'
                          : 'border-[var(--dlunting)] hover:bg-[var(--lunting)]'
                      }`}
                    aria-label="Make selected products go live"
                  >
                    <Image
                      src={liveIcon}
                      width={20}
                      height={20}
                      alt="Live"
                      className="w-6 h-6"
                    />
                  </button>
                </TT>

              </div>
            </div>
            <div className="flex flex-col border border-white/5 h-full rounded-xl">
              <div className="flex flex-row items-center w-full pl-2 h-10">
                <div className="flex flex-row items-center border-r border-r-white/20 w-8 ml-2 h-full">
                  <input
                    type="checkbox"
                    id="custom-checkbox"
                    className="peer hidden"
                    checked={products.length === selectedProducts.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProducts(products.map(product => product.id));
                      } else {
                        setSelectedProducts([]);
                      }
                    }}
                  />
                  <label
                    htmlFor="custom-checkbox"
                    className="text-[#ffffff00] w-4 h-4 border border-[var(--dlunting)] rounded peer-checked:text-white peer-checked:flex items-center justify-center cursor-pointer
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
                <h1 className='w-2/12 pl-2 font-work font-light text-md'>Stock Volume</h1>
                <h1 className='w-1/12 pl-2 font-work font-light text-md'>Category</h1>
                <h1 className='w-1/12 pl-2 font-work font-light text-md'>Live</h1>
              </div>
              {products.map((element, index) => (
                <div key={index} className={`flex flex-row items-center w-full pl-2 h-13 border-t border-t-white/10 ${index === (products.length - 1) && 'border-b border-b-white/10'}`}>
                  <div className="flex flex-row items-center border-r border-r-white/20 w-8 ml-2 h-full">
                    <input
                      type="checkbox"
                      id={`custom-checkbox-${index}`}
                      className="peer hidden"
                      checked={selectedProducts.includes(element.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts((prev: any) => [...prev, element.id]);
                        } else {
                          setSelectedProducts((prev: any) => prev.filter((item: any) => item !== element.id));
                        }
                      }}
                    />
                    <label
                      htmlFor={`custom-checkbox-${index}`}
                      className={`text-[#ffffff00] w-4 h-4 border border-[var(--dlunting)] rounded peer-checked:text-white peer-checked:flex items-center justify-center cursor-pointer
                                peer-checked:bg-[var(--dlunting)]`}
                    >
                      <span className="font-bold">-</span>
                    </label>
                  </div>
                  <div className='flex flex-row py-2 w-3/12 px-2 font-work'>
                    <Image
                      src={element.imgs[0]}
                      width={2000}
                      height={2000}
                      alt={`${element.name}`}
                      className='w-9 h-9 rounded-xl'
                    />
                    <div className="flex flex-col pl-2">
                      <h1 className='font-work text-sm font-medium'>
                        {element.name.length > 35 ? element.name.substring(0, 32) + '..' : element.name}
                      </h1>
                      <h1 className='font-work text-xs font-light'>
                        {element.vardt ? element.vardt.n_variations + ' variations' : 'One Variant'}
                      </h1>
                    </div>
                  </div>
                  <h1 className='w-1/12 py-2 pl-2 font-work'>{element.price}<span className='font-cutive text-[0.1em] text-white/20'>NPR</span></h1>
                  <h1 className='w-1/12 py-2 pl-2 font-work'>{element.salesdt ? element.salesdt.cur : 0}</h1>
                  <h1 className='w-2/12 py-2 pl-2 font-work'>{element.price * (element.salesdt ? element.salesdt.cur : 0)}<span className='font-cutive text-[0.1em] text-white/20'>NPR</span></h1>
                  <h1 className='w-1/12 py-2 pl-2 font-work'>{element.stockdt ? element.stockdt.cur : 0}</h1>
                  <h1 className='w-2/12 py-2 pl-2 font-work'>{element.price * (element.stockdt ? element.stockdt.cur : 0)}<span className='font-cutive text-[0.1em] text-white/20'>NPR</span></h1>
                  <h1 className='w-1/12 py-2 pl-2 font-work'>{_store.prod_det.categories[element.category] || 'N/A'}</h1>
                  <h1 className='w-1/12 py-2 pl-2 font-work'>{element.active ? "Yes" : <span className='text-red-500'>No</span>}</h1>
                </div>
              ))}
            </div>
            {editPopupShown && editProduct && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-50">
              <div className="w-8/12 h-3/5 p-6 bg-black border border-white/5 rounded-xl shadow-white/10 shadow-sm">
                <h2 className="font-work text-2xl font-semibold mb-4">
                  Editing <span className="underline decoration-[var(--lunting)]">"{editProduct.name}"</span>
                </h2>
                <div className="flex flex-row h-11/12">
                <div className="flex flex-col w-6/12  p-6 border border-white/20 rounded-xl h-full">
                  {editProductError && <h1 className="font-work font-bold text-xs text-red-500">Error: {editProductError}</h1>}                
                  <label className="flex flex-col">
                    <span className="font-work font-light text-[0.8rem] w-full p-0 m-0 underline decoration-[0.15em] underline-offset-0 decoration-[var(--lunting)]">
                      Product Name
                    </span>
                    <input
                      type="text"
                      value={editProduct.name}
                      onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                      className="mt-2 h-10 w-full focus:border focus:border-[var(--bunting)] bg-stone-900/30 font-work text-md rounded-md pl-2 m-0 focus:outline-none"
                    />
                  </label>
                  <div className="flex flex-col justify-between items-start w-full mb-2">
                    <span className="font-work font-light text-[0.8rem] w-full p-0 m-0 underline decoration-[0.15em] underline-offset-0 decoration-[var(--lunting)]">Description of your product</span>
                    <textarea
                      placeholder={`Describe ${editProduct.name != "" ? editProduct.name : 'your product'}`}
                      className={`mt-2 h-28 bg-stone-900/30 text-sm text-white font-work rounded-md w-full pl-2 pt-1 m-0 focus:outline-none`}
                      value={editProduct.desc}
                      onChange={(e) => setEditProduct({ ...editProduct, desc: e.target.value })}
                    />
                  </div>
                  <label className="flex flex-col">
                    <span className="font-work font-light text-[0.8rem] w-full p-0 m-0 underline decoration-[0.15em] underline-offset-0 decoration-[var(--lunting)]">
                      Price
                    </span>
                    <input
                      type="number"
                      value={editProduct.price}
                      onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                      className="mt-2 h-10 w-full focus:border focus:border-[var(--bunting)] bg-stone-900/30 font-work text-md rounded-md pl-2 m-0 focus:outline-none"
                    />
                  </label>
                  <label className="flex flex-col">
                    <span className="font-work font-light text-[0.8rem] w-full p-0 m-0 underline decoration-[0.15em] underline-offset-0 decoration-[var(--lunting)]">
                      Category
                    </span>
                    <select
                      className="mt-2 h-10 w-full bg-stone-900/30 font-normal text-md font-work rounded-md px-2 m-0 focus:outline-none"
                      value={editProduct.category}
                      onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                    >
                      <option value="" disabled className="bg-black text-white font-medium">
                        Select a category
                      </option>
                      {Object.values(_store.prod_det.categories).map((category: any, idx: any) => (
                        <option key={idx} value={category} className="bg-black text-white font-light">
                          {category}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col">
                    <span className="font-work font-light text-[0.8rem] w-full p-0 m-0 underline decoration-[0.15em] underline-offset-0 decoration-[var(--lunting)]">
                      Live
                    </span>
                    <select
                      value={editProduct.active ? "Yes" : "No"}
                      onChange={(e) => setEditProduct({ ...editProduct, active: e.target.value === "Yes" })}
                      className="mt-2 h-10 w-full bg-stone-900/30 font-normal text-md font-work rounded-md px-2 m-0 focus:outline-none"
                    >
                      <option className="bg-black text-white font-medium" value="Yes">Yes</option>
                      <option className="bg-black text-white font-medium" value="No">No</option>
                    </select>
                  </label>
                </div>
                <div className="flex flex-col ml-5 w-6/12 border rounded-xl border-white/15 p-3">
                  <div
                    className={`flex flex-col justify-center items-center h-3/6 w-12/12 border border-dashed border-white/30 rounded-3xl p-20
                    hover:border-[var(--dlunting)] ${editIsDraggingImage   ? 'hover:cursor-move' : 'hover:cursor-pointer'} transition ease-in-out duration-200`}
                    onClick={() => editFileInputRef.current?.click()}
                    onDragOver={editHandleDragOver}
                    onDrop={editHandleDrop}
                  >
                    <input
                      ref={editFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden w-full h-full"
                      onChange={handleEditFileChange}
                    />
                    <Image
                      src={uploadIcon}
                      alt="upload"
                      width={2000}
                      height={2000}
                      className="w-1/12 h-1/12 mb-5"
                    />
                    <h1 className="text-white font-work font-semibold text-xl">Click to upload or drag and drop</h1>
                    <h1 className="text-white/60 font-work font-light text-md">Max 10MB and only png and jpeg files allowed</h1>
                  </div>
                  <div className="flex flex-row justify-start items-center w-full h-1/6 px-2">
                    {editImgUrls?.map((value: string, index: number) => (
                      <div key={index} className="flex flex-col items-end justify-center m-0 pr-3">
                        <button
                          onClick={() => {
                            setEditImgUrls((prevUrls: any) => prevUrls.filter((_: any, i: any) => i !== index));
                            setEditSelectedFiles((prevFiles: any) => prevFiles.filter((_: any, i: any) => i !== index));
                          }}
                          className="flex flex-row items-center justify-center relative top-3 left-2 bg-white/40 w-5 h-5 font-bold rounded-full transition ease-in-out duration-300"
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
                  <div className="flex flex-row items-center w-full justify-end mt-6">
                    <div className="flex flex-row w-1/3">
                    <TT wParam='w-8/12' text={`Save your changes ${editProductError !== '' ? '(disabled)' : ''}`} position='top'>
                    <button
                      disabled={editProductError !== ''}
                      onClick={editSelectedProduct}
                      className="flex flex-row justify-center items-center bg-[var(--bunting)] w-full rounded-xl px-2 h-10 font-work font-medium text-md
                      hover:bg-[var(--dlunting)] transition ease-in-out duration-300 mr-2"
                    >
                      Save
                    </button></TT>
                    <TT text={`Go back. Discard this menu`} position='bottom'>
                    <button
                      onClick={() => { seteditPopupShown(false); setEditProduct(null); }}
                      className='flex flex-row justify-center items-center bg-transparent rounded-xl px-2 h-10 font-work font-medium text-md
                      hover:bg-red-500/20 transition ease-in-out duration-300 mr-3'
                      aria-label="Cancel"
                    >
                      <Image
                        src={discardIcon}
                        width={20}
                        height={20}
                        alt='Cancel'
                        className='w-6 h-6'
                      />
                    </button>
                    </TT>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          )}
          </>
        ) : (
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
          </div> 
        )}
      </div>
    </div>
  );
};

export default ProductsTable;
