import React, { useState } from 'react';
import Image from 'next/image';

import discardIcon from '@/app/assets/images/discard.svg';
import clothesIcon from '@/app/assets/images/clothes.svg';
import foodIcon from '@/app/assets/images/food.svg';
import crossIcon from '@/app/assets/images/cross.svg';


interface Variation {
  id: number;
  name: string;
}

export interface VariationBase {
  id: number;
  name: string;
  variations: Variation[];
}

interface ProductVariationsProps {
  variations: VariationBase[] | undefined;
  setVariations: React.Dispatch<React.SetStateAction<VariationBase[] | undefined>>;
  selectedCategory: string;
}

const ProductVariations: React.FC<ProductVariationsProps> = ({ variations, setVariations, selectedCategory }) => {
  const [isVariationPopupVisible, setIsVariationPopupVisible] = useState(false);
  const [currentBaseId, setCurrentBaseId] = useState<number | null>(null);
  const [newVariation, setNewVariation] = useState<Variation>({
    id: Date.now(),
    name: '',
  });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [editingBaseName, setEditingBaseName] = useState<string>('');
  const [editActiveBaseId, setEditActiveBaseId] = useState<number | null>(null);


  const handleRemoveVariation = (baseId: number, variationId: number) => {
    setVariations(prev =>
      prev?.map(base =>
        base.id === baseId
          ? {
              ...base,
              variations: base.variations.filter(variation => variation.id !== variationId),
            }
          : base
      )
    );
  };
  

  const handleAddVariation = (baseId: number) => {
    setCurrentBaseId(baseId);
    setNewVariation({
      id: Date.now(),
      name: '',
    });
    setIsVariationPopupVisible(true);
  };

  const handleSaveNewVariation = () => {
    if (!newVariation.name) {
      setErrorMessage("Variation name is required.");
      return;
    }

    if (currentBaseId !== null) {
      setVariations(prev =>
        prev?.map(base =>
          base.id === currentBaseId
            ? {
                ...base,
                variations: [...base.variations, newVariation],
              }
            : base
        )
      );
    }
    setErrorMessage('');
    setIsVariationPopupVisible(false);
  };

  const handleBaseDoubleClick = (baseId: number, currentName: string) => {
    setEditingBaseName(currentName);
    setEditActiveBaseId(baseId);
  };

  const handleBaseNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingBaseName(e.target.value);
  };

  const handleSaveBaseName = () => {
    if (editActiveBaseId !== null) {
      setVariations(prev =>
        prev?.map(base =>
          base.id === editActiveBaseId
            ? { ...base, name: editingBaseName }
            : base
        )
      );
      setEditActiveBaseId(null); // Close editing mode
    }
  };

  return (
    <div className='w-full'>
      {selectedCategory && variations?.map(base => (
      <div key={base.id} className="flex justify-center items-center flex-row gap-2">
        <h1 className="w-1/6 flex flex-col mb-[-1em] font-work font-xs underline-offset-0 decoration-[var(--lunting)]">{base.name}</h1>
        <div key={base.id} className="flex flex-row items-center w-full gap-3">

          {/* <button
            onClick={() => handleAddVariation(base.id)}
            className="text-sm text-blue-400 hover:text-blue-500 transition ease-in-out mb-2"
          >
            Add Variation
          </button> */}

          {base.variations.map(variation => (
            <div key={variation.id} className="flex flex-col items-end justify-center m-0">
              <button
                onClick={() => handleRemoveVariation(base.id, variation.id)}
                className="flex flex-row items-center justify-center relative top-2 left-1 bg-white/40 w-3 h-3 font-bold rounded-full  transition ease-in-out duration-300"
              >
              <Image
                src={crossIcon}
                alt="X"
                width={100} 
                height={100}  
                className="w-2 h-2 rounded-xl object-cover"  
              />
                
              </button>
              <div className="flex font-work w-8 h-8 p-4 px-8 items-center justify-center bg-stone-950 hover:bg-white/20 transition ease-in-out duration-300 rounded-md">
                {variation.name}
              </div>
            </div>
          ))}

          <div className="flex flex-col items-end justify-center m-0 ">
            <button
              hidden
              onClick={() => {              }}
              className="flex flex-row items-center justify-center relative top-2 left-1 bg-transparent w-3 h-3 font-bold rounded-full  transition ease-in-out duration-300"
            >
            <Image
              src={crossIcon}
              alt="X"
              width={100} 
              height={100}
              hidden  
              className="w-3 h-3 rounded-xl object-cover"  
            />
              
            </button>
                
            <button
              onClick={() => handleAddVariation(base.id)}
              className="bg-white/40 w-8 h-8 p-2 px-6 font-bold flex items-center justify-center hover:bg-[var(--dlunting)] transition ease-in-out duration-300 rounded-md"
            >
              +
            </button>
          </div>
        </div>
      </div>
      ))}

      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

      {isVariationPopupVisible && (
        <div className="flex flex-row tooltip-dropdown relative bg-stone-950 text-white rounded-xl p-3 w-3/4 h-12 shadow-lg z-50">
          <input
            type="text"
            value={newVariation.name}
            onChange={e => setNewVariation({ ...newVariation, name: e.target.value })}
            placeholder="Variation Name"
            className="w-4/6 p-3 bg-stone-900/30 text-md rounded-md focus:outline-none focus:border focus:border-[var(--dlunting)]"
          />

          <div className="flex ml-3 w-2/6 items-center justify-between">
            <button
              onClick={handleSaveNewVariation}
              className="w-4/6 bg-[var(--bunting)] hover:bg-[var(--dlunting)] transition ease-in-out duration-300 text-white font-medium rounded-xl px-4 py-2"
            >
              Save
            </button>
            <button
              onClick={() => setIsVariationPopupVisible(false)}
              className="flex flex-row justify-center items-center text-red-500 hover:bg-red-500/20 transition ease-in-out duration-300 w-2/6 h-full rounded-xl ml-2"
            >
              <Image
                src={discardIcon}
                width={20}
                height={20}
                alt="Cancel"
                className="w-6 h-6"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVariations;
