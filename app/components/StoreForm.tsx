import { Dispatch, FC, useState } from "react";
import Image from "next/image";

import people1 from "@/app/assets/images/people-1.svg"
import people2 from "@/app/assets/images/people-2.svg"
import people3 from "@/app/assets/images/people-3.svg";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { fetchStores } from "@/app/lib/supabase";

interface StoreFormInterface {
  user: any;
  setStore: Dispatch<any>;
}

const supabase = createClientComponentClient();

export const DefaultLogos = [
  'https://blonmglhfntabwhwswez.supabase.co/storage/v1/object/public/logos/default1.svg',
  'https://blonmglhfntabwhwswez.supabase.co/storage/v1/object/public/logos/default2.svg',
  'https://blonmglhfntabwhwswez.supabase.co/storage/v1/object/public/logos/default3.svg',
  'https://blonmglhfntabwhwswez.supabase.co/storage/v1/object/public/logos/default4.svg',
  'https://blonmglhfntabwhwswez.supabase.co/storage/v1/object/public/logos/default5.svg',
  'https://blonmglhfntabwhwswez.supabase.co/storage/v1/object/public/logos/default6.svg',
  'https://blonmglhfntabwhwswez.supabase.co/storage/v1/object/public/logos/default7.svg',
  'https://blonmglhfntabwhwswez.supabase.co/storage/v1/object/public/logos/default8.svg',
  'https://blonmglhfntabwhwswez.supabase.co/storage/v1/object/public/logos/default9.svg',
  'https://blonmglhfntabwhwswez.supabase.co/storage/v1/object/public/logos/default10.svg',
  'https://blonmglhfntabwhwswez.supabase.co/storage/v1/object/public/logos/default11.svg',
  'https://blonmglhfntabwhwswez.supabase.co/storage/v1/object/public/logos/default13.svg',
  'https://blonmglhfntabwhwswez.supabase.co/storage/v1/object/public/logos/default14.svg',
  'https://blonmglhfntabwhwswez.supabase.co/storage/v1/object/public/logos/default15.svg',
  'https://blonmglhfntabwhwswez.supabase.co/storage/v1/object/public/logos/default16.svg'

]

