'use client';

import Image from "next/image";
import { FC, useEffect } from "react";
import Link from "next/link";
import { DefaultLogos } from "@/app/components/StoreForm";


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
  domain: string;
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

const DashboardSideBar: FC<DashboardSideBarInterface> = ({ shopName, currentPage, logoUrl, domain }) => {
  const displayName = decodeURIComponent(shopName.substring(0, 14));
  const storeDomain = domain;

  return (
    <div className="flex flex-col bg-stone-950 w-3/12 h-full pl-5 pr-4 pt-7">
      <div className="flex flex-row w-full items-center mb-4">
        <Image src={logoUrl ? logoUrl : DefaultLogos[Math.floor(Math.random() * DefaultLogos.length)]} alt="File icon" width={32} height={32} className="w-12 h-12 p-1 rounded-lg"/>
        <h1 className="flex text-white uppercase ml-2 w-[190] font-work text-xl font-bold">
          {displayName}...
        </h1>
      </div>
      <span className="font-work uppercase text-md mb-2">General</span>
      <div className="flex flex-col w-full items-start mb-4">
        {Object.entries(Options).map(([label, { path, icon }]) => (
          <Link href={`/dashboard/${storeDomain}/${path}`}
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
            <h1 className="flex mt-[0.5] pl-3 py-0 font-work text-lg">{label}</h1>
          </Link>
        ))}
      </div>
      <span className="font-work uppercase text-md mb-2">Advanced</span>
      <div className="flex flex-col w-full items-start">
        {Object.entries(AdvOptions).map(([label, { path, icon }]) => (
          <Link href={`/dashboard/${storeDomain}/${path}`}

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
            <h1 className="flex mt-[0.5] pl-3 py-0 font-work text-lg">{label}</h1>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardSideBar;
