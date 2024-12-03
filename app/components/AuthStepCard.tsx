import { FC } from "react";

interface AuthStepCardProps {
    step: number; 
    isActive: boolean;
}

const AuthStepCard : FC<AuthStepCardProps> = ({ step, isActive }) => {
    return (
        <div className={`h-1/4 w-full rounded-xl flex flex-row items-center ${isActive ?  "bg-white/[.6]" : "bg-stone-950"} `}>
            <div className={`flex justify-center items-center ml-2 rounded-full bg-black w-[2.5vw] h-[2.5vw]`}>
                <span className="text-white font-work font-bold">{step}</span>
            </div>
        </div>
    )
};

export default AuthStepCard;