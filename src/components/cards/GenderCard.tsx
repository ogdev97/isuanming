'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';

interface GenderCardProps {
    onSelect: (gender: 'male' | 'female') => void;
    language: 'en' | 'zh';
}

export default function GenderCard({ onSelect, language }: GenderCardProps) {
    const isEn = language === 'en';

    return (
        <Card className="flex flex-col items-center text-center gap-6 py-10">
            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <h2 className="text-2xl font-serif font-bold text-auspicious-red mb-2">
                    {isEn ? 'Select Gender' : '选择性别'}
                </h2>
                <p className="text-stone-600 text-sm">
                    {isEn ? 'Yin or Yang? This helps align the energies.' : '阴还是阳？这将有助于调整能量。'}
                </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 w-full mt-4">
                <Button
                    onClick={() => onSelect('male')}
                    variant="outline"
                    className="flex flex-col gap-2 py-8 hover:border-imperial-gold hover:bg-imperial-gold/10"
                >
                    <span className="text-3xl">🐉</span>
                    <span>{isEn ? 'Male' : '男'}</span>
                </Button>
                <Button
                    onClick={() => onSelect('female')}
                    variant="outline"
                    className="flex flex-col gap-2 py-8 hover:border-auspicious-red hover:bg-auspicious-red/10"
                >
                    <span className="text-3xl">🦚</span>
                    <span>{isEn ? 'Female' : '女'}</span>
                </Button>
            </div>
        </Card>
    );
}
