import React, { useState, useMemo } from 'react';
import { 
  Flame, 
  MapPin, 
  Clock, 
  MessageSquare, 
  CheckCircle2, 
  Search, 
  ArrowUpDown, 
  Plus, 
  Check,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { CIVIC_CATEGORIES, CIVIC_STATUSES } from '../types';
import Icon from './Icon';

export default function CivicIssuesView({ 
  issues, 
  onSelectIssue, 
  onUpvoteIssue, 
  onOpenReportModal 
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('urgency');

  const filteredIssues = useMemo(() => {
    let result = [...issues];

    if (selectedCategory !== 'all') {
      result = result.filter(item => item.category === selectedCategory);
    }

    if (selectedStatus !== 'all') {
      result = result.filter(item => item.status === selectedStatus);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        item => 
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.location?.name?.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'urgency') {
        const scoreA = (a.urgencyUpvotes || 0) * 2 + (a.severity || 1) * 3 + (a.verifiedCount || 0);
        const scoreB = (b.urgencyUpvotes || 0) * 2 + (b.severity || 1) * 3 + (b.verifiedCount || 0);
        return scoreB - scoreA;
      }
      if (sortBy === 'severity') {
        return (b.severity || 1) - (a.severity || 1);
      }
      if (sortBy === 'upvotes') {
        return (b.urgencyUpvotes || 0) - (a.urgencyUpvotes || 0);
      }
      if (sortBy === 'recent') {
        return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
      }
      return 0;
    });

    return result;
  }, [issues, selectedCategory, selectedStatus, searchQuery, sortBy]);

  const getStatusInfo = (statusId) => {
    return CIVIC_STATUSES.find(s => s.id === statusId) || CIVIC_STATUSES[0];
  };

  const getCategoryInfo = (catId) => {
    return CIVIC_CATEGORIES.find(c => c.id === catId) || { label: catId, icon: 'AlertCircle', tagClass: 'bg-stone-100 text-stone-700' };
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
      
      {/* Top Banner with Vibrant Accents */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
              Civic Watch & Hazard Triage
            </h1>
            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
              <TrendingUp className="w-3 h-3 text-amber-500" />
              <span>Prioritized by Votes</span>
            </span>
          </div>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm mt-0.5">
            Potholes, dark walkways, and plumbing faults at IIEST Shibpur surfaced directly to facility crews.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => onOpenReportModal('civic')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center space-x-1.5 shadow-glow-indigo active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Report an Issue</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-stone-900 p-3.5 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-card dark:shadow-card-dark space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by pothole, streetlight, Clock Tower, Library..."
              className="w-full pl-9 pr-4 py-2 bg-stone-50 dark:bg-stone-800/80 hover:bg-stone-100/50 dark:hover:bg-stone-800 focus:bg-white dark:focus:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-stone-400"
            />
          </div>

          {/* Status & Sorting */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Pills */}
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-xl text-xs font-medium border border-stone-200/60 dark:border-stone-700">
              <button
                onClick={() => setSelectedStatus('all')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedStatus === 'all' 
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-subtle font-bold' 
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedStatus('reported')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedStatus === 'reported' 
                    ? 'bg-purple-600 text-white shadow-subtle font-bold' 
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                Reported
              </button>
              <button
                onClick={() => setSelectedStatus('in_progress')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedStatus === 'in_progress' 
                    ? 'bg-amber-500 text-white shadow-subtle font-bold' 
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setSelectedStatus('resolved')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  selectedStatus === 'resolved' 
                    ? 'bg-emerald-600 text-white shadow-subtle font-bold' 
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                Resolved
              </button>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center space-x-1 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-2.5 py-1.5 rounded-xl text-xs text-stone-700 dark:text-stone-300 font-medium">
              <ArrowUpDown className="w-3 h-3 text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort issues by"
                className="bg-transparent focus:outline-none cursor-pointer pr-1 text-stone-800 dark:text-stone-200"
              >
                <option value="urgency">🔥 Highest Urgency</option>
                <option value="severity">⭐ Severity (1-5)</option>
                <option value="upvotes">👍 Most Upvotes</option>
                <option value="recent">🕒 Most Recent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`whitespace-nowrap px-3 py-1 rounded-lg transition-all font-semibold ${
              selectedCategory === 'all'
                ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-subtle'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            All Categories
          </button>

          {CIVIC_CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-3 py-1 rounded-lg transition-all flex items-center space-x-1.5 font-medium border ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-600 text-white font-bold shadow-subtle'
                    : 'bg-stone-50 dark:bg-stone-800/80 border-stone-200/80 dark:border-stone-700/80 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Civic Issues */}
      {filteredIssues.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-12 text-center shadow-card">
          <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">No issues found matching your filters</p>
          <p className="text-xs text-stone-400 mt-1">Try resetting search keywords or category filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredIssues.map((issue) => {
            const status = getStatusInfo(issue.status);
            const category = getCategoryInfo(issue.category);

            return (
              <div
                key={issue.id}
                onClick={() => onSelectIssue(issue)}
                className="group bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 hover:border-indigo-400 dark:hover:border-indigo-600 p-4 sm:p-5 shadow-card dark:shadow-card-dark hover:shadow-card-hover transition-all flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Top Bar: Category Pill & Status Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border flex items-center space-x-1 ${category.tagClass}`}>
                        <span>{category.emoji}</span>
                        <span>{category.label}</span>
                      </span>

                      <span className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${status.badgeClass}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dotColor}`} />
                        <span>{status.label}</span>
                      </span>
                    </div>

                    {/* Upvote Urgency Action Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpvoteIssue(issue.id);
                      }}
                      className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl border text-xs font-bold transition-all ${
                        issue.userUpvoted
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-transparent shadow-glow-amber'
                          : 'bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-800 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60'
                      }`}
                      title="Upvote to surface this hazard to campus maintenance"
                    >
                      <Flame className={`w-3.5 h-3.5 ${issue.userUpvoted ? 'fill-current text-white' : 'text-orange-500'}`} />
                      <span>{issue.urgencyUpvotes || 0}</span>
                    </button>
                  </div>

                  {/* Title & Media */}
                  <div className="flex gap-3.5">
                    {issue.imageUrl && (
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0 border border-stone-200 dark:border-stone-800 max-w-[80px] max-h-[80px]">
                        <img
                          src={issue.imageUrl}
                          alt={issue.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm sm:text-base text-stone-900 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {issue.title}
                      </h3>
                      <p className="text-stone-500 dark:text-stone-400 text-xs mt-1 line-clamp-2 leading-relaxed">
                        {issue.description}
                      </p>
                    </div>
                  </div>

                  {/* Location Landmark */}
                  <div className="mt-3 flex items-center space-x-1.5 text-xs text-stone-600 dark:text-stone-400">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="truncate font-medium">{issue.location?.name}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-3.5 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-stone-400">Severity:</span>
                    <span className={`font-bold px-1.5 py-0.2 rounded text-[11px] ${
                      issue.severity >= 4 ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {issue.severity || 3}/5
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-stone-500 dark:text-stone-400">
                    {issue.verifiedCount > 0 && (
                      <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <Check className="w-3 h-3" />
                        <span>{issue.verifiedCount} verified</span>
                      </span>
                    )}

                    <span className="flex items-center space-x-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{issue.comments?.length || 0}</span>
                    </span>

                    <span>{timeAgo(issue.reportedAt)}</span>
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
