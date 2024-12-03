'use client';

import Image from "next/image";
import { useState } from "react";

import {
    validateEmail, validatePasswordStrength,
    registerHandler
} from '@/app/lib/auth';
import AuthStepCard from "@/app/components/AuthStepCard";

// https://cdn.dribbble.com/userupload/14908601/file/original-0364202fb134d5708b4466efc20cf6df.png?resize=705x529&vertical=center

export default function Register() {
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>(""); 
    const [username, setUsername] = useState<string>(""); 


    return (
        <div className="flex h-screen w-screen justify-center items-center">
        <div className="w-10/12 h-5/6 bg-white rounded-3xl">
            <div
            className="w-1/2 h-full relative flex flex-col items-center justify-end rounded-l-3xl z-0"
            style={{
                background: `radial-gradient(70% 60% at 50% 85%, var(--bunting) 50%, var(--bunting) 100%)`,
            }}
            >
            <div style={{ content: "''", position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: `url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAAAXNSR0IArs4c6QAAAIFJREFUGFc1i7sNwkAQRGeFSBwQEAOiBzqgBpzvYXtdk/eQbmmEQogs6MGJdTq0J5HMRzOPCMC96/Y5593TbC4EtLd2Q4H5nMxmgMCBj5bS17MDkFG2OunqxQkXqu6jjE3UafHc98OlDoPISTV+6uVPiEhTSjnE+HgTCpjDNVl6/QCorzBsJWmYUAAAAABJRU5ErkJggg==')`, backgroundBlendMode: 'overlay', opacity: 0.7,  pointerEvents: 'none', zIndex: 10 }}
            />
                <h1 className="text-white text-4xl font-work uppercase font-bold">Get started with Bazaar.ly</h1>
                <p className="text-white/[.5] font-work">Complete these easy steps to get started in no time</p>
                <div className="flex flex-col gap-1 h-1/3 w-3/6 z-20 mt-5">
                    <AuthStepCard step={1} isActive={true}/>
                    <AuthStepCard step={2} isActive={false}/>
                    <AuthStepCard step={3} isActive={false}/>
                </div>
            </div>
        </div>
        </div>
    );
}