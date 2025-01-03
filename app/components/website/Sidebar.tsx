import { FC, useState } from "react";
import TT from "@/app/components/ToolTip";
import Image from "next/image";

import plusIcon from '@/app/assets/images/website/plus.svg';
import pagesIcon from '@/app/assets/images/website/pages.svg';
import themeIcon from '@/app/assets/images/website/theme.svg';
import mediaIcon from '@/app/assets/images/website/media.svg';

const Sidebar: FC = () => {
  const [isShown, setIsShown] = useState({
    componentLibrary: false,
    pagesMenu: false,
    siteTheme: false,
    siteMedia: false,
  });
  
  const toggleVisibility = (key: keyof typeof isShown) =>
    setIsShown((prev) => ({ ...prev, [key]: !prev[key] }));
  
  const Options: Record<number, {
    uid: keyof typeof isShown
    icon: any;
    tip: string;
    stateKey: keyof typeof isShown;
  }> = {
    0: { uid: 'componentLibrary', icon: plusIcon, tip: "Add a component from the library", stateKey: "componentLibrary" },
    1: { uid: 'pagesMenu', icon: pagesIcon, tip: "Pages and Menu", stateKey: "pagesMenu" },
    2: { uid: 'siteTheme', icon: themeIcon, tip: "Site Theme and Design", stateKey: "siteTheme" },
    3: { uid: 'siteMedia', icon: mediaIcon, tip: "Site Media", stateKey: "siteMedia" },
  };
  

  return (
    <div className="flex flex-col pt-5 w-16 gap-5 h-full items-center bg-stone-950">
      {Object.entries(Options).map(([key, { uid, icon, tip, stateKey }]) => (
        <TT key={key} text={tip} position="right">
          <div onClick={() => toggleVisibility(uid)} className="p-2 cursor-pointer rounded-full shadow shadow-white/20">
            <Image src={icon} alt={`${tip}`} width={24} height={24} />
          </div>
        </TT>
      ))}
    </div>
  );
};

export default Sidebar;
