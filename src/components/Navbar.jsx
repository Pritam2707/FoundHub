import React from 'react';
import { 
  AlertCircle, 
  MapPin, 
  Plus, 
  ShieldCheck, 
  HeartHandshake,
  ArrowUpRight
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenReportModal, 
  onOpenAdminPortal,
  civicCount,
  lostFoundCount
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/70 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer" 
            onClick={() => setActiveTab('civic')}
          >
            <div className="w-8 h-8 rounded-xl bg-stone-900 flex items-center justify-center text-white text-xs font-bold shadow-subtle">
              CB
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="font-semibold text-base tracking-tight text-stone-900">CivicBloom</span>
              <span className="text-stone-300">/</span>
              <span className="text-xs text-stone-500 font-medium">FoundHub</span>
            </div>
          </div>

          {/* Center Tabs */}
          <nav className="hidden md:flex items-center space-x-1 p-1 bg-stone-100/90 rounded-xl border border-stone-200/60 text-xs font-medium">
            <button
              onClick={() => setActiveTab('civic')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'civic'
                  ? 'bg-white text-stone-900 shadow-subtle font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 text-stone-500" />
              <span>Civic Issues</span>
              <span className="text-[11px] text-stone-400 font-normal">({civicCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('lostfound')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'lostfound'
                  ? 'bg-white text-stone-900 shadow-subtle font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5 text-stone-500" />
              <span>Lost & Found</span>
              <span className="text-[11px] text-stone-400 font-normal">({lostFoundCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'map'
                  ? 'bg-white text-stone-900 shadow-subtle font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-stone-500" />
              <span>Campus Map</span>
            </button>
          </nav>

          {/* Right Action: Separate Staff Portal & Create Report */}
          <div className="flex items-center space-x-2">
            {/* Separate Staff Portal Button */}
            <button
              onClick={onOpenAdminPortal}
              className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-all"
              title="Access Facility Staff Operations Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
              <span>Staff Portal</span>
              <ArrowUpRight className="w-3 h-3 text-stone-400" />
            </button>

            {/* Main Create Action */}
            <button
              onClick={() => onOpenReportModal(activeTab === 'lostfound' ? 'lostfound' : 'civic')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-stone-900 text-white font-medium text-xs hover:bg-stone-800 transition-all shadow-subtle active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{activeTab === 'lostfound' ? 'Post Item' : 'Report Issue'}</span>
            </button>
          </div>

        </div>

        {/* Mobile Tab Row */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-stone-100 text-xs">
          <button
            onClick={() => setActiveTab('civic')}
            className={`px-2.5 py-1 rounded-lg font-medium ${
              activeTab === 'civic' ? 'bg-stone-100 text-stone-900 font-semibold' : 'text-stone-500'
            }`}
          >
            Civic ({civicCount})
          </button>

          <button
            onClick={() => setActiveTab('lostfound')}
            className={`px-2.5 py-1 rounded-lg font-medium ${
              activeTab === 'lostfound' ? 'bg-stone-100 text-stone-900 font-semibold' : 'text-stone-500'
            }`}
          >
            Lost & Found ({lostFoundCount})
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`px-2.5 py-1 rounded-lg font-medium ${
              activeTab === 'map' ? 'bg-stone-100 text-stone-900 font-semibold' : 'text-stone-500'
            }`}
          >
            Map
          </button>

          <button
            onClick={onOpenAdminPortal}
            className="px-2.5 py-1 rounded-lg font-medium text-stone-500 hover:text-stone-900"
          >
            Staff ➔
          </button>
        </div>

      </div>
    </header>
  );
}
