import React, { useState, useEffect } from 'react';
import { Download, Sparkles, X, Smartphone } from 'lucide-react';

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  if (isInstalled || isDismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-surface/95 backdrop-blur-md p-4 rounded-3xl border border-stone-200 shadow-soft-lg flex items-center justify-between gap-3 animate-slide-up">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pastel-lavender via-pastel-peach to-pastel-mint p-0.5 shrink-0 flex items-center justify-center">
          <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-brand-primary font-bold">
            <Smartphone className="w-5 h-5" />
          </div>
        </div>
        <div>
          <h4 className="text-xs font-bold text-brand-dark flex items-center space-x-1">
            <span>Install CivicBloom PWA</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-pastel-mint-light text-pastel-mint-dark font-semibold">Offline Ready</span>
          </h4>
          <p className="text-[11px] text-stone-500 line-clamp-1">Fast access on mobile & desktop with offline cache</p>
        </div>
      </div>

      <div className="flex items-center space-x-1.5 shrink-0">
        <button
          onClick={handleInstallClick}
          className="px-3 py-1.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-primaryHover shadow-soft-sm transition-all flex items-center space-x-1"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install</span>
        </button>
        <button
          onClick={() => setIsDismissed(true)}
          className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
