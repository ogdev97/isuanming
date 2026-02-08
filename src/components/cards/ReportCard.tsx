'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { FortuneReport, Pillar } from '@/types/fortune';
import { Briefcase, Heart, Coins, Activity, Sparkles, Compass, Palette, Hash, ChevronRight, ChevronLeft, Repeat, Languages } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReportCardProps {
    data: FortuneReport;
    onReset: () => void;
    language: 'en' | 'zh';
}

const SECTIONS = [
    'overview',
    'career',
    'wealth',
    'love',
    'health',
    'lucky'
] as const;

type Section = typeof SECTIONS[number];

const CircularScore = ({ score, colorClass, size = 120 }: { score: number, colorClass: string, size?: number }) => {
    const radius = size / 2 - 10;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 10) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            {/* Background Circle */}
            <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-stone-200"
                />
                {/* Progress Circle */}
                <motion.circle
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                    className={colorClass}
                />
            </svg>
            <div className="flex flex-col items-center justify-center z-10">
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                    className={cn("text-3xl font-bold font-serif", colorClass.replace('text-', 'text-'))}
                >
                    {score}
                </motion.span>
                <span className="text-xs text-stone-400 font-medium">/ 10</span>
            </div>
        </div>
    );
};

export default function ReportCard({ data, onReset, language }: ReportCardProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [displayLang, setDisplayLang] = useState<'en' | 'zh'>(language);
    const isEn = displayLang === 'en';

    const handleNext = () => {
        if (currentStep < SECTIONS.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const toggleLanguage = () => {
        setDisplayLang(prev => prev === 'en' ? 'zh' : 'en');
    };

    const renderContent = () => {
        const section = SECTIONS[currentStep];

        switch (section) {
            case 'overview':
                return (
                    <div className="flex flex-col items-center text-center space-y-6">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="space-y-2"
                        >
                            <div className="inline-block px-4 py-1 rounded-full bg-imperial-gold/20 text-stone-800 text-sm font-medium border border-imperial-gold/40">
                                {isEn ? "Year of the Fire Horse 2026" : "2026 丙午马年"}
                            </div>
                            <h2 className="text-4xl font-serif font-bold text-auspicious-red">
                                {isEn ? data.zodiac : data.zodiac_zh}
                            </h2>
                            <div className="flex justify-center gap-6 text-sm text-stone-600 mt-2">
                                <span className="flex items-center gap-1">
                                    <Sparkles size={14} />
                                    {isEn ? data.element : data.element_zh}
                                </span>
                                <span className="flex items-center gap-1"><Compass size={14} /> Kua: {data.kua}</span>
                            </div>
                        </motion.div>

                        <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 mt-4 max-w-md">
                            <p className="text-lg text-stone-800 font-medium mb-3 leading-relaxed">
                                "{isEn ? data.overview : data.overview_zh}"
                            </p>
                        </div>
                    </div>
                );

            case 'career':
            case 'wealth':
            case 'love':
            case 'health':
                const pillar = data.pillars[section];
                const config = {
                    career: { icon: Briefcase, color: "text-blue-600", bg: "bg-blue-100", title: isEn ? "Career" : "事业" },
                    wealth: { icon: Coins, color: "text-amber-500", bg: "bg-amber-100", title: isEn ? "Wealth" : "财运" },
                    love: { icon: Heart, color: "text-rose-500", bg: "bg-rose-100", title: isEn ? "Love" : "感情" },
                    health: { icon: Activity, color: "text-emerald-500", bg: "bg-emerald-100", title: isEn ? "Health" : "健康" }
                }[section];
                const Icon = config.icon;

                return (
                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className={cn("p-4 rounded-full mb-2", config.bg, config.color)}>
                            <Icon size={48} />
                        </div>
                        <h3 className="text-3xl font-serif font-bold text-stone-800">{config.title}</h3>

                        <CircularScore score={pillar.score} colorClass={config.color} />

                        <div className="bg-white/80 p-6 rounded-xl border border-stone-100 shadow-sm max-w-md">
                            <p className="text-lg text-stone-700 mb-3 leading-relaxed">
                                {isEn ? pillar.text : pillar.text_zh}
                            </p>
                        </div>
                    </div>
                );

            case 'lucky':
                // Fallback if _zh arrays are missing (safety check)
                const colors = isEn ? data.lucky.colors : (data.lucky.colors_zh || data.lucky.colors);
                const numbers = isEn ? data.lucky.numbers : (data.lucky.numbers_zh || data.lucky.numbers);
                const directions = isEn ? data.lucky.directions : (data.lucky.directions_zh || data.lucky.directions);

                return (
                    <div className="flex flex-col items-center text-center space-y-8">
                        <h3 className="text-3xl font-serif font-bold text-stone-800 mb-4">
                            {isEn ? "Your Lucky Charms" : "您的幸运物"}
                        </h3>

                        <div className="grid grid-cols-1 gap-4 w-full max-w-md">
                            <div className="bg-stone-50 p-4 rounded-xl flex items-center gap-4 border border-stone-100">
                                <div className="p-3 bg-imperial-gold/10 text-imperial-gold rounded-full"><Palette size={24} /></div>
                                <div className="text-left">
                                    <div className="text-xs text-stone-500 uppercase tracking-wider">
                                        {isEn ? "Colors" : "幸运色"}
                                    </div>
                                    <div className="font-bold text-stone-800">
                                        {colors?.join(", ")}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-stone-50 p-4 rounded-xl flex items-center gap-4 border border-stone-100">
                                <div className="p-3 bg-imperial-gold/10 text-imperial-gold rounded-full"><Hash size={24} /></div>
                                <div className="text-left">
                                    <div className="text-xs text-stone-500 uppercase tracking-wider">
                                        {isEn ? "Numbers" : "幸运数字"}
                                    </div>
                                    <div className="font-bold text-stone-800">
                                        {numbers?.join(", ")}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-stone-50 p-4 rounded-xl flex items-center gap-4 border border-stone-100">
                                <div className="p-3 bg-imperial-gold/10 text-imperial-gold rounded-full"><Compass size={24} /></div>
                                <div className="text-left">
                                    <div className="text-xs text-stone-500 uppercase tracking-wider">
                                        {isEn ? "Directions" : "吉利方位"}
                                    </div>
                                    <div className="font-bold text-stone-800">
                                        {directions?.join(", ")}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button onClick={onReset} variant="outline" className="px-8 gap-2">
                                <Repeat size={16} />
                                {isEn ? 'Start Over' : '重新开始'}
                            </Button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <Card className="max-w-xl w-full py-8 px-4 md:px-8 min-h-[600px] flex flex-col relative overflow-hidden">
            {/* Language Toggle */}
            <div className="absolute top-4 right-4 z-20">
                <Button
                    variant="ghost"
                    onClick={toggleLanguage}
                    className="p-2 h-auto rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100"
                    title={isEn ? "Switch to Chinese" : "Switch to English"}
                >
                    <Languages size={20} />
                    <span className="sr-only">Toggle Language</span>
                </Button>
            </div>

            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-stone-100">
                <motion.div
                    className="h-full bg-auspicious-red"
                    animate={{ width: `${((currentStep + 1) / SECTIONS.length) * 100}%` }}
                />
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col justify-center py-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${currentStep}-${displayLang}`} // Key includes language to force re-render/anim on switch
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            {SECTIONS[currentStep] !== 'lucky' && (
                <div className="flex justify-between items-center mt-auto pt-6 border-t border-stone-100">
                    <Button
                        variant="ghost"
                        onClick={handlePrev}
                        disabled={currentStep === 0}
                        className={cn("text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-full px-4", currentStep === 0 && "opacity-0 pointer-events-none")}
                    >
                        <ChevronLeft size={20} className="mr-1" /> {isEn ? "Back" : "返回"}
                    </Button>

                    <div className="flex gap-2">
                        {SECTIONS.map((_, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "w-2 h-2 rounded-full transition-all duration-300",
                                    idx === currentStep ? "bg-auspicious-red w-4" : "bg-stone-200"
                                )}
                            />
                        ))}
                    </div>

                    <Button
                        onClick={handleNext}
                        variant="primary"
                        className="pl-6 pr-4 rounded-full shadow-xl shadow-red-500/20 min-w-[120px]"
                    >
                        {isEn ? "Next" : "下一步"} <ChevronRight size={20} className="ml-1" />
                    </Button>
                </div>
            )}
        </Card>
    );
}
