import React, { useState } from 'react';
import { Language } from './types.ts';
import Layout from './components/Layout.tsx';
import LandingPage from './components/LandingPage.tsx';
import Pricing from './components/Pricing.tsx';
import HelpCenter from './components/HelpCenter.tsx';
import SecurityInfo from './components/SecurityInfo.tsx';
import HowItWorks from './components/HowItWorks.tsx';
import TermsOfService from './components/TermsOfService.tsx';
import PrivacyPolicy from './components/PrivacyPolicy.tsx';
import { t } from './services/translationService.ts';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [language, setLanguage] = useState<Language>(Language.EN_GB);

  const renderContent = () => {
    switch (currentView) {
      case 'landing': return <LandingPage />;
      case 'pricing': return <Pricing onDownloadClick={() => setCurrentView('landing')} />;
      case 'help-center': return <HelpCenter />;
      case 'how-it-works': return <HowItWorks onDownloadClick={() => setCurrentView('landing')} />;
      case 'security': return <SecurityInfo />;
      case 'terms': return <TermsOfService />;
      case 'privacy': return <PrivacyPolicy />;
      default: return <LandingPage />;
    }
  };

  return (
    <Layout 
      currentView={currentView}
      onNavigate={(v) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setCurrentView(v);
      }} 
      language={language} 
      onLanguageChange={setLanguage} 
      t={key => t(key, language)}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;