import React, { useState } from 'react';
import { 
  MapPin, 
  Flame, 
  ExternalLink, 
  Layers, 
  Sparkles, 
  Globe2,
  Navigation,
  AlertTriangle,
  HeartHandshake
} from 'lucide-react';
import { IIEST_WIKI_MAP_URL, IIEST_CAMPUS_BUILDINGS } from '../types';

export default function InteractiveMap({ 
  civicIssues, 
  lostFoundItems, 
  onSelectCivicIssue, 
  onSelectLostFound,
  isDark 
}) {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [activeIssueOverlay, setActiveIssueOverlay] = useState(null);

  const unresolvedCivic = civicIssues.filter(i => i.status !== 'resolved');
  const lostItems = lostFoundItems.filter(i => i.type === 'lost' && i.status !== 'reunited');
  const foundItems = lostFoundItems.filter(i => i.type === 'found' && i.status !== 'reunited');

  const filteredCivic = selectedCategoryFilter === 'all' || selectedCategoryFilter === 'civic' 
    ? civicIssues 
    : [];

  const filteredLost = selectedCategoryFilter === 'all' || selectedCategoryFilter === 'lost' 
    ? lostItems 
    : [];

  const filteredFound = selectedCategoryFilter === 'all' || selectedCategoryFilter === 'found' 
    ? foundItems 
    : [];

  const totalPins = filteredCivic.length + filteredLost.length + filteredFound.length;

  return (
    <div className="space-y-4 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
              IIEST Shibpur Campus Map
            </h1>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>maps.iiest.wiki Engine Active</span>
            </span>
          </div>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm mt-0.5">
            Using the official hand-surveyed aerial map and labeled building database from <strong>maps.iiest.wiki</strong>.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <a
            href={IIEST_WIKI_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-glow-indigo transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Fullscreen maps.iiest.wiki ↗</span>
          </a>
        </div>
      </div>

      {/* Live Issue Triage & Incident Quick Bar */}
      <div className="bg-white dark:bg-stone-900 p-3.5 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-stone-400 font-bold text-[11px] mr-1">Overlay Reports:</span>
          
          <button
            onClick={() => setSelectedCategoryFilter('all')}
            className={`px-3 py-1 rounded-lg transition-all font-bold ${
              selectedCategoryFilter === 'all'
                ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-subtle'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
            }`}
          >
            All Live Reports ({totalPins})
          </button>

          <button
            onClick={() => setSelectedCategoryFilter('civic')}
            className={`px-3 py-1 rounded-lg transition-all font-bold flex items-center space-x-1 ${
              selectedCategoryFilter === 'civic'
                ? 'bg-amber-500 text-white shadow-glow-amber'
                : 'bg-stone-100 dark:bg-stone-800 text-amber-700 dark:text-amber-400 hover:bg-amber-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Civic Hazards ({civicIssues.length})</span>
          </button>

          <button
            onClick={() => setSelectedCategoryFilter('lost')}
            className={`px-3 py-1 rounded-lg transition-all font-bold flex items-center space-x-1 ${
              selectedCategoryFilter === 'lost'
                ? 'bg-pink-600 text-white shadow-subtle'
                : 'bg-stone-100 dark:bg-stone-800 text-pink-700 dark:text-pink-400 hover:bg-pink-100'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Lost Items ({lostItems.length})</span>
          </button>
        </div>

        {/* Quick Report Navigation Strip */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
          <span className="text-stone-400 font-bold text-[11px] shrink-0">Recent Pins:</span>
          {civicIssues.slice(0, 4).map(issue => (
            <button
              key={issue.id}
              onClick={() => onSelectCivicIssue(issue)}
              className="whitespace-nowrap px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-all flex items-center space-x-1 font-semibold"
              title={issue.title}
            >
              <Flame className="w-3 h-3 text-orange-500 fill-current" />
              <span className="truncate max-w-[130px]">{issue.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Official maps.iiest.wiki Live Interactive Embedded Engine */}
      <div className="w-full h-[660px] rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-card-dark bg-stone-950 relative">
        <iframe
          src={IIEST_WIKI_MAP_URL}
          title="IIEST Shibpur Campus Map (maps.iiest.wiki)"
          className="w-full h-full border-0"
          allow="geolocation"
          loading="lazy"
        />

        {/* Floating Quick Action Overlay */}
        <div className="absolute top-4 right-4 bg-stone-900/90 backdrop-blur-md border border-stone-700 text-white p-3 rounded-2xl shadow-card-dark text-xs max-w-xs pointer-events-auto hidden sm:block">
          <div className="flex items-center space-x-1.5 text-emerald-400 font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hand-Surveyed IIEST Layer</span>
          </div>
          <p className="text-stone-300 text-[11px] leading-relaxed">
            All buildings, departments, hostels, laboratories, and paths are surveyed and labeled directly in this map.
          </p>
        </div>
      </div>

    </div>
  );
}
