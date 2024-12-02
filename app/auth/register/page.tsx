'use client';

import Image from "next/image";
import { useState } from "react";

import {
    validateEmail, validatePasswordStrength,
    registerHandler
} from '@/app/lib/auth';

// https://cdn.dribbble.com/userupload/14908601/file/original-0364202fb134d5708b4466efc20cf6df.png?resize=705x529&vertical=center

export default function Register() {
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>(""); 
    const [username, setUsername] = useState<string>(""); 


    return (
        <div className="flex h-screen w-screen justify-center items-center">
        <div className="w-10/12 h-5/6 bg-white">
            <h1>hello!</h1>
        </div>
        </div>
    );
}