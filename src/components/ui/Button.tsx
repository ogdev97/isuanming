'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

// Extend HTMLMotionProps but override children to be standard ReactNode
interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    fullWidth?: boolean;
}

export default function Button({
    children,
    variant = 'primary',
    fullWidth = false,
    className,
    ...props
}: ButtonProps) {

    const baseStyles = "relative px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden";

    const variants = {
        primary: "bg-auspicious-red text-white shadow-lg hover:bg-red-700 hover:shadow-red-500/20 active:scale-95",
        secondary: "bg-imperial-gold text-stone-900 shadow-md hover:bg-yellow-400 active:scale-95",
        outline: "border-2 border-stone-800 text-stone-800 hover:bg-stone-100 active:scale-95",
        ghost: "bg-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-100/50 active:scale-95",
    };

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            className={cn(
                baseStyles,
                variants[variant],
                fullWidth && "w-full",
                className
            )}
            {...props}
        >
            <span className="relative z-10">{children}</span>
            {/* Shine effect on hover for primary/secondary */}
            {variant !== 'outline' && (
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shine_1s_ease-in-out] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
            )}
        </motion.button>
    );
}
