import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  Sparkles, 
  HeartHandshake, 
  Award, 
  Plus,
  ArrowRight
} from 'lucide-react';
import { LOST_FOUND_CATEGORIES } from '../types';
import { findMatchesForPost } from '../services/matchingEngine';
import Icon from './Icon';

export default function LostFoundView({ 
  items, 
  onSelectItem, 
  onOpenCreateModal 
}) {
  const [selectedType, setSelectedType] = useState('all'); // 'all', 'lost', 'found', 'reunited'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered Items
  const filteredItems = useMemo(() => {
    let result = [...items];

    if (selectedType === 'lost') {
      result = result.filter(item => item.type === 'lost' && item.status !== 'reunited');
    } else if (selectedType === 'found') {
      result = result.filter(item => item.type === 'found' && item.status !== 'reunited');
    } else if (selectedType === 'reunited') {
      result = result.filter(item => item.status === 'reunited');
    }

    if (selectedCategory !== 'all') {
      result = result.filter(item => item.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        item =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.locationName?.toLowerCase().includes(q) ||
          item.color?.toLowerCase().includes(q) ||
          item.brand?.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [items, selectedType, selectedCategory, searchQuery]);

  // System Smart Matches
  const systemMatches = useMemo(() => {
    const matchesFound = [];
    const lostItems = items.filter(i => i.type === 'lost' && i.status !== 'reunited');
    
    for (const lost of lostItems) {
      const candidates = findMatchesForPost(lost, items, 60);
      if (candidates.length > 0) {
        matchesFound.push({
          lostItem: lost,
          foundItem: candidates[0].matchedItem,
          score: candidates[0].score,
          reasons: candidates[0].reasons,
        });
      }
    }
    return matchesFound;
  }, [items]);

  const getCategoryInfo = (catId) => {
    return LOST_FOUND_CATEGORIES.find(c => c.id === catId) || { label: catId, icon: 'Package' };
  };

  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Clean Minimal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
            Lost & Found Community Hub
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
            Auto-matches lost and found listings using categories, keywords, and location proximity.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => onOpenCreateModal('lost')}
            className="px-3.5 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-all flex items-center space-x-1.5 shadow-subtle"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post an Item</span>
          </button>
        </div>
      </div>

      {/* Discreet Smart Match Suggestion Alert */}
      {systemMatches.length > 0 && (
        <div className="bg-indigo-50/70 border border-indigo-100 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-indigo-950 block">
                {systemMatches.length} Possible Match Pair Detected
              </span>
              <span className="text-indigo-700">
                "{systemMatches[0].lostItem.title}" matches with "{systemMatches[0].foundItem.title}" ({systemMatches[0].score}% confidence)
              </span>
            </div>
          </div>

          <button
            onClick={() => onSelectItem(systemMatches[0].lostItem)}
            className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 rounded-lg font-semibold hover:bg-indigo-50 transition-all flex items-center space-x-1 shrink-0 self-start sm:self-center"
          >
            <span>Review Match</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-subtle space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by item name, color, brand, or location..."
              className="w-full pl-9 pr-4 py-2 bg-stone-50/80 hover:bg-stone-50 focus:bg-white border border-stone-200/80 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 transition-all placeholder:text-stone-400"
            />
          </div>

          {/* Type Segmented Controller */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-xl text-xs font-medium">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedType === 'all' ? 'bg-white text-stone-900 shadow-subtle font-semibold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedType('lost')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedType === 'lost' ? 'bg-white text-stone-900 shadow-subtle font-semibold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Lost
            </button>
            <button
              onClick={() => setSelectedType('found')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedType === 'found' ? 'bg-white text-stone-900 shadow-subtle font-semibold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Found
            </button>
            <button
              onClick={() => setSelectedType('reunited')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedType === 'reunited' ? 'bg-white text-stone-900 shadow-subtle font-semibold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Reunited
            </button>
          </div>
        </div>

        {/* Minimal Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`whitespace-nowrap px-3 py-1 rounded-lg transition-all font-medium ${
              selectedCategory === 'all'
                ? 'bg-stone-900 text-white shadow-subtle'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            All Categories
          </button>

          {LOST_FOUND_CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-3 py-1 rounded-lg transition-all flex items-center space-x-1 font-medium ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-subtle'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Icon name={cat.icon} className="w-3 h-3 text-stone-400" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Items */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200/80 p-12 text-center shadow-subtle">
          <p className="text-sm font-semibold text-stone-800">No items found</p>
          <p className="text-xs text-stone-400 mt-1">Try switching tabs or adjusting search keywords</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => {
            const category = getCategoryInfo(item.category);
            const isLost = item.type === 'lost';
            const isReunited = item.status === 'reunited';

            const candidateMatches = findMatchesForPost(item, items, 60);
            const topMatch = candidateMatches[0];

            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="group bg-white rounded-2xl border border-stone-200/80 hover:border-stone-400/80 p-3.5 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-stone-100 mb-3 border border-stone-100">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300">
                        <Icon name={category.icon} className="w-8 h-8" />
                      </div>
                    )}

                    {/* Minimal Type Badge */}
                    <div className="absolute top-2 left-2">
                      {isReunited ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white shadow-subtle">
                          REUNITED
                        </span>
                      ) : isLost ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-600 text-white shadow-subtle">
                          LOST
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-600 text-white shadow-subtle">
                          FOUND
                        </span>
                      )}
                    </div>

                    {/* Reward Badge */}
                    {item.reward && (
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-white/95 text-stone-800 shadow-subtle">
                        {item.reward}
                      </div>
                    )}

                    {/* Match notification tag */}
                    {topMatch && !isReunited && (
                      <div className="absolute bottom-2 inset-x-2 bg-stone-900/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-lg text-[10px] font-semibold text-center flex items-center justify-center space-x-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>{topMatch.score}% Match Found</span>
                      </div>
                    )}
                  </div>

                  {/* Category & Title */}
                  <div className="text-[11px] text-stone-400 font-medium mb-1">
                    {category.label} {item.color ? `• ${item.color}` : ''}
                  </div>

                  <h3 className="font-semibold text-xs sm:text-sm text-stone-900 line-clamp-2 leading-snug group-hover:text-brand-primary transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-stone-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Footer Meta */}
                <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                  <div className="flex items-center space-x-1 truncate mr-2">
                    <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                    <span className="truncate">{item.locationName}</span>
                  </div>

                  <span className="text-[11px] shrink-0">{timeAgo(item.timestamp)}</span>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
