'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react';
import DashboardSideBar from '../components/DashboardSideBar';

const supabase = createClientComponentClient();

interface StoreFormInterface {
  storeName: string;
  storePhone: string;
  logo: File | null;
  description: string;
  subdomain: string;
}

export default function CreateStore() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<StoreFormInterface>({
    storeName: '',
    storePhone: '',
    logo: null,
    description: '',
    subdomain: '',
  });

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, logo: file }));
  };

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: any, session: any) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async () => {
    if (!user) {
      alert('Please log in first.');
      return;
    }



    setLoading(true); 

    try {
      let logoUrl = '';

      if (formData.logo) {
        const { data, error } = await supabase.storage
          .from('logos')
          .upload(`${user.id}${formData.logo.name}`, formData.logo, {
            upsert: true,
            contentType: formData.logo.type,
          });

        if (error) {
          throw new Error('Error uploading logo: ' + error.message);
        }

        logoUrl = data?.path ?? '';
      }

      const { error: insertError } = await supabase
        .from('store')
        .insert([
          {
            store_name: formData.storeName,
            store_phone: formData.storePhone,
            logo_url: logoUrl,
            description: formData.description,
            subdomain: formData.subdomain,
            user_id: user.id,
          },
        ]);


      if (insertError) {
        throw new Error('Error creating store: ' + insertError.message);
      }

      console.log('Store created successfully!');
      alert('Store created successfully!');
    } catch (error: any) {
      console.error(error.message);
      alert('An error occurred: ' + error.message);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <>
      {user ? (
        <div className="flex h-screen w-screen justify-start items-center">
        <DashboardSideBar shopName={user.id} currentPage='Home'/> 
        </div>
        //   <div className="flex flex-row justify-start w-10/12 h-5/6 bg-stone-950 rounded-3xl">
        //     <div
        //       className="w-1/2 h-full relative flex flex-col items-center justify-center rounded-l-3xl z-0"
        //       style={{
        //         background:
        //           'radial-gradient(100% 80% at 1% 1%, var(--bunting) -100%, var(--black) 30%, var(--bunting) 100%, var(--white) 200%)',
        //       }}
        //     >
        //       <h1 className="text-white text-5xl font-work uppercase font-bold">
        //         Create Your Store
        //       </h1>
        //       <p className="text-white/[.5] font-cutive text-sm text-thin">
        //         Step {step} of 5
        //       </p>
        //     </div>

        //     <div className="w-1/2 h-full relative flex flex-col items-center justify-center z-0">
        //       <div className="w-9/12 flex flex-col items-center justify-center pt-16">
        //         {step === 1 && (
        //           <>
        //             <h2 className="text-white font-cutive text-xl mb-4">Enter your store name</h2>
        //             <input
        //               type="text"
        //               name="storeName"
        //               value={formData.storeName}
        //               onChange={handleChange}
        //               placeholder="Store Name"
        //               className="w-full p-3 rounded-lg bg-stone-800 text-white"
        //             />
        //           </>
        //         )}
        //         {step === 2 && (
        //           <>
        //             <h2 className="text-white font-cutive text-xl mb-4">Enter your store phone number</h2>
        //             <input
        //               type="text"
        //               name="storePhone"
        //               value={formData.storePhone}
        //               onChange={handleChange}
        //               placeholder="Phone Number"
        //               className="w-full p-3 rounded-lg bg-stone-800 text-white"
        //             />
        //           </>
        //         )}
        //         {step === 3 && (
        //           <>
        //             <h2 className="text-white font-cutive text-xl mb-4">Upload your logo</h2>
        //             <input
        //               type="file"
        //               accept="image/*"
        //               onChange={handleFileChange}
        //               className="w-full p-3 rounded-lg bg-stone-800 text-white"
        //             />
        //           </>
        //         )}
        //         {step === 4 && (
        //           <>
        //             <h2 className="text-white font-cutive text-xl mb-4">Describe your store</h2>
        //             <textarea
        //               name="description"
        //               value={formData.description}
        //               onChange={handleChange}
        //               placeholder="Store Description"
        //               className="w-full p-3 rounded-lg bg-stone-800 text-white"
        //             />
        //           </>
        //         )}
        //         {step === 5 && (
        //           <>
        //             <h2 className="text-white font-cutive text-xl mb-4">Choose a subdomain</h2>
        //             <input
        //               type="text"
        //               name="subdomain"
        //               value={formData.subdomain}
        //               onChange={handleChange}
        //               placeholder="Subdomain"
        //               className="w-full p-3 rounded-lg bg-stone-800 text-white"
        //             />
        //           </>
        //         )}

        //         <div className="flex mt-8 w-full justify-between">
        //           {step > 1 && (
        //             <button
        //               onClick={handlePrevious}
        //               className="p-3 rounded-lg bg-stone-800 text-white hover:bg-stone-700 transition duration-200"
        //             >
        //               Previous
        //             </button>
        //           )}
        //           {step < 5 ? (
        //             <button
        //               onClick={handleNext}
        //               disabled={loading}
        //               className="p-3 rounded-lg bg-stone-800 text-white hover:bg-stone-700 transition duration-200"
        //             >
        //               Next
        //             </button>
        //           ) : (
        //             <button
        //               onClick={handleSubmit}
        //               disabled={loading}
        //               className="p-3 rounded-lg bg-green-600 text-white hover:bg-green-500 transition duration-200"
        //             >
        //               {loading ? 'Submitting...' : 'Submit'}
        //             </button>
        //           )}
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        // </div>
      ) : (
        <></>
      )}
    </>
  );
}
