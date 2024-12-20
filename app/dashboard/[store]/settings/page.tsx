'use client';

import { useRouter } from "next/navigation";
import React from 'react';

import DashboardSideBar from "@/app/components/DashboardSideBar";

export default function SettingsPage({ params }: { params: Promise<{ store: string }> }) {
  const router = useRouter();
  const param = React.use(params);
  const { store } = param;
  
  return (
    <div className="flex h-screen w-screen justify-start items-center">
      <DashboardSideBar shopName={store} currentPage="Settings" />
      <div className="flex flex-col w-full h-full justify-center items-center">
      </div>
    </div>
  );
}