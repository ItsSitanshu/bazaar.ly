/*
https://cdn.dribbble.com/userupload/16140667/file/original-ce4e04f6035c1fb630c493a00a5e9e56.png?resize=752x&vertical=center - ORDER DETAIL
https://cdn.dribbble.com/userupload/16155072/file/original-1fea2ecec3251ae36d18cc9771fd7de6.png?resize=752x&vertical=center - MESSAGING
https://cdn.dribbble.com/userupload/16186490/file/original-ac579db472d0fa6da21f9ba0385a765b.png?resize=1024x768&vertical=center - ORDERS
https://cdn.dribbble.com/userupload/16186825/file/original-8a8a24dab504ff330efe51c5e9726dc5.png?resize=1024x768&vertical=center - UPLOAD PRODUCT
https://cdn.dribbble.com/userupload/16093318/file/original-e9673e89950de604d6fb9b5ba2e112d9.png?resize=752x&vertical=center - STORE DASHBOARD 
*/
'use client';


import Link from "next/link";
import { useRouter } from "next/navigation";

export default function StorePage({ params }: { params: { store: string } }) {
    const router = useRouter();
    const { store } = params;
    
    return (
        <div>
            <h1>Dashboard for Store: {store}</h1>
            <nav>
                <ul>
                    <li><Link href={`/dashboard/${store}/upload`}>Upload</Link></li>
                    <li><Link href={`/dashboard/${store}/track-orders`}>Track Orders</Link></li>
                    <li><Link href={`/dashboard/${store}/website`}>Website</Link></li>
                    <li><Link href={`/dashboard/${store}/messaging`}>Messaging</Link></li>
                </ul>
            </nav>
        </div>
    );
}
