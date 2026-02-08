'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden relative">
            {/* Background Texture/Pattern */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'url("/noise.png")', // Optional noise texture if we add one later
                    backgroundSize: '100px 100px'
                }}
            />

            {/* Decorative Circle/Sun behind */}
            <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-imperial-gold/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-auspicious-red/10 blur-3xl pointer-events-none" />

            <main className="z-10 w-full max-w-md relative">
                <AnimatePresence mode="wait">
                    {children}
                </AnimatePresence>
            </main>
        </div>
    );
}
