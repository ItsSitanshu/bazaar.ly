'use client';

import Image from "next/image";

import AuthButton from "@/app/components/AuthButton";
import AuthLoginForm from "@/app/components/AuthLoginForm";

export default function Login() {
    return (
        <div className=" flex h-screen w-screen justify-center items-center">
        <div className="flex flex-row justify-start w-10/12 h-5/6 bg-stone-950 rounded-3xl">
            <div className="w-1/2 h-full relative flex flex-col items-center justify-center rounded-l-3xl z-0" style={{
                background: `radial-gradient(100% 80% at 1% 1%, var(--bunting) -100%, var(--black) 30%, var(--bunting) 100%, var(--white) 200%)`,
            }}
            >
            <div style={{ content: "''", position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: `url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAAAXNSR0IArs4c6QAAAIFJREFUGFc1i7sNwkAQRGeFSBwQEAOiBzqgBpzvYXtdk/eQbmmEQogs6MGJdTq0J5HMRzOPCMC96/Y5593TbC4EtLd2Q4H5nMxmgMCBj5bS17MDkFG2OunqxQkXqu6jjE3UafHc98OlDoPISTV+6uVPiEhTSjnE+HgTCpjDNVl6/QCorzBsJWmYUAAAAABJRU5ErkJggg==')`, backgroundBlendMode: 'overlay', opacity: 0.7,  pointerEvents: 'none', zIndex: 10, borderTopLeftRadius: 'inherit', borderBottomLeftRadius: 'inherit' }}
            />
                <h1 className="text-white text-5xl font-work uppercase font-bold">Welcome back to</h1>
                <div className="flex flex-row">
                    <h1 className="text-white text-6xl font-work uppercase font-bold hover:text-white/60 tansition duration-300 ease-in-out">Bazaar.ly</h1>                    
                    <Image aria-hidden src="/logo.svg" alt="File icon" width={32} height={32} className="ml-2"/>
                </div>
                <p className="text-white/[.5] font-cutive text-sm text-thin">build your bazaar, the you way</p>
            </div>
            <div className="w-1/2 h-full relative flex flex-col items-center justify-center z-0">
            <div className="w-9/12 flex flex-col items-center justify-center pt-16">
                <h1 className="text-white font-cutive text-xl">Login to your Account</h1>
                <p className="text-white/[.5] font-work text-sm">Welcome back! Are you ready to start selling?</p>
                <AuthButton/>
                <AuthLoginForm/>
            </div>
            </div>
        </div>

        </div>
    );
}