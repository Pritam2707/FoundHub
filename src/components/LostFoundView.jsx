import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  Sparkles, 
  HeartHandshake, 
  MessageSquare, 
  Tag, 
  Award, 
  ShieldCheck, 
  CheckCircle,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { LOST_FOUND_CATEGORIES, LOST_FOUND_STATUSES } from '../types';
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

  // Global Smart Match Discovery (find any high confidence pairs)
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
    return LOST_FOUND_CATEGORIES.find(c => c.id === catId) || { label: catId, color: 'sand', icon: 'Package' };
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
    <div className="space-y-6 pb-12">
      
      {/* Hero Banner with Soft Pastel Gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pastel-lavender-light/90 via-pastel-sky-light/80 to-pastel-mint-light/90 p-6 sm:p-8 border border-stone-200/60 shadow-soft-sm">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/80 border border-stone-200/60 text-xs font-semibold text-brand-dark mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
            <span>Multi-Factor AI Similarity Matching</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark">
            Campus & Community Lost & Found
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-1.5 leading-relaxed">
            Report lost possessions or log found items. Our smart matching engine compares categories, keywords, geolocation proximity, and photo cues to automatically suggest matches.
          </p>

          <div className="mt-4 flex flex-wrap gap-2.5">
            <button
              onClick={() => onOpenCreateModal('lost')}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-2xl bg-brand-dark text-white text-xs sm:text-sm font-semibold hover:bg-stone-800 transition-all shadow-soft-sm"
            >
              <span>+ I Lost an Item</span>
            </button>
            <button
              onClick={() => onOpenCreateModal('found')}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-2xl bg-pastel-mint-dark text-white text-xs sm:text-sm font-semibold hover:bg-emerald-700 transition-all shadow-soft-sm"
            >
              <span>+ I Found an Item</span>
            </button>
          </div>
        </div>

        {/* Abstract pastel circles */}
        <div className="absolute -right-10 -bottom-10 w-52 h-52 rounded-full bg-pastel-lavender/30 blur-2xl pointer-events-none" />
      </div>

      {/* SMART MATCH DISCOVERY ALERT BANNER (If any matches exist) */}
      {systemMatches.length > 0 && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-pastel-lavender-light to-pastel-mint-light border-2 border-pastel-lavender-border text-brand-dark shadow-soft-sm animate-fade-in space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-brand-primary shadow-soft-sm font-bold">
              <Sparkles className="w-4 h-4 animate-pulse-subtle" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-brand-dark">
                Smart Match Suggestions Found ({systemMatches.length})
              </h3>
              <p className="text-[11px] text-stone-600">
                Our algorithm detected potential match pairs between active lost and found posts!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {systemMatches.slice(0, 2).map((match, i) => (
              <div 
                key={i} 
                className="bg-white/90 p-3 rounded-2xl border border-stone-200/80 flex items-center justify-between cursor-pointer hover:border-brand-primary/60 transition-all shadow-soft-sm"
                onClick={() => onSelectItem(match.lostItem)}
              >
                <div className="truncate mr-2">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-pastel-peach-light text-pastel-peach-dark">LOST</span>
                    <span className="text-xs font-semibold text-stone-800 truncate">{match.lostItem.title}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 mt-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-pastel-mint-light text-pastel-mint-dark">FOUND</span>
                    <span className="text-xs text-stone-600 truncate">{match.foundItem.title}</span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span className="inline-flex items-center px-2 py-1 rounded-xl text-xs font-bold bg-pastel-lavender-light text-pastel-lavender-dark border border-pastel-lavender-border">
                    {match.score}% Match
                  </span>
                  <span className="block text-[9px] text-brand-primary font-medium mt-0.5">Click to view</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls Bar: Type Tabs, Search, Category Pills */}
      <div className="bg-surface p-4 rounded-3xl border border-stone-200/70 shadow-soft-sm space-y-3.5">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by item name, color (e.g. Navy Blue), brand, or location..."
              className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200/70 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all placeholder:text-stone-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 bg-stone-200/60 rounded-full px-1.5 py-0.5"
              >
                Clear
              </button>
            )}
          </div>

          {/* Type Segmented Controller */}
          <div className="flex items-center bg-stone-50 p-1 rounded-2xl border border-stone-200/70 text-xs">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                selectedType === 'all' ? 'bg-white shadow-soft-sm text-brand-dark font-semibold' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setSelectedType('lost')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                selectedType === 'lost' ? 'bg-pastel-peach-light text-pastel-peach-dark font-semibold shadow-soft-sm' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              Lost (Looking)
            </button>
            <button
              onClick={() => setSelectedType('found')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                selectedType === 'found' ? 'bg-pastel-sky-light text-pastel-sky-dark font-semibold shadow-soft-sm' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              Found (Safe)
            </button>
            <button
              onClick={() => setSelectedType('reunited')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                selectedType === 'reunited' ? 'bg-pastel-mint-light text-pastel-mint-dark font-semibold shadow-soft-sm' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              Reunited 🎉
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-2xl text-xs font-semibold border transition-all ${
              selectedCategory === 'all'
                ? 'bg-brand-dark text-white border-brand-dark shadow-soft-sm'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
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
                className={`whitespace-nowrap flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-pastel-lavender-light text-pastel-lavender-dark border-pastel-lavender-border font-semibold shadow-soft-sm'
                    : 'bg-white text-stone-600 border-stone-200/80 hover:bg-stone-50'
                }`}
              >
                <Icon name={cat.icon} className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Grid of Items */}
      {filteredItems.length === 0 ? (
        <div className="bg-surface rounded-3xl border border-stone-200/70 p-12 text-center shadow-soft-sm">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-pastel-lavender-light flex items-center justify-center text-pastel-lavender-dark mb-4">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-brand-dark">No lost & found listings match</h3>
          <p className="text-stone-500 text-sm mt-1 max-w-md mx-auto">
            Try adjusting your search keywords or switching between Lost and Found tabs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredItems.map((item) => {
            const category = getCategoryInfo(item.category);
            const isLost = item.type === 'lost';
            const isReunited = item.status === 'reunited';

            // Check if this item has matches in the opposite bucket
            const candidateMatches = findMatchesForPost(item, items, 60);
            const topMatch = candidateMatches[0];

            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="group bg-surface rounded-3xl border border-stone-200/70 p-4 shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col justify-between cursor-pointer relative hover:border-pastel-lavender-border/80"
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-stone-100 mb-3 border border-stone-100">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400">
                        <Icon name={category.icon} className="w-10 h-10 opacity-40" />
                      </div>
                    )}

                    {/* Top Status & Type Badges */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      {isReunited ? (
                        <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-pastel-mint text-pastel-mint-dark border border-pastel-mint-border shadow-soft-sm">
                          Reunited 🎉
                        </span>
                      ) : isLost ? (
                        <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-pastel-peach text-pastel-peach-dark border border-pastel-peach-border shadow-soft-sm">
                          LOST ITEM
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-pastel-sky text-pastel-sky-dark border border-pastel-sky-border shadow-soft-sm">
                          FOUND ITEM
                        </span>
                      )}
                    </div>

                    {/* Reward Badge */}
                    {item.reward && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-pastel-butter text-pastel-butter-dark border border-pastel-butter-border shadow-soft-sm flex items-center space-x-1">
                        <Award className="w-3 h-3" />
                        <span>{item.reward}</span>
                      </div>
                    )}

                    {/* Smart Match Suggested Pill */}
                    {topMatch && !isReunited && (
                      <div className="absolute bottom-2 inset-x-2 bg-brand-dark/85 backdrop-blur-md text-white px-2 py-1 rounded-xl text-[10px] font-bold text-center flex items-center justify-center space-x-1 shadow-soft-sm">
                        <Sparkles className="w-3 h-3 text-pastel-lavender" />
                        <span>✨ {topMatch.score}% Match Found</span>
                      </div>
                    )}
                  </div>

                  {/* Category Pill */}
                  <div className="flex items-center space-x-1 text-[11px] text-stone-500 font-medium mb-1">
                    <Icon name={category.icon} className="w-3 h-3 text-stone-400" />
                    <span>{category.label}</span>
                    {item.color && (
                      <>
                        <span>•</span>
                        <span className="text-stone-600 font-semibold">{item.color}</span>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-sm text-brand-dark line-clamp-2 group-hover:text-brand-primary transition-colors leading-snug">
                    {item.title}
                  </h3>

                  {/* Description snippet */}
                  <p className="text-stone-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Card Bottom Meta */}
                <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                  <div className="flex items-center space-x-1 truncate mr-2">
                    <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                    <span className="truncate text-stone-600">{item.locationName}</span>
                  </div>

                  <div className="shrink-0 flex items-center space-x-1 text-[11px]">
                    <Clock className="w-3 h-3" />
                    <span>{timeAgo(item.timestamp)}</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
