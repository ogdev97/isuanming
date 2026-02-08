'use client';

import React, { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import { motion } from 'framer-motion';

interface LoadingCardProps {
    language: 'en' | 'zh';
}

export default function LoadingCard({ language }: LoadingCardProps) {
    const isEn = language === 'en';
    const [messageIndex, setMessageIndex] = useState(0);

    const messages = isEn ? [
        "Consulting the stars...",
        "Aligning with the Fire Horse...",
        "Reading the celestial patterns...",
        "Your destiny is unfolding..."
    ] : [
        "正在咨询星辰...",
        "与火马能量对齐...",
        "解读天象模式...",
        "您的命运正在展开..."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % messages.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [isEn]);

    return (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
            {/* Galloping Horse Animation (CSS/SVG based) */}
            <div className="relative w-32 h-32 mb-8">
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, 2, -1, 0]
                    }}
                    transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="w-full h-full text-auspicious-red"
                >
                    {/* Simple Horse SVG */}
                    <img src="/horse-fire.png" alt="Galloping Horse" className="w-full h-full object-contain drop-shadow-md" />
                </motion.div>

                {/* Dust/Clouds animation under hooves */}
                <motion.div
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-stone-300/50 blur-xl rounded-full"
                />
            </div>

            <motion.p
                key={messageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-lg font-serif text-imperial-gold font-medium"
            >
                {messages[messageIndex]}
            </motion.p>
        </Card>
    );
}
