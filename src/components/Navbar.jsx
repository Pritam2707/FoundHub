import React from 'react';
import { 
  AlertCircle, 
  Search, 
  MapPin, 
  PlusCircle, 
  ShieldCheck, 
  Sparkles, 
  HeartHandshake,
  Layers,
  BarChart3
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenReportModal, 
  isAdmin, 
  setIsAdmin,
  civicCount,
  lostFoundCount
}) {
  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-stone-200/70 shadow-soft-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & App Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('civic')}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-pastel-lavender via-pastel-peach to-pastel-mint p-0.5 shadow-soft-md flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand-primary animate-pulse-subtle" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-lg sm:text-xl tracking-tight text-brand-dark">CivicBloom</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-pastel-lavender-light text-pastel-lavender-dark font-medium border border-pastel-lavender-border/50">
                  & FoundHub
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">Community Resolution & Lost Item Platform</p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 p-1 bg-stone-100/80 rounded-2xl border border-stone-200/60">
            <button
              onClick={() => setActiveTab('civic')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'civic'
                  ? 'bg-white text-brand-dark shadow-soft-sm'
                  : 'text-stone-600 hover:text-brand-dark hover:bg-white/50'
              }`}
            >
              <AlertCircle className={`w-4 h-4 ${activeTab === 'civic' ? 'text-pastel-peach-dark' : 'text-stone-400'}`} />
              <span>Civic Issues</span>
              <span className="px-1.5 py-0.2 rounded-full text-xs font-semibold bg-pastel-peach-light text-pastel-peach-dark">
                {civicCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('lostfound')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'lostfound'
                  ? 'bg-white text-brand-dark shadow-soft-sm'
                  : 'text-stone-600 hover:text-brand-dark hover:bg-white/50'
              }`}
            >
              <HeartHandshake className={`w-4 h-4 ${activeTab === 'lostfound' ? 'text-pastel-lavender-dark' : 'text-stone-400'}`} />
              <span>Lost & Found</span>
              <span className="px-1.5 py-0.2 rounded-full text-xs font-semibold bg-pastel-lavender-light text-pastel-lavender-dark">
                {lostFoundCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'map'
                  ? 'bg-white text-brand-dark shadow-soft-sm'
                  : 'text-stone-600 hover:text-brand-dark hover:bg-white/50'
              }`}
            >
              <MapPin className={`w-4 h-4 ${activeTab === 'map' ? 'text-pastel-mint-dark' : 'text-stone-400'}`} />
              <span>Interactive Map</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'admin'
                  ? 'bg-white text-brand-dark shadow-soft-sm'
                  : 'text-stone-600 hover:text-brand-dark hover:bg-white/50'
              }`}
            >
              <BarChart3 className={`w-4 h-4 ${activeTab === 'admin' ? 'text-pastel-sky-dark' : 'text-stone-400'}`} />
              <span>Ops & Insights</span>
            </button>
          </nav>

          {/* Right Action Buttons: Admin Toggle & Post CTA */}
          <div className="flex items-center space-x-2.5">
            {/* Admin Switch Pill */}
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              title="Toggle Facility Admin / Staff Mode"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                isAdmin 
                  ? 'bg-pastel-butter-light border-pastel-butter-border text-pastel-butter-dark shadow-soft-sm font-semibold' 
                  : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100'
              }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${isAdmin ? 'text-pastel-butter-dark' : 'text-stone-400'}`} />
              <span>{isAdmin ? 'Facility Staff Mode' : 'Citizen View'}</span>
            </button>

            {/* Quick Action Button */}
            <div className="relative group">
              <button
                onClick={() => onOpenReportModal(activeTab === 'lostfound' ? 'lostfound' : 'civic')}
                className="flex items-center space-x-2 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-2xl bg-brand-primary text-white font-medium text-sm shadow-soft-md hover:bg-brand-primaryHover hover:shadow-pastel-glow transition-all active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Report / Post</span>
                <span className="sm:hidden">Post</span>
              </button>
            </div>
          </div>

        </div>

        {/* Mobile Tab Row */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-stone-200/50">
          <button
            onClick={() => setActiveTab('civic')}
            className={`flex items-center space-x-1.5 py-1.5 px-3 rounded-xl text-xs font-medium ${
              activeTab === 'civic' ? 'bg-pastel-peach-light text-pastel-peach-dark font-semibold' : 'text-stone-500'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Civic ({civicCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('lostfound')}
            className={`flex items-center space-x-1.5 py-1.5 px-3 rounded-xl text-xs font-medium ${
              activeTab === 'lostfound' ? 'bg-pastel-lavender-light text-pastel-lavender-dark font-semibold' : 'text-stone-500'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Lost/Found ({lostFoundCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center space-x-1.5 py-1.5 px-3 rounded-xl text-xs font-medium ${
              activeTab === 'map' ? 'bg-pastel-mint-light text-pastel-mint-dark font-semibold' : 'text-stone-500'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Map</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center space-x-1.5 py-1.5 px-3 rounded-xl text-xs font-medium ${
              activeTab === 'admin' ? 'bg-pastel-sky-light text-pastel-sky-dark font-semibold' : 'text-stone-500'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Ops</span>
          </button>
        </div>

      </div>
    </header>
  );
}
