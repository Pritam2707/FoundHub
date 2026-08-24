import React from 'react';
import { 
  AlertCircle, 
  MapPin, 
  Plus, 
  ShieldCheck, 
  HeartHandshake, 
  Sun, 
  Moon,
  Sparkles
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenReportModal, 
  onOpenAdminPortal,
  civicCount,
  lostFoundCount,
  isDark,
  onToggleTheme
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer" 
            onClick={() => setActiveTab('civic')}
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-subtle">
              🌸
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-base tracking-tight text-stone-900 dark:text-white">CivicBloom</span>
              <span className="text-stone-300 dark:text-stone-700">/</span>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">FoundHub</span>
            </div>
          </div>

          {/* Center Tabs */}
          <nav className="hidden md:flex items-center space-x-1 p-1 bg-stone-100/90 dark:bg-stone-800/80 rounded-xl border border-stone-200/60 dark:border-stone-700 text-xs font-medium">
            <button
              onClick={() => setActiveTab('civic')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'civic'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-subtle font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <AlertCircle className={`w-3.5 h-3.5 ${activeTab === 'civic' ? 'text-amber-500' : 'text-stone-400'}`} />
              <span>Civic Issues</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                {civicCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('lostfound')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'lostfound'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-subtle font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <HeartHandshake className={`w-3.5 h-3.5 ${activeTab === 'lostfound' ? 'text-pink-500' : 'text-stone-400'}`} />
              <span>Lost & Found</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-pink-100 dark:bg-pink-950 text-pink-800 dark:text-pink-300">
                {lostFoundCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'map'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-subtle font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <MapPin className={`w-3.5 h-3.5 ${activeTab === 'map' ? 'text-emerald-500' : 'text-stone-400'}`} />
              <span>Satellite Map</span>
            </button>
          </nav>

          {/* Right Action Items: Theme Toggle, Staff Portal, Create Action */}
          <div className="flex items-center space-x-2">
            
            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-stone-700 transition-all border border-stone-200 dark:border-stone-700"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Separate Staff Portal */}
            <button
              onClick={onOpenAdminPortal}
              className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 transition-all"
              title="Access Facility Operations Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Staff Portal</span>
            </button>

            {/* Main Create Action */}
            <button
              onClick={() => onOpenReportModal(activeTab === 'lostfound' ? 'lostfound' : 'civic')}
              className="flex items-center space-x-1 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-glow-indigo active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{activeTab === 'lostfound' ? 'Post Item' : 'Report Issue'}</span>
            </button>
          </div>

        </div>

        {/* Mobile Tab Bar */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-stone-100 dark:border-stone-800 text-xs">
          <button
            onClick={() => setActiveTab('civic')}
            className={`px-2.5 py-1 rounded-lg font-medium ${
              activeTab === 'civic' ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-bold' : 'text-stone-500'
            }`}
          >
            Civic ({civicCount})
          </button>

          <button
            onClick={() => setActiveTab('lostfound')}
            className={`px-2.5 py-1 rounded-lg font-medium ${
              activeTab === 'lostfound' ? 'bg-pink-100 dark:bg-pink-950 text-pink-900 dark:text-pink-200 font-bold' : 'text-stone-500'
            }`}
          >
            Lost & Found ({lostFoundCount})
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`px-2.5 py-1 rounded-lg font-medium ${
              activeTab === 'map' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 font-bold' : 'text-stone-500'
            }`}
          >
            Satellite
          </button>

          <button
            onClick={onOpenAdminPortal}
            className="px-2 py-1 rounded-lg font-medium text-emerald-600 dark:text-emerald-400"
          >
            Staff ➔
          </button>
        </div>

      </div>
    </header>
  );
}
