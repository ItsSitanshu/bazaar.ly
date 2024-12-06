'use client';

import Image from "next/image";

import { FC } from "react";

const DashboardSideBar: FC = () => {
  return (
    <div className="flex flex-col bg-stone-950 w-1/6 h-full">
      <h1 className="text-white font-work text-xl">Welcome back</h1>
      <div className="flex flex-col w-full h-1/3">
        <div className="flex border items-center pl-3 bg-white w-11/12 rounded-xl mt-2 text-black font-work h-1/6">SELECTED ITEM</div>
        <div className="flex hover:border items-center pl-3 border-white w-11 /12 rounded-2xl mt-2 text-white font-work h-1/6">ITEM X</div>
        <div className="flex hover:border items-center pl-3 border-white w-11/12 rounded-2xl mt-2 text-white font-work h-1/6">ITEM X</div>
        <div className="flex hover:border items-center pl-3 border-white w-11/12 rounded-2xl mt-2 text-white font-work h-1/6">ITEM X</div>
        <div className="flex hover:border items-center pl-3 border-white w-11/12 rounded-2xl mt-2 text-white font-work h-1/6">ITEM X</div>
      </div>
      
    </div>
  );
}

export default DashboardSideBar;