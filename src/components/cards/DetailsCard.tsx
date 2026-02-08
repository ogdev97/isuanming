'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';

interface DetailsCardProps {
    onSubmit: (name: string, dob: string, birthTime: string) => void;
    language: 'en' | 'zh';
}

export default function DetailsCard({ onSubmit, language }: DetailsCardProps) {
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [birthTime, setBirthTime] = useState('');
    const isEn = language === 'en';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && dob) {
            onSubmit(name, dob, birthTime);
        }
    };

    return (
        <Card className="flex flex-col gap-6 py-8">
            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center"
            >
                <h2 className="text-2xl font-serif font-bold text-auspicious-red mb-2">
                    {isEn ? 'Your Details' : '您的详细信息'}
                </h2>
                <p className="text-stone-600 text-sm">
                    {isEn ? 'The stars need to know who you are.' : '星辰需要知道你是谁。'}
                </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700 ml-1">
                        {isEn ? 'Name' : '姓名'}
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-auspicious-red focus:ring-2 focus:ring-auspicious-red/20 outline-none transition-all bg-white/50 backdrop-blur-sm"
                        placeholder={isEn ? "Enter your name" : "输入您的姓名"}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-stone-700 ml-1">
                            {isEn ? 'Date of Birth' : '出生日期'}
                        </label>
                        <input
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-auspicious-red focus:ring-2 focus:ring-auspicious-red/20 outline-none transition-all bg-white/50 backdrop-blur-sm"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-stone-700 ml-1">
                            {isEn ? 'Time (Optional)' : '时辰 (选填)'}
                        </label>
                        <input
                            type="time"
                            value={birthTime}
                            onChange={(e) => setBirthTime(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-auspicious-red focus:ring-2 focus:ring-auspicious-red/20 outline-none transition-all bg-white/50 backdrop-blur-sm"
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    className="mt-4"
                    disabled={!name || !dob}
                >
                    {isEn ? 'Reveal My Destiny' : '揭示我的命运'}
                </Button>
            </form>
        </Card>
    );
}