const StoreForm: FC<StoreFormInterface> = ({ user, setStore }) => {
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [subdomain, setSubDomain] = useState<string>("");
  const [employeeOption, setEmployeeOption] = useState<number>(1);
  const [address, setAddress] = useState<{province: string; district: string; city: string}>({
    province: "",
    district: "",
    city: ""
  });

  const [formData, setFormData] = useState({
    storeName: '',
    storePhone: '',
    logo: null,
    description: '',
    subdomain: '',
  });

  const handleFormSubmit = async () => {
    if (!user) {
      alert('Please log in first.');
      return;
    }
  
  
    try {
      const { error: insertError } = await supabase
        .from('store')
        .insert([
          {
            user_id: user.id,
            store_name: name,
            store_phone: 0,
            description: description,
            logo_url: DefaultLogos[Math.floor(Math.random() * DefaultLogos.length)],
            subdomain: subdomain,
            emp_ty: {range_type: employeeOption},
            address: address
          },
        ]);
    } catch (error: any) {
      console.error(error.message);
      alert('An error occurred: ' + error.message);
    } finally {
      console.log('Store created successfully!');
      fetchStores(supabase, user.id, setStore);
    }
  }


  return (
    <div className="flex flex-col w-9/12 h-full pl-6 pt-8">
      <h1 className="font-work font-semibold text-white text-3xl">Build your business profile</h1>
      <div className="flex flex-col w-full h-full px-3">
      <div className="flex flex-col w-10/12 h-full items-center">
        <form onSubmit={handleFormSubmit} className="w-full h-full mt-3">
          <div className="flex flex-row justify-between items-start w-full mb-2">
            <span className="font-work font-light text-[0.8rem] w-4/12 p-0 m-0 underline decoration-[0.15em] underline-offset-0 decoration-[var(--lunting)]">Your business title</span>
            <input
              type="text"
              placeholder="e.g. Hari's Closet"
              className={`h-10 bg-stone-900/30 ${name === "" ? 'font-extralight text-[0.75em]' : 'font-normal text-[0.85em]'} font-work rounded-md w-8/12 pl-2 m-0 focus:outline-none`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-row justify-between items-start w-full mb-2">
            <span className="font-work font-light text-[0.8rem] w-4/12 p-0 m-0 underline decoration-[0.15em] underline-offset-0 decoration-[var(--lunting)]">Your website domain</span>
            <div className="flex flex-row items-start w-8/12">
              <input
                type="text"
                placeholder="haribahaduriscool"
                className={`h-10 w-3/4 bg-stone-900/30 ${subdomain === "" ? 'font-extralight text-[0.75em]' : 'font-bold text-[0.85em]'} font-work rounded-l-md pl-2 m-0 focus:outline-none`}
                value={subdomain}
                onChange={(e) => setSubDomain(e.target.value)}
              />
              <div className="bg-black/80 rounded-r-md h-8 w-1/4">
                <h1 className={`flex justify-center items-center h-full w-full font-work font-bold text-[0.6em]`}>.bazaar.ly</h1>
              </div>
            </div>

          </div>
          <div className="flex flex-row justify-between items-start w-full mb-2">
            <span className="font-work font-light text-[0.8rem] w-4/12 p-0 m-0 underline decoration-[0.15em] underline-offset-0 decoration-[var(--lunting)]">Description of conducted activities</span>
            <textarea
              placeholder="A helpful and brief explanation of your business's operations"
              className={`h-28 bg-stone-900/30 ${description === "" ? 'font-extralight text-[0.75em]' : 'font-normal text-[0.85em]'} font-work rounded-md w-8/12 pl-2 pt-1 m-0 focus:outline-none`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex flex-row justify-between items-start w-full mb-2">
            <span className="font-work font-light text-[0.8rem] w-4/12 p-0 m-0 underline decoration-[0.15em] underline-offset-0 decoration-[var(--lunting)]">Business address</span>
            <div className="flex flex-col justify-between h-32 w-8/12">
              <input
                type="text"
                placeholder="Province"
                className={`h-10 w-full bg-stone-900/30 ${address.province === "" ? 'font-extralight text-[0.75em]' : 'font-normal text-[0.85em]'} font-work rounded-md w-8/12 pl-2 m-0 focus:outline-none`}
                value={address.province}
                onChange={(e) => setAddress((prev: any) => ({ ...prev,  province: e.target.value, })) }
              />
              <input
                type="text"
                placeholder="District"
                className={`h-10 w-full bg-stone-900/30 ${address.district === "" ? 'font-extralight text-[0.75em]' : 'font-normal text-[0.85em]'} font-work  rounded-md w-8/12 pl-2 m-0 focus:outline-none`}
                value={address.district}
                onChange={(e) => setAddress((prev: any) => ({ ...prev,  district: e.target.value, })) }
              />
              <input
                type="text"
                placeholder="City"
                className={`h-10 w-full bg-stone-900/30 ${address.city === "" ? 'font-extralight text-[0.75em]' : 'font-normal text-[0.85em]'} font-work  rounded-md w-8/12 pl-2 m-0 focus:outline-none`}
                value={address.city}
                onChange={(e) => setAddress((prev: any) => ({ ...prev,  city: e.target.value, })) }
              />
            </div>
          </div>
          <div className="flex flex-row justify-between items-start w-full">
            <span className="font-work font-light text-[0.8rem] w-4/12 p-0 m-0 underline decoration-[0.15em] underline-offset-0 decoration-[var(--lunting)]">Number of Employees</span>
            <div className="flex flex-row justify-between h-32 w-8/12 ">
              <div onClick={ () => setEmployeeOption(1) } className={`flex flex-col hover:bg-stone-950 transition duration-150 items-center justify-center bg-stone-900/30 w-1/3 h-2/3 rounded-lg pt-1 mr-2 ${employeeOption == 1 ? 'border border-[var(--dlunting)] ' : ''}`}>
                <Image src={people1} width={6} height={6} alt='1-20'
                  className="w-6 h-6"/>
                <h1 className='font-work text-xs'>1-20</h1>
              </div >
              <div onClick={ () => setEmployeeOption(2) } className={`flex flex-col hover:bg-stone-950 transition duration-150 items-center justify-center bg-stone-900/30 w-1/3 h-2/3 rounded-lg pt-1 mr-2 ${employeeOption == 2 ? 'border border-[var(--dlunting)] ' : ''}`}>
                <Image src={people2} width={6} height={6} alt='20-50'
                  className="w-6 h-6"/>
                <h1 className='font-work text-xs'>20-50</h1>
              </div>
              <div onClick={ () => setEmployeeOption(3) } className={`flex flex-col hover:bg-stone-950 transition duration-150 items-center justify-center bg-stone-900/30 w-1/3 h-2/3 rounded-lg pt-1 ${employeeOption == 3 ? 'border border-[var(--dlunting)] ' : ''}`}>
                <Image src={people3} width={6} height={6} alt='50+'
                  className="w-6 h-6"/>
                <h1 className='font-work text-xs'>50+</h1>
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            className="hover:cursor-pointer hover:bg-white transition-transform hover:scale-[1.05] duration-300 ease-in-out flex flex-col items-center justify-center w-1/2 h-9 rounded-md bg-white/90 last:font-work text-md text-black font-medium"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default StoreForm;
