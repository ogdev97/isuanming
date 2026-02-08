'use client';

import React, { useState } from 'react';
import AppWrapper from '@/components/layout/AppWrapper';
import LanguageCard from '@/components/cards/LanguageCard';
import GenderCard from '@/components/cards/GenderCard';
import DetailsCard from '@/components/cards/DetailsCard';
import LoadingCard from '@/components/cards/LoadingCard';
import ReportCard from '@/components/cards/ReportCard';
import { API_ENDPOINT } from '@/lib/constants';
import { FortuneReport } from '@/types/fortune';
import Button from '@/components/ui/Button';
import { ChevronLeft } from 'lucide-react';

// Define the steps of the application
type Step = 'language' | 'gender' | 'details' | 'loading' | 'report';

export default function Home() {
  const [step, setStep] = useState<Step>('language');
  const [userData, setUserData] = useState({
    language: 'en' as 'en' | 'zh',
    gender: '' as 'male' | 'female',
    name: '',
    dob: '',
    birthTime: '',
  });
  const [report, setReport] = useState<FortuneReport | null>(null);
  const [error, setError] = useState('');

  const handleLanguageSelect = (lang: 'en' | 'zh') => {
    setUserData(prev => ({ ...prev, language: lang }));
    setStep('gender');
  };

  const handleGenderSelect = (gender: 'male' | 'female') => {
    setUserData(prev => ({ ...prev, gender }));
    setStep('details');
  };

  const handleDetailsSubmit = async (name: string, dob: string, birthTime: string) => {
    setUserData(prev => ({ ...prev, name, dob, birthTime }));
    setStep('loading');
    setError('');
    setReport(null);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          dob,
          birthTime,
          gender: userData.gender,
          language: userData.language
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to fetch fortune');
      }

      const data = await response.json();
      setReport(data);
      setStep('report');
    } catch (err: any) {
      console.error(err);
      const fallbackError = userData.language === 'en' ? 'The stars are clouded. Please try again.' : '星象模糊，请重试。';
      setError(err.message || fallbackError);
      setStep('details');
    }
  };

  const handleReset = () => {
    setStep('language');
    setUserData({ language: 'en', gender: 'male', name: '', dob: '', birthTime: '' });
    setReport(null);
  };

  const handleBack = () => {
    if (step === 'gender') {
      setStep('language');
    } else if (step === 'details') {
      setStep('gender');
    }
  };

  return (
    <AppWrapper>
      {/* Global Back Button */}
      {(step === 'gender' || step === 'details') && (
        <div className="absolute top-4 left-4 z-50">
          <Button
            variant="outline"
            onClick={handleBack}
            className="p-2 aspect-square rounded-full border-none bg-white/50 backdrop-blur-sm hover:bg-white/80 shadow-sm"
          >
            <ChevronLeft size={24} className="text-stone-600" />
          </Button>
        </div>
      )}

      {step === 'language' && (
        <LanguageCard onSelectLanguage={handleLanguageSelect} />
      )}

      {step === 'gender' && (
        <GenderCard onSelect={handleGenderSelect} language={userData.language} />
      )}

      {step === 'details' && (
        <React.Fragment>
          <DetailsCard onSubmit={handleDetailsSubmit} language={userData.language} />
          {error && (
            <div className="absolute top-4 left-0 w-full flex justify-center z-50">
              <p className="bg-red-100 text-red-800 px-4 py-2 rounded-full shadow-lg text-sm">{error}</p>
            </div>
          )}
        </React.Fragment>
      )}

      {step === 'loading' && (
        <LoadingCard language={userData.language} />
      )}

      {step === 'report' && report && (
        <ReportCard data={report} onReset={handleReset} language={userData.language} />
      )}
    </AppWrapper>
  );
}
