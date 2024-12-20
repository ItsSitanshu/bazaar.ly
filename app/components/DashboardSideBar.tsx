'use client';

import Image from "next/image";
import { FC, useEffect } from "react";
import Link from "next/link";


import homeIcon from "@/app/assets/images/sidebar_Home.svg";
import productIcon from "@/app/assets/images/sidebar_Product.svg";
import ordersIcon from "@/app/assets/images/sidebar_Orders.svg";
import messagingIcon from "@/app/assets/images/sidebar_Messaging.svg";
import websiteIcon from "@/app/assets/images/sidebar_Website.svg";
import settingIcon from "@/app/assets/images/sidebar_Setting.svg";
import employeeIcon from "@/app/assets/images/sidebar_Employee.svg";
import inventoryIcon from "@/app/assets/images/sidebar_Inventory.svg";
import orgIcon from "@/app/assets/images/sidebar_Stores.svg";
import questionMark from '@/app/assets/images/question_mark.svg'

interface DashboardSideBarInterface {
  shopName: string;
  currentPage: string;
  logoUrl: string;
}

const Options: Record<string, { path: string; icon: any }> = {
  'Home': { path: "/", icon: homeIcon },
  'Product': { path: "upload", icon: productIcon },
  'Orders': { path: "orders", icon: ordersIcon },
  'Website': { path: "website", icon: websiteIcon },
  'Inventory': { path: "inventory", icon: inventoryIcon },
  'Messaging': { path: "messaging", icon: messagingIcon },
};

const AdvOptions: Record<string, { path: string; icon: any }> = {
  'Settings': { path: "settings", icon: settingIcon },
  'Workspace': { path: "employees", icon: employeeIcon },
  'Multiple Stores ': { path: "org", icon: orgIcon },
};

const DashboardSideBar: FC<DashboardSideBarInterface> = ({ shopName, currentPage, logoUrl }) => {
  const storeName = shopName.toLowerCase()
  const logo = logoUrl;

  useEffect(() => {
    console.log(logo, logoUrl);
  })

  return (
    <div className="flex flex-col bg-stone-950 h-full pl-5 pr-4 pt-7">
      <div className="flex flex-row w-full items-center mb-4">
        {logoUrl ? (
          <Image src={logoUrl} alt="File icon" width={32} height={32} className="w-10 h-10 p-1 rounded-lg"/>
        ) : (
          <div className="flex justify-center items-center w-10 h-10 p-1 rounded-full bg-transparent">
            <Image src={questionMark} alt="File icon" width={32} height={32} className="w-8 h-8 p-1 rounded-lg"/>
          </div>
        ) }

        <h1 className="flex text-white uppercase ml-2 w-[190] font-work text-lg font-bold">
          {shopName.substring(0, 10)}
        </h1>
      </div>
      <span className="font-work uppercase text-xs mb-2">General</span>
      <div className="flex flex-col w-full items-start mb-4">
        {Object.entries(Options).map(([label, { path, icon }]) => (
          <Link href={`/dashboard/${storeName}/${path}`}
            key={path}
            className={`flex flex-row w-full items-center justify-start pl-3 mb-1 p-2 rounded-xl
            text-white hover:bg-white/5 transition ease-in-out duration-200`}
            style={
              currentPage === label
                ? {
                    background: `linear-gradient(to top left, #ffffff11 0%, #ffffff33 100%, #ffffff55 100%)`,
                    fontWeight: "bold",
                  }
                : {}
            }
          >
            <Image src={icon} alt={`${label} icon`} width={16} height={16} />
            <h1 className="flex mt-[0.5] pl-3 py-0 font-work text-sm">{label}</h1>
          </Link>
        ))}
      </div>
      <span className="font-work uppercase text-xs mb-2">Advanced</span>
      <div className="flex flex-col w-full items-start">
        {Object.entries(AdvOptions).map(([label, { path, icon }]) => (
          <Link href={`/dashboard/${storeName}/${path}`}

            key={path}
            className={`flex flex-row w-full items-center justify-start pl-3 mb-1 p-2 rounded-xl
            text-white hover:bg-white/5 transition ease-in-out duration-200`}
            style={
              currentPage === label
                ? {
                    background: `linear-gradient(to top left, #ffffff11 0%, #ffffff33 100%, #ffffff55 100%)`,
                    fontWeight: "bold",
                  }
                : {}
            }
          >
            <Image src={icon} alt={`${label} icon`} width={16} height={16} />
            <h1 className="flex mt-[0.5] pl-3 py-0 font-work text-sm">{label}</h1>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardSideBar;
