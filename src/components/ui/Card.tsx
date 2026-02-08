'use client';

import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx'; // Assuming clsx is installed, if not I will use simple string concatenation or install it. I installed it earlier.

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export default function Card({ children, className }: CardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={clsx(
                "bg-white/90 backdrop-blur-sm border border-imperial-gold/30 shadow-xl rounded-2xl p-6 md:p-8 w-full relative overflow-hidden",
                "before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-gradient-to-r before:from-transparent before:via-imperial-gold before:to-transparent",
                className
            )}
        >
            {children}
        </motion.div>
    );
}
