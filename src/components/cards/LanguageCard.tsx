'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';

interface LanguageCardProps {
    onSelectLanguage: (lang: 'en' | 'zh') => void;
}

export default function LanguageCard({ onSelectLanguage }: LanguageCardProps) {
    return (
        <Card className="flex flex-col items-center text-center gap-6 py-12">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-auspicious-red mb-4"
            >
                {/* Simple SVG Horse Icon / Calligraphy Style */}
                <img src="/horse-fire.png" alt="Fire Horse" className="w-48 h-48 object-contain drop-shadow-xl" />
            </motion.div>

            <div className="space-y-4">
                <h1 className="text-3xl font-serif font-bold tracking-wider text-stone-800">
                    2026 Year of the Horse
                </h1>
                <p className="text-stone-600 max-w-xs mx-auto text-sm italic">
                    Discover your destiny in the Year of the Fire Horse (Bing Wu).
                </p>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-xs mt-6">
                <Button onClick={() => onSelectLanguage('en')} variant="primary" fullWidth className="group">
                    Reveal My Destiny
                    <span className="text-xs opacity-70 group-hover:opacity-100 transition-opacity ml-2">(English)</span>
                </Button>
                <Button onClick={() => onSelectLanguage('zh')} variant="secondary" fullWidth className="group">
                    解开命运之谜
                    <span className="text-xs opacity-70 group-hover:opacity-100 transition-opacity ml-2">(中文)</span>
                </Button>
            </div>
        </Card>
    );
}
